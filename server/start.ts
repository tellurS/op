//import {Application} from './components/application';

import {Web} from './lib/web';
import {JsonClient} from './lib/jsonclient';
import {Rbac} from './lib/rbac';
import {DictionaryManager} from './lib/dictionaryManager';

var url = require('url');

//components
let web=new Web(3002); 
let client=new JsonClient(); 
let rbac=new Rbac(client); 
let DM=new DictionaryManager(client); 

//config

//init
web.init();
client.init();

web.addStatic('dist');


//proxy 
/*
web.server.use((req, res, next)=>{    
    rbac.validate('0101',req.originalUrl,req.body)
    .then(d=>{
        switch(req.method) {
          case 'GET':  {
           //return client.dget(req.originalUrl).then(result=>res.send(result.body)); 
            next();
            break;         
          }
          case 'POST':  
            return client.dpost(req.originalUrl,req.body).then(result=>res.send(result.body));
           case 'PUT':  
            return client.dput(req.originalUrl,req.body).then(result=>res.send(result.body));
          case 'DELETE':  
            return client.ddelete(req.originalUrl).then(result=>res.send(result.body));
          default:
            return res.status(404).end();
        }                 
    })
    .catch(err=>{
            res.status(401).end();
            console.log(err);
            return;
    });    
});*/
//start



web.server.get('*', function(req, res, next){    
    let dictionaryName=req.path;
    let url_parts = url.parse(req.url, false);    
    let param=url_parts.search||'';
    
    console.log("dictionaryName",dictionaryName,param);        
        
    req.session.rolesId=['root','base']; 
        

    rbac.loadRoles(req.session.rolesId||[])
        .then((log)=>{console.log('pr1',log);return log;})
        
    .then(roles=>roles.map(r=>DM.array2index(r['dictionaries']||[],'id')))                
        .then((log)=>{console.log('pr2',log);return log;})
        
    .then(dicts=>rbac.commulateRolesDataByPriority(dicts))
        .then((log)=>{console.log('pr3b',log);return log;})    
        
    .then(comulate=>DM.getRows(comulate[dictionaryName],param))
     //   .then((log)=>{console.log('pr4b',log);return log;})    
        
    .then(result=>{res.send(result);return "ok"}) 
        .then((log)=>{console.log('pr5',log);return log;})    
        
    .catch((e)=> {console.log("catch",e);res.status(500).end()});    
});

web.start(); 
console.log('starting Op:server!');