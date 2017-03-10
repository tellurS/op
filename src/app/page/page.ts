import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataManager, Utils } from '../dataManager';
import { Observable } from 'rxjs/Observable';
import { IComponentData,IPageEvent,ICommandItem,Dataset } from './api';

export class Page {
    public componentName = 'Page';
    public features = {};
    public events:EventEmitter<IPageEvent> = new EventEmitter<ICommandItem>();
    public logs:EventEmitter<IPageEvent> = new EventEmitter<IPageEvent>();
    public componentData: IComponentData;
    public params = {};
    // Start
    constructor(public route: ActivatedRoute, public router: Router, public dm: DataManager) {
        this.componentData = route.snapshot.data as IComponentData;
        dm.setDataset(this.componentData.datasets);
    }
    // Event
    private push(isLog:boolean=false ,type = 'log', data = {}) {
        let l = Object.assign({}, { componentName: this.componentName, type, isLog}, data);
        if(isLog){
            this.logs.emit(l);
        }else{
            this.events.emit(l);        
        }
    }    
    public log(type = 'log', data = {}) {
        this.push(true,type,data)
    }
    public emit(type = 'emit', data = {}) {
        this.push(false,type,data)
    }
    public run(run = 'run', options = {}, dst = null) {
        let data: ICommandItem = { run, options};
        if (dst) {
            data.dst = dst;
        }
        this.emit('run', data);
    }
    // Registry
    public getComponentData(expression: string, default1: any = null): any {
        return Utils.parse(this.componentData, expression) || default1;
    }
    // Params
    public applyParams(change = {}) {
        this.params = Object.assign({}, this.params, change);
        this.emit('paramsChange', { params: this.params });
    }
    // Urls
    public changeUrl(options = { replaceUrl: true }) {
        this.router.navigate([this.params], options);
    }
}

