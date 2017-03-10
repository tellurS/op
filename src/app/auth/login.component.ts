import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Page } from '../page/page';
import { DataManager, Utils } from '../dataManager';
import { DialogForm } from '../dialogForm';
import { Observable } from 'rxjs/Observable';
import { FormItem } from '../page/api';
import { AuthGuard } from './authGuard';

@Component({
    selector: 'Login',
    templateUrl: './login.template.html'
})
export class Login extends Page {
    public  componentName = 'Login';
    public  returnUrl: string;
    @ViewChild(DialogForm) public dialog: DialogForm;
    // Start
    constructor(public route: ActivatedRoute,
        public router: Router,
        public dm: DataManager,
        public auth: AuthGuard
    ) {

        super(route, router, dm);
        this.log('LoginCreated');

    }
    public  ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    public ngAfterViewInit() {
        this.loginForm().subscribe(s => {
            if (s.type === 'run') {
                this.authuntificate(s.options);
            } else {
                this.router.navigate([this.returnUrl]);
            }
        });
    }
    public loginForm() {
        let login: FormItem[] = [
            { name: 'username', caption: 'Login', type: 'text', minLength: 5, maxLength: 25, description: 'Login', required: true },
            { name: 'password', caption: 'Password', type: 'password', minLength: 5, maxLength: 26, description: 'Password', required: true }
        ];

        return this.dialog.form('Login Form', 'please enter:', {}, login, [
            { label: 'Login', icon: 'fa-plus', run: 'Login', formStatus: true },
            { label: 'Close', icon: 'fa-close', run: 'Login' },
        ]);
    }
    public authuntificate(options: IAuth = {}) {
        this.dm.saveRecord('login', options)
            .subscribe((ok) => {
                this.auth.save(ok);
            }, error => {}
            );
    }

}

export interface IAuth {
    username?: string;
    password?: string;
}