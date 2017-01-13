var jsonServer = require('json-server');
var server = jsonServer.create();
const express = require('express');
var middlewares = jsonServer.defaults();
//https
var https = require('https');
var fs = require('fs');
//http://www.akadia.com/services/ssh_test_certificate.html
var privateKey  = fs.readFileSync('ssl/server.key', 'utf8');
var certificate = fs.readFileSync('ssl/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};


//arg
 
 if (process.argv.length !== 4) {
    console.log("Usage: " + __filename + " DB static",process.argv,process.argv.length);
    process.exit(-1);
}
 
var db = process.argv[2];
var stat=process.argv[3];
 
console.log('DB ' + db,'Static '+stat);
  
//init db 
var router = jsonServer.router(db); 
  
//server
server.use(express.static(stat));

server.use(jsonServer.rewriter({
  '/api/': '/'
}));
server.use(middlewares);

server.use(function (req, res, next) {
 //if (isAuthorized(req)) { // add your authorization logic here 
   next(); 
 //} else {  res.sendStatus(401)}
});

server.use(router);
//start
var httpsServer = https.createServer(credentials, server);
httpsServer.listen(5555);
console.log('OP server is running');


let request = require('request-json');
var client = request.createClient('https://localhost:5555/',{strictSSL: false});
 
client.get('issues/', function(err, res, body) {
  return console.log(err, res, body);
});


