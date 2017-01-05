import { Component,Input,Output, EventEmitter,ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Message} from 'primeng/primeng';
import { DataManager,Utils} from '../dataManager';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/concat';
import { Observable } from 'rxjs/Observable';
import { DragDrop,DragDropEvent } from '../dragDrop/dragDrop';
import { Page } from '../page/page';
import { MenuCommandItem } from '../menuCommand/menuCommand';
import { DialogForm,FormItem } from '../dialogForm';

@Component({
    selector: 'kanbanDesk',  
    templateUrl: './kanbanDesk.template.html',
    providers : [DragDrop],
 })
export class KanbanDesk extends Page{
    componentName="KanbanDesk";
    columns: any;
    records=[];
    peoples=[];
    resources=[];
    selectedIdRecords = [];
    colWidth: any;
    tagsa: any;
    tags: any;
    msgs: Message[] = [];
    features={
        pooling: 0,
        peoples: false,
        peoplesInTree:false,        
        resources:false,
        resourcesInTree:false,        
        tagsInTree:false,
        priority:false        
    };
    menuItems=[];
    menuPeoples=[];
    menuResources=[];    
    prefixTagCss="kanban-tag";
    workAria=10;
    @ViewChild(DialogForm) dialog:DialogForm;
    //Start
    constructor(public route: ActivatedRoute,
                public router: Router,
                public dm:DataManager,
                public dragDrop:DragDrop) {       
        
        super(route,router,dm);
        this.log("kanbanCreated");
        
        this.dragDrop.setEvents(this.events);        
        
    }

    ngOnInit() {
        this.features=this.getComponentData("feature",this.features);
            
        Observable.combineLatest([this.dm.getRecords('columns'),
                                  this.dm.getRecords('issues', 
                                                    this.events.filter(e=>e.type==="paramsChange").map(val => Utils.pick(val.params,["priority_gte"])).distinctUntilChanged(null,a=>JSON.stringify(a)), 
                                                    {pooling:this.features.pooling}),
                                  this.dm.getRecords('tags'),
                                  (this.features.peoples)?this.dm.getRecords('peoples'):Observable.of([]),
                                  (this.features.resources)?this.dm.getRecords('resources'):Observable.of([]),
                                  //this.dm.getRecords('issues',{id:"1"})
                                  ])
               .subscribe(([c,i,t,p,r])=>{
                   this.columns = c;
                   this.colWidth = 'ui-g-' + (this.workAria/ this.columns.length).toFixed();
                   this.tagsa=t;
                   this.tags = Utils.array2index(t, "id");
                   this.data2menu(t,this.features.tagsInTree,"menuTags","tags");                   
                   this.records=i;
                   this.peoples=Utils.array2index(p, "id");;
                   this.data2menu(p,this.features.peoplesInTree,"menuPeoples","peoples");
                   this.resources=Utils.array2index(r, "id");;
                   this.data2menu(r,this.features.resourcesInTree,"menuResources","resources");                                     
                   this.run("order");                   
                   this.log("dataUpdated");                   
        });             
        this.menuItems = [
            {label: "Add", icon: "fa-plus",   eventEmitter:this.events,run:"addDialog"},
            {label: "Change", icon: "fa-edit", eventEmitter: this.events, run: "changeDialog", one: true},
            {label: "Clone", icon: "fa-refresh",   eventEmitter:this.events,run:"clone",multi:true},
            {label: "Remove" , icon: "fa-cut",eventEmitter:this.events,run:"remove",multi:true},                                   
            {label: "Priority" , icon: "fa-fire", items:[            
                {label: "High Priority" , icon: "fa-fire",eventEmitter:this.events,run:"change",multi:true,options:{priority:"1000"}},            
                {label: "Medium Priority" , icon: "fa-gavel",eventEmitter:this.events,run:"change",multi:true,options:{priority:"500"}},                        
                {label: "Low Priority" , icon: "fa-bed",eventEmitter:this.events,run:"alternative",options:[
                        {run:"change",label:"Set Low Priority",multi:true,options:{priority:"100"}}
                ]}
            ]},                        
            {label: "Select" , icon: "fa-fire", items:[            
                {label: "Select all" , icon: "fa-battery-full",eventEmitter:this.events,run:"selectAll"},            
                {label: "Toggle select" , icon: "fa-battery-quarter",eventEmitter:this.events,run:"toggleSelect"},                        
                {label: "Deselect" , icon: "fa-battery-empty",eventEmitter:this.events,run:"deSelect"},                        
                {label: "Order" , icon: "fa-sort-up",eventEmitter:this.events,run:"order"}                                 
            ]},                                    
            
        ];    
                                                                          
    }    
    
