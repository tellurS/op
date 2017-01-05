import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import  * as Primeng from 'primeng/primeng';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { App } from './app.component';
//import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InteralStateType } from './app.service';
import { KanbanDesk,byColumns } from './kanbanDesk';
import { DialogForm } from './dialogForm';
import { DataManager,RestClient } from './dataManager';
import { NoContent } from './no-content';
import { MenuCommand,MenuCommandSub } from './menuCommand/menuCommand';


// Application wide providers
const APP_PROVIDERS = [
//  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InteralStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ App ],
  declarations: [
    App,
    KanbanDesk,
    byColumns,
    MenuCommand,MenuCommandSub,
    NoContent,
    DialogForm
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Primeng.PanelModule,
    Primeng.TooltipModule,
    Primeng.DragDropModule,
    Primeng.TreeModule,
    Primeng.GrowlModule,
    Primeng.MenuModule,
    Primeng.DialogModule,
    Primeng.ButtonModule,
    Primeng.PanelModule,
    Primeng.DropdownModule,
    Primeng.InputTextModule,
    Primeng.InputTextareaModule,
    Primeng.TabViewModule,
    Primeng.CodeHighlighterModule,    
    RouterModule.forRoot(ROUTES, { useHash: true })    
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    DataManager,
    RestClient    
    ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}

