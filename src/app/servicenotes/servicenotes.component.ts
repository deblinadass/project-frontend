import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn, NgForm, FormControlDirective, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ProductService } from '../_services/product.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ModalService } from '../modal/modal.service';
//import { AccessService } from '../_services/access.service';
import { OrderService } from '../_services/order.service';

import { AuthenticationService } from '../_services/authentication.service';
import moment from "moment";
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';

import { LocationService } from '../_services/location.service';

import 'moment-timezone';
import { TicketService } from '../_services/ticket.service';
import { CommonService } from '../_services/common.service';
import { ToasterService } from '../_services/toastr.service';

moment.tz.setDefault('Europe/Amsterdam');


declare var jQuery: any;
declare const editClick: any;
declare var $: any;

export class OrderListModel {
  id: number;
  orderattributevalues: OrderAttributeModel[] = [];
}

export class OrderAttributeModel {
  orderattribute: number;
  orderattributevalue: string;
}

@Component({
  selector: 'app-servicenotes',
  templateUrl: './servicenotes.component.html',
  styleUrls: ['./servicenotes.component.scss']
})
export class ServicenotesComponent implements OnInit {
  buttondisabled = false;
  buttondisabledone = false;
  buttondisabledtwo = false;
  buttondisabledthird = false;
  buttondisabledfourth = false;
  buttondisabledfifth = false;
  chainid;
  id;
  location_details: any;
  customernotesdata: any;
  locations_list: any;
  loading = false;
  navLinks: any[] = [];
  activeLinkIndex = -1;
  satelliteID;
  superuser: boolean;
  locationchain: any;
  locationcountry: any;
  locationproperty: any[];
  locationdata_dict = {};
  locationparentcustomerid;
  location_name;
  routerCurrentURL;
  location_parentcustomerid;
  notelocation;
  notewan;
  notelan;
  noteisp;
  notesla;
  notegeneral;
  notelocation_parent;
  notewan_parent;
  notelan_parent;
  noteisp_parent;
  notesla_parent;
  notegeneral_parent;
  notelocationform: FormGroup;
  notewanform: FormGroup;
  notelanform: FormGroup;
  noteispform: FormGroup;
  noteslaform: FormGroup;
  notegeneralform: FormGroup;
  tabSectionList: any[] = [];
  inheritance = false;

  remainingText;
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private _locationService: LocationService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private authenticationservice: AuthenticationService,
    private datePipe: DatePipe,
    public _commonService: CommonService,
    private toasterservice: ToasterService,
  ) {

    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.id = sessionStorage.getItem('sessionSatelliteID');
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionSatelliteID');
    }
    this.getPropertyAll();
    this.tabSectionList = this._commonService.getSectionList('ServicenoteTab');

  }

  ngOnInit() {


    this.superuser = this.authenticationservice.isSuperUser();

    this._locationService.location_details(this.id).subscribe(
      data => {
        this.location_details = data;
        //console.log(this.location_details);
        this.locationparentcustomerid = data.parentcustomerid;
        this.location_name = data.customername;
        this._locationService.getLocationChainId(data.chainid).subscribe(datachain => {
          this.location_details.locationchain = datachain['result'][0]['chainname'];
          this._locationService.getLocationCountryId(data.country).subscribe(datacountry => {
            this.locationcountry = datacountry['result'][0]['countryname'];
            this.location_details.locationtypeid = this.locationproperty.find(r => r.customerattribute == 'locationtype' && r.customerpropertyvalue == this.location_details.locationtypeid
            ).customerpropertyname;
            this.location_details.accountmanagerid = this.locationproperty.find(r => r.customerattribute == 'accountmanager' && r.customerpropertyvalue == this.location_details.accountmanagerid
            ).customerpropertyname;

            this.location_details.city = (data.city) ? ' ' + data.city : '';
            this.location_details.postcode = (data.postcode) ? ', ' + data.postcode : '';

            this.location_details.streetname = (data.streetname) ? ' ' + data.streetname : '';
            this.location_details.housenumber = (data.housenumber) ? ' ' + data.housenumber : '';
            this.location_details.housenumberaddition = (data.housenumberaddition) ? ' ' + data.housenumberaddition : '';
            this.location_details.fulladdress = (this.locationcountry + this.location_details.streetname + this.location_details.housenumber + this.location_details.housenumberaddition + this.location_details.postcode + this.location_details.city) ? this.locationcountry + this.location_details.streetname + this.location_details.housenumber + this.location_details.housenumberaddition + this.location_details.postcode + this.location_details.city : 'No Adres vermeld';
            this.location_details.customername = data.customername;
            if (data.servicenotesinheritance == 1) {
              this.inheritance = true;
              if (this.inheritance) { //Fetching parent service notes
                this._locationService.getCustomerNote(this.locationparentcustomerid).subscribe(
                  data => {
                    //this.customernotesdata = data;
                    this.notelocation_parent = (data) ? data.notelocation : '';
                    this.notesla_parent = (data) ? data.notesla : '';
                    this.notewan_parent = (data) ? data.notewan : '';
                    this.notelan_parent = (data) ? data.notelan : '';
                    this.noteisp_parent = (data) ? data.noteisp : '';
                    this.notegeneral_parent = (data) ? data.notegeneral : '';
                    //console.log(this.customernotesdata);

                  }, error => this.toasterservice.showError(error));
              }
            }
          }, error => this.toasterservice.showError(error));
        }, error => this.toasterservice.showError(error));
      }, error => this.toasterservice.showError(error));

    this._locationService.getCustomerNote(this.id).subscribe(
      data => {
        this.customernotesdata = data;
        this.notelocation = (data) ? data.notelocation : '';
        this.notesla = (data) ? data.notesla : '';
        this.notewan = (data) ? data.notewan : '';
        this.notelan = (data) ? data.notelan : '';
        this.noteisp = (data) ? data.noteisp : '';
        this.notegeneral = (data) ? data.notegeneral : '';
        console.log(this.customernotesdata);

        //this.remainingText = data.notekpncustomerservice.length;
      }, error => this.toasterservice.showError(error));

    this.notelocationform = this.formBuilder.group({
      /****** New Attr ******/
      customerid: this.id,
      notelocation: [''],
      /****** New Attr ******/
    });

    this.notewanform = this.formBuilder.group({
      /****** New Attr ******/
      customerid: this.id,
      notewan: [''],
      /****** New Attr ******/
    });

    this.noteispform = this.formBuilder.group({
      /****** New Attr ******/
      customerid: this.id,
      noteisp: [''],
      /****** New Attr ******/
    });

    this.notelanform = this.formBuilder.group({
      /****** New Attr ******/
      customerid: this.id,
      notelan: [''],
      /****** New Attr ******/
    });

    this.noteslaform = this.formBuilder.group({
      /****** New Attr ******/
      customerid: this.id,
      notesla: [''],
      /****** New Attr ******/
    });

    this.notegeneralform = this.formBuilder.group({
      /****** New Attr ******/
      customerid: this.id,
      notegeneral: [''],
      /****** New Attr ******/
    });

  }

  getPropertyAll() {
    this._locationService.getAllLocationProperty().subscribe(data => {
      this.locationproperty = data;

    }, error => this.toasterservice.showError(error));
  }

  ngAfterViewInit(): void {
    //this.product_list = this.getProductList();
    //this.order_list = this.getOrderList();
  }




  formatdatemst(dateval) {
    return this.datePipe.transform(new Date(dateval), 'dd-MM-yyyy');
  }


  onUpdate(form: NgForm) {
    this.buttondisabled = true;

    if (this.notelocationform.invalid) {
      this.buttondisabled = false;

      const invalid = [];
      const controls = this.notelocationform.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      console.log(invalid);
      return invalid;
    }


    this._locationService.addServiceNotes(JSON.stringify(form.value))
      .subscribe(res => {
        this.buttondisabled = false;

      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }


  onUpdateNOC(form: NgForm) {

    this.buttondisabledone = true;
    if (this.notewanform.invalid) {

      this.buttondisabledone = false;
      const invalid = [];
      const controls = this.notewanform.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      console.log(invalid);
      return invalid;
    }


    this._locationService.addServiceNotes(JSON.stringify(form.value))
      .subscribe(res => {

        this.buttondisabledone = false;
      }, (err) => {
        this.toasterservice.showError(err);
        this.buttondisabledone = false;
      });
  }

  onUpdateExtSupplier(form: NgForm) {

    this.buttondisabledtwo = true;
    if (this.noteispform.invalid) {

      this.buttondisabledtwo = false;
      const invalid = [];
      const controls = this.noteispform.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      console.log(invalid);
      return invalid;
    }


    this._locationService.addServiceNotes(JSON.stringify(form.value))
      .subscribe(res => {

        this.buttondisabledtwo = false;
      }, (err) => {
        this.toasterservice.showError(err);
        this.buttondisabledtwo = false;
      });
  }

  onUpdateTechService(form: NgForm) {

    this.buttondisabledthird = true;
    if (this.notelanform.invalid) {

      this.buttondisabledthird = false;
      const invalid = [];
      const controls = this.notelanform.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      console.log(invalid);
      return invalid;
    }


    this._locationService.addServiceNotes(JSON.stringify(form.value))
      .subscribe(res => {

        this.buttondisabledthird = false;
      }, (err) => {
        this.toasterservice.showError(err);
        this.buttondisabledthird = false;
      });
  }
  onUpdateSLA(form: NgForm) {

    this.buttondisabledfourth = true;
    if (this.noteslaform.invalid) {

      this.buttondisabledfourth = false;
      const invalid = [];
      const controls = this.noteslaform.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      console.log(invalid);
      return invalid;
    }


    this._locationService.addServiceNotes(JSON.stringify(form.value))
      .subscribe(res => {

        this.buttondisabledfourth = false;
      }, (err) => {
        this.toasterservice.showError(err);
        this.buttondisabledfourth = false;
      });
  }
  onUpdateGeneral(form: NgForm) {

    this.buttondisabledfifth = true;
    if (this.notegeneralform.invalid) {

      this.buttondisabledfifth = false;
      const invalid = [];
      const controls = this.notegeneralform.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      console.log(invalid);
      return invalid;
    }


    this._locationService.addServiceNotes(JSON.stringify(form.value))
      .subscribe(res => {

        this.buttondisabledfifth = false;
      }, (err) => {
        this.toasterservice.showError(err);
        this.buttondisabledfifth = false;
      });
  }



  GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    }
  }


  GetSortOrderDesc(prop) {
    return function (a, b) {
      if (a[prop] < b[prop]) {
        return 1;
      } else if (a[prop] > b[prop]) {
        return -1;
      }
      return 0;
    }
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.notelocationform.controls[controlName].hasError(errorName);
  }

  public hasErrorNOC = (controlName: string, errorName: string) => {
    return this.noteispform.controls[controlName].hasError(errorName);
  }



}
