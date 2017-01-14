var process = require('process');
const express = require('express');
var server = express();

//https
var https = require('https');
var fs = require('fs');
//http://www.akadia.com/services/ssh_test_certificate.html
var privateKey  = fs.readFileSync('ssl/server.key', 'utf8');
var certificate = fs.readFileSync('ssl/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};


//arg
 
 if (process.argv.length !== 3) {
    console.log("Usage: " + __filename + " DB static",process.argv,process.argv.length);
    process.exit(-1);
}
 
//var db = process.argv[2];
var stat=process.argv[2];
 
console.log('Static ' + stat);
  

//server
server.use(function (req, res, next) {
   console.log("request", req.originalUrl);
   next(); 
});

server.use(express.static(stat));

//proxy
let request = require('request-json');
var client = request.createClient('http://localhost:3001/',{strictSSL: false});

server.use(function (req, res, next) {
   client.get(req.originalUrl, function(e, r, body) {
      res.send(body);
      //return console.log("res",e, r, body);
   });   
});




server.use(function (req, res, next) {
 //if (isAuthorized(req)) { // add your authorization logic here 
   next(); 
 //} else {  res.sendStatus(401)}
});

//server.use(router);
//start
var httpsServer = https.createServer(credentials, server);
httpsServer.listen(3002);
console.log('OP server is running');


 
/*
client.get('issues/', function(err, res, body) {
  return console.log("kuku");
});
*/

 process.on('SIGINT', function () { 
    httpsServer.close();
    process.exit(2);
 });
  process.on('exit', function () { 
    httpsServer.close();
    process.exit(2);
 });