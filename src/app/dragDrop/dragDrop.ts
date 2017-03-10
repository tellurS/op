import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { IPageEvent,IDragDropData } from '../page/api';
import { DragDropData } from './dragDropEvent';

@Injectable()
export class DragDrop {
    public eventDragDrop: IDragDropData;
    public events: EventEmitter<IPageEvent>;    
    public setEvents(events) {
        this.events = events;
        this.events.emit({ type: 'setEvent', componentName: 'dragDrop' });
    }
    public onDragEnter($event, node) {
        this.events.emit({ type: 'onDragEnter', componentName: 'dragDrop' });
    }
    public onDragLeave($event, node) {
        this.events.emit({ type: 'onDragLeave', componentName: 'dragDrop' });
    }
    public dragStart(event, rec) {
        delete (this.eventDragDrop);
        this.eventDragDrop = new DragDropData();
        this.eventDragDrop.src = rec;
        this.events.emit({ type: 'onDragStart', componentName: 'dragDrop', dragDropData: this.eventDragDrop });
    }
    public drop(event, dst, type) {
        this.eventDragDrop.drops.push({ type, dst });
        this.events.emit({ type: 'onDrop', componentName: 'dragDrop', dragDropData: this.eventDragDrop });
    }
    public dragEnd(event) {

        if (this.eventDragDrop.drops.length > 0) {
            this.events.emit({ type: 'onDragEnd', componentName: 'dragDrop', dragDropData: this.eventDragDrop });
        } else {
            this.events.emit({  type: 'onDragEndEmpty', componentName: 'dragDrop',
                                dragDropData: this.eventDragDrop });
        }
    }
}
