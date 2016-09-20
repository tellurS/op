import { Component } from '@angular/core';


@Component({
    selector: 'kanbanDesk',  // <home></home>
  
  providers: [
//    Title
  ],
  templateUrl: './kanbanDesk.template.html'
})
export class KanbanDesk {
  constructor() {

  }

  ngOnInit() {
    console.log('hello `kanbanDesc` component');
    // this.title.getData().subscribe(data => this.data = data);
  }


}
