let Ajv = require('ajv');
let crypto = require('crypto');
const secret = 'abcdefg';

 /*
ajv.addKeyword('range', { type: 'number', compile: function (sch, parentSchema) {
  var min = sch[0];
  var max = sch[1];

  return parentSchema.exclusiveRange === true
          ? function (data) { return data > min && data < max; }
          : function (data) { return data >= min && data <= max; }
}, errors: false, metaSchema: {
  type: 'array',
  items: [ { type: 'number' }, { type: 'number' } ],
  additionalItems: false
} });
*/
//export default ajv;


export class Schema{
    componentName="Schema";
    ajv:any;
    constructor() {
        this.ajv = new Ajv({  v5: true, removeAdditional: true,allErrors: true });     
        require('ajv-merge-patch')(this.ajv);
        this.ajv.addKeyword('crypt', { type: 'string',
            compile:(param, parentSchema,it)=>{
                return (data, dataPath, parentData, parentDataProperty, rootData)=>
                    {   parentData[parentDataProperty+'_']=crypto.createHmac(param,secret).update(data).digest('hex');
                        return true;
                    }
            },
            modifying:true,
            metaSchema: {
                type: 'string',
                additionalItems: false
            }
       });                          
        this.ajv.addKeyword('log', { 
            compile:(param, parentSchema,it)=>{
                return (data, dataPath, parentData, parentDataProperty, rootData)=>
                    {
                    console.log("keyword:log",...param.map(i=>it.util.getData(i, it.dataLevel, it.dataPathArr)),it.errors);                      
                    return true;
                    }
            },
            metaSchema: {
                type: 'array',
                "items": {
                    "type": "string"
                },                
                additionalItems: false
            }
       });       
    }
    init(){
    }
    compile(schema){
        return this.ajv.compile(schema);
    }

}
