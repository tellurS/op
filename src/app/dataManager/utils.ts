import { Observable } from 'rxjs/Observable';
import './rxData';

export class Utils {
/*  Convert data
 *  Utils.array2index([{name:'1',ss:"data"}])=>{"1":{name:'1',ss:"data"}};
 */
    static array2index(arr : Array<any>, index: string = "name"):any {
        let result = {};
        arr.forEach(el=> result[ el[index]as 'string'] = el);
        return result;
    }    
    static parse(data:any,expression?:string,defaultValue?){
        if(!data)
            return defaultValue;
        if(!expression)
            return defaultValue;                    
        if(data["flatMap"]){            
            return data.flatMap((datar) => Observable.of(this.parse(datar,expression,defaultValue)));
        }else{
            let src=data;
            expression.split('.').every(current=>{
                if(current.charAt(0)==="["){//array
                    current = current.slice(1, current.length-1)
                }
                if(src[current]){
                    src=src[current];
                    return true;
                }
                src=defaultValue;
                return false;
           })
           return src;
        }       
    }
    static pick(obj:Object,keys:String[],invert:boolean=false){ //only vlaues with keys
        let res={};
        for (var key in obj) {
            if(!invert&&(keys.indexOf(key)>-1)||  
               invert&&(keys.indexOf(key)==-1)   //inver
            ){
                res[key]=obj[key];
            }
        }
        return res;
    }
    static update(obj:Object,options:{key?:string,expression?:string,handle?:updateHandler|string,defaultValue?:any}){
        if(!obj)
            return options.defaultValue;
        if(!options.expression)
            return options.defaultValue;                    
        if(obj["flatMap"]){            
            return obj["flatMap"]((objValue) => Observable.of(this.update(obj,options)));
        }else{
            let src=obj;
            options.key.split('.').every((current,i,arr)=>{
                console.log('parse',current);
                if(current.charAt(0)==="["){//array
                    current = current.slice(1, current.length-1);
                    if(!src[current]){  //create                  
                        src[current]=[];
                    }
                }
                if (!src[current] && i == (arr.length-1)){
                    src[current]=[];
                }
                if(src[current]){
                    let c:updateHandler;
                    switch(options.handle) {
                      case '+=':  
                        c = this.updateHandlePlus;
                        break;
                      case '++':  
                        c = this.updateHandlePlusPlus;
                        break;
                      case '-=':  
                        c = this.updateHandleMinus;
                        break;
                      case '--':  
                        c = this.updateHandleMinusMinus;
                        break;
                      case '+':  
                            c = this.updateHandleAddEl;                            
                        break;                                        
                      case '-':  
                            c = this.updateHandleRemoveEl;                            
                        break;                        
                      case '!':  
                            c = this.updateHandleTurnEl;                            
                        break;                                                                
                      default:
                        c=(options.handle as updateHandler)||this.updateHandleEq;
                        break;
                    }                    
                    src[current]=c(obj,options.key,options.expression,src[current])||options.defaultValue;                    
                    return true;
                }
                return false;
           });
           
           return obj;
        }                       
    }    
    static updateHandleEq(obj:Object,key:string,expression:string,value:any ){
        return expression;
    }
    static updateHandlePlus(obj:Object,key:string,expression:string,value:any ){
        return Number(value)+Number(expression);
    }    
    static updateHandlePlusPlus(obj:Object,key:string,expression:string,value:any ){
        return Number(value)+1;
    }        
    static updateHandleMinus(obj:Object,key:string,expression:string,value:any ){
        return Number(value)-Number(expression);
    }    
    static updateHandleMinusMinus(obj:Object,key:string,expression:string,value:any ){
        return Number(value)-1;
    }    
    static updateHandleRemoveEl(obj:Object,key:string,expression:string,value:any ){
        if(Array.isArray(value)){
            let i=value.indexOf(expression);
            if(i>-1){
                value.splice(i, 1);
            }
        }        
        return value ;
    }    
    static updateHandleAddEl(obj:Object,key:string,expression:string,value:any ){
        if(Array.isArray(value)){
            let i=value.indexOf(expression);
            if(i==-1){
                value.push(expression);
            }
        }        
        return value ;
    }      
    static updateHandleTurnEl(obj:Object,key:string,expression:string,value:any ){
        if(Array.isArray(value)){
            let i=value.indexOf(expression);
            if(i==-1){
                value.push(expression);
            }else{
                 value.splice(i, 1);
            }
        }        
        return value ;
    }     
}

export interface updateHandler {(   
        obj:Object,    
        key:string,
        expression:string,
        value:any    
):any}

