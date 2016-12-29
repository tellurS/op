import { Routes, RouterModule } from '@angular/router';
//import { Home } from './home';
//import { About } from './about';
import { NoContent } from './no-content';
import { KanbanDesk } from './kanbanDesk';
//import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
    { path: '', redirectTo: 'kanban_desk', pathMatch: "full" },
    {
        path: 'kanban_desk',
        component: KanbanDesk, 
        /*    canActivate?: any[];
            canActivateChild?: any[];
            canDeactivate?: any[];
            canLoad?: any[];*/
        //resolve: {resolve: DataResolver},
        data: {
            caption: 'Desk',
            enable: true,
            role: ['root', 'admin'],
            feature: {
                poolingNone: "6000",
                peoples:true,             
                resources:true,
                priority:true,
                peoplesInTree:true
            },
            datasets:[
                {name:"tags", src:"/api/tags",api:"rest",format:"json"},
                {name:"issues", src:"/api/issues",api:"rest",format:"json"},
                {name:"columns", src:"/api/columns",api:"rest",format:"json"},
                {name:"peoples", src:"/api/peoples",api:"rest",format:"json"},
                {name:"resources", src:"/api/resources",api:"rest",format:"json"}               
            ]      
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
