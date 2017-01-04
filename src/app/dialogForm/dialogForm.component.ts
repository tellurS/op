import { Component,Input,Output, EventEmitter} from '@angular/core';

import { MenuCommandItem } from '../menuCommand/menuCommand';

@Component({
    selector: 'dialog',  
    templateUrl: './dialogForm.template.html',
    
 })
export class DialogForm{
    visible:boolean=false;
    @Input() header:string="dialog";
    @Input() body:string="dialog";   
    @Output() public events= new EventEmitter();
    data:Object;
    componentName="DialogForm";
    /*
    @Input() dataModel:any;
    @Input() data:any;
    @Input() eventEmitter;// = new EventEmitter();
    */
    buttons:MenuCommandItem;

    show(){
        this.visible=true;
        this.emit("show",{data:this.data,header:this.header,body:this.body});
    }
    emit(type="emit",data={},data1={}){                
        let d=Object.assign({},{componentName:this.componentName,type},data,data1);
        this.events.emit(d);                
    }    
    click(item:MenuCommandItem){
        this.visible=false;        
        this.emit("run",item,this.data);
    }
    alternative(header:string,body:string,data:Object,...commandsItems:Array<MenuCommandItem>){
        this.header=header;
        this.body=body;
        this.buttons=commandsItems;
        this.data=data;
        this.show();
       console.log("buba",this);
     //   return this.events;
    }
    ngOnInit() {              
       // this.events.subscribe(e=>console.log(e));        
    }
}

