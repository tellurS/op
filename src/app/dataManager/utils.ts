export class Utils {
/*  Convert data
 *  Utils.array2index([{name:'1',ss:"data"}])=>{"1":{name:'1',ss:"data"}};
 */
    static array2index(arr : Array<any>, index: string = "name"):any {
        let result = {};
        arr.forEach(el=> result[el[index]as 'string'] = el);
        return result;
    }    
}
