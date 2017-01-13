import {NgModule,Component,ElementRef,AfterViewInit,OnDestroy,Input,Output,Renderer,EventEmitter,trigger,state,transition,style,animate} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomHandler} from 'primeng/components/dom/domhandler';
import {MenuItem} from 'primeng/components/common/api';
import {Router} from '@angular/router';




export class BaseMenuCommand {
    
    constructor(public router: Router) {}    
    
    handleClick(event, item: MenuCommandItem) {
        if(item.disabled) {
            event.preventDefault();
            return;
        }
        
        item.expanded = !item.expanded;
        
        if(!item.url||item.routerLink) {
            event.preventDefault();
        }
                   
        if(item.command||item.eventEmitter) {
            if(!item.eventEmitter) {
                item.eventEmitter = new EventEmitter();
                item.eventEmitter.subscribe(item.command);
            }
            
            item.eventEmitter.emit({
                originalEvent: event,
                item: item,
                type: "menuClick"                                
            });
        }
        
        if(item.routerLink) {
            this.router.navigate(item.routerLink);
        }
    }
    
    itemDrop(event, item: MenuCommandItem) {
        
        if(!item.url||item.routerLink) {
            event.preventDefault();
        }
        
        if(item.command||item.eventEmitter) {
            if(!item.eventEmitter) {
                item.eventEmitter = new EventEmitter();
                item.eventEmitter.subscribe(item.command);
            }
            item.eventEmitter.emit({
                originalEvent: event,
                item: item,
                type: "menuDrop"
            });
        }
    }        
}

@Component({
    selector: 'm-menucommandSub',
    //selector: 'p-panelMenuSub', 
    //
    template: `
        <ul class="ui-menu-list ui-helper-reset" [style.display]="expanded ? 'block' : 'none'">
            <li *ngFor="let child of item.items" class="ui-menuitem ui-corner-all" [ngClass]="{'ui-menu-parent':child.items}" >
                <a [href]="child.url||'#'" class="ui-menuitem-link ui-corner-all" pDroppable="{{dropName}}" (onDrop)="itemDrop($event, child)"
                    [ngClass]="{'ui-menuitem-link-hasicon':child.icon&&child.items,'ui-state-disabled':child.disabled}" 
                    (click)="handleClick($event,child)">
                    <span class="ui-panelmenu-icon fa fa-fw" [ngClass]="{'fa-caret-right':!child.expanded,'fa-caret-down':child.expanded}" *ngIf="child.items"></span
                    ><span class="ui-menuitem-icon fa fa-fw" [ngClass]="child.icon" *ngIf="child.icon"></span
                    ><span class="ui-menuitem-text">{{child.label}}</span>
                </a>
                <m-menucommandSub [item]="child" [dropName]="dropName" [expanded]="child.expanded" *ngIf="child.items"></m-menucommandSub>
            </li>
        </ul>
    `
})
export class MenuCommandSub extends BaseMenuCommand {
    
    @Input() item: MenuCommandItem;
    
    @Input() expanded: boolean;
    @Input() dropName: string="rec";
    
    constructor(router: Router) {
        super(router);
    }
}

@Component({
    selector: 'm-menucommand',
    template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="'ui-panelmenu ui-widget'">
            <div *ngFor="let item of model;let f=first;let l=last;" class="ui-panelmenu-panel">
                <div tabindex="0" [ngClass]="{'ui-widget ui-panelmenu-header ui-state-default':true,'ui-corner-top':f,'ui-corner-bottom':l&&!item.expanded,
                    'ui-state-disabled':item.disabled}">
                    <a [href]="item.url||'#'" [ngClass]="{'ui-panelmenu-headerlink-hasicon':item.icon}" (click)="handleClick($event,item)"
                       pDroppable="{{dropName}}" (onDrop)="itemDrop($event, item)"
                    >
                        <span *ngIf="item.items" class="ui-panelmenu-icon fa" [ngClass]="{'fa-caret-right':!item.expanded,'fa-caret-down':item.expanded}"></span
                        ><span class="ui-menuitem-icon fa" [ngClass]="item.icon" *ngIf="item.icon"></span
                        ><span class="ui-menuitem-text">{{item.label}}</span>
                    </a>
                </div>
                <div *ngIf="item.items" class="ui-panelmenu-content-wrapper" [@rootItem]="item.expanded ? 'visible' : 'hidden'" 
                    [ngClass]="{'ui-panelmenu-content-wrapper-overflown': !item.expanded||animating}">
                    <div class="ui-panelmenu-content ui-widget-content">
                        <m-menucommandSub [item]="item" [dropName]="dropName" [expanded]="true"></m-menucommandSub>
                    </div>
                </div>
            </div>
        </div>
    `,
    animations: [
        trigger('rootItem', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class MenuCommand extends BaseMenuCommand {
    
    @Input() model: MenuCommandItem[];

    @Input() style: any;

    @Input() styleClass: string;
    
    @Input() dropName: string="rec";    
    
    public animating: boolean;
    
    constructor(router: Router) {
        super(router);
    }
            
    unsubscribe(item: any) {
        if(item.eventEmitter) {
            item.eventEmitter.unsubscribe();
        }
        
        if(item.items) {
            for(let childItem of item.items) {
                this.unsubscribe(childItem);
            }
        }
    }
            
    ngOnDestroy() {        
        if(this.model) {
            for(let item of this.model) {
                this.unsubscribe(item);
            }
        }
    }
    
    handleClick(event, item) {
        this.animating = true;
        super.handleClick(event, item);

        setTimeout(() => {
            this.animating = false;
        }, 400);
    }

}



export interface MenuCommandItem extends MenuItem{
    options?:any;
    run?:string;
    multi?:boolean;
    one?:boolean;
    dst?:any;
    formStatus?:any;
    type?:string
    
    params?:any;
    data?:any;
    item?:any;
    $event?:any;
    rec?:any
}