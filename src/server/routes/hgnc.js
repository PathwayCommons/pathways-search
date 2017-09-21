// // TODO turn into real server route
// // Turn this into a json response instead of letting
// var http = require('http');
// var fs = require('fs');

// // Target URL is http://www.genenames.org/cgi-bin/download?col=gd_app_sym&col=gd_prev_sym&status=Approved&status_opt=2&where=&order_by=gd_app_sym_sort&format=text&limit=&submit=submit
// var options = {
//   host: 'www.genenames.org',
//   path: '/cgi-bin/download?col=gd_app_sym&col=gd_prev_sym&status=Approved&status_opt=2&where=&order_by=gd_app_sym_sort&format=text&limit=&submit=submit'
// };

// console.log("Starting HGNC symbols download ...");

// http.request(options, function(response){
//   var str = '';

//   //another chunk of data has been recieved, so append it to `str`
//   response.on('data', function (chunk) {
//     str += chunk;
//   });

//   //the whole response has been recieved, so we just print it out here
//   response.on('end', function () {
//     fs.writeFile(__dirname + "/public/hgncSymbols.txt", str, function(){
//       console.log("Download Complete");
//     });
//   });
// }).end();


// // code to turn hgnc symbols text into a list
// const fetch = require('fetch-ponyfill')().fetch;

// const symbolNameBlackList = [
//   'CELL'
// ];

// const parseHGNCData = text => {
//   // the first line of the file is nonsense, remove it.
//   let i = text.indexOf('\n') + 1;
//   let textNoHeader = text.substr(i).toUpperCase();

//   let parsed = textNoHeader.split(/[\s,]+/)
//     .filter(symbol => {
//       if (symbol.length > 0 || symbolNameBlackList.indexOf(symbol) == -1) {
//         return true;
//       }
//       return false;
//     });

//   return parsed;
// };

// export default (filename) => {
//   return fetch(filename, {method: 'get', mode: 'no-cors'})
//   .then(res => res.text())
//   .then(parseHGNCData)
//   .then(hgncSymbols => new Set(hgncSymbols));
// };