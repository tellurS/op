import {JsonClient} from './jsonclient';
let Promise = require('promise');

export class Rbac{    
    componentName="rbac";
    constructor(public json:JsonClient) {}
    init(){
        
    }
    validate(session:string,req:any,body:any):any{
        return this.json.dget('sessions/'+session)
            .then((r,body)=>'ok')
            .catch((e)=> {throw e});
    }
    
}


export interface validateCallback {(
    err:boolean,
    data:any
)}
