import { Component,Input,Output, EventEmitter,ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Page } from '../page/page';
import { DataManager,Utils} from '../dataManager';
import { DialogForm,FormItem } from '../dialogForm';
import { Observable } from 'rxjs/Observable';
import { AuthGuard } from './authGuard';

@Component({
    selector: 'Login',  
    templateUrl: './login.template.html'
 })
export class Login extends Page{
    componentName="Login";
    returnUrl: string;    
    @ViewChild(DialogForm) dialog:DialogForm;
    //Start
    constructor(public route: ActivatedRoute,
                public router: Router,
                public dm:DataManager,
                public auth:AuthGuard
                ) {       
        
        super(route,router,dm);
        this.log("LoginCreated");        
            
    }
    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }    
    ngAfterViewInit() {     
        this.loginForm().subscribe(s=>{
            if(s.type=='run'){
                this.authuntificate(s.options);
            }else{
                this.router.navigate([this.returnUrl]);            
            }
        });
    }
    loginForm(){
        let login:Array<FormItem>=[
            {name:"username",caption:"Login",type:"text",minLength:5,maxLength:25,description:"Login",required:true},
            {name:"password",caption:"Password",type:"password",minLength:5,maxLength:26,description:"Password",required:true}
        ];
        
        return this.dialog.form("Login Form", "please enter:",{}, login,[
            {label: "Login",   icon: "fa-plus", run:"Login",formStatus:true},
            {label: "Close", icon: "fa-close",  run:"Login" },
        ]);
    }     
    authuntificate(options:IAuth={}){
        this.dm.saveRecord("login",options)
               .subscribe((ok)=>{
                            this.auth.save(ok);                             
                        },error => {
                          
                          
                          }                        
                        );                                                      
    }

}

export interface IAuth {
    username?:string,    
    password?:string,
}