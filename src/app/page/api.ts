import { MenuItem } from 'primeng/components/common/api';

export interface IComponentData {
    caption: string;
    enable: boolean;
    role: string[];
    future: Object;
    datasets: Dataset[];
}
export interface Dataset {
    name: string;
    src: string;
    api: string;
    format: string;
    retry?: number;
}
export interface IPageEvent {
    componentName?: string;
    type?: string;
    dragDropData?: IDragDropData;
    isLog?: boolean;
    run?: string;
    options?: any;
    dst?: any;
    item?: ICommandItem; 
    $event?: any;
    src?: any;
    params?:any; // for parms page
}
export interface ICommandItem extends MenuItem {
    // extends MenuItem
    /*  label?: string;
        icon?: string;
        items?: MenuItem[];
        expanded?: boolean;
        disabled?: boolean;
        visible?: boolean;
           
        command?: (event?: any) => void;
        url?: string;
        routerLink?: any;
        eventEmitter?: EventEmitter<any>;   
        target?: string;*/
    items?: ICommandItem[];
     // specific                
    run?: string;
    options?: any;
    multi?: boolean;
    one?: boolean;
    dst?: any;
    formStatus?: any;
    type?: string;
    params?: any;
    data?: any;
    src?: any;
}

export interface FormItem {
    name: string;
    caption?: string;
    description?: string;
    disabled?: boolean;
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

export interface IDragDropData{
    src: Object;
    drops: Array<{type: string,
                  dst: Object
                 }> ;
}
