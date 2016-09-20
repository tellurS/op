import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'kanbanDesk',  // <home></home>
    templateUrl: './kanbanDesk.template.html'
})
export class KanbanDesk {
    columns: Array<any>;
    records: any;
    colWidth: any;
    tags: any;

    constructor(private route: ActivatedRoute,
        private router: Router) {

    }

    ngOnInit() {
        console.log('hello `kanbanDesk` component');
        this.route.data.subscribe(data => {
            this.columns = data.columns;
            this.colWidth = 'ui-g-' + (12 / this.columns.length).toFixed();
            //init
            this.records = {};
            this.columns.forEach(el=> this.records[el.id] = []);
            //load        
            data.source.data.sort((a,b)=>{return a.priority&&b.priority&&(a.priority>b.priority);})
                            .forEach(el=> this.records[el.columnId].push(el));
            //priority;
            this.tags = this.array2index(data.tags, "id");
            console.log("tags",this.tags);
        });
    }
    tag2icon(tag: string) {
        return this.tags[tag] && this.tags[tag].icon || '';
    }
    tag2text(tag: string) {
        return this.tags[tag] && this.tags[tag].caption || '';
    }    
    array2index(arr: Array<any>, index: String) {
        let result ={};
        arr.forEach(el=>result[el[index]]=el);
        return result;
    }

}
