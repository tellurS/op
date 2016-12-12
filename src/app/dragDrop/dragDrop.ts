import { Injectable } from '@angular/core';
import { EventEmitter} from '@angular/core';

@Injectable()
export class DragDrop {
    eventDragDrop:DragDropEvent;
    drapDropRun = new EventEmitter<DragDropEvent>();
    
    events:EventEmitter<any>;    
    
    setEvents(events){
        this.events=events;
        this.events.emit({type:"setEvent",module:"dragDrop"});
    }
    constructor(){        
        
    }    
    onDragEnter($event, node){        
        this.events.emit({type:"onDragEnter",module:"dragDrop"});
    }
    onDragLeave($event, node){
        this.events.emit({type:"onDragLeave",module:"dragDrop"});
    }      
    dragStart(event,rec) {        
        delete(this.eventDragDrop);
        this.eventDragDrop=new DragDropEvent();
        this.eventDragDrop.src = rec;
        this.events.emit({type:"onDragStart",module:"dragDrop",data:this.eventDragDrop});
    }    
    drop(event,dst,type) {        
        this.eventDragDrop.drops.push({type,dst});        
        this.events.emit({type:"onDrop",module:"dragDrop",data:this.eventDragDrop});
    }
    dragEnd(event) {
        console.log("dragEnd",event,this.eventDragDrop);
        if (this.eventDragDrop.drops.length>0)
              this.events.emit({type:"onDragEnd",module:"dragDrop",data:this.eventDragDrop});
        else
            this.events.emit({type:"onDragEndEmpty",module:"dragDrop",data:this.eventDragDrop});
    }            
}

export class DragDropEvent{
    src:Object;
    drops:Array<{type:string,
           dst: Object 
        }>=[];        
    
}
