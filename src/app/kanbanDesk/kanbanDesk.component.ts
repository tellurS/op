import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Message} from 'primeng/primeng';

@Component({
    selector: 'kanbanDesk',  // <home></home>
    templateUrl: './kanbanDesk.template.html'
})
export class KanbanDesk {
    columns: Array<any>;
    records: any;
    colWidth: any;
    tags: any;
    draggedRec:any;
    dropArr:Array<any>;
    msgs: Message[] = [];
    
    constructor(private route: ActivatedRoute,
        private router: Router) {

    }

    ngOnInit() {
        console.log('hello `kanbanDesk` component');
        this.route.data.subscribe(data => {
            this.columns = data.columns;
            this.colWidth = 'ui-g-' + (12 / this.columns.length).toFixed();
            //init
            this.records = data.source.data.sort((a,b)=>a.priority>b.priority);
            //this.columns.forEach(el=> this.records[el.id] = []);
            //load        
            /*
            data.source.data.sort((a,b)=>a.priority>b.priority)
                            .forEach(el=> this.records[el.columnId].push(el));*/
            //priority;
            this.tags = this.array2index(data.tags, "id");
            console.log("tags",this.tags);
        });
        
        
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
        /*
        if(this.draggedCar) {
            this.selectedCars.push(this.draggedCar);
            this.availableCars.splice(this.findIndex(this.draggedCar), 1);
            this.draggedCar = null;
        }*/
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
            if(dst[0][1]==='column'){
                this.changeColumn(this.draggedRec,dst[0][0]);
            }else{                
                
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
        if(rec.columnId!=dst.id){
           console.log("changeColumn",rec,dst.id);
           rec.columnId=dst.id; 
           //this.records.push(Object.assign({},rec,{columnId:dst.id}));
        }else{
            
        }
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