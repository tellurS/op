import {JsonClient} from './jsonclient';

export class Rbac{    
    componentName="rbac";
    constructor(public json:JsonClient) {}
    init(){
        
    }
    validate(session:string,req:any,body:any,auth:validateCallback){
        this.json.jsonServer.get('sessions/'+session,(e,r,body)=>{
            if(e){
                auth(e,null);
            }else{
                auth(null,'ok');
                console.log(body);
            }            
        });
    }
    
}


export interface validateCallback {(
    err:boolean,
    data:any
)}
