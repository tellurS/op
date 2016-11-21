import { Component,Input,Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Message} from 'primeng/primeng';
import { DataManager } from '../dataManager';
import 'rxjs/add/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { DragDrop } from '../dragDrop/dragDrop';


@Component({
    selector: 'kanbanDesk',  
    templateUrl: './kanbanDesk.template.html',
    providers : [DragDrop],
 })
export class KanbanDesk {
    columns: any;
    records: any;
    colWidth: any;
    tags: any;
    msgs: Message[] = [];
    features={
        pooling: false,
        bin:     false,
        peoples: false,
        resourse:false,
        priority:false        
    };
    items=[];

    
    @Input()  paramsIssuesList = {};
    @Output() paramsIssuesListChange = new EventEmitter();
    
    
    constructor(private route: ActivatedRoute,
        private router: Router,private dm:DataManager,public dragDrop:DragDrop) {
        this.dragDrop.setParentComponent(this);
    }

    ngOnInit() {
        console.log('hello `kanbanDesk` component');
        this.features=this.dm.getCurrentData("feature",this.features);
            
        Observable.combineLatest([this.dm.getRecords('columns'),
                                  this.dm.getRecords('issues', 
                                                    this.paramsIssuesListChange, 
                                                    {pooling:this.features.pooling}),
                                  this.dm.getRecords('tags'),
                                  this.dm.getRecords('issues',{id:"1"}),                                  
                                  ])
               .subscribe(([c,i,t])=>{
                   this.columns = c;
                   this.colWidth = 'ui-g-' + (11 / this.columns.length).toFixed();
                   this.records = i.sort((a,b)=>a.priority>b.priority);
                   this.tags = this.array2index(t, "id");
                   console.log('datachanged!!!');
        });
        this.applyParams();              
        this.items = [
                       {label: 'Remove' , icon: 'kanban-recycle',dropCommand:e=>this.dragDrop.drop(e,e.itemDrop,'remove')},
                       {label: 'Open', icon: 'fa-download',dataItem:"Ogo",dropEventEmitter:this.dragDrop.itemsDrop},
                       {label: 'clone', icon: 'fa-refresh',dropEventEmitter:this.dragDrop.itemsDrop,run:'remove'}
        ];        
                
    }
    tag2icon(tag: string) {
        return this.tags[tag] && this.tags[tag].icon || '';
    }
    tag2text(tag: string) {
        return this.tags[tag] && this.tags[tag].caption || '';
    }    
    array2index(arr: Array<any>, index: String) {
        let result ={};
        arr.forEach(el=>result[el[index]]=el);
        return result;
    }
    
    changeColumn(rec,dst){
        if(rec.columnId!=dst.id){//changeColumn
           console.log("changeColumn",rec,dst.id);
           rec.columnId=dst.id; 
           this.dm.saveRecord("issues", rec).subscribe((d)=>rec=d);
        }else{ //clone
           this.dm.saveRecord("issues",Object.assign({},rec,{id:null})).subscribe((d)=>this.records.push(d));           
        }
    }
    remove(rec){
           console.log("remove",rec); 
           this.dm.deleteRecord("issues", rec).subscribe((d)=>this.records=this.records.filter(item => item !== rec));
    }     
    togglePriority(){
        this.applyParams({priority_gte:'10'});
    }
    applyParams(change={}){
        this.paramsIssuesList=Object.assign(this.paramsIssuesList,change);
        this.paramsIssuesListChange.emit(this.paramsIssuesList);           
    }
    select(node){
        console.log("select",node);
    }
   drop(event,dst,type) {        
        console.log("drop",event,dst,type);
      
    }    
    
}

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'byColumns',
  pure: false
})
export class byColumns implements PipeTransform {
  transform(value: Array<any>, columnId: string): number {
    return value.filter(a=>(a.columnId===columnId));
  }
}

