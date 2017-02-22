import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
 
@Injectable()
export class AuthGuard implements CanActivate {
    username="";
    roles=[]
    auth=false;
     
    constructor(private router: Router) { }
  
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log("guard, required",route.data.roles);
                                       
        if(this.roles.some((e)=>route.data.roles&&route.data.roles.indexOf(e)>-1)){
           return true; 
        }; 
/*
        if(this.auth){
            this.router.navigate(['/not-right'], { queryParams: { returnUrl: state.url }});
            return false;
        }                
        */
        /*
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }*/
 
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
    
    save(auth:IAuth){
        this.username=auth.username;
        this.auth=true;
        this.roles=auth.roles;
    }            
}

export interface IAuth {
    username?:string,    
    password?:string,
    roles:Array<string>
}