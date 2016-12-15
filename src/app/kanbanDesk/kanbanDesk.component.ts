import { Component,Input,Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Message} from 'primeng/primeng';
import { DataManager,Utils} from '../dataManager';
import 'rxjs/add/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { DragDrop,DragDropEvent } from '../dragDrop/dragDrop';
import { Template } from '../template/template.component';


@Component({
    selector: 'kanbanDesk',  
    templateUrl: './kanbanDesk.template.html',
    providers : [DragDrop],
 })
export class KanbanDesk extends Template{
    columns: any;
    records=[];
    selectedIdRecords = [];
    colWidth: any;
    tags: any;
    msgs: Message[] = [];
    features={
        pooling: 0,
        bin:     false,
        peoples: false,
        resourse:false,
        priority:false        
    };
    menuItems=[];

    
    
    //Start
    constructor(private route: ActivatedRoute,
                private router: Router,
                private dm:DataManager,
                public dragDrop:DragDrop) {       
        
        super(route,dm);
        console.log("kanban created");
        
        this.dragDrop.setEvents(this.events);        
        
    }

    ngOnInit() {
        console.log('hello `kanbanDesk` component');
        this.features=this.getCurrentData("feature",this.features);
            
        Observable.combineLatest([this.dm.getRecords('columns'),
                                  this.dm.getRecords('issues', 
                                                    this.paramsChange, 
                                                    {pooling:this.features.pooling}),
                                  this.dm.getRecords('tags')
                                  //this.dm.getRecords('issues',{id:"1"})
                                  ])
               .subscribe(([c,i,t])=>{
                   this.columns = c;
                   this.colWidth = 'ui-g-' + (11 / this.columns.length).toFixed();
                   this.records = i.sort((a,b)=>a.priority>b.priority);
                   this.tags = Utils.array2index(t, "id");
                   console.log('datachanged!!!');
        });
        this.applyParams();              
        this.menuItems = [
                       {label: "Remove" , icon: "kanban-recycle",eventEmitter:this.events,run:"remove"},
                       {label: "clone", icon: "fa-refresh",eventEmitter:this.events,run:"clone",dataItem:{"caption":"new witch template","columnId":1}}
        ];        
        
        this.events.filter(e=>e.type==="drop")//Menu2drop
                   .subscribe(e=>this.dragDrop.drop(e,e.item,e.item.run));        
        this.events.filter(e=>e.type==="onDragEnd")
                   .subscribe(e=>this.processingDrop(e.data));        
        this.events.filter(e=>e.type==="click")
                   .subscribe(e=>this.processingClick(e.item));                   
        this.events.subscribe(e=>console.log("Logger:",e));
        this.events.filter(e=>e.type==="select")
                   .subscribe(e=>this.changeUrl());                                                      
        this.events.filter(e=>e.type==="applyUrlParams")
                   .subscribe(e => this.selectRecords(null, false, ...e.data));
                   
        this.applyUrlParams(this.route.snapshot.params);                   

    }
    //click event    
    processingClick(e){
        if(e.run&&this[e.run]){
            console.log("Run:",e.run,e.dataItem);
            this[e.run](e.dataItem||{});
        }                
    }   
    //drop event
    processingDrop(e:DragDropEvent){
        let dropFinish;
            dropFinish=e.drops.sort((a,b)=> (a.type === 'changeColumn')?1:-1);//column first
            console.log("drapDropRun dst",dropFinish[0]);

            if(dropFinish[0].type&&this[dropFinish[0].type]){
                console.log("Run:");
                this[dropFinish[0].type](e.src,dropFinish[0].dst,dropFinish[0].dst.dropDataItem||{});
            }                
    }
    
    //Helpers
    tag2icon(tag: string) {
        return this.tags[tag] && this.tags[tag].icon || '';
    }    
    tag2text(tag: string) {
        return this.tags[tag] && this.tags[tag].caption || '';
    }    
    //Commands    
    changeColumn(rec,dst){
        if(rec.columnId!=dst.id){//changeColumn
           console.log("changeColumn",rec,dst.id);
           rec.columnId=dst.id; 
           this.dm.saveRecord("issues", rec).subscribe((d)=>rec=d);
        }else{ //clone
           this.clone(rec);
        }
    }
    remove(rec){
        if(rec){
            console.log("remove",rec); 
            this.dm.deleteRecord("issues", rec).subscribe((d)=>this.records=this.records.filter(item => item !== rec));
        }
    }     
    clone(rec){
        if(rec){
            this.dm.saveRecord("issues",Object.assign({},rec,{id:null})).subscribe((d)=>this.records.push(d));           
        }
    }
    
    //Params    
    togglePriority(){
        this.applyParams({priority_gte:'15'});
    }
    applyUrlParams(params: Params){
        if(params['selectedIds']){
            this.events.emit({type:"applyUrlParams",module:"kanbanDesk",data:params['selectedIds'].split(',').map(s=>+s)});        
        }
    }            
    //select
    selectRecords($event={},push=true,...recordsId){
        if(!push){
            this.events.emit({type:"deSelect",module:"kanbanDesk",data:this.selectedIdRecords});
            this.selectedIdRecords=[];                      
        }        
        this.selectedIdRecords = this.selectedIdRecords.concat(recordsId);
        this.events.emit({type:"select",module:"kanbanDesk",data:this.selectedIdRecords,event:$event});                
    }
    select($event,rec){
        this.selectRecords($event,$event.shiftKey,rec.id);
    }
    isSelect(rec){
        return this.selectedIdRecords.indexOf(rec.id)>-1;       
    }   
    //urls
    changeUrl(){        
        this.router.navigate([{ selectedIds: this.selectedIdRecords}],  { replaceUrl: true });
    }
}

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'byColumns',
  pure: false
})
export class byColumns implements PipeTransform {
  transform(values: Array<{columnId:number}>, columnId: number): Array<any> {
    return values.filter(a=>(a.columnId==columnId));
  }
}

