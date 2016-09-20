import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'kanbanDesk',  // <home></home>
  templateUrl: './kanbanDesk.template.html'
})
export class KanbanDesk {
  columns:Array<any>;
  colWidth:any;
  constructor(  private route: ActivatedRoute,
                private router: Router) {

  }

  ngOnInit() {      
    console.log('hello `kanbanDesk` component');
    this.route.data.forEach((data) => {
        this.columns=data.columns;
        this.colWidth='ui-g-' + (12 / this.columns.length).toFixed();
    });
  }


}
