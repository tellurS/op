//import {Application} from './components/application';

import {Web} from './lib/web';
import {JsonClient} from './lib/jsonclient';

//components
let web=new Web(3002); 
let client=new JsonClient(); 

//config

//init
web.init();
client.init();

web.addStatic('dist');


//proxy


web.server.use((req, res, next)=>{    
    switch(req.method) {
      case 'GET':  
        client.jsonServer.get(req.originalUrl,(e,r,body)=>res.send(body));
        break;
      case 'POST':  
        client.jsonServer.post(req.originalUrl,req.body,(e,r,body)=>res.send(body));
        break;        
      case 'PUT':  
        client.jsonServer.put(req.originalUrl,req.body,(e,r,body)=>res.send(body));
        break;        
      case 'DELETE':  
        client.jsonServer.delete(req.originalUrl,(e,r,body)=>res.send(body));
        break;                
      default:
        res.status(404).end();
    }        
});

//start

web.start();

/*
var process = require('process');
const express = require('express');
var bodyParser = require('body-parser');
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

server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//proxy
let request = require('request-json');
var client = request.createClient('http://localhost:3001/',{strictSSL: false});

server.use((req, res, next)=>{    
    switch(req.method) {
      case 'GET':  
        client.get(req.originalUrl,(e,r,body)=>res.send(body));
        break;
      case 'POST':  
        client.post(req.originalUrl,req.body,(e,r,body)=>res.send(body));
        break;        
      case 'PUT':  
        client.post(req.originalUrl,req.body,(e,r,body)=>res.send(body));
        break;        
      case 'DELETE':  
        client.delete(req.originalUrl,(e,r,body)=>res.send(body));
        break;                
      default:
        res.status(404).end();
    }        
    
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

*/
 
/*
client.get('issues/', function(err, res, body) {
  return console.log("kuku");
});
*/
/*
 process.on('SIGINT', function () { 
    httpsServer.close();
    process.exit(2);
 });
  process.on('exit', function () { 
    httpsServer.close();
    process.exit(2);
 });
 */