import { Routes, RouterModule } from '@angular/router';
//import { Home } from './home';
//import { About } from './about';
import { NoContent } from './no-content';
import { KanbanDesk } from './kanbanDesk';
import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
  { path: '',      redirectTo: 'kanban_desk',pathMatch:"full" },
  { path: 'kanban_desk',
    component: KanbanDesk, 
/*    canActivate?: any[];
    canActivateChild?: any[];
    canDeactivate?: any[];
    canLoad?: any[];*/
    data: {
        caption:'Desk',
        enable: true,
        role:['Root','Admin'],
        source:{
            type:'inner'
        },
        feture:{
            simple:true
        }
    }
    /*resolve?: ResolveData;
    children?: Route[];
    loadChildren?: LoadChildren;
    */
  
  },
  /*
  { path: 'home',  component: Home },
  { path: 'about', component: About },
  {
    path: 'detail', loadChildren: () => System.import('./+detail')
  },*/
  { path: '**',    component: NoContent },
];
