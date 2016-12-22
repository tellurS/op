import { Injectable } from '@angular/core';
import { Http, Response,Headers,RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import './rxData';

@Injectable()
export class RestClient {
    constructor(private http: Http) {
    }
    data2URLSearchParams(data={}):URLSearchParams{
        let params = new URLSearchParams();
        if(data)
            for(let p in data){
                params.set(p, data[p]);
            }
        return params;
    }
    id2url(baseurl:string,id=""){       
        return baseurl+((id!="")?(id='/'+id):"");
    }
    createOptions(data?):RequestOptions{
        return new RequestOptions({ headers:  new Headers({ 'Content-Type': 'application/json' }),
                                    search:   this.data2URLSearchParams(data)
                             });
    }
    getRecords(baseurl:string,params={},clientOptions:IClientOptions={}){
        return this.http.get(this.id2url(baseurl,clientOptions.id),this.createOptions(params))
                        .retry(clientOptions.retry||3)                        
                        .map(this.extractData)
                        .catch(this.handleError);      
    }    
    saveRecord(baseurl: string,record:any,clientOptions:IClientOptions={}){
        return this.http.post(baseurl,  record, this.createOptions())
                        .retry(clientOptions.retry||3)         
                        .map(this.extractData)
                        .catch(this.handleError);        
    }    
    deleteRecord(baseurl: string,clientOptions:IClientOptions={}){
            return this.http.delete(this.id2url(baseurl,clientOptions.id),this.createOptions())
                        .retry(clientOptions.retry||3)        
                        .map(this.extractData)
                        .catch(this.handleError);        
    }      
    private extractData(res: Response) {
        return JSON.parse(res["_body"]);
    }
       
    private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error("Error!",errMsg); 
      return Observable.throw(errMsg);
    }    
}

export interface IClientOptions { 
    retry?:number,
    id?:any
}