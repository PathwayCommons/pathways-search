var fetch = require('fetch-ponyfill')().fetch;
import {utilities} from 'pathway-commons';
import localForage from 'localforage';

const expireDelay = 60*1000;//30*24*60*60*1000;

var checkList = [
	"uniprot",
	"chebi"
]

// var hgncUrl = "http://www.genenames.org/cgi-bin/download?col=gd_app_sym&status=Approved&status_opt=2&where=&order_by=gd_app_sym_sort&format=text&limit=&submit=submit"; // URL of hgncSymbols.txt data

let getHgncData = () => {
	return Promise.all([localForage.getItem('hgncSymbols'), localForage.getItem('hgncSymbolsExpiry')])
		.then(promArray => {
			var value = promArray[0];
			var expiry = promArray[1];
			var unixTime = new Date().getTime();

			if(expiry < unixTime || value === null) {
				return fetch("hgncSymbols.txt", {method: 'get', mode: 'no-cors'})
					.then(res => res.text())
					.then(text => text
						.toUpperCase() // Make all text upper case
						.split("\n") // Split file string by new line characters
						.slice(1) // Remove header
						.map(line => { // Parse file from hgnc
							var lineArray = line.trim().split("	");
							var prevSymbolArray = lineArray.length > 1 ? lineArray[1].split(", ") : [];
							return [lineArray[0], ...prevSymbolArray];
						})
						.reduce((acc, val) => acc.concat(val)) // Flatten resulting array
					)
					.then(dataArray => {
						localForage.setItem('hgncSymbols', dataArray);
						localForage.setItem('hgncSymbolsExpiry', unixTime + expireDelay);
						return dataArray;
					})
			}
			else {
				return value;
			}
		})
		.then(dataArray => new Set(dataArray))
}

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
		return getHgncData()
			.then(hgncData => words.split(/\s+/g)
				.map(word => { // Process each word individually
					var isSymbol;
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
