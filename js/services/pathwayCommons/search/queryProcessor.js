import {utilities} from 'pathway-commons';
import getHGNCData from './hgnc';

const sourceList = [
  'uniprot',
  'chebi',
  'smpdb',
  'refseq'
];

const escapeLucene = (inputString) => {
  return inputString.replace(/([\!\*\+\-\&\|\(\)\[\]\{\}\^\~\?\:\/\\"])/g, '\\$1');
};

const escapeSpaces = (inputString) => {
  return inputString.replace(/(\s+)/g, '\\$1');
};

const tokenPrefix = (phrase, collection) => {
  return phrase
    .split(/\s+/g)
    .map(token => {
      //if symbol is recognized by at least one source
      let isSymbol = sourceList.some( sourceName => utilities.sourceCheck( sourceName, token ) );

      if(!isSymbol) {
        isSymbol = collection.has( token.toUpperCase() );
      }
      token = escapeLucene(token);
      return isSymbol ? token : ( 'name:' + '*' + token + '*' );
    });
};


export default (query, failureCount = 0) => { // Pass in all query parameters
  // queries must be non empty strings
  if (typeof query.q !== 'string' && query.q.length <= 0) {
    return Promise.resolve(query.q);
  }

  let words = query.q.trim();

  if (failureCount === 0) {
    // Prefix non-symbol tokens with Lucene index field 'name'
    return getHGNCData
      .then( tokenPrefix.bind( null, words ) ) //implicit Promise result
      .then( result => '(name:' + escapeSpaces( words ) + ') OR (' + 'name:*' + escapeSpaces( words ) + '*) OR (' + result.join(' AND ') + ")" );

  }
  if ( failureCount === 1 ) {
    // Perform less strict search -- separated from the groups above because I found it slower on the backend
    return getHGNCData
      .then( tokenPrefix.bind( null, words ) )
      .then( result => '(' + result.join(' OR ') + ')' );
  }

  if ( failureCount === 2 ) {
    // Perform search for matches with any white-space separated token
    return Promise.resolve( words );
  }

  // All fallbacks exhausted, conclude no results available and return null
  return Promise.resolve(null);
};
