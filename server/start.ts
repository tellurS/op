//import {Application} from './components/application';

import {Web} from './lib/web';
import {JsonClient} from './lib/jsonclient';
import {Rbac} from './lib/rbac';
import {ResourceManager} from './lib/resourceManager';
import {Schema} from './lib/schema';

var url = require('url');

//components
let web=new Web(3002); 
let client=new JsonClient(); 
let rbac=new Rbac(client); 
let schema=new Schema();
let rm=new ResourceManager(client,schema); 
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


/*
web.server.get('*', function(req, res, next){    
    let dictionaryName=req.path;
    let url_parts = url.parse(req.url, false);    
    let param=url_parts.search||'';
    
    console.log("0. DictionaryName",dictionaryName,param);        
        
    req.session.rolesId=['root','base']; 
        

    rbac.loadRoles(req.session.rolesId||[])
        .then((log)=>{console.log('1.Get roles',log);return log;})
        
    .then(roles=>roles.map(r=>DM.array2index(r['dictionaries']||[],'id')))                
        .then((log)=>{console.log('2.Get dictionary',log);return log;})
        
    .then(dicts=>rbac.commulateRolesDataByPriority(dicts))
        .then((log)=>{console.log('3.Commulate Dict ',log);return log;})    

    .then(comulate=>DM.prepareOperations(comulate[dictionaryName]))
        .then((log)=>{console.log('4.Prepare dictionary',log);return log;})    

    .then(ops=>DM.runOperations(ops,param))
        .then((log)=>{console.log('5.Run Operation',log);return log;})           

    .then(result=>{res.send(result.result);return "ok"}) 
        .then((log)=>{console.log('7.Sended',log);return log;})    
        
    .catch((e)=> {console.log("catch",e);res.status(500).end()});    
});

*/
/*
web.server.post('*', function(req, res, next){    
    let dictionaryName=req.path;
    let url_parts = url.parse(req.url, false);    
    let param={url:url_parts.search||{},body:req.body||{}};
    
    console.log("0. DictionaryName",dictionaryName,param);        
        
    req.session.rolesId=['noauth']; 
        

    rbac.loadRoles(req.session.rolesId||[])
        .then((log)=>{console.log('1.Get roles',log);return log;})
        
    .then(roles=>roles.map(r=>DM.array2index(r['dictionaries']||[],'id')))                
        .then((log)=>{console.log('2.Get dictionary',log);return log;})
        
    .then(dicts=>rbac.commulateRolesDataByPriority(dicts))
        .then((log)=>{console.log('3.Commulate Dict ',log);return log;})    

    .then(comulate=>DM.prepareOperations(comulate[dictionaryName]))
        .then((log)=>{console.log('4.Prepare dictionary',log);return log;})    

    .then(ops=>DM.runOperations(ops,param))
        .then((log)=>{console.log('5.Run Operation',log);return log;})           

    .then(result=>{res.send(result.result);return "ok"}) 
        .then((log)=>{console.log('7.Sended',log);return log;})    
        
    .catch((e)=> {console.log("catch",e);res.status(e.status||500).send(e.errors||"general error").end()});    
});
*/
web.server.use('/:urlResource/:urlId?/:urlAction?', function(req, res, next){
    //rbac
    rbac.setDeafultRoles(req.session,['noauth']);
    //param       
    let resourceName:string=req.params.urlResource;
    let action=req.params.urlAction;
    if(action){
       action="/"+action;
    }else{
        action="";    
    
    let urlId=req.params.urlId;    
    let url_parts = url.parse(req.url, false);
    let data;//to one    
   
    console.log("0. Resource",resourceName);        
        
    rbac.loadRolesByPriorityWithCompile(req.session.roles)  
        .then((log)=>{console.log('1.Get roles',log);return log;})
        
    .then(roles=>rbac.validate(roles,req.method,resourceName,action))
        .then((log)=>{console.log('2.Rbac param',log);return log;})    
 
    .then(paramRbac=>{return data=Object.assign({},url_parts.search,req.body,req.params,{urlMethod:req.method},paramRbac)})
        .then((log)=>{console.log('3.Param request',log);return log;})
        
    .then(data=>rm.loadDataById(resourceName,urlId)
                .then((log)=>{console.log('4.Preload by id',log);return log;})
                .then(res=>data=Object.assign({old:res},data))) 
                        
    .then(data=>rm.validate(req.method,resourceName,action,data))
        .then((log)=>{console.log('5.Result input validation',log);return log;})    //send client err
              
   
    .then(comulate=>rm.prepareOperations(comulate[dictionaryName]))
        .then((log)=>{console.log('5.Prepare dictionary',log);return log;})    

    .then(ops=>DM.runOperations(ops,param))
        .then((log)=>{console.log('5.Run Operation',log);return log;})           

    .then(result=>{res.send(result.result);return "ok"}) 
        .then((log)=>{console.log('7.Sended',log);return log;})    
        
    .catch((e)=> {console.log("catch",e);res.status(e.status||500).send(e.errors||"general error").end()});    
});

web.start(); 
console.log('starting Op:server!');