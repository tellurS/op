import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MenuCommandItem } from '../menuCommand/menuCommand';
import { CustValidators } from './custValidators';

@Component({
    selector: 'm-dialog',
    templateUrl: './dialogForm.template.html',

})
export class DialogForm {
    public visible: boolean = false;
    @Input() public header: string = 'dialog';
    @Input() public body: string = 'dialog';
    @Output() public events = new EventEmitter();
    @Input() public data: Object;
    @Input() public componentName = 'DialogForm';
    @Input() public models: FormItem[];
    @Input() public buttons: MenuCommandItem;
    @Input() public values: Object;
    public userform: FormGroup;

    constructor(private fb: FormBuilder) { }
    public show() {
        this.visible = true;
        this.emit('show', {
            data: this.data, header: this.header,
            body: this.body, models: this.models,
            buttons: this.buttons
        });
    }
    public emit(type = 'emit', ...data) {
        let d = Object.assign({}, { componentName: this.componentName, type }, ...data);
        this.events.emit(d);
    }
    public click(item: MenuCommandItem) {
        this.visible = false;
        this.emit('run', this.data, { options: this.values }, item);
    }
    public alternative(header: string, body: string, data: Object,
                       commandsItems: MenuCommandItem[]) {
        this.header = header;
        this.body = body;
        this.buttons = commandsItems;
        this.data = data;
        this.models = [];
        this.userform = this.fb.group([]);
        this.values = {};
        this.show();
    }

    public prepareForm(models: FormItem[], controlsConfig = {}, values): any {
        this.models.forEach(model => {
            let modelValidators = [];
            if (model.required) {
                modelValidators.push(Validators.required);
            }
            if (model.minLength) {
                modelValidators.push(Validators.minLength(model.minLength));
            }
            if (model.maxLength) {
                modelValidators.push(Validators.maxLength(model.maxLength));
            }
            if (model.pattern) {
                modelValidators.push(Validators.pattern(model.pattern));
            }
            if (model.rangeLength) {
                modelValidators.push(CustValidators.rangeLength(model.rangeLength));
            }
            if (model.min) {
                modelValidators.push(CustValidators.min(model.min));
            }
            if (model.max) {
                modelValidators.push(CustValidators.max(model.max));
            }
            if (model.range) {
                modelValidators.push(CustValidators.rangeLength(model.range));
            }
            if (model.digits) {
                modelValidators.push(CustValidators.digits);
            }
            if (model.number) {
                modelValidators.push(CustValidators.number);
            }
            if (model.url) {
                modelValidators.push(CustValidators.url);
            }
            if (model.email) {
                modelValidators.push(CustValidators.email);
            }
            if (model.date) {
                modelValidators.push(CustValidators.date);
            }
            if (model.creditCard) {
                modelValidators.push(CustValidators.creditCard);
            }
            if (model.json) {
                modelValidators.push(CustValidators.json);
            }
            if (model.base64) {
                modelValidators.push(CustValidators.base64);
            }
            if (model.uuid) {
                modelValidators.push(CustValidators.uuid);
            }
            if (model.minDate) {
                modelValidators.push(CustValidators.minDate(model.minDate));
            }
            if (model.maxDate) {
                modelValidators.push(CustValidators.maxDate(model.maxDate));
            }
            if (model.phone) {
                modelValidators.push(CustValidators.phone(model.phone));
            }
            if (model.equal) {
                modelValidators.push(CustValidators.equal(model.equal));
            }
            if (model.equalTo) {
                modelValidators.push(CustValidators.equalTo(controlsConfig[model.equalTo]));
            }
            if ((model.type === 'dropdown' || model.type === 'listbox') && model.values) {
                model.labelsValues = model.values.map(e => {
                    return {
                        value: e[model.idValue],
                        label: e[model.labelValue], icon: e[model.icon]
                    }
                });
            }

            if (!this.values[model.name]) {
                this.values[model.name] = model.default;
            }

            controlsConfig[model.name] = new FormControl('', modelValidators);
        });

        return controlsConfig;
    }
    form(header: string, body: string, rec: Object, models: FormItem[],
         commandsItems: MenuCommandItem[]): EventEmitter<any> {
        this.header = header;
        this.body = body;
        this.buttons = commandsItems;
        this.models = models;
        this.values = Object.assign({}, rec);
        this.data = { dst: rec };
        let f = this.prepareForm(this.models, {}, this.values);

        this.userform = this.fb.group(f);

        this.show();
        return this.events;
    }


}

export interface FormItem {
    name: string;
    caption?: string;
    description?: string;
    type?: string;
    value?: any;
    placeholder?: string;
    errorMsg?: string;
    default?: any;
    values?: Object[];
    idValue?: string;
    labelValue?: string;
    labelsValues?: Object[];
    icon?: string;
    minLength?: number;
    maxLength?: number;
    min?: any;
    max?: any;
    custom?: any;
    required?: boolean;
    pattern?: string;
    rangeLength?: number[];
    range?: number[];
    digits?: boolean;
    number?: boolean;
    url?: boolean;
    email?: boolean;
    date?: boolean;
    minDate?: any;
    maxDate?: any;
    creditCard?: boolean;
    json?: boolean;
    uid?: boolean;
    base64?: boolean;
    phone?: string;
    uuid?: boolean;
    equal?: any;
    equalTo?: string;
    step?: string;
}