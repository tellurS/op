import { Component,Input,Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataManager,Utils,Dataset} from '../dataManager';
import { Observable } from 'rxjs/Observable';


export class Template {
    features={};
    componentName="template";
    //Event
    events = new EventEmitter();
    emit(data={}){                
        let d=Object.assign({componentName:this.componentName},data);
        this.events.emit(d);                
    }
    run(run="run",data={}){       
        this.emit({type:'run',run,dataItem:data});                
    }    
    log(type="log",data={}){       
        let l=Object.assign({},{type},data);
        this.emit(l);                
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
        this.emit({type:"paramsChange",params:this.params});           
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
