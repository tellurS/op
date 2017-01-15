//import {Application} from './components/application';

import {Web} from './lib/web';
import {JsonClient} from './lib/jsonclient';
import {Rbac} from './lib/rbac';

//components
let web=new Web(3002); 
let client=new JsonClient(); 
let rbac=new Rbac(client); 

//config

//init
web.init();
client.init();

web.addStatic('dist');


//proxy
web.server.use((req, res, next)=>{    
    rbac.validate('0101',req.originalUrl,req.body)
    .then(d=>{
        switch(req.method) {
          case 'GET':  
            return client.dget(req.originalUrl).then(result=>res.send(result.body));
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
});

//start

web.start();