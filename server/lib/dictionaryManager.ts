import {JsonClient} from './jsonclient';
let Promise = require('promise');

export class DictionaryManager{    
    componentName="DictionaryManager";
    constructor(public db:JsonClient) {}
    init(){
        
    }
    getRows(uri:string){             
        console.log("getRows",uri);
        return this.db.dget(uri)
            .then(result=>result.body);        
    }     
    addSearch(acc,addUrl){
       console.log("addSearch",addUrl);
       let param=acc.paran
        if(param&&addUrl){
            param+="&"+addUrl;
        }else
        if(!param&&addUrl){
            param="?"+addUrl;
        }        
        acc.uri=acc.dictionary.src+param;     
    }
    o2o(acc){
        console.log("ACC o2o",acc)
        acc.uri=acc.dictionary.src+acc.param;     
    }    
    operationSrc(dictionary:IDictionary,param:string){        
        if(!dictionary){
            console.log("Not dictionary");
            throw 'Not dictionary';
        }           
        let jobs=dictionary.toSrc||[{"operation":"o2o","options":[]}];
        let acc={dictionary:dictionary,param:param};
        
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
    runSerial(acc,tasks) {
      console.log("runSerial",acc,tasks);
      let result = Promise.resolve();
      tasks.forEach(task => {
        result = result.then(() => task.context[task.operation](acc,...task.options))
      });
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