var fetch = require('fetch-ponyfill')().fetch;
import {utilities} from 'pathway-commons';

var checkList = [
	"uniprot",
	"chebi",
	"smpdb",
	"keggpathway"
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

let hgncData = fetch("hgncSymbols.txt", {method: 'get', mode: 'no-cors'})
	.then(res => res.text())
	.then(parseFile)
	.then(dataArray => new Set(dataArray));

let escapeLucene = (inputString) => {
	return inputString.replace(/([\!\*\+\-\&\|\(\)\[\]\{\}\^\~\?\:\/\\"])/g, "\\$1");
}

let escapeSpaces = (inputString) => {
	return inputString.replace(/(\s+)/g, "\\$1");
}

export let queryProcessing = (query, failureCount = 0) => { // Pass in all query parameters
	if(failureCount > 1) { // All fallbacks exhausted, conclude no results available and return null
		return Promise.resolve(null);
	}

	var enhance = query.enhance !== "false";
	var output = "";

	// Check q to ensure it contains a valid value otherwise return q
	if(typeof query.q === "string" && query.q.length) {
		var words = query.q.trim();
	}
	else {
		return Promise.resolve(query.q);
	}

	if( enhance && !failureCount ) {
		return hgncData // AND then OR all tokens
			.then(hgncData => words
				.split(/\s+/g)
				.map(word => { // Process each word individually
					let isSymbol;
					// Conduct regex checks
					isSymbol = checkList.some( ds => utilities.sourceCheck( ds, word ) );
					// Conduct more expensive HGNC check
					if(!isSymbol) {
						isSymbol = hgncData.has( word.toUpperCase() );
					}
					// When using enhanced search Lucene is always escaped
					word = escapeLucene(word);
					return (isSymbol ? word : "name:" + "*" + word + "*" );
				})
			).then(
				result => {
					let q = "(name:" + escapeSpaces( words ) + ") OR (" +
							    "name:*" + escapeSpaces( words ) + "*) OR (" +
									result.join(" AND ") 					 + ") OR (" +
									result.join(" OR ") 					 + ")";
					return q;
				}
			);
	}
	else {
			return Promise.resolve( words );
	}
}
