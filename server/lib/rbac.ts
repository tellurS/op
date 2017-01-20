import {JsonClient} from './jsonclient';
let Promise = require('promise');

export class Rbac{    
    componentName="rbac";
    constructor(public db:JsonClient) {}
    init(){
        
    }

    loadRoles(rolesId:Array<string>){                
        return Promise.all(rolesId.map(id=>this.loadRole(id)));
    }  
    loadRole(id:string){                
        console.log('load role',id);
        return this.db.dget('roles/'+id)
            .then(r=>r.body)
            .catch((e)=> {throw e})        
    } 
    commulateRolesDataByPriority(roles:Array<Role>){
        console.log('commulateRolesDataByPriority-In',roles);
        let rolesData:Array<Role>=roles.sort((a,b)=>(a.priority-b.priority));
        let result=Object.assign({}, ...rolesData);
        console.log('commulateRolesDataByPriority',result,rolesData);
        return result;        
    }     
}


export interface Role{
    id            :number,
    caption       :string,
    priority      :number,
    dictionaries? :any,    
}