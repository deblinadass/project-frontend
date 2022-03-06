import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../_models/user.model';
import { AuthenticationService } from '../_services/authentication.service';
import { MatDialog } from '@angular/material/dialog';

declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss'],
    animations: [routerTransition()]
})

export class LogoutComponent implements OnInit {
    
    constructor(
        private authenticationservice: AuthenticationService,
    ) {
    }

    ngOnInit() {
        localStorage.removeItem('isLoggedin');
        //this.authenticationservice.logout().subscribe();
         
        
		
        

    }

        
}