  ngAfterViewInit() {     
        this.events.filter(e=>e.type==="menuDrop")//Menu2drop
                   .subscribe(e=>this.dragDrop.drop(e,e.item,e.item.run));        
                   
        this.events.filter(e=>e.type==="onDragEnd")
                   .subscribe(e=>this.processingDrop(e.data));        
        this.events.filter(e=>e.type==="menuClick")
                   .subscribe(e=>this.processingClick(e.item)); 
        this.events.filter(e=>e.type==="run")
                   .subscribe(e=>this.processingClick(e));     
        this.dialog.events.filter(e=>e.type==="run")
               .subscribe(e=>this.processingClick(e)); 
                                   
        this.events.filter(e=>e.type==="select")
                    .subscribe(e=>this.applyParams({select: this.selectedIdRecords}));    
        this.events.filter(e=>e.type==="select")
            .subscribe(e => { this.menuItems[1].disabled = (this.selectedIdRecords.length==0)});                                   
        this.events.filter(e=>e.type==="paramsChange")
                   .subscribe(e=>this.changeUrl());       
          
                   
        this.selectedIdRecords           
                       
        Observable.concat(this.logs, this.events,this.dialog.events).subscribe(e=>console.log(e));
          //start                                
        this.log('init');
        this.applyUrlParams(this.route.snapshot.params);
  }    
    //click menu event    
    processingClick(item:MenuCommandItem){
        if(item.run&&this[item.run]){          
            this.log("processingClick",item);            
            if (item.multi||item.one){//group2single                
                this.selectedIdRecords.forEach(
                          id=>this[item.run as string](item.options||{},id)
                        );        
            }else{               
                this[item.run as string](item.options||{},this.selectedIdRecords,item.dst);            
            }                                             
        }                
    }   
    //drop event
    processingDrop(e:DragDropEvent){
        let dropFinish=e.drops.sort((a,b)=> (a.type === 'changeColumn')?1:-1);//column first
        let dst=dropFinish[0].dst;

        if(dropFinish[0].type&&this[dropFinish[0].type]){
            this.log("processingDrop",{options:dst.options,src:e.src,dst});
            this[dropFinish[0].type](dst.options,e.src.id,dst);                            
        }
    }
    //web Helpers
    tag2icon(tag: string) {
        return this.tags[tag] && this.tags[tag].icon || '';
    }    
    tag2text(tag: string) {
        return this.tags[tag] && this.tags[tag].caption || '';
    }        
    people2icon(tag: string) {
        return this.peoples[tag] && this.peoples[tag].icon || '';
    }    
    people2text(tag: string) {
        return this.peoples[tag] && this.peoples[tag].caption || '';
    }        
    resource2icon(tag: string) {
        return this.resources[tag] && this.resources[tag].icon || '';
    }    
    resource2text(tag: string) {
        return this.resources[tag] && this.resources[tag].caption || '';
    }                
    
