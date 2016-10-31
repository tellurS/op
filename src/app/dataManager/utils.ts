import { Observable } from 'rxjs/Observable';
import './rxData';

export class Utils {
/*  Convert data
 *  Utils.array2index([{name:'1',ss:"data"}])=>{"1":{name:'1',ss:"data"}};
 */
    static array2index(arr : Array<any>, index: string = "name"):any {
        let result = {};
        arr.forEach(el=> result[el[index]as 'string'] = el);
        return result;
    }    
    static parse(data:any,expression?:string,defaultValue?){
        console.log("Parsing",data,expression,defaultValue);
        if(!data)
            return defaultValue;
        if(!expression)
            return defaultValue;                    
        if(data["flatMap"]){            
            return data.flatMap((datar) => Observable.of(this.parse(datar,expression,defaultValue)));
        }else{
            let src=data;
            console.log("Parsing Pre",src);
            expression.split('.').every(current=>{
                console.log("Parsing Go",src,current);
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
}
