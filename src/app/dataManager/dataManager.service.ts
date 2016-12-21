import { Injectable } from '@angular/core';
import { Http, Response,Headers,RequestOptions,URLSearchParams } from '@angular/http';
import {Utils} from './utils';
import { Observable } from 'rxjs/Observable';
import { RestClient } from'./restClient.service';
import './rxData';


@Injectable()
export class DataManager {
    constructor(private rest: RestClient) {
    }
    setDataset(data: Dataset[]) {
        Object.assign(this.datasets, Utils.array2index(data));     
    }             
    getRecords(name: string,param:Observable<any>|any={},options:{pooling:number}={pooling:0}){//.share()
        let source=[];
        if(param.flatMap){ //param - Observable
            source.push(param);
        }else{             //param - simple 
            source.push(Observable.of(param));
        }     
        if(options.pooling){ //repeat
            source.push(Observable.interval(options.pooling).startWith(0));
        }   
        
        return Observable.combineLatest(...source)
                .flatMap((paramPlusTimer) =>this.getRecordsSimple(name,paramPlusTimer[0]))
                .distinctUntilChanged();
    }
    getRecordsSimple(name:string,params={}){
        console.log("get",params);
        let options={retry: this.datasets[name].retry};
        if(params["id"]){ 
            options["id"]= params["id"];
        }                     
        if(this.datasets[name].api==="rest"&&this.datasets[name].format==="json")
            return this.rest.getRecords(this.datasets[name].src,params,options)
                .share();
        throw {name : "NotImplementedError", message : "api"};           
    }
    saveRecord(name: string,record:any){
        if(this.datasets[name].api==="rest"&&this.datasets[name].format==="json")
            return this.rest.saveRecord(this.datasets[name].src, record, { retry: this.datasets[name].retry});
        throw {name : "NotImplementedError", message : "api"}; 
    }    
    deleteRecord(name: string,record:any){
        if(this.datasets[name].api==="rest"&&this.datasets[name].format==="json")
            return this.rest.deleteRecord(this.datasets[name].src, { retry: this.datasets[name].retry,
                                                                     id: record.id});
        throw {name : "NotImplementedError", message : "api"};         
    }
    private datasets: { [name: string]: Dataset } = {};

}


export interface Dataset {
    name: string,
    src: string,
    api: string,
    format: string,
    retry?:number
}

