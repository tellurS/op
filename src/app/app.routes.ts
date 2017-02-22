import { Routes, RouterModule } from '@angular/router';
//import { Home } from './home';
//import { About } from './about';
import { NoContent } from './no-content';
import { KanbanDesk } from './kanbanDesk';
import { AuthGuard } from './auth/authGuard';
import { Login } from './auth/login.component';
//import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
    { path: '', redirectTo: 'kanban', pathMatch: "full" },
    {
        path: 'login',
        component: Login,        
        data: {
            caption: 'login',
            enable: true,
            roles: ['noauth'],
            feature:[],                    
            datasets:[
                {name:"login", src:"/api/login",api:"rest",format:"json"},        
            ]
        }   
    },    
    {
        path: 'kanban',
        component: KanbanDesk, 
        canActivate: [AuthGuard],
        /*    canActivate?: any[];
            canActivateChild?: any[];
            canDeactivate?: any[];
            canLoad?: any[];*/
        //resolve: {resolve: DataResolver},
        data: {
            caption: 'Desk',
            enable: true,
            roles: ['kanban_view', 'admin'],
            feature: {
                poolingNone: "6000",
                peoples:true,             
                resources:true,
                priority:true,
                peoplesInTree:true,
                resourcesInTree:false,        
                tagsInTree:false
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
