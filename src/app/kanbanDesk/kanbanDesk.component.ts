import { Component,Input,Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Message} from 'primeng/primeng';
import { DataManager } from '../dataManager';
import 'rxjs/add/observable/combineLatest';
import { Observable } from 'rxjs/Observable';


@Component({
    selector: 'kanbanDesk',  // <home></home>
    templateUrl: './kanbanDesk.template.html'
})
export class KanbanDesk {
    columns: any;
    records: any;
    colWidth: any;
    tags: any;
    draggedRec:any;
    dropArr:Array<any>;
    msgs: Message[] = [];

    @Input() paramsIssuesList = {};
    @Output() paramsIssuesListChange = new EventEmitter();
        
    constructor(private route: ActivatedRoute,
        private router: Router,private dm:DataManager) {

    }

    ngOnInit() {
        console.log('hello `kanbanDesk` component');
        Observable.combineLatest([this.dm.getRecords('columns'),
                                  this.dm.getRecords('issues', 
                                                    this.paramsIssuesListChange, 
                                                    {pooling:this.dm.getCurrentData("future.pooling",false)}),
                                  this.dm.getRecords('tags'),
                                  this.dm.getRecords('issues',{id:"1"}),                                  
                                  ])
               .subscribe(([c,i,t])=>{
                   this.columns = c;
                   this.colWidth = 'ui-g-' + (12 / this.columns.length).toFixed();
                   this.records = i.sort((a,b)=>a.priority>b.priority);
                   this.tags = this.array2index(t, "id");
                   console.log('datachanged!!!');
        });
        this.applyParams();
              
        this.items = [{
            "label": "Documents",
            "data": "Documents Folder",
            "expandedIcon": "fa-folder-open",
            "collapsedIcon": "fa-folder",
            "children": [{
                    "label": "Work",
                    "data": "Work Folder",
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder",
                    "children": [{"label": "Expenses.doc", "icon": "fa-file-word-o", "data": "Expenses Document"}, {"label": "Resume.doc", "icon": "fa-file-word-o", "data": "Resume Document"}]
                },
                {
                    "label": "Home",
                    "data": "Home Folder",
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder",
                    "children": [{"label": "Invoices.txt", "icon": "fa-file-word-o", "data": "Invoices for this month"}]
                }]
        },
        {
            "label": "Pictures",
            "data": "Pictures Folder",
            "expandedIcon": "fa-folder-open",
            "collapsedIcon": "fa-folder",
            "children": [
                {"label": "barcelona.jpg", "icon": "fa-file-image-o", "data": "Barcelona Photo"},
                {"label": "logo.jpg", "icon": "fa-file-image-o", "data": "PrimeFaces Logo"},
                {"label": "primeui.png", "icon": "fa-file-image-o", "data": "PrimeUI Logo"}]
        }];
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
    
    dragStart(event,rec) {        
        console.log("drag",event,rec);
        this.draggedRec = rec;
        this.dropArr=[];
        this.msgs[0]={severity:'info', summary:'Drag', detail:'Change column/set label'};
    }
    
    drop(event,dst,type) {        
        console.log("drop",event,dst,type);
        this.dropArr.push([dst,type]);        
    }
    dropedMenu(event,dst) {        
        console.log("dropedMenu",this.dst,this.draggedRec);
        this.clearDroped();
    }    
    dragEnd(event) {
        console.log("dragEnd",event,this.dropArr);
        let dst;
        if (this.dropArr && this.dropArr.length>0){
            dst=this.dropArr.sort((a,b)=> (a[1] === 'column')?1:-1);
            console.log("dragEnd dst",dst[0]);
            if(dst[0][1]==='remove'){
                this.remove(this.draggedRec);
            }                         
            if(dst[0][1]==='column'){
                this.changeColumn(this.draggedRec,dst[0][0]);
            }             
            if(dst[0][1]==='clone'){
                this.clone(this.draggedRec);
            }                         
            
            if(dst[0][1]!=='menu'){
                this.clearDroped();
            }            
        }        
    }    
    clearDroped(){
                this.msgs=[];
                this.draggedRec = null;
                console.log('clear')        
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