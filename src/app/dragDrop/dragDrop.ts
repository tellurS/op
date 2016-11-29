import { Injectable } from '@angular/core';
import { EventEmitter} from '@angular/core';

@Injectable()
export class DragDrop {
    draggedRec:any;
    dropArr:Array<any>;    
    itemsDrop = new EventEmitter();
    parentComponent: any;
    
    constructor(){
        this.itemsDrop.subscribe(e=>this.drop(e,e.item,"menu"));
    }
    setParentComponent(parent:any){
        this.parentComponent=parent;
    }
    onDragEnter($event, node){
        console.log("onDragEnter",$event, node);
    }
    onDragLeave($event, node){
        console.log("onDragLeave",$event, node);
    }    
    clearDroped(){
                //this.msgs=[];
                this.draggedRec = null;
                console.log('clear')        
    }    
    dragStart(event,rec) {        
        console.log("drag",event,rec);
        this.draggedRec = rec;
        this.dropArr=[];
        //this.msgs[0]={severity:'info', summary:'Drag', detail:'Change column/set label'};
    }
    
    drop(event,dst,type) {        
        console.log("drop",event,dst,type);
        this.dropArr.push([dst,type]);        
    }

    dragEnd(event) {
        console.log("dragEnd",event,this.dropArr);
        let dst;
        if (this.dropArr && this.dropArr.length>0){
            dst=this.dropArr.sort((a,b)=> (a[1] === 'column')?1:-1);
            console.log("dragEnd dst",dst[0]);
            if(dst[0][1]==='remove'){
                this.parentComponent.remove(this.draggedRec);
            }                         
            if(dst[0][1]==='column'){
                this.parentComponent.changeColumn(this.draggedRec,dst[0][0]);
            }                         
            if(dst[0][1]==='menu'){
                //this.clearDroped();
                console.log("Command:", dst[0][0]), this.draggedRec;
                if(dst[0][0].run&&this.parentComponent[dst[0][0].run]){
                   console.log("Run:");
                   this.parentComponent[dst[0][0].run](this.draggedRec,dst[0][0].dropDataItem);
                }
            }            
        }        
    }        
    
}
