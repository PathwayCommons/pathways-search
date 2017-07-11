var fetch = require('fetch-ponyfill')().fetch;
import {utilities} from 'pathway-commons';

var checkList = [
	"uniprot",
	"chebi",
	"smpdb",
	"refseq"
];

var nameBlacklist = [
	"CELL"
];

// var hgncUrl = "http://www.genenames.org/cgi-bin/download?col=gd_app_sym&col=gd_prev_sym&status=Approved&status_opt=2&where=&order_by=gd_app_sym_sort&format=text&limit=&submit=submit"; // URL of hgncSymbols.txt data

let parseFile = text => {
	let i = text.indexOf("\n") + 1; // Get index of first newline
	let textNoHeader = text.substr(i).toUpperCase();

	return textNoHeader
	.split(/[\s,]+/) // Split file string by whitespace (spaces, tabs, newlines) and commas
	.filter(symbol => symbol) // Check for and remove any empty strings
	.filter(symbol => nameBlacklist.indexOf(symbol) == -1); // Filter out ridiculous names
};

let getHGNCData = fetch("hgncSymbols.txt", {method: 'get', mode: 'no-cors'})
	.then(res => res.text())
	.then(parseFile)
	.then(dataArray => new Set(dataArray));

let escapeLucene = (inputString) => {
	return inputString.replace(/([\!\*\+\-\&\|\(\)\[\]\{\}\^\~\?\:\/\\"])/g, "\\$1");
}

let escapeSpaces = (inputString) => {
	return inputString.replace(/(\s+)/g, "\\$1");
}

let tokenPrefix = ( phrase, collection ) => {
	return phrase
		.split(/\s+/g)
		.map(token => {
			// Add a Lucene prefix 'name' to any white-space separted tokens that are NOT symbols that match any of the categories decalred in checkList array
			let isSymbol;
			// Conduct regex checks
			isSymbol = checkList.some( ds => utilities.sourceCheck( ds, token ) );
			// Conduct more expensive HGNC check
			if(!isSymbol) {
				isSymbol = collection.has( token.toUpperCase() );
			}
			token = escapeLucene(token);
			return isSymbol ? token : ( "name:" + "*" + token + "*" );
		});
}

export let queryProcessing = (query, failureCount = 0) => { // Pass in all query parameters

	// Check q to ensure it contains a valid value otherwise return q
	if(typeof query.q === "string" && query.q.length) {
		var words = query.q.trim();
	}
	else {
		return Promise.resolve(query.q);
	}

	if( failureCount === 0 ) {
		// Perform strict search
		// Prefix non-symbol tokens with Lucene index field 'name'
		return getHGNCData
			.then( tokenPrefix.bind( null, words ) ) //implicit Promise result
			.then( result => "(name:" + escapeSpaces( words ) + ") OR (" + "name:*" + escapeSpaces( words ) + "*) OR (" + result.join(" AND ") + ")" );

	} else if ( failureCount === 1 ) {
		// Perform less strict search -- separated from the groups above because I found it slower on the backend
		return getHGNCData
			.then( tokenPrefix.bind( null, words ) )
			.then( result => "(" + result.join(" OR ") + ")" );
	}
	else if ( failureCount === 2 ) {
		// Perform search for matches with any white-space separated token
		return Promise.resolve( words );

	} else {
		 // All fallbacks exhausted, conclude no results available and return null
		return Promise.resolve(null);
	}
}
