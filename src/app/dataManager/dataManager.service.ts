import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Utils} from './utils';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/throw';


@Injectable()
export class DataManager {
    constructor(private http: Http) {
    }
    getData() {

    }
    setDataset(data: Dataset[]) {
        Object.assign(this.datasets, Utils.array2index(data));     
    }             
    preload(data: Dataset[]){
        data.filter(el => el.preload != null).forEach(el => this.load(el.name,el.preload))
    }
    loadSimple(name:string,dst:string=name){
        return this.http.get(this.datasets[name].src)
                        .retry(this.datasets[name].retry||3)                        
                        .map(this.extractData)
                        .catch(this.handleError);      
    }
    loadPooling(name:string,time:number){
        return Observable
           .interval(time)
           .startWith(0)
           .flatMap(() => {
             return this.loadSimple(name);
           }).distinctUntilChanged();
    }    
    loadRun(name:string) {
        if(this.datasets[name].pooling)
            return this.loadPooling(name,this.datasets[name].pooling)
        else
            return this.loadSimple(name);
    }
    load(name:string) {
        let data =this.loadRun(name);
        data.subscribe(d=>{this.db[name]=d;console.log('db',this.db);});
        
        return 's'//data;
    }    
    private datasets: { [name: string]: Dataset } = {};
    private db: { [name: string]: Array<any> } = {};        
    private extractData(res: Response) {
      console.log("body",res);
        return JSON.parse(res._body);
    }
       
    private handleError (error: any) {
      // In a real world app, we might use a remote logging infrastructure
      // We'd also dig deeper into the error to get a better message
      let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error("Error!",errMsg); // log to console instead
      return Observable.throw(errMsg);
    }    
}


interface Dataset {
    name: string,
    src: string,
    api: string,
    format: string,
    preload: string,
    retry?:number,
    pooling?:number
}

