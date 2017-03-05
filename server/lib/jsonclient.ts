let request = require('request-json');

export class JsonClient{
    componentName="jsonClient";
    jsonServer:any;
    constructor(public urlServer:string="http://localhost:3001/") {}
    init(){
        this.jsonServer = request.createClient(this.urlServer,{strictSSL: false});        
    }
    
}





