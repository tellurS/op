import { Component,Input,Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataManager,Utils,Dataset} from '../dataManager';
import { Observable } from 'rxjs/Observable';



export class Page {
    features={};
    componentName="template";
    //Event
    events = new EventEmitter();
    logs = new EventEmitter();
    emit(type="emit",data={}){                
        let d=Object.assign({},{componentName:this.componentName,type},data);
        this.events.emit(d);                
    }
    run(run="run",options={}){       
        this.emit('run',{run,options});                
    }    
    log(type="log",data={}){       
        let l=Object.assign({},{status:"log",componentName:this.componentName,type},data);
        this.logs.emit(l);                        
    }        
    //Start
    constructor(public route: ActivatedRoute,public router: Router,public dm:DataManager) {  
        this.data=route.snapshot.data as ComponentData;                                         
        dm.setDataset(this.data.datasets);
    }
    //Registry  
    data:ComponentData;        
    getComponentData(expression:string,default1:any=null):any {
        return Utils.parse(this.data,expression)||default1;        
    }     
    //Params
    params = {};
    applyParams(change={}){
        this.params=Object.assign({},this.params,change);
        this.emit("paramsChange",{params:this.params});           
    }       
    //Urls
    changeUrl(options={replaceUrl:true}){           
        this.router.navigate([this.params],options);           
    }  
}

interface ComponentData {
    caption: string,
    enable:  boolean,
    role:    Array<string>,
    future:  Object,
    datasets:Array<Dataset>
}