    status2class(rec){
        let dst={'kanban-high':rec.priority>=700,
                'kanban-medium':(rec.priority<700)&&(rec.priority>400),
                'kanban-low':(rec.priority<=400),
                'kanban-selected':this.isSelect(rec)
                };
        if(rec.tags)
            rec.tags.forEach(c=>{dst[this.prefixTagCss+c]=true;});
        return dst;
    }
    //helpers
    id2record(id:number){
        if(!id)
            return null;
        return this.records.find(r=>r.id===id);         
    }    
    //Commands 
    addDialog(options={},src=null){
        let form:Array<FormItem>=[
            {name:"columnId",caption:"Column",type:"dropdown",values:this.columns,
             idValue:"id",labelValue:"caption",icon:"icon","default":2,description:"Column type",
             required:true,number:true
             },
            {name:"caption",caption:"Caption",type:"text",minLength:15,maxLength:60,description:"Caption for issue"},
            {name:"description",caption:"Description",type:"text",minLength:15,maxLength:260,description:"Description for issue"},
            {name:"priority",caption:"Priority",type:"number",min:0,max:2000,description:"Priority for issue",default:"500"},
            {name:"tags",caption:"Label",type:"listbox",description:"Tag for issue",default:[],
             values:this.tagsa,idValue:"id",labelValue:"caption",icon:"icon"            
            }
        ];
        this.log("addDialog",{options,src});        
        
        this.dialog.form("new record", "please enter:",{}, form,[
            {label: "Add",   icon: "fa-plus", run:"save",formStatus:true},
            {label: "Close", icon: "fa-close"},
        ]);
    }     
    changeDialog(options={},src=null){
        let rec=this.id2record(src);
        if(!rec){
            return;
        }             
        this.log("changeDialog",{options,src,rec});        
        
        let form:Array<FormItem>=[
            {name:"columnId",caption:"Column",type:"dropdown",values:this.columns,
             idValue:"id",labelValue:"caption",icon:"icon","default":2,description:"Column type",
             required:true,number:true
             },
            {name:"caption",caption:"Caption",type:"text",minLength:15,maxLength:60,description:"Caption for issue"},
            {name:"description",caption:"Description",type:"text",minLength:15,maxLength:260,description:"Description for issue"},
            {name:"priority",caption:"Priority",type:"number",min:0,max:2000,description:"Priority for issue",default:"500"},
            {name:"tags",caption:"Label",type:"listbox",description:"Tag for issue",default:[],
             values:this.tagsa,idValue:"id",labelValue:"caption",icon:"icon"            
            }
        ];
        
        this.dialog.form("Edit record", "please change:",rec, form,[
            {label: "Save",   icon: "fa-edit", run:"save",formStatus:true},
            {label: "Close", icon: "fa-close"},
        ]);
    }    
    save(options={},src=null,dst={}){
        this.log("save",{options});
        this.dm.saveRecord("issues",options)
               .subscribe((newR)=>{
                            let index = this.records.indexOf(dst);
                            if(index>0){
                                this.records.splice(index, 1,newR);
                            }else{
                                this.records.push(newR);
                            }                            
                            this.run("order");
                        });                                              
    }
    order(options={},src=null){
        this.records = this.records.sort((a,b)=>a.priority<b.priority);    
        console.log("order",this.records);    
    }    
    changeColumn(options={},src=null,dst){        
        let rec=this.id2record(src);
        if(!src){
            return;
        }                             
        if(rec.columnId!=dst.id){//changeColumn
           this.log("changeColumn",{rec,id:dst.id});
           this.change({columnId:dst.id},src);
        }else{ //clone
           this.clone(options,src);
        }
    }
    remove(options={},src=null){
        if(src){
            this.log("remove",{src});            
            this.dm.deleteRecord("issues", src).subscribe((d)=>this.records=this.records.filter(item => item.id !== src));
        }
    }     
    clone(options={},src=null){
        let rec=this.id2record(src);
        if(!rec){
            return;
        }             
        this.log("clone",{rec,src});
        this.dm.saveRecord("issues",Object.assign({},rec,{id:null})).subscribe((d)=>this.records.push(d));                   
    }    
    change(options={},src=null){
        let rec=this.id2record(src);
        if(!rec){
            return;
        }             
        this.log("change",{options,src,rec});
        this.save(Object.assign({},rec,options),src,rec);           
    }    
    update(options={},src=null,dst=null){
        let rec=this.id2record(src);
        if(!rec||!options.key){
            return;
        }          
        this.save(Utils.update(Object.assign(rec),options),src,rec);
    }    
    //Params    
    togglePriority(){
        this.applyParams({priority_gte:'15'});
    }
    applyUrlParams(params: Params){
        this.applyParams(params);
        if(params['select']){
            this.selectRecords(null, false, ...params['select'].split(',').map(s=>+s))    
        };                
    }            
    //select
    selectRecords($event={},push=true,...recordsId){
        if(!push){
            this.emit("deSelect",{data:this.selectedIdRecords});            
            this.selectedIdRecords=[];                      
        }        
        this.selectedIdRecords = this.selectedIdRecords.concat(recordsId);
        this.emit("select",{data:this.selectedIdRecords,event:$event});            
    }
    select(options={}){
        this.selectRecords(options.$event,options.$event.shiftKey,options.rec.id);        
    }
    isSelect(rec){
        return this.selectedIdRecords.indexOf(rec.id)>-1;       
    }   
    selectAll(options={},src=null,dst){
        this.selectRecords(null,false,...this.records.map(e=>e.id));
    }         
    toggleSelect(options={},src=null,dst){
            this.selectRecords(null, false, ...this.records.filter(e => this.selectedIdRecords.indexOf(e.id)===-1).map(e=>e.id));
    }         
    deSelect(options={},src=null,dst){
            this.selectRecords(null, false);
    }
    alternative(options=[],src=null,dst=null){
        this.dialog.alternative("select", "please select action", { src, dst }, options);
    }              
    //etc
    data2menuSub(items,directoryName:string):MenuCommandItem[]{        
        return items.map(e=>{                        
                let item:MenuCommandItem={label: e.caption||'' , icon: e.icon ,eventEmitter:this.events,run:"update",multi:true};
                if(e._child){
                    item.expanded=false;
                    item.items=this.data2menuSub(e._child.map(id=>this[directoryName][id]),directoryName);
                }
                
                if(!e._onlyFolder)
                    item.options={key:directoryName,expression:e.id,handle:"!"}    
                return item;    
              });               
    } 
    data2menu(data:Array<any>,onlyRoot:false,menuName:string,directoryName:string){
        let roots=data.filter(item=>item._itIsRoot);
        if (roots.length===1){
            roots[0]._child=data.filter(item=>!item._itIsRoot).map(e=>e.id);
            this[menuName]=this.data2menuSub(roots,directoryName);
        }else{        
            this[menuName]=this.data2menuSub(data.filter(item=>(!onlyRoot||item._root)),directoryName);
        }
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

