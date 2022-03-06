import { Component, Inject, Optional, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn, NgForm, FormControlDirective, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../_services/location.service';
import { AuthenticationService } from '../_services/authentication.service';
import { DatePipe, formatDate } from '@angular/common';
import { VERSION } from '@angular/material/core';
import { MatSelectSearchVersion } from 'ngx-mat-select-search';
import { debounceTime, delay, tap, filter, map, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { TicketService } from '../_services/ticket.service';
import { ProductService } from '../_services/product.service';
import { OrderService } from '../_services/order.service';
import { ToasterService } from '../_services/toastr.service';
import { DateValidator } from '../_shared/date.validator';

import moment from "moment";
import 'moment-timezone';
import { Customer } from '../interface/interface';
import { Order, Orderbase, OrderStatusUpdate } from '../newhotspotsconnectiondialog-box/hotspots';
//import { DateValidator } from '../_shared/date.validator';
import { ScratchService } from '../_services/scratch.service';

import { Observable } from 'rxjs';
import { CommonService } from '../_services/common.service';
moment.tz.setDefault('Europe/Amsterdam');
declare var jQuery: any;
declare const editClick: any;
declare var $: any;

@Component({
  selector: 'app-endusercreate',
  templateUrl: './endusercreate.component.html',
  styleUrls: ['./endusercreate.component.scss']
})
export class EndusercreateComponent implements OnInit {

    slaAddonValue: string;
    action: string;
    local_data: any;
    submitted = false;
    _id: string;
    loading = false;
    counter: number;
    isBillingUser: boolean;
    jsonArray: any[]
    today = new Date();
    jstoday = '';
    buttondisabled = true;
    // Order Variable define
    order: Order[] = [];
    orderbase: any[];
    loggedinuserrole;
    enduser;
  
    Accountcreateform: FormGroup;
    customercontactList: any[] = [];
    /********************** Auto Search For Satellite Move *************************/
 
    SCardOrderShipmentPostalCode;
    tabSectionList: any[] = [];
    subscriptionList;
    gender;
  
    countrydata;
    constructor(
      private formBuilder: FormBuilder,
      private _locationService: LocationService,
      public router: Router,
      public dialogRef: MatDialogRef<EndusercreateComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
      private _Activatedroute: ActivatedRoute,
      private route: ActivatedRoute,
      private authenticationservice: AuthenticationService,
      private datePipe: DatePipe,
      public _commonService: CommonService,
      private toasterservice: ToasterService,
  
    ) {
      this.loggedinuserrole = this.authenticationservice.getUserRole();
      this.isBillingUser = this.authenticationservice.isBillingUser();
      this.local_data = { ...data };
  
      this.action = this.local_data.action;
      this.tabSectionList = this._commonService.getSectionList('MultiserviceTab');
  
    }
  
  
  
    ngOnInit() {
  
      this.buttondisabled = false;
      //this.ConfirmedValidator();
      this._id = this.route.snapshot.paramMap.get("id");
      console.log(this.local_data);
  
      if (this.local_data.action == 'Add') {
  
        this.populateformdropdown();
        this.Accountcreateform = this.formBuilder.group({
          /****** New Attr ******/

          username: ['', [Validators.required]],
          password: ['', Validators.required],
          passwordconfirm:  [''],
          lastname: ['', Validators.required],
          lastNamePrefix: [''],
          firstname: ['', Validators.required],
          firstNameInitials: [''],
          gender: [''],
          streetName: [''],
          houseNumber: [''],
          houseNumberExtension: [''],
          zip: [''],
          city: [''],
          country_id: [1],
          email: ['', [Validators.required, Validators.email]],
          phonenumber: [''],
          birthdate: [''],
          Numberofaccounts: [1, Validators.pattern('([0-9]{1}[0-9]{0,3}|[0-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[0]{1}[,.][0-9]{1}[1-9]{1}|[0]{1}[,.][1-9]{1}[0-9]{1}|[0]{1}[,.][1-9]{1})')],
          contractDate: [''],
          enddate_abo: ['', Validators.required],
          secondsleft: ['', [Validators.required, Validators.pattern('([0-9]{1}[0-9]{0,3}|[0-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[0]{1}[,.][0-9]{1}[1-9]{1}|[0]{1}[,.][1-9]{1}[0-9]{1}|[0]{1}[,.][1-9]{1})')]],
          accountsubscriptiontype: ['1'],
          /****** New Attr ******/
  
        },
        { 
      validator: [this.ConfirmedValidator('password', 'passwordconfirm'),this.checkUsername(/^(?:[a-zA-Z0-9.@]+)?$/, 'username')]
    });
    this.ConfirmedValidator('password', 'passwordconfirm')
  
        var crdate = moment().format('YYYY-MM-DD');
        var ordertype = 'add';
  
      } 
    }
  
    ngAfterViewInit(): void {
     
    }
  
    closeDialog() {
      this.dialogRef.close({ event: 'Cancel' });
    }

    ConfirmedValidator(controlName: string, matchingControlName: string){
      return (formGroup: FormGroup) => {
          const control = formGroup.controls[controlName];
          const matchingControl = formGroup.controls[matchingControlName];
          if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
              return;
          }
          if (control.value !== matchingControl.value) {
              matchingControl.setErrors({ confirmedValidator: true });
          } else {
            matchingControl.setErrors(null);
          }
      }
    }

    checkUsername(nameRe: RegExp, controlName: string){
      return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
       // const matchingControl = formGroup.controls[matchingControlName];
        if (control.errors && !control.errors.checkUsernameValid) {
            return;
        }
        if (!control.value.endsWith('@kpn.nl') || !nameRe.test(control.value)) {
          control.setErrors({ checkUsernameValid: true });
        } else {
          control.setErrors(null);
        }
    }
      /*
      return (control: AbstractControl): ValidationErrors | null => {
        const checkUsername = control.value.endsWith('@kpn.nl')
        console.log(control.value)
        console.log(checkUsername)
        //const checkUsernamePatter = nameRe.test(control.value);
        return checkUsername ? {checkUsernameValid: false} : {checkUsernameValid: true};
      };*/
    }

     matchValues(
      matchTo: string // name of the control to match to
    ): (AbstractControl) => ValidationErrors | null {
      return (control: AbstractControl): ValidationErrors | null => {
        return !!control.parent &&
          !!control.parent.value &&
          control.value === control.parent.controls[matchTo].value
          ? null
          : { isMatching: false };
      };
  }
  
    onSubmit(form: NgForm) {
      if (this.Accountcreateform.invalid) {
  
        const invalid = [];
        const controls = this.Accountcreateform.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }
        console.log(invalid)
        return invalid;
        this.buttondisabled = false;
        return;
      }
  
      this.buttondisabled = true;
      this.jsonArray = form.value;
      this.jstoday = moment().format('YYYY-MM-DD HH:mm:ss');
      //var birthdate=formatDate(this.local_data.creationdateEdit, 'yyyy-MM-dd', 'en-US');
      //var enddate_abo=formatDate(this.local_data.creationdateEdit, 'yyyy-MM-dd', 'en-US');
      //var birthdate=formatDate(this.local_data.creationdateEdit, 'yyyy-MM-dd', 'en-US');
  
      if (this.Accountcreateform.get('birthdate').value == '' || this.Accountcreateform.get('birthdate').value == null) {
        this.Accountcreateform.get('birthdate').setValue(null);
      } else {
        this.Accountcreateform.get('birthdate').setValue(this.transformDate(this.Accountcreateform.get('birthdate').value));
      }

      if (this.Accountcreateform.get('enddate_abo').value == '' || this.Accountcreateform.get('enddate_abo').value == null) {
        this.Accountcreateform.get('enddate_abo').setValue(null);
      } else {
        this.Accountcreateform.get('enddate_abo').setValue(this.transformDate(this.Accountcreateform.get('enddate_abo').value));
      }

      if (this.Accountcreateform.get('contractDate').value == '' || this.Accountcreateform.get('contractDate').value == null) {
        this.Accountcreateform.get('contractDate').setValue(null);
      } else {
        this.Accountcreateform.get('contractDate').setValue(this.transformDate(this.Accountcreateform.get('contractDate').value));
      }
      console.log(JSON.stringify(form.value));
      this._locationService.createEnduser(JSON.stringify(form.value))
        .subscribe(res => {
          if (res['message'] != undefined) {
            this.toasterservice.showErrorOrderCompletion(res['message']);
            this.dialogRef.close({ event: 'Cancel' });
          } 
          this.buttondisabled = false;
          this.dialogRef.close({ event: 'Add', data: this.local_data });
        }, (err) => {
          this.buttondisabled = false;
          this.toasterservice.showError(err);
        });
    }
  
    populateformdropdown() {
      this._locationService.getLocationProperty('Gender').subscribe(data => {
        this.gender = data;
      }, (err) => {
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      });
  
      this._locationService.getLocationProperty('Subscription').subscribe(
        data => {
          this.subscriptionList = data;

        }, error => this.toasterservice.showError(error));

      this._locationService.getAllCountry().subscribe(data => {
        this.countrydata = data['result'];           
        if(data['result'] != null ||  data['result'].length !== 0){				
        this.countrydata = data['result'];
        }
      $('.overlay').hide();
      }, error => this.toasterservice.showError(error));
    }
  
    public hasError = (controlName: string, errorName: string) => {
      return this.Accountcreateform.get(controlName).hasError(errorName);
    }
  
    transformDate(date: any) {
      return this.datePipe.transform(date, 'yyyy-MM-dd hh:mm:ssZZZZZ');
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

    dateValidationEnddate() {
      var enddate_abo = this.Accountcreateform.get('enddate_abo');
      if (enddate_abo.value != '' && enddate_abo.value != null) {
        enddate_abo.setValidators([DateValidator.dateVaidator]);
        enddate_abo.updateValueAndValidity();
      } else {
        enddate_abo.setValue('');
        enddate_abo.clearValidators();
        enddate_abo.updateValueAndValidity();
      }
    }

    dateValidationbirthdate() {
      var birthdate = this.Accountcreateform.get('birthdate');
      if (birthdate.value != '' && birthdate.value != null) {
        birthdate.setValidators([DateValidator.dateVaidator]);
        birthdate.updateValueAndValidity();
      } else {
        birthdate.setValue('');
        birthdate.clearValidators();
        birthdate.updateValueAndValidity();
      }
    }
    dateValidationcontractDate() {
      var contractDate = this.Accountcreateform.get('contractDate');
      if (contractDate.value != '' && contractDate.value != null) {
        contractDate.setValidators([DateValidator.dateVaidator]);
        contractDate.updateValueAndValidity();
      } else {
        contractDate.setValue('');
        contractDate.clearValidators();
        contractDate.updateValueAndValidity();
      }
    }

}
