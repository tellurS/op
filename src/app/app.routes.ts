import { Routes, RouterModule } from '@angular/router';
//import { Home } from './home';
//import { About } from './about';
import { NoContent } from './no-content';
import { KanbanDesk } from './kanbanDesk';
import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
    { path: '', redirectTo: 'kanban_desk', pathMatch: "full" },
    {
        path: 'kanban_desk',
        component: KanbanDesk, 
        resolve: {resolve: DataResolver},
        
        /*    canActivate?: any[];
            canActivateChild?: any[];
            canDeactivate?: any[];
            canLoad?: any[];*/
        data: {
            caption: 'Desk',
            enable: true,
            role: ['root', 'admin'],
            future: {
                simple: true
            },
            datasets:[
                {name:"tags", src:"/api/tags",api:"rest",format:"json",preload:"tags"},
                {name:"issues", src:"/api/issues",api:"rest",format:"json",pooling:'60000',preload:"issues"},
                {name:"columns", src:"/api/columns",api:"rest",format:"json",preload:"columns"},
            ],
            columns: [
                { id:"1",caption: "New" , icon:"fa-file" },
                { id:"2",caption: "Progress", icon:"fa-font-awesome" },
                { id:"3",caption: "Checked", icon:"fa-adjust" },
                { id:"4",caption: "Closed", icon:"fa-archive" }
            ],
            source: {
                type: 'inner',
                data: [
                    {columnId:"1",caption:"super job4",description:"No text4",tags:["2"]},
                    {columnId:"1",caption:"super job",description:"No text",tags:["1","2"],priority:50},
                    {columnId:"2",caption:"super job2",description:"super",tags:["2"],priority:10},
                    {columnId:"1",caption:"super job3",description:"No description",priority:20},
                ]                
            },
            tags:[
                { id:"1", caption: "Simple", icon:"fa-file" },
                { id:"2", caption: "Hard"  , icon:"fa-font-awesome"}               
            ],           
            /*          children?: Route[]          loadChildren?: LoadChildren          */

        }
    },
    /*
    { path: 'home',  component: Home },
    { path: 'about', component: About },
    {
      path: 'detail', loadChildren: () => System.import('./+detail')
    },*/
    { path: '**', component: NoContent }
];
