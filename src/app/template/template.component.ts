import { Component,Input,Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataManager,Utils,Dataset} from '../dataManager';
import { Observable } from 'rxjs/Observable';


export class Template {
    features={};
    //Event
    events = new EventEmitter();
    //Start
    constructor( route: ActivatedRoute, dm:DataManager) {  
        this.data=route.snapshot.data as CurrentData;                                         
        dm.setDataset(this.data.datasets);
    }
    //Reestr   
    data:CurrentData;        
    getCurrentData(expression:string,default1:any=null):any {
        return Utils.parse(this.data,expression)||default1;        
    }     
    //Params
    params = {};
    paramsChange = new EventEmitter();    
    applyParams(change={}){
        this.params=Object.assign(this.params,change);
        this.paramsChange.emit(this.params);           
    }       
    //Urls
    
}

interface CurrentData {
    caption: string,
    enable:  boolean,
    role:    Array<string>,
    future:  Object,
    datasets:Array<Dataset>
}
