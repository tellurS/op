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
            feature: {
                poolingNone: "6000",
                bin: true,
                peoples:true,
                resourse:true,
                priority:true
            },
            datasets:[
                {name:"tags", src:"/api/tags",api:"rest",format:"json"},
                {name:"issues", src:"/api/issues",api:"rest",format:"json"},
                {name:"columns", src:"/api/columns",api:"rest",format:"json"},
                {bags:"tags", src:"/api/bags",api:"rest",format:"json"},
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
