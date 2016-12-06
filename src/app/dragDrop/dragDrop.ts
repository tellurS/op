import { Injectable } from '@angular/core';
import { EventEmitter} from '@angular/core';

@Injectable()
export class DragDrop {
    event:DragDropEvent;
    itemsDrop = new EventEmitter();
    drapDropRun = new EventEmitter<DragDropEvent>();
        
    constructor(){
        this.itemsDrop.subscribe(e=>this.drop(e,e.item,e.item.run));
    }
    onDragEnter($event, node){
        console.log("onDragEnter",$event, node);
    }
    onDragLeave($event, node){
        console.log("onDragLeave",$event, node);
    }      
    dragStart(event,rec) {        
        console.log("drag",event,rec);
        delete(this.event);
        this.event=new DragDropEvent();
        this.event.src = rec;
    }    
    drop(event,dst,type) {        
        console.log("drop",event,dst,type);
        this.event.drops.push({type,dst});        
    }
    dragEnd(event) {
        console.log("dragEnd",event,this.event);
        if (this.event.drops.length>0)
            this.drapDropRun.emit(this.event);
    }            
}

export class DragDropEvent{
    src:Object;
    drops:Array<{type:string,
           dst: Object 
        }>=[];        
    
}
