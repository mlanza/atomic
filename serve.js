var static = require('node-static');
var fs = require('fs');
var path = require('path');
var fileServer = new static.Server('./');
require('http').createServer(function(request, response) {
  console.log(request.method, request.url);
  if (request.method === 'POST') {
    var body = '';
    request.on('data', function(chunk){
      body += chunk.toString(); // convert Buffer to string
    });
    request.on('end', function(){
      fs.writeFile(path.join(__dirname, request.url), body, function(err) {
        if (err) {
          console.log("save failed!", err);
        } else {
          console.log("save succeeded!");
        }
      });
    });
  }
  request.addListener('end', function() {
    fileServer.serve(request, response, function (err, result) {
      if (err) { // There was an error serving the file
        console.error("Error serving " + request.url + " - " + err.message);
        response.writeHead(err.status, err.headers);
        response.end();
      }
    });
  }).resume();
}).listen(8080);