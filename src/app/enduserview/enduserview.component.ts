import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, RouterLinkActive, Routes } from '@angular/router';
import { FormBuilder, Validators, FormArray, ValidatorFn, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EnduserService } from '../_services/EnduserService.service';
import { LocationService } from '../_services/location.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { routerTransition } from '../router.animations';

import { AuthenticationService } from '../_services/authentication.service';

import { ToasterService } from '../_services/toastr.service';
//import { SatelliteDialogBoxComponent } from '../satellite-dialog-box/satellite-dialog-box.component';

declare var $: any;


@Component({
  selector: 'app-enduserview',
  templateUrl: './enduserview.component.html',
  styleUrls: ['./enduserview.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    routerTransition()
  ],
})

export class EnduserviewComponent implements OnInit, AfterViewInit {

  id;
  account_details: any;;
  loading = true;
  navLinks: any;
  activeLinkIndex = -1;
  satelliteID;
  superuser: boolean;
  currentUrl;


  constructor(
    public router: Router,
    private _locationService: LocationService,
    private _enduserService: EnduserService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private authenticationservice: AuthenticationService,
    private toasterservice: ToasterService,
  ) {
    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.id = sessionStorage.getItem('sessionSatelliteID');
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionSatelliteID');
    }
    //this.id = this.router.getCurrentNavigation().extras.state.id;
    this._locationService.getTabList('4').subscribe(data => {
      this.navLinks = data;
    }, error => this.toasterservice.showError(error));
  }

  ngOnInit() {

    this.currentUrl = this.router.url;

    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    }, error => this.toasterservice.showError(error));

    //this.superuser = this.authenticationservice.isSuperUser();

    this._enduserService.fetchAccount(this.id).subscribe(
      data => {
        this.account_details = data;
        this.loading = false;
        this.account_details['result'][0]['accountAddress'] = this.account_details['result'][0]['country'] + ',' + this.account_details['result'][0]['address1']+ ',' + this.account_details['result'][0]['zip'] + this.account_details['result'][0]['city']
      }, error => this.toasterservice.showError(error));

  }
  ngAfterViewInit(): void {
  }

  applyFilter(filterValue: string) {

  }




}