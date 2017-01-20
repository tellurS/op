import {JsonClient} from './jsonclient';
let Promise = require('promise');

export class DictionaryManager{    
    componentName="DictionaryManager";
    constructor(public db:JsonClient) {}
    init(){
        
    }
    getRows(dictionary:IDictionary,param:string){        
        if(!dictionary){
            console.log("Not dictionary");
            throw 'Not dictionary';
        }        
        console.log("getRows",dictionary,param);
        
        return this.operationSrc(dictionary,param)
             .then((log)=>{console.log('getRows:a',log);return log;})    
            .then((path)=>this.db.dget(path[0]))
            .then(result=>result.body)
            .catch((e)=> {throw e})         
    } 
    addSearch(dictionary:IDictionary,param:string,addUrl:any){
       console.log("addSearch",addUrl);
        if(param&&addUrl){
            param+="&"+addUrl;
        }else
        if(!param&&addUrl){
            param="?"+addUrl;
        }        
        return Promise.resolve(dictionary.src+param);
    }
    defaultSearch(dictionary:IDictionary,param:string){
        return Promise.resolve(dictionary.src+param);     
    }    
    operationSrc(dictionary:IDictionary,param:string){
        let path;
        if(dictionary.toSrc){
            console.log("Sourse",dictionary.toSrc);
            return Promise.all(dictionary.toSrc.map(o=>this[o.operation](dictionary,param,...o.options)));
        }else{
            return Promise.all([this.defaultSearch(dictionary,param)]);
        }  
    }    
    array2index(arr : Array<any>=[], index: string = "name"):any {
        console.log("array2index",arr,index);
        let result = {};
        arr.forEach(el=> result[ el[index]as 'string'] = el);
        return result;
    }        
}
    
export interface IDictionary{
    id  : string,
    caption: string,
    src : string,
    toSrc? : Array<IDictionaryToSrc>,    
    api : string
}


export interface IDictionaryToSrc{
    operation   : string,
    options     : Array<any>
}