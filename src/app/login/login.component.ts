import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../_models/user.model';
import { AuthenticationService } from '../_services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../_services/common.service';
import { ToasterService } from '../_services/toastr.service';

declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})

export class LoginComponent implements OnInit {
    private msttokens: any;
    private JWT_TOKEN = 'JWT_TOKEN';
    private REFRESH_TOKEN: string;
    private ACCESS_TOKEN: string;
    private GRIP_REFRESH_TOKEN: string;
    private USER_NAME: string;
    private USER_ROLE: string;
    private USER_PREV_LOGIN: string;
    loginForm: FormGroup;
    public userModel = new UserModel();
    public loginResponse: any;
    Message: string;
    error = '';
    internalservererror: string;

    public isLoginError: any;
    public loading: boolean;
    public aanmeldenClicked = false;

    submitted = false;
    returnUrl: string;
    indeterminate: String;
    logindisabled: boolean;
	tabSectionList: any[] = [];
    @ViewChild('username') private elementRef: ElementRef;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationservice: AuthenticationService,
        public router: Router,
        private activatedRoute: ActivatedRoute,
        private dialogRef: MatDialog,
        private _commonService: CommonService,
        private toasterservice: ToasterService,
    ) {
    }

    ngOnInit() {
        this.dialogRef.closeAll();
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.logindisabled = false;
        $('.progress-spinner').hide();
    }

    get f() { return this.loginForm.controls; }

    userLogin() {
        $('.progress-spinner').show();
        this.logindisabled = true;
        this.submitted = true;
        const isValid = this.loginForm.invalid;
        if (this.loginForm.invalid) {
            $('.progress-spinner').hide();
            this.logindisabled = false;
            return;
        }
        this.userModel.username = this.loginForm.controls.username.value;
        this.userModel.password = this.loginForm.controls.password.value;
        (this.authenticationservice.login(this.userModel).subscribe(
            data => {
                this.router.navigate(['']);
                localStorage.setItem('isLoggedin', 'true');
                $('.progress-spinner').hide();
                this.logindisabled = false;
                this.router.navigate(['/customersearch']);
            },
            error => {
                this.isLoginError = true;
                $('.progress-spinner').hide();
                this.logindisabled = false;
                return;
            }
        )
        );
    }

    reset() {
        this.isLoginError = null;
    }

    onLoggedin() {
        localStorage.setItem('isLoggedin', 'true');
    }

    get userName() {
        return this.loginForm.get('username');
    }

    get password() {
        return this.loginForm.get('password');
    }
    ngAfterViewInit() {
        this.elementRef.nativeElement.focus();
    };   
}






