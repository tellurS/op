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
    static pick(obj:Object,keys:String[],invert:boolean=false){ //only keys
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
}
