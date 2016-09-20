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
        /*    canActivate?: any[];
            canActivateChild?: any[];
            canDeactivate?: any[];
            canLoad?: any[];*/
        data: {
            caption: 'Desk',
            enable: true,
            role: ['root', 'admin'],
            columns: [
                { id:"1",caption: "New" , icon:"fa-file" },
                { id:"2",caption: "Progress", icon:"fa-font-awesome" },
                { id:"3",caption: "Checked", icon:"fa-adjust" },
                { id:"4",caption: "Closed", icon:"fa-archive" }
            ],
            source: {
                type: 'inner',
                data: [
                    {columnId:"1",caption:"super job",description:"No text"},
                    {columnId:"2",caption:"super job2",description:"super"},
                    {columnId:"1",caption:"super job3",description:"No description"},
                ]
            },
            feture: {
                simple: true
            }
            /*resolve?: ResolveData          children?: Route[]          loadChildren?: LoadChildren          */

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
