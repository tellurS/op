import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataManager, Utils, Dataset } from '../dataManager';
import { Observable } from 'rxjs/Observable';
import { MenuCommandItem } from '../menuCommand/menuCommand';

export class Page {
    public componentName = 'template';
    public features = {};
    public events = new EventEmitter();
    public logs = new EventEmitter();
    public data: ComponentData;
    public params = {};
    // Start
    constructor(public route: ActivatedRoute, public router: Router, public dm: DataManager) {
        this.data = route.snapshot.data as ComponentData;
        dm.setDataset(this.data.datasets);
    }
    // Event

    public emit(type = 'emit', data = {}) {
        let d = Object.assign({}, { componentName: this.componentName, type }, data);
        this.events.emit(d);
    }
    public run(run = 'run', options = {}, dst = null) {
        let data: MenuCommandItem = { run, options };
        if (dst) {
            data.dst = dst;
        }
        this.emit('run', data);
    }
    public log(type = 'log', data = {}) {
        let l = Object.assign({}, { status: 'log', componentName: this.componentName, type }, data);
        this.logs.emit(l);
    }

    // Registry
    public getComponentData(expression: string, default1: any = null): any {
        return Utils.parse(this.data, expression) || default1;
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

interface ComponentData {
    caption: string;
    enable: boolean;
    role: string[];
    future: Object;
    datasets: Dataset[];
}
