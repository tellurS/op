let request = require('request-json');

export class JsonClient implements dataProvider{
    componentName="jsonClient";
    jsonServer:any;
    constructor(public urlServer:string="http://localhost:3001/") {}
    init(){
        this.jsonServer = request.createClient(this.urlServer,{strictSSL: false});        
    }
    dget(name:string):any{        
        console.log('get',name);
        return this.jsonServer.get(name);            
    }
    ddelete(name:string):any{
        return this.jsonServer.delete(name);         
    }    
    dpost(name:string,data:any):any{
        return this.jsonServer.post(name,data);         
    }
    dput(name:string,data:any):any{
        return this.jsonServer.put(name,data);         
    }       
}




export interface dataProvider{
    dget(name:string):any;
    ddelete(name:string):any;
    dpost(name:string,data:any):any;        
    dput(name:string,data:any):any;  
}

