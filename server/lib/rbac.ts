import {JsonClient} from './jsonclient';
let Promise = require('promise');

export class Rbac{    
    componentName="rbac";
    constructor(public db:JsonClient) {}
    init(){
        
    }   
    setDeafultRoles(session:Session,defaultRoles:Array<string>){
        if(!session.roles)
             session.roles=defaultRoles;
    }
    validate(allowDeny:Object,method:string,resourceName:string,urlAction?:string){
        if(urlAction){
            urlAction="/"+urlAction;
        }else{
            urlAction="";
        }
        if(!allowDeny.allow[method+"/"+resourceName+urlAction]){
            throw new Error("Not allow");
        }            
        if(allowDeny.deny[method+"/"+resourceName+urlAction]
           &&allowDeny.deny[method+"/"+resourceName+urlAction].allow){
               throw new Error("Denny");
        }
        return allowDeny.allow[method+"/"+resourceName+urlAction];
    } 
    loadRolesByPriorityWithCompile(roles:Array<string>):Promise<any>{
        return this.loadAllRoles()
        .then(all=>{
            let data=all.filter(id=>roles.indexOf(id)>-1).sort((a,b)=>a.priority>b.priority);
            return {
                allow:Object.assign({}, ...data.allow),
                deny:Object.assign({}, ...data.deny)
            }
        });
    }  
    loadAllRoles():Promise<any>{
        console.log('load all roles');
        return this.db.dget('roles')
            .then(r=>r.body)
            .catch((e)=> {throw e});                       
    }  
    loadRole(id:string){                
        console.log('load role',id);
        return this.db.dget('roles/'+id)
            .then(r=>r.body)
            .catch((e)=> {throw e});        
    } 
}


export interface Role{
    id            :number,
    caption       :string,
    priority      :number,
    acl? :any,    
}

export interface Session{
    id            :number,
    username?     :string,
    status?       :boolean,
    roles?        :Array<string>
}


