'strict'

var http = require('http');
var fs = require('fs');

// Target URL is http://www.genenames.org/cgi-bin/download?col=gd_app_sym&col=gd_prev_sym&status=Approved&status_opt=2&where=&order_by=gd_app_sym_sort&format=text&limit=&submit=submit
var options = {
  host: 'www.genenames.org',
  path: '/cgi-bin/download?col=gd_app_sym&col=gd_prev_sym&status=Approved&status_opt=2&where=&order_by=gd_app_sym_sort&format=text&limit=&submit=submit'
};

console.log("Starting HGNC symbols download ...");

http.request(options, function(response){
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    fs.writeFile(__dirname + "/public/hgncSymbols.txt", str, function(){
      console.log("Download Complete");
    });
  });
}).end();
