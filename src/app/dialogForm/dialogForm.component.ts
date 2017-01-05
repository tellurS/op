import { Component,Input,Output, EventEmitter} from '@angular/core';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { MenuCommandItem } from '../menuCommand/menuCommand';
import {Message,SelectItem} from 'primeng/primeng/components/common/api';

@Component({
    selector: 'm-dialog',  
    templateUrl: './dialogForm.template.html',
    
 })
export class DialogForm{
    visible:boolean=false;
    @Input()  header:string="dialog";
    @Input()  body:string="dialog";   
    @Output() public events= new EventEmitter();
    @Input()  data:Object;
    @Input()  componentName="DialogForm";
    @Input()  models:Array<FormItem>;
    @Input()  buttons:MenuCommandItem;

    show(){
        this.visible=true;
        this.emit("show",{data:this.data,header:this.header,body:this.body,models:this.models,buttons:this.buttons});
    }
    emit(type="emit",data={},data1={}){                
        let d=Object.assign({},{componentName:this.componentName,type},data,data1);
        this.events.emit(d);                
    }    
    click(item:MenuCommandItem){
        this.visible=false;        
        this.emit("run",item,this.data);
    }
    alternative(header:string,body:string,data:Object,commandsItems:Array<MenuCommandItem>){
        this.header=header;
        this.body=body;
        this.buttons=commandsItems;
        this.data=data;
        this.models=[];
        this.show();
    }
    form(header:string,body:string,models:Array<FormItem>,commandsItems:Array<MenuCommandItem>){
        this.header=header;
        this.body=body;
        this.buttons=commandsItems;
        this.models=models;
        this.show();
    }    


  msgs: Message[] = [];
    
    userform: FormGroup;
    
    submitted: boolean;
    
    genders: SelectItem[];
        
    description: string;
    
    constructor(private fb: FormBuilder) {}
    
    ngOnInit() {
        this.userform = this.fb.group({
            'firstname': new FormControl('', Validators.required),
            'lastname': new FormControl('', Validators.required),
            'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
            'description': new FormControl(''),
            'gender': new FormControl('', Validators.required)
        });
        
        this.genders = [];
        this.genders.push({label:'Select Gender', value:''});
        this.genders.push({label:'Male', value:'Male'});
        this.genders.push({label:'Female', value:'Female'});
    }
    
    onSubmit(value: string) {
        this.submitted = true;
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'Success', detail:'Form Submitted'});
    }
    
    get diagnostic() { return JSON.stringify(this.userform.value); }
    
}

export interface FormItem {
    name:string,
    caption?:string,
    type?:string,
    value?:any,  
    values?:Array<Object>,
    idValues?:string,
    captionValues?:string,
    icon?:string,
    default?:any,
    description?:string,
    minLength?:number,
    maxLength?:number,
    min?:any,
    max?:any,
    custom?:any
}