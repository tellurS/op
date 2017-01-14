import { Component } from './component';

declare function require(moduleName: string): any;

 export class Application extends Component{
    componentName="Applications";
    components:Array<Component>=[];
    constructor(...components:Array<string>) {
        super();    
        console.log(this.componentName,'constructor');
        this.loadCompoment(...components);
       
    }
    loadCompoment(...components:Array<string>){
        //this.components=this.components.concat(components.map((name:string)=>new(require('./'+name))()));                        
        let c = require('./web');
        //new c.isComponent();
        let a:Component=this.instantiate(c) as Component;
    }
    instantiate<T>(ctor:  { new(...args: any[]): T }): T {
        return new ctor();        
    }    
    start(){
        console.log('Application:start');
    }
}

