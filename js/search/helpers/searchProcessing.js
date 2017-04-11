var fetch = require('fetch-ponyfill')().fetch;
import {utilities} from 'pathway-commons';

var checkList = [
	"uniprot",
	"chebi"
]

// var hgncUrl = "http://www.genenames.org/cgi-bin/download?col=gd_app_sym&col=gd_prev_sym&status=Approved&status_opt=2&where=&order_by=gd_app_sym_sort&format=text&limit=&submit=submit"; // URL of hgncSymbols.txt data

let parseFile = text => {
	let i = text.indexOf("\n") + 1; // Get index of first newline
	let textNoHeader = text.substr(i).toUpperCase();

	return textNoHeader
	.split(/[\s,]+/) // Split file string by whitespace (spaces, tabs, newlines) and commas
	.filter(symbol => symbol); // Check for and remove any empty strings
};

let hgncData = fetch("hgncSymbols.txt", {method: 'get', mode: 'no-cors'})
	.then(res => res.text())
	.then(parseFile)
	.then(dataArray => new Set(dataArray));

let escapeLucene = (inputString) => {
	return inputString.replace(/([\!\*\+\-\&\|\(\)\[\]\{\}\^\~\?\:\/\\"])/g, "\\$1");
}

export let searchProcessing = (query) => { // Pass in all query parameters
	var escape = query.escape !== "false";
	var enhance = query.enhance !== "false";
	var output = "";

	// Check q to ensure it contains a valid value otherwise return q
	if(typeof query.q === "string" && query.q.length) {
		var words = query.q.trim();
	}
	else {
		return query.q;
	}

	if(enhance) {
		return hgncData
			.then(hgncData => words.split(/\s+/g)
				.map(word => { // Process each word individually
					let isSymbol;
					// Conduct regex checks
					isSymbol = checkList.some(ds => utilities.sourceCheck(ds, word));
					// Conduct more expensive HGNC check
					if(!isSymbol) {
						isSymbol = hgncData.has(word.toUpperCase());
					}
					// When using enhanced search Lucene is always escaped
					word = escapeLucene(word);
					return (isSymbol ? word : "name:" + word);
				})
				.reduce((acc, val, index) => {
					return acc + (index !== 0 ? " AND " : "") + val;
				})
			);
	}
	else {
			return Promise.resolve(escape ? escapeLucene(words) : words);
	}
}
