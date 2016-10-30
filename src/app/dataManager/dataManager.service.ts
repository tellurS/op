import { Injectable } from '@angular/core';
import { Http, Response,Headers,RequestOptions,URLSearchParams } from '@angular/http';
import {Utils} from './utils';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/share'

@Injectable()
export class DataManager {
    constructor(private http: Http) {
    }
    setDataset(data: Dataset[]) {
        Object.assign(this.datasets, Utils.array2index(data));     
        data.forEach(el => this.load(el.name));
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
        //let data =this.loadRun(name);
       // data.subscribe(d=>{this.db[name]=d;console.log('db',this.db);});
        this.db[name]=this.loadRun(name).share();
        return this.db[name];
    }    
    getData(name: string){
        return this.db[name];
    }
    getDataExtra(name: string,param:Object={},id=""){
        let source=[];
        if(param.flatMap){ //param - Observable
            source.push(param);
        }else{             //param - simple 
            source.push(Observable.of(param));
        }     
        if(this.datasets[name].pooling){ //repeat
            source.push(Observable.interval(this.datasets[name].pooling).startWith(0));
        }   
        
        return Observable.combineLatest(...source)
                .flatMap((paramPlusTimer) =>this.loadSimple(name,paramPlusTimer[0],id))
                .distinctUntilChanged();
    }
    loadSimple(name:string,data={},id=""){
        console.log("simple",data,id);
        let params = new URLSearchParams();
            for(let p in data){
                params.set(p, data[p]);
                console.log(p, params[p]);
            }
        if(id!=""){
            id='/'+id;
        }
        let headers = new Headers({ 'Content-Type': 'application/json' });   
        return this.http.get(this.datasets[name].src+id,{search: params, headers: headers})
                        .retry(this.datasets[name].retry||3)                        
                        .map(this.extractData)
                        .catch(this.handleError);      
    }    
    saveRecord(name: string,record:any){
        console.log("save",record);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.datasets[name].src,  record, options)
                        .retry(this.datasets[name].retry||3)        
                        .map(this.extractData)
                        .catch(this.handleError);        
    }    
    deleteRecord(name: string,record:any){
        console.log("save",record);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers});
            return this.http.delete(this.datasets[name].src+'/'+record.id, options)
                        .retry(this.datasets[name].retry||3)        
                        .map(this.extractData)
                        .catch(this.handleError);        
    }    
    private datasets: { [name: string]: Dataset } = {};
    private db: { [name: string]: any} = {};        
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

