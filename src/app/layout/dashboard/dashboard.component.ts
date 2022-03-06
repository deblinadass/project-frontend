import { Component, OnInit} from '@angular/core';
import { routerTransition } from '../../router.animations';
import { HttpClient} from '@angular/common/http';
import { Router} from '@angular/router';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {  
    public isLoading = true;

    constructor(public router: Router, private httpClient:HttpClient) {              
    }

    ngOnInit(): void {   
      this.isLoading = true;
    }  
 
}
