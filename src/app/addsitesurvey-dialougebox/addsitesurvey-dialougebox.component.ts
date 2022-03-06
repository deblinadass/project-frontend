import { Component, Inject, Optional, Input, OnInit } from '@angular/core';
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
import { TicketService } from '../_services/ticket.service';
import { ProductService } from '../_services/product.service';
import { OrderService } from '../_services/order.service';
import { ToasterService } from '../_services/toastr.service';
import { DateValidator } from '../_shared/date.validator';
import { CustomerContactdialogBoxComponent } from '../customercontactdialog-box/customercontactdialog-box.component';
import moment from "moment";
import 'moment-timezone';
import { Customer } from '../interface/interface';
import { Order, Orderbase, OrderStatusUpdate } from '../newhotspotsconnectiondialog-box/hotspots';
//import { DateValidator } from '../_shared/date.validator';
import { ScratchService } from '../_services/scratch.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CommonService } from '../_services/common.service';
moment.tz.setDefault('Europe/Amsterdam');
declare var jQuery: any;
declare const editClick: any;
declare var $: any;

@Component({
  selector: 'app-addsitesurvey-dialougebox',
  templateUrl: './addsitesurvey-dialougebox.component.html',
  styleUrls: ['./addsitesurvey-dialougebox.component.scss']
})
export class AddsitesurveyDialougeboxComponent implements OnInit {
  orderid;
slaAddonValue: string;
action: string;
local_data: any;
submitted = false;
_id: string;
loading = false;
counter: number;
isBillingUser:boolean;
jsonArray: any[]
today = new Date();
jstoday = '';
buttondisabled = true;
issuenextstateList: any[];
hasnextstateid;
locationdata_dict:any;
returnUrl: string;
locationid: number;
communicationgroupList;
// Order Variable define
order: Order[] = [];
orderbase: any[];
orderStatusUpdate: OrderStatusUpdate[] = [];
orderattribute = new Map<string, string>();
orderattributevalue = new Map<string, string>();
productattributelist = new Map<string, string>();
orderFormUpdatedValue: any[] = [];
orderFormUpdateStatusValue: any[] = [];
orderActvateOnDelivery: any[];
orderrestrictOnLocation: any[];
BouwTypeList:any[];
isplandateedit;


isConn;

sitesurveycreateform: FormGroup;
orderChainList: any;
ordertypeList: any[];
orderstatusList;
BOUWSOConnectionList;
BOUWOrderCablingList;
BOUWSOStartpacketList;
isMainLocationListBlank;
location_parentcustomerid;
catalogueProperty: any[];

productnameList: any[];
cataloguepropertybygroupList: any[];
productnameListCheck: any[];
orderaddonlist: any[];
ordershipmentMode: any[];
customissuestate: any[] = [];
mainselectedpriceplan;
orderstatus_name;
ordertypename;
userrole;
selectedState;
issueAllState: any[] = [];
customercontactList: any[] = [];
/********************** Auto Search For Satellite Move *************************/
isRestrictionOnChain: boolean = false;
isActivation: boolean = false;
shipmentpost: boolean = false;
shipmentmail: boolean = false;
chainlist = new Map<number, string>();
chainid;  
chainVal;
countryList =  new Map<string, string>();
countryid;
countryVal;
loggedinuserrole;
bouwAllState;
  version = VERSION;
  noRecordFound;
  matSelectSearchVersion = MatSelectSearchVersion;
  SCardOrderShipmentPostalCode;
  tabSectionList: any[] = [];
  tabSectionListContact: any[] = [];
 /* chain Dropdown */
  protected locationsSatellite;  
  public chainFilteringCtrl: FormControl = new FormControl();
  protected chaindata;   
  public searchingChain: boolean = false;
  public filteredServerSideChains: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  protected _onDestroyChain = new Subject<void>();
  /* country Dropdown */  
  public countryFilteringCtrl: FormControl = new FormControl();
  protected countrydata;   
  public searchingCountry: boolean = false;
  public filteredServerSideCountry: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  protected _onDestroyCountry = new Subject<void>();
  /********************** Auto Search For Satellite Move *************************/
  
  
  
  constructor(
    private productservice: ProductService,
    private formBuilder: FormBuilder,
    private _locationService: LocationService,
    public router: Router,
    public dialogRef: MatDialogRef<AddsitesurveyDialougeboxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _Activatedroute: ActivatedRoute,
    private route: ActivatedRoute,
    private authenticationservice: AuthenticationService,
    private ticketservice: TicketService,
    private toasterservice: ToasterService,
    private _orderservice: OrderService,
    private datePipe: DatePipe,
    private _scratchservice: ScratchService,
    public _commonService: CommonService,
    public dialog: MatDialog,
  ) {
    this.loggedinuserrole = this.authenticationservice.getUserRole();
    this.isBillingUser = this.authenticationservice.isBillingUser();
    this.local_data = { ...data };
    
    this.action = this.local_data.action;
    this.locationdata_dict = this.local_data.locationdata_dict;
    this.location_parentcustomerid = this.local_data.locationparentcustomerid;
    if (this.action == 'Update' || this.action == 'UpdateStatus' || this.action == 'Delete') {
      this.locationid = +this.local_data.locationid;
    } else {
      this.locationid = +data.locationid;
    }
    this.tabSectionList = this._commonService.getSectionList('HotspotTab');
    this.tabSectionListContact = this._commonService.getSectionList('Contact');
  }

 

  ngOnInit() {
   
    this.buttondisabled = false;
    this._id = this.route.snapshot.paramMap.get("id");
   
    if (this.local_data.action == 'Add') {
      
      this.populateformdropdown();
      

      this.sitesurveycreateform = this.formBuilder.group({
        /****** New Attr ******/
        customerid: this.locationid,
        BOUWProgressNotification:[''],
        BOUWOrderContactid:['' , Validators.required],
        BOUWOrderContactPerson: [''],
        BOUWOrderContactPersonTelephone:[''],
        BOUWOrderContactPersonEmail:[''],
        BOUWOrderContactPersonFunction:[''],
        BOUWOrderWishdate: ['', Validators.required],
        BOUWOrderContractor: ['', Validators.required],
        BOUWOrderPlanneddate: [''],
        BOUWOrderCabling: [''],
        description: [''],
        BOUWSOStartpacket: [0],
        BOUWSOConnection: [''],
        BOUWSOTelephonenumber: [''],
        BOUWSOPlaceisrapoint: [''],
        BOUWSOLinequantity: [''],
        BOUWSODescription: [''], // Glas description
        BOUWSOStartpaketCatRefID: [''],
        BOUWSOStartpaketProductNaam: [''],
        facturatie_status: [''],
        orderstatus:[''],
        orderstate:[''],
        BOUWSOrderContractor:[''],
        BOUWSOrderWishdate: [''],
        BOUWOrderCoverage: ['', Validators.required],
        BOUWOrderSelectedType: [''],
        BOUWOrderTerminationReason: [''],
        /****** New Attr ******/
        
      });

      var crdate = moment().format('YYYY-MM-DD');
      var ordertype = 'add';
     // this.getProductCatalogueFilterByDate(crdate, ordertype);
      this.sitesurveycreateform.get('facturatie_status').setValue('Ready');
      
    }else if (this.local_data.action == 'Update'){
      this.orderid= this.local_data.id;
      this.local_data.BOUWOrderContactid = Number(this.local_data.BOUWOrderContactid);
      this.local_data.BOUWOrderContractor = Number(this.local_data.BOUWOrderContractor);
      this.local_data.BOUWOrderCabling = (this.local_data.BOUWOrderCabling);

      this.populateformdropdown();

      this._orderservice.getAtrbval(this.local_data.id).subscribe(data => {
        for (let item in data) {
          this.orderattributevalue.set(data[item]['orderattribute'], data[item]['id']);
        }
        
      }, error => this.toasterservice.showError(error));


      this.sitesurveycreateform = this.formBuilder.group({
        /****** New Attr ******/
        customerid: this.locationid,
        BOUWProgressNotification:[''],
        BOUWOrderContactid:[Number(this.local_data.BOUWOrderContactid), Validators.required],
        BOUWOrderContactPerson: [this.local_data.BOUWOrderContactPerson],
        BOUWOrderContactPersonTelephone:[this.local_data.BOUWOrderContactPersonTelephone],
        BOUWOrderContactPersonEmail:[this.local_data.BOUWOrderContactPersonEmail],
        BOUWOrderContactPersonFunction:[this.local_data.BOUWOrderContactPersonFunction],
        BOUWOrderWishdate: [this.local_data.BOUWOrderWishdateEdit, Validators.required],
        BOUWOrderContractor: [Number(this.local_data.BOUWOrderContractor), Validators.required],
        BOUWOrderPlanneddate: [this.local_data.BOUWOrderPlanneddateEdit],
        BOUWOrderCabling: [''],
        description: [this.local_data.opmerking],
        BOUWSOStartpacket: [''],
        BOUWSOConnection: [''],
        BOUWSOTelephonenumber: [''],
        BOUWSOPlaceisrapoint: [''],
        BOUWSOLinequantity: [''],
        BOUWSODescription: [''], // Glas description
        BOUWSOStartpaketCatRefID: [''],
        BOUWSOStartpaketProductNaam: [''],
        facturatie_status: [this.local_data.billingstatus],
        orderstatus:[this.local_data.orderstatus],
        orderstate:[Number(this.local_data.orderstate)],
        BOUWSOrderContractor:[''],
        BOUWSOrderWishdate: [''],
        BOUWOrderCoverage: [this.local_data.BOUWOrderCoverage],
        BOUWOrderSelectedType: [''],
        BOUWOrderTerminationReason: [''],
        /****** New Attr ******/
        
      });
      
      var ordertype = 'add';
      var crdate = formatDate(this.local_data.creationdateEdit, 'yyyy-MM-dd', 'en-US');
     // this.getProductCatalogueFilterByDate(crdate, ordertype);
      this.sitesurveycreateform.get('facturatie_status').setValue('Ready');

      this.getOrderStateList();

    }else if (this.local_data.action == 'UpdateStatus') {

      //this.populatestate();
      this.populateformdropdown();

      this.sitesurveycreateform = this.formBuilder.group({
        
        orderstate: ['',Validators.required],

      });

    }
  }

  getOrderStateList(){
    this.userrole = '01000010';
    this._orderservice.getBouwNextStateProperty(this.local_data.orderstate).subscribe(data => {
      this.issuenextstateList = data;
      this.isplandateedit = (data.length >0 && Number(data[0].isplandateedit) == 1) ? true : false ;
      this.hasnextstateid = (data.length >0) ? data[0].nextstate_id : 0;
      this.customissuestate.push({
        id: Number(this.issuenextstateList[0].currentstate_id),
        name: this.issuenextstateList[0].currentstatename
      });
        for (let state of this.issuenextstateList){
          this.customissuestate.push({
            id: Number(state.nextstate_id),
            name: state.nextstatename
          });
          
        }
        this.selectedState = Number(this.local_data.orderstate);
    }, (err) => {
      this.toasterservice.showError(err);
      this.dialogRef.close({ event: 'Cancel' });
    });
  }
  
  ngAfterViewInit(): void {
     
  }
 
  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onSubmit(form: NgForm) {
    if (this.sitesurveycreateform.invalid) {
      
      const invalid = [];
        const controls = this.sitesurveycreateform.controls;
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

    if (this.sitesurveycreateform.get('BOUWOrderWishdate').value == '' || this.sitesurveycreateform.get('BOUWOrderWishdate').value == null) {
      this.sitesurveycreateform.get('BOUWOrderWishdate').setValue(null);
    } else {
      this.sitesurveycreateform.get('BOUWOrderWishdate').setValue(this.transformDate(this.sitesurveycreateform.get('BOUWOrderWishdate').value));
    }
    
    this.orderbase = [
      {
        hstorderid: '',
        orderstatus: '',
        orderstate: '1',
        remarks: (this.sitesurveycreateform.get('description').value == '') ? '' : this.sitesurveycreateform.get('description').value.toString().trim(),
        creationdate: this.jstoday,
        updationdate: null,
        ponumber: '',
        ordertype: '1',
        locationid: this.locationid,
        productcatalogueid: 3,
        productcataloguegroup: 3,
        billingstartdate: null,
        isstartpaketactive:this.sitesurveycreateform.get('BOUWSOStartpacket').value,
        startpaketcatalogue:this.sitesurveycreateform.get('BOUWSOStartpaketCatRefID').value,
        stratpaketname: this.sitesurveycreateform.get('BOUWSOStartpaketProductNaam').value,
        isconnection: this.sitesurveycreateform.get('BOUWSOConnection').value,
        billingstatus: (this.sitesurveycreateform.get('facturatie_status').value == '') ? '' : this.sitesurveycreateform.get('facturatie_status').value.toString().trim(),
        bouwtype: 1, //New Site survey
      }
    ];

    this.counter = 0;
    Object.keys(this.sitesurveycreateform.controls).forEach(key => {
      if (key == 'BOUWOrderContactid' || key == 'BOUWOrderWishdate' ||
      key == 'BOUWOrderContractor' || key == 'BOUWOrderPlanneddate' || key == 'BOUWOrderCabling' ||
      key == 'BOUWSOStartpacket' || key == 'BOUWSOConnection' || key == 'BOUWSOTelephonenumber' || 
      key == 'BOUWSOPlaceisrapoint' || key == 'BOUWSOLinequantity' || key == 'BOUWSODescription' || 
      key == 'BOUWProgressNotification' || key =='BOUWSOrderContractor' || key =='BOUWSOrderWishdate' || 
      key == 'BOUWOrderCoverage' || key == 'BOUWOrderSelectedType' || key == 'BOUWOrderTerminationReason') {
        this.order.push({
          id: '',
          orderattributevalue: (this.sitesurveycreateform.get(key).value == null || this.sitesurveycreateform.get(key).value == '') ? '' : this.sitesurveycreateform.get(key).value.toString().trim(),
          orderattribute: this.orderattribute.get(key),
          orderbasef: this.orderbase[0]
        });

      }

    });
    this.order.sort(this.GetSortOrder("orderattribute"));
    this._orderservice.addOrderNHBouw(JSON.stringify(this.order))
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }





  onUpdate(form: NgForm) {
    if (this.sitesurveycreateform.invalid) {
      
      const invalid = [];
        const controls = this.sitesurveycreateform.controls;
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

    if (this.sitesurveycreateform.get('BOUWOrderWishdate').value == '' || this.sitesurveycreateform.get('BOUWOrderWishdate').value == null) {
      this.sitesurveycreateform.get('BOUWOrderWishdate').setValue(null);
    } else {
      this.sitesurveycreateform.get('BOUWOrderWishdate').setValue(this.transformDate(this.sitesurveycreateform.get('BOUWOrderWishdate').value));
    }


    if (this.sitesurveycreateform.get('BOUWOrderPlanneddate').value == '' || this.sitesurveycreateform.get('BOUWOrderPlanneddate').value == null) {
      this.sitesurveycreateform.get('BOUWOrderPlanneddate').setValue(null);
    } else {
      this.sitesurveycreateform.get('BOUWOrderPlanneddate').setValue(this.transformDate(this.sitesurveycreateform.get('BOUWOrderPlanneddate').value));
    }

    

    this.orderbase = [
      {
        hstorderid: this.local_data.orderid,
        orderstatus: '',
        orderstate: this.sitesurveycreateform.get('orderstate').value,
        remarks: (this.sitesurveycreateform.get('description').value == '') ? '' : this.sitesurveycreateform.get('description').value.toString().trim(),
        creationdate: this.local_data.creationdateEdit,
        updationdate: this.jstoday,
        ponumber: '',
        ordertype: '1',
        locationid: this.locationid,
        productcatalogueid: 3,
        productcataloguegroup: 3,
        billingstartdate: null,
        isstartpaketactive:this.sitesurveycreateform.get('BOUWSOStartpacket').value,
        startpaketcatalogue:this.sitesurveycreateform.get('BOUWSOStartpaketCatRefID').value,
        stratpaketname: this.sitesurveycreateform.get('BOUWSOStartpaketProductNaam').value,
        isconnection: this.sitesurveycreateform.get('BOUWSOConnection').value,
        billingstatus: (this.sitesurveycreateform.get('facturatie_status').value == '') ? '' : this.sitesurveycreateform.get('facturatie_status').value.toString().trim(),
       
        bouwtype: 1, //New site survey
      }
    ];

    this.counter = 0;
    Object.keys(this.sitesurveycreateform.controls).forEach(key => {
      if (key == 'BOUWOrderContactid' || key == 'BOUWOrderWishdate' ||
      key == 'BOUWOrderContractor' || key == 'BOUWOrderPlanneddate' || key == 'BOUWOrderCabling' ||
      key == 'BOUWSOStartpacket' || key == 'BOUWSOConnection' || key == 'BOUWSOTelephonenumber' || 
      key == 'BOUWSOPlaceisrapoint' || key == 'BOUWSOLinequantity' || key == 'BOUWSODescription' || 
      key == 'BOUWProgressNotification' || key =='BOUWSOrderContractor' || key =='BOUWSOrderWishdate' || key == 'BOUWOrderCoverage'
      || key == 'BOUWOrderSelectedType' || key == 'BOUWOrderTerminationReason') {
        this.order.push({
          id: this.orderattributevalue.get(this.orderattribute.get(key)),
          orderattributevalue: (this.sitesurveycreateform.get(key).value == null || this.sitesurveycreateform.get(key).value == '') ? '' : this.sitesurveycreateform.get(key).value.toString().trim(),
          orderattribute: this.orderattribute.get(key),
          orderbasef: this.orderbase[0]
        });

      }

    });


    var BOUWOrderContractorName = this.sitesurveycreateform.get('BOUWOrderContractor').value ? this.communicationgroupList.find(r =>
      r.communicationvalue == this.sitesurveycreateform.get('BOUWOrderContractor').value
    ).communicationname : '';

    
    var updateDateformat = moment().format('DD-MM-YYYY');
    var orderstatename =  this.bouwAllState.find(r => 
      r.value == this.sitesurveycreateform.get('orderstate').value
    ).name;
    this.orderFormUpdatedValue.push({
      id: this.local_data.id,
     
      BOUWOrderContactid: this.sitesurveycreateform.get('BOUWOrderContactid').value,
      BOUWOrderContractor : this.sitesurveycreateform.get('BOUWOrderContractor').value,
      description: this.sitesurveycreateform.get('description').value,
      BOUWOrderContractorName: BOUWOrderContractorName,
      BOUWOrderWishdate: this.sitesurveycreateform.get('BOUWOrderWishdate').value ? formatDate(this.sitesurveycreateform.get('BOUWOrderWishdate').value, 'dd-MM-yyyy', 'en-US') : '',
      BOUWOrderWishdateEdit: this.sitesurveycreateform.get('BOUWOrderWishdate').value,
      BOUWOrderPlanneddate: this.sitesurveycreateform.get('BOUWOrderPlanneddate').value ? formatDate(this.sitesurveycreateform.get('BOUWOrderPlanneddate').value, 'dd-MM-yyyy', 'en-US') : '',
      BOUWOrderPlanneddateEdit: this.sitesurveycreateform.get('BOUWOrderPlanneddate').value,
      BOUWTypeName :this.local_data.bouwtype,
      orderstatusname: orderstatename,
      BOUWOrderCoverage: this.sitesurveycreateform.get('BOUWOrderCoverage').value
     
    });

    this.order.sort(this.GetSortOrder("orderattribute"));
      this._orderservice.updateOrderNHBouw(JSON.stringify(this.order), this.local_data.id)
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Update', data: this.orderFormUpdatedValue });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }


  openContactDialogAdd(action ) {
    const dialogRef = this.dialog.open(CustomerContactdialogBoxComponent, {
      width: '960px',
      data: { locationid: this.locationid, action: action }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {
        this.resetContactList(result.response.id);
      }
    }, error => this.toasterservice.showError(error));

  }

  resetContactList(newContactId){
   this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;
        this.selectCustomerContact(Number(newContactId));
          this.sitesurveycreateform.patchValue({
            BOUWOrderContactid: Number(newContactId)
          })
      }, error => this.toasterservice.showError(error));
  }

  populateformdropdown() {


    this._orderservice.getBouwStateList().subscribe(data => {
      this.bouwAllState = data;

    });

    this._orderservice.getAtrbe(3).subscribe(data => {
      for (let item in data) {
        this.orderattribute.set(data[item]['attributename'], data[item]['id']);
      }
      
      this.buttondisabled = false;
    }, error => this.toasterservice.showError(error));

    
    this._orderservice.getOrderProperty('BOUWSOStartpacket').subscribe(data => {
      this.BOUWSOStartpacketList = data;
      }, error => this.toasterservice.showError(error));

    this._orderservice.getOrderProperty('BOUWOrderCabling').subscribe(data => {
      this.BOUWOrderCablingList = data;
      
      }, error => this.toasterservice.showError(error));

    this._orderservice.getOrderProperty('BOUWSOConnection').subscribe(data => {
      this.BOUWSOConnectionList = data;
      }, error => this.toasterservice.showError(error));

    this._orderservice.getOrderProperty('BouwType').subscribe(data => {
      this.BouwTypeList = data;
      }, error => this.toasterservice.showError(error));


    this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;
        
        if(this.local_data.action == 'Update'){
          this.selectCustomerContact(Number(this.local_data.BOUWOrderContactid));
        }
      },
      err => console.error(err),
      () => console.log('')
    );

    this.ticketservice.getCommunicationgroup().subscribe(data => {
      this.communicationgroupList = data;
      
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

  }


  public hasError = (controlName: string, errorName: string) => {
    return this.sitesurveycreateform.get(controlName).hasError(errorName);
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

  

  selectCustomerContact(customercontactid){
    let selectedcontactperson = this.customercontactList.find(r => r.id == customercontactid
    );
    this.sitesurveycreateform.get('BOUWOrderContactPersonEmail').setValue(selectedcontactperson.contactpersonemail);
    this.sitesurveycreateform.get('BOUWOrderContactPersonTelephone').setValue(selectedcontactperson.contactpersontelephone);
    this.sitesurveycreateform.get('BOUWOrderContactPersonFunction').setValue(selectedcontactperson.contactpersonfunction);
    
  }

  


  selectConnection(checkValue){
    if(checkValue == '1'){
      this.isConn = checkValue;
    }else{
      this.isConn = checkValue;
    }
  }


  dateValidation(){
    var BOUWOrderWishdate = this.sitesurveycreateform.get('BOUWOrderWishdate');
    if (BOUWOrderWishdate.value != '' && BOUWOrderWishdate.value != null) {
      BOUWOrderWishdate.setValidators([DateValidator.dateVaidator]);
      BOUWOrderWishdate.updateValueAndValidity();
    } else {
      BOUWOrderWishdate.setValue('');
      BOUWOrderWishdate.clearValidators();
      BOUWOrderWishdate.updateValueAndValidity();
    }
  }

  }


