import { Component, Inject, Optional, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn, NgForm, FormControlDirective, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../_services/location.service';
import { AuthenticationService } from '../_services/authentication.service';
import { DatePipe,formatDate } from '@angular/common';
import { VERSION } from '@angular/material/core';
import { MatSelectSearchVersion } from 'ngx-mat-select-search';
import { debounceTime, delay, tap, filter, map, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';

import { MacauthService } from '../_services/macauth.service';
import { ProductService } from '../_services/product.service';
import { OrderService } from '../_services/order.service';
import { ToasterService } from '../_services/toastr.service';
import { DateValidator } from '../_shared/date.validator';

import moment from "moment";
import 'moment-timezone';
import { Customer } from '../interface/interface';
import { Order, Orderbase, OrderStatusUpdate } from './macauth';
//import { DateValidator } from '../_shared/date.validator';
import { ScratchService } from '../_services/scratch.service';

import { Observable } from 'rxjs';
moment.tz.setDefault('Europe/Amsterdam');
declare var jQuery: any;
declare const editClick: any;
declare var $: any;



@Component({
  selector: 'app-macauthdialog-box',
  templateUrl: './macauthdialog-box.component.html',
  styleUrls: ['./macauthdialog-box.component.scss'],
})

export class MacauthdialogBoxComponent {
  slaAddonValue: string;
  action: string;
  local_data: any;
  submitted = false;
  _id: string;
  loading = false;
  counter: number;
  
  jsonArray: any[]
  today = new Date();
  jstoday = '';
  buttondisabled = true;
  
  locationdata_dict:any;
  returnUrl: string;
  locationid: number;
  
  isUbprofileNotDefault: boolean = false;
  isUbprofileTypeNotDefault: boolean = false;
  
  macFormUpdatedValue: any[] = [];

  macauthform: FormGroup;
  
userbandwidthList: any[];
macpropertyList: any[];
macUBProfileList: any[];
macUBProfileTypeList: any[];

macUBL3ProfileList: any[];
macUBDBBProfileList: any[];

macUBDownloadProfileList: any[];
macUBUploadProfileList: any[];
macUBDownloadUploadProfileList: any[];


macUBL3UploadProfileList: any[];
macUBDBBUploadProfileList: any[];
macUBL3DownloadProfileList: any[];
macUBDBBDownloadProfileList: any[];

macUBDownloadList: any[];
macUBUploadList: any[];

userrole;

/********************** Auto Search For Satellite Move *************************/

UBlist = new Map<number, string>();

UBVal;

userbandwidth_id;
loggedinuserrole;
  version = VERSION;
  noRecordFound;
  matSelectSearchVersion = MatSelectSearchVersion;
  SCardOrderShipmentPostalCode;
 /* UB Dropdown */
  protected locationsSatellite;  
  public UBFilteringCtrl: FormControl = new FormControl();
  protected userbandwidthLists;   
  public searchingUB: boolean = false;
  public filteredServerSideUBs: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  protected _onDestroyUB = new Subject<void>();
  
  /********************** Auto Search For Satellite Move *************************/

  
  
  searchText;
  characters: any[] = [];
  constructor(
    private _macauthservice: MacauthService,
    private formBuilder: FormBuilder,
    public router: Router,
    public dialogRef: MatDialogRef<MacauthdialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _Activatedroute: ActivatedRoute,
    private route: ActivatedRoute,
    private authenticationservice: AuthenticationService,
    private _productservice: ProductService,
    private datePipe: DatePipe,  
    private toasterservice: ToasterService,
  ) {
    this.local_data = { ...data };
    
    this.action = this.local_data.action;
    this.locationdata_dict = this.local_data.locationdata_dict;
    //this.location_parentcustomerid = this.local_data.locationparentcustomerid;
    if (this.action == 'Update' || this.action == 'UpdateStatus' || this.action == 'Delete') {
      this.locationid = +this.local_data.locationid;
    } else {
      this.locationid = +data.locationid;
    }
   
  }


 


  selectTypePlan(selectedType){
    
    this.local_data.ubprofiledownload = '';
    this.local_data.ubprofileupload = '';
    
    if(selectedType.toString() == '2'){

      this.isUbprofileNotDefault = true;
      
      this.macUBDownloadList = this.macUBDBBDownloadProfileList;
      this.macUBUploadList = this.macUBDBBUploadProfileList;
      this.validationForUBFields(selectedType);
      
    }else if(selectedType.toString() == '3'){
      this.isUbprofileNotDefault = true;
      this.macUBDownloadList = this.macUBL3DownloadProfileList;
      this.macUBUploadList = this.macUBL3UploadProfileList;
      this.validationForUBFields(selectedType);
      
    }else{
      
      this.isUbprofileNotDefault = false;
      this.isUbprofileTypeNotDefault = false;
      this.validationForUBFields(selectedType);
      
      
    }
    
    
  }

  validationForUBFields(selectedType){

    var ubprofiledownload = this.macauthform.get('ubprofiledownload');
    var ubprofileupload = this.macauthform.get('ubprofileupload');
    if (selectedType.toString()=='2') {
      ubprofiledownload.setValidators([Validators.required]);
      ubprofileupload.setValidators([Validators.required]);
      ubprofiledownload.updateValueAndValidity();
      ubprofileupload.updateValueAndValidity();
    } else if (selectedType.toString()=='3') {
      ubprofiledownload.setValidators([Validators.required]);
      ubprofileupload.setValidators([Validators.required]);
      ubprofiledownload.updateValueAndValidity();
      ubprofileupload.updateValueAndValidity();
    }
     else {
      ubprofiledownload.setValue('');
      ubprofileupload.setValue('');
      ubprofiledownload.clearValidators();
      ubprofiledownload.updateValueAndValidity();
      ubprofileupload.clearValidators();
      ubprofileupload.updateValueAndValidity();
    }
  }





  selectDownloadUploadUpdate(ubprofile){
   
    if(ubprofile.toString() == '2'){ //DBB
      this.isUbprofileNotDefault = true;
      this.validationForUBFields(ubprofile);
    }else if(ubprofile.toString() == '3'){ // L3
      this.isUbprofileNotDefault = true;
      this.validationForUBFields(ubprofile);
    }else{ // Dynamic
      this.isUbprofileNotDefault = false;
      this.validationForUBFields(ubprofile);
    }

  }

 



  ngOnInit() {

   
    this.buttondisabled = false;
    this._id = this.route.snapshot.paramMap.get("id");

    
    

    
    if (this.local_data.action == 'Add') {
      
     
      this.populateformdropdown();
      this.macauthform = this.formBuilder.group({
        location_id : this.locationid,
        macaddress: ['',[Validators.required, Validators.pattern('^([0-9a-fA-F]{2}[:.-]){5}[0-9a-fA-F]{2}$')]],
        remark: ['',Validators.required],
        //userbandwidth_id:  [''],
        startdate: [''],
        enddate: [''],
        ubprofile: [''],
        ubprofileupload: [''],
        ubprofiledownload: ['']
      });

      
    }else if (this.local_data.action == 'Update'){
      
      
      this.populateformdropdown();
      
      this.macauthform = this.formBuilder.group({
        location_id : this.locationid,
        macaddress: ['',[Validators.required, Validators.pattern('^([0-9a-fA-F]{2}[:.-]){5}[0-9a-fA-F]{2}$')]],
        remark: ['',Validators.required],
        //userbandwidth_id:  [''],
        enddate: [''],
        ubprofile: [''],
        ubprofileupload: [''],
        ubprofiledownload: ['']
      });

      if(this.local_data.ubprofile.toString() == '1'){
        this.macauthform.get('ubprofileupload').setValue('');
        this.macauthform.get('ubprofiledownload').setValue('');
      }
      //this.selectTypePlan(this.local_data.ubprofile);
      this.selectDownloadUploadUpdate(this.local_data.ubprofile);

     }
  }

  

  reformat(event) {
    if (event.data) {
      const two_chars_no_colons_regex = /([^:]{2}(?!:))/g;
      if(event.target.value.length < 17){
        event.target.value = event.target.value.replace(
          two_chars_no_colons_regex,
          "$1:"
        );
      }
    }
  }

 
  ngAfterViewInit(): void {
    //this.dropdownchanges();
  }
 


  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onSubmit(form: NgForm) {
    if (this.macauthform.invalid) {
      
      const invalid = [];
        const controls = this.macauthform.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }

        return invalid;
      this.buttondisabled = false;
      return;
    }
    
    this.buttondisabled = true;
    this.jsonArray = form.value;
    this.jstoday = moment().format('YYYY-MM-DD HH:mm:ss');

    if (this.macauthform.get('enddate').value == '' || this.macauthform.controls['enddate'].value == null) {
      this.macauthform.get('enddate').setValue(null);
    } else {
      this.macauthform.get('enddate').setValue(this.transformDate(this.macauthform.get('enddate').value));
    }
    if (this.macauthform.get('ubprofiledownload').value == '' || this.macauthform.controls['ubprofiledownload'].value == null) {
      this.macauthform.get('ubprofiledownload').setValue(0);
    } else {
      this.macauthform.get('ubprofiledownload').setValue(this.macauthform.get('ubprofiledownload').value);
    }
    if (this.macauthform.get('ubprofileupload').value == '' || this.macauthform.controls['ubprofileupload'].value == null) {
      this.macauthform.get('ubprofileupload').setValue(0);
    } else {
      this.macauthform.get('ubprofileupload').setValue(this.macauthform.get('ubprofileupload').value);
    }
    form.value.startdate = moment().format('YYYY-MM-DD');
   this._macauthservice.addMac(JSON.stringify(form.value))
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }


  onUpdate(form: NgForm) {
    if (this.macauthform.invalid) {
      
      const invalid = [];
        const controls = this.macauthform.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }

        return invalid;
      this.buttondisabled = false;
      return;
    }
    
    this.buttondisabled = true;
    this.jsonArray = form.value;
    this.jstoday = moment().format('YYYY-MM-DD HH:mm:ss');

    if (this.macauthform.get('enddate').value == '' || this.macauthform.controls['enddate'].value == null) {
      this.macauthform.get('enddate').setValue(null);
    } else {
      this.macauthform.get('enddate').setValue(this.transformDate(this.macauthform.get('enddate').value));
    }
    if (this.macauthform.get('ubprofiledownload').value == '' || this.macauthform.controls['ubprofiledownload'].value == null) {
      this.macauthform.get('ubprofiledownload').setValue(0);
    } else {
      this.macauthform.get('ubprofiledownload').setValue(this.macauthform.get('ubprofiledownload').value);
    }

    if (this.macauthform.get('ubprofileupload').value == '' || this.macauthform.controls['ubprofileupload'].value == null) {
      this.macauthform.get('ubprofileupload').setValue(0);
    } else {
      this.macauthform.get('ubprofileupload').setValue(this.macauthform.get('ubprofileupload').value);
    }
    /*let userbandwidthdata = (this.macauthform.get('userbandwidth_id').value!='' && this.macauthform.get('userbandwidth_id').value!=0)
    ? this.userbandwidthLists.find(r =>
      r.id == Number(this.macauthform.get('userbandwidth_id').value)
    ).description : '';*/

    var macubprofile = this.macauthform.get('ubprofile').value;
    var macubprofileupload = this.macauthform.get('ubprofileupload').value;
    var ubprofiledownload = this.macauthform.get('ubprofiledownload').value;
    var ubprofilename, ubprofileuploadname, ubprofiledownloadname;
    ubprofilename =  (macubprofile!=0 && macubprofile!='') ? this.macpropertyList.find(r =>
      r.id == macubprofile && r.productattribute_id==1 
    ).name : '';
    
    if(macubprofile.toString() == '2'){
      ubprofileuploadname =  (macubprofileupload!=0 && macubprofileupload!='') ? this.userbandwidthList.find(r =>
        r.id == macubprofileupload && r.type=='upload' && r.profile=='DBB'
      ).upload : '';
      ubprofiledownloadname =  (ubprofiledownload!=0 && ubprofiledownload!='') ? this.userbandwidthList.find(r =>
        r.id == ubprofiledownload && r.type=='download' && r.profile=='DBB'
      ).download : '';
    }else if(macubprofile.toString() == '3'){
      ubprofileuploadname =  (macubprofileupload!=0 && macubprofileupload!='') ? this.userbandwidthList.find(r =>
        r.id == macubprofileupload && r.type=='upload' && r.profile=='L3'
      ).upload : '';
      ubprofiledownloadname =  (ubprofiledownload!=0 && ubprofiledownload!='') ? this.userbandwidthList.find(r =>
        r.id == ubprofiledownload && r.type=='download' && r.profile=='L3'
      ).download : '';
    }
    
    this.macFormUpdatedValue.push({
      id: this.local_data.id,
      macaddress: this.macauthform.get('macaddress').value,
      //startdate: this.macauthform.get('startdate').value ?  formatDate(this.macauthform.get('startdate').value, 'dd-MM-yyyy', 'en-US') : null,
      //startdateEdit: this.macauthform.get('startdate').value,
      enddate: this.macauthform.get('enddate').value ?  formatDate(this.macauthform.get('enddate').value, 'dd-MM-yyyy', 'en-US') : '',
      enddateEdit: this.macauthform.get('enddate').value,
      remark: this.macauthform.get('remark').value,
      //userbandwidth_id: this.macauthform.get('userbandwidth_id').value,
      //userbandwidthname: userbandwidthdata,
      ubprofile: this.macauthform.get('ubprofile').value,
      ubprofiledownload: this.macauthform.get('ubprofiledownload').value,
      ubprofileupload: this.macauthform.get('ubprofileupload').value,
      ubprofilename: ubprofilename,
      ubprofiledownloadname: ubprofiledownloadname,
      ubprofileuploadname: ubprofileuploadname
    });
    
    
    this._macauthservice.updateMac(JSON.stringify(form.value), this.local_data.id)
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Update', data: this.macFormUpdatedValue });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }

  


  onDelete() {
    this.buttondisabled = true;
    this._macauthservice.deleteMacAuth(this.local_data.id).subscribe(
      data => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Delete', data: this.local_data });
      }, (err) => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      }
    );

  }



  populateformdropdown() {
  
    this._macauthservice.getUserBandwidth().subscribe(data => {
      this.userbandwidthList = data;
        this.macUBL3UploadProfileList =  this.userbandwidthList.filter(ubvalue =>           
          ubvalue.profile == 'L3' && ubvalue.type == 'upload');  
        this.macUBDBBUploadProfileList =  this.userbandwidthList.filter(ubvalue =>           
          ubvalue.profile == 'DBB'  && ubvalue.type == 'upload');  
        this.macUBL3DownloadProfileList =  this.userbandwidthList.filter(ubvalue =>           
          ubvalue.profile == 'L3'  && ubvalue.type == 'download');  
        this.macUBDBBDownloadProfileList =  this.userbandwidthList.filter(ubvalue =>           
          ubvalue.profile == 'DBB'  && ubvalue.type == 'download');      
          
          if(this.local_data.action == 'Update'){
            if(this.local_data.ubprofile.toString() == '2'){
              this.isUbprofileNotDefault = true;
              this.macUBDownloadList = this.macUBDBBDownloadProfileList;
              this.macUBUploadList = this.macUBDBBUploadProfileList;
            }else if(this.local_data.ubprofile.toString() == '3'){
              this.isUbprofileNotDefault = true;
              this.macUBDownloadList = this.macUBL3DownloadProfileList;
              this.macUBUploadList = this.macUBL3UploadProfileList;
            }
          }


    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });


    this._productservice.getmacpropertylist(20).subscribe(data => {
      this.macpropertyList = data;
        this.macUBProfileList =  this.macpropertyList.filter(ubvalue =>           
        ubvalue.productattribute_id == 1);  
        this.macUBProfileTypeList =  this.macpropertyList.filter(ubvalue =>           
        ubvalue.productattribute_id == 2);  
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    
  }

 

  public hasError = (controlName: string, errorName: string) => {
    return this.macauthform.controls[controlName].hasError(errorName);
  }

  transformDate(date: any) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
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



  dateValidation(){
    var enddate = this.macauthform.get('enddate');
    if (enddate.value != '' && enddate.value != null) {
      enddate.setValidators([DateValidator.dateVaidator]);
      enddate.updateValueAndValidity();
    } else {
      enddate.setValue('');
      enddate.clearValidators();
      enddate.updateValueAndValidity();
    }
  }
  
}