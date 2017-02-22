import {JsonClient} from './jsonclient';
let Promise = require('promise');
import {Schema} from './schema';

export class DictionaryManager{    
    componentName="DictionaryManager";
    constructor(public db:JsonClient,public schema:Schema) {}
    init(){
        
    }

    //operations    
    getRows(acc:Request){             
        console.log("getRows",acc.uri);
        return this.db.dget(acc.uri)
            .then(result=>acc.result=result.body);        
    }         
    addSearch(acc:Request,addUrl){
       console.log("addSearch",addUrl);
       let param=acc.param
        if(param&&addUrl){
            param+="&"+addUrl;
        }else
        if(!param&&addUrl){
            param="?"+addUrl;
        }        
        acc.uri=acc.dictionary.src+param;     
    }
    o2o(acc:Request){
        console.log("ACC o2o",acc);
        acc.uri=acc.dictionary.src+acc.param;     
    }    
    valid(acc:Request){             
        let validate = this.schema.ajv.compile(acc.dictionary.schemaA);
        if(validate(acc.param)){
            acc.result = acc.param;
            console.log("OK validate",acc);
        }else{
            acc.status="409";
            acc.errors=validate.errors;
            console.log("Not validate");
            throw acc;
        }        
    }        
    //base
    prepareOperations(dictionary:IDictionary){
        if(!dictionary){
            console.log("Not dictionary");
            throw 'Not dictionary';
        }                   
        
        return Object.assign({toSrc:[{"operation":"o2o","options":[]},
                                     {"operation":"getRows","options":[]}
                             ]},dictionary);                
    }    
    runOperations(dictionary:IDictionary,param:Object){        
        if(!dictionary){
            console.log("Not dictionary");
            throw 'Not dictionary';
        }           
        let jobs=dictionary.toSrc;
        let acc:Request={dictionary,param};
        
        return this.runSerial(acc,
                       jobs.map(o=>{return {operation:o.operation,
                                            context:  this,
                                            options:   o.options}}))
        .then((log)=>{console.log('acc',acc,log);return log;})                                                       
        .then(()=>acc);        
    }        
    //to utils
    array2index(arr : Array<any>=[], index: string = "name"):any {
        console.log("array2index",arr,index);
        let result = {};
        arr.forEach(el=> result[ el[index]as 'string'] = el);
        return result;
    }        
    runSerial(acc:Request,tasks) {
      console.log("runSerial",acc,tasks);
      let result = Promise.resolve();
      tasks.forEach(task => {
        result = result.then(() => task.context[task.operation](acc,...task.options))
      });
      return result;
    }       
}


export interface Request{
    dictionary : IDictionary,    
    param :      Object,
    result?:     Object,
    uri?  :      string,
    status?:     string,
    errors?:      Object
}
    
export interface IDictionary{
    id  : string,
    caption: string,
    src : string,
    toSrc? : Array<IDictionaryToSrc>,    
    api : string,
    schemaA?: Object
}


export interface IDictionaryToSrc{
    operation   : string,
    options     : Array<any>,
    uri         : string
}