import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DragDropEvent } from './dragDropEvent';

@Injectable()
export class DragDrop {
    public eventDragDrop: DragDropEvent;
    public drapDropRun = new EventEmitter<DragDropEvent>();
    public events: EventEmitter<any>;    
    public setEvents(events) {
        this.events = events;
        this.events.emit({ type: 'setEvent', module: 'dragDrop' });
    }
    public onDragEnter($event, node) {
        this.events.emit({ type: 'onDragEnter', module: 'dragDrop' });
    }
    public onDragLeave($event, node) {
        this.events.emit({ type: 'onDragLeave', module: 'dragDrop' });
    }
    public dragStart(event, rec) {
        delete (this.eventDragDrop);
        this.eventDragDrop = new DragDropEvent();
        this.eventDragDrop.src = rec;
        this.events.emit({ type: 'onDragStart', module: 'dragDrop', data: this.eventDragDrop });
    }
    public drop(event, dst, type) {
        this.eventDragDrop.drops.push({ type, dst });
        this.events.emit({ type: 'onDrop', module: 'dragDrop', data: this.eventDragDrop });
    }
    public dragEnd(event) {

        if (this.eventDragDrop.drops.length > 0) {
            this.events.emit({ type: 'onDragEnd', module: 'dragDrop', data: this.eventDragDrop });
        } else {
            this.events.emit({  type: 'onDragEndEmpty', module: 'dragDrop',
                                data: this.eventDragDrop });
        }
    }
}
