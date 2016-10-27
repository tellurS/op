import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/take';
import { DataManager } from './dataManager';

@Injectable()
export class DataResolver implements Resolve<any> {
  constructor(private dataManager:DataManager) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("Resolve!!",route.data.datasets);
    this.dataManager.setDataset(route.data.datasets);
    //return this.dataManager.load('tag');
    let preload=route.data.datasets.filter(el => el.preload != null)
                       .map(el => this.dataManager.load(el.name,el.preload));
    return Observable.combineLatest(...preload,(...a)=>"ok");    
  }
}

// an array of services to resolve routes with data
export const APP_RESOLVER_PROVIDERS = [
  DataResolver
];
