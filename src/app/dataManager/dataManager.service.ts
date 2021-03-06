import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Utils } from './utils';
import { Observable } from 'rxjs/Observable';
import { RestClient } from './restClient.service';
import { IComponentData,IPageEvent,ICommandItem,Dataset } from '../page/api';
import './rxData';

@Injectable()
export class DataManager {
    constructor(private rest: RestClient) {
    }
    public setDataset(data: Dataset[]) {
        Object.assign(this.datasets, Utils.array2index(data));
    }
    public getRecords(name: string, param: Observable<any> | any = {}, options: { pooling: number } = { pooling: 0 }) {  // .share()
        let source = [];
        if (param.flatMap) {  // param - Observable
            source.push(param);
        } else {              // param - simple 
            source.push(Observable.of(param));
        }
        if (options.pooling) { //r epeat
            source.push(Observable.interval(options.pooling).startWith(0));
        }

        return Observable.combineLatest(...source)
            .flatMap((paramPlusTimer) => this.getRecordsSimple(name, paramPlusTimer[0]))
            .distinctUntilChanged();
    }
    public getRecordsSimple(name: string, params = {}) {
        let options = { retry: this.datasets[name].retry || 0 };
        if (params['id']) {
            options['id'] = params['id'];
        }
        if (this.datasets[name].api === 'rest' && this.datasets[name].format === 'json'){
            return this.rest.getRecords(this.datasets[name].src, params, options)
                .share();
        }
        throw { name: 'NotImplementedError', message: 'api' };
    }
    public saveRecord(name: string, record: any) {
        if (this.datasets[name].api === 'rest' && this.datasets[name].format === 'json')
            return this.rest.saveRecord(this.datasets[name].src, record, { retry: this.datasets[name].retry });
        throw { name: 'NotImplementedError', message: 'api' };
    }
    public deleteRecord(name: string, idRecord: number) {
        if (this.datasets[name].api === 'rest' && this.datasets[name].format === 'json'){
            return this.rest.deleteRecord(this.datasets[name].src, {
                retry: this.datasets[name].retry,
                id: idRecord
            });
        }
        throw { name: 'NotImplementedError', message: 'api' };
    }
    private datasets: { [name: string]: Dataset } = {};
}

