import { Component, Inject, Optional, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn, NgForm, FormControlDirective, AbstractControl } from '@angular/forms';
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
import { Order, Orderbase, OrderStatusUpdate } from './hotspots';
//import { DateValidator } from '../_shared/date.validator';
import { ScratchService } from '../_services/scratch.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CommonService } from '../_services/common.service';
import { CustomerContactdialogBoxComponent } from '../customercontactdialog-box/customercontactdialog-box.component';
moment.tz.setDefault('Europe/Amsterdam');
declare var jQuery: any;
declare const editClick: any;
declare var $: any;



@Component({
  selector: 'app-modifyhotspotsdialog-box',
  templateUrl: './modifyhotspotsdialog-box.component.html',
  styleUrls: ['./modifyhotspotsdialog-box.component.scss'],
})

export class ModifyhotspotsdialogBoxComponent {
  ConType: string;
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
  issuenextstateList: any[];
  hasnextstateid;
  locationdata_dict: any;
  returnUrl: string;
  locationid: number;
  communicationgroupList;
  // Order Variable define
  order: Order[] = [];
  orderbase: Orderbase[];
  orderStatusUpdate: OrderStatusUpdate[] = [];
  orderattribute = new Map<string, string>();
  orderattributevalue = new Map<string, string>();
  productattributelist = new Map<string, string>();
  orderFormUpdatedValue: any[] = [];
  orderFormUpdateStatusValue: any[] = [];
  orderActvateOnDelivery: any[];
  orderrestrictOnLocation: any[];
  BouwTypeList: any[];
  BouwStateList: any[];
  isplandateedit;


  isConn;

  hotspotscreateform: FormGroup;
  orderChainList: any;
  ordertypeList: any[];
  orderstatusList;
  BOUWSOConnectionList;
  BOUWOrderCablingList;
  BOUWOrderSelectedTypeList;
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
  bouwAllState: any[] = [];
  customercontactList: any[] = [];
  /********************** Auto Search For Satellite Move *************************/
  isRestrictionOnChain: boolean = false;
  isActivation: boolean = false;
  shipmentpost: boolean = false;
  shipmentmail: boolean = false;
  chainlist = new Map<number, string>();
  chainid;
  chainVal;
  countryList = new Map<string, string>();
  countryid;
  countryVal;
  loggedinuserrole;
  version = VERSION;
  noRecordFound;
  matSelectSearchVersion = MatSelectSearchVersion;
  SCardOrderShipmentPostalCode;
  orderid;
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
    public dialogRef: MatDialogRef<ModifyhotspotsdialogBoxComponent>,
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
      this.hotspotscreateform = this.formBuilder.group({
        /****** New Attr ******/
        customerid: this.locationid,
        BOUWProgressNotification: [''],
        BOUWOrderContactid: ['', Validators.required],
        BOUWOrderContactPerson: [''],
        BOUWOrderContactPersonTelephone: [''],
        BOUWOrderContactPersonEmail: [''],
        BOUWOrderContactPersonFunction: [''],
        BOUWOrderWishdate: ['', Validators.required],
        BOUWOrderContractor: ['', Validators.required],
        BOUWOrderPlanneddate: [''],
        BOUWOrderCabling: ['', Validators.required],
        description: [''],
        BOUWSOStartpacket: ['', Validators.required],
        BOUWSOConnection: ['', Validators.required],
        BOUWSOTelephonenumber: [''],
        BOUWSOPlaceisrapoint: [''],
        BOUWSOLinequantity: [''],
        BOUWSODescription: [''], // Glas description
        BOUWSOStartpaketCatRefID: [''],
        BOUWSOStartpaketProductNaam: [''],
        facturatie_status: [''],
        orderstatus: [''],
        orderstate: [''],
        BOUWSOrderContractor: ['', Validators.required],
        BOUWSOrderWishdate: ['', Validators.required],
        BOUWOrderCoverage: [''],
        BOUWOrderSelectedType: ['', Validators.required],
        BOUWOrderTerminationReason: [''],
        /****** New Attr ******/

      });



      var crdate = moment().format('YYYY-MM-DD');
      var ordertype = 'add';
      this.getProductCatalogueFilterByDate(crdate, ordertype);
      this.hotspotscreateform.get('facturatie_status').setValue('Ready');

    } else if (this.local_data.action == 'Update') {

      this.orderid = this.local_data.id;
      this.local_data.BOUWOrderContactid = Number(this.local_data.BOUWOrderContactid);
      this.local_data.BOUWOrderContractor = Number(this.local_data.BOUWOrderContractor);
      this.local_data.BOUWOrderCabling = (this.local_data.BOUWOrderCabling);

      this.populateformdropdown();

      this._orderservice.getAtrbval(this.local_data.id).subscribe(data => {
        for (let item in data) {
          this.orderattributevalue.set(data[item]['orderattribute'], data[item]['id']);
        }

      }, error => this.toasterservice.showError(error));


      this.hotspotscreateform = this.formBuilder.group({
        /****** New Attr ******/
        customerid: this.locationid,
        BOUWProgressNotification: [this.local_data.BOUWProgressNotification],
        BOUWOrderContactid: [Number(this.local_data.BOUWOrderContactid), Validators.required],
        BOUWOrderContactPerson: [this.local_data.BOUWOrderContactPerson],
        BOUWOrderContactPersonTelephone: [this.local_data.BOUWOrderContactPersonTelephone],
        BOUWOrderContactPersonEmail: [this.local_data.BOUWOrderContactPersonEmail],
        BOUWOrderContactPersonFunction: [this.local_data.BOUWOrderContactPersonFunction],
        BOUWOrderWishdate: [this.local_data.BOUWOrderWishdateEdit, Validators.required],
        BOUWOrderContractor: [Number(this.local_data.BOUWOrderContractor), Validators.required],
        BOUWOrderPlanneddate: [this.local_data.BOUWOrderPlanneddate],
        BOUWOrderCabling: [this.local_data.BOUWOrderCabling, Validators.required],
        description: [this.local_data.opmerking],
        BOUWSOStartpacket: [this.local_data.BOUWSOStartpacket],
        BOUWSOConnection: [this.local_data.BOUWSOConnection],
        BOUWSOTelephonenumber: [this.local_data.BOUWSOTelephonenumber],
        BOUWSOPlaceisrapoint: [this.local_data.BOUWSOPlaceisrapoint],
        BOUWSOLinequantity: [this.local_data.BOUWSOLinequantity],
        BOUWSODescription: [this.local_data.BOUWSODescription], // Glas description
        BOUWSOStartpaketCatRefID: [this.local_data.BOUWSOStartpaketCatRefID],
        BOUWSOStartpaketProductNaam: [this.local_data.BOUWSOStartpaketProductNaam],
        facturatie_status: [this.local_data.billingstatus],
        orderstatus: [this.local_data.orderstatus],
        orderstate: [Number(this.local_data.orderstate)],
        BOUWSOrderContractor: [Number(this.local_data.BOUWSOrderContractor)],
        BOUWSOrderWishdate: [this.local_data.BOUWSOrderWishdateEdit],
        BOUWOrderCoverage: [''],
        BOUWOrderSelectedType: [this.local_data.BOUWOrderSelectedType, Validators.required],
        BOUWOrderTerminationReason: [''],
        /****** New Attr ******/

      });

      var ordertype = 'add';
      var crdate = formatDate(this.local_data.creationdateEdit, 'yyyy-MM-dd', 'en-US');
      this.getProductCatalogueFilterByDate(crdate, ordertype);
      this.hotspotscreateform.get('facturatie_status').setValue('Ready');




      this.getOrderStateList();



    } else if (this.local_data.action == 'UpdateStatus') {

      //this.populatestate();
      this.populateformdropdown();

      this.hotspotscreateform = this.formBuilder.group({

        orderstate: ['', Validators.required],

      });

    }
  }


  getOrderStateList() {
    this.userrole = '01000010';
    this._orderservice.getBouwNextStateProperty(this.local_data.orderstate).subscribe(data => {
      this.issuenextstateList = data;

      this.isplandateedit = (data.length > 0 && Number(data[0].isplandateedit) == 1) ? true : false;

      this.hasnextstateid = (data.length > 0) ? data[0].nextstate_id : 0;
      if (data.length > 0) {
        this.customissuestate.push({
          id: Number(this.issuenextstateList[0].currentstate_id),
          name: this.issuenextstateList[0].currentstatename
        });
        for (let state of this.issuenextstateList) {
          this.customissuestate.push({
            id: Number(state.nextstate_id),
            name: state.nextstatename
          });

        }
      }
      this.selectedState = Number(this.local_data.orderstate);
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
  }





  ngAfterViewInit(): void {

  }



  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onSubmit(form: NgForm) {
    if (this.hotspotscreateform.invalid) {

      const invalid = [];
      const controls = this.hotspotscreateform.controls;
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




    if (this.hotspotscreateform.get('BOUWOrderWishdate').value == '' || this.hotspotscreateform.get('BOUWOrderWishdate').value == null) {
      this.hotspotscreateform.get('BOUWOrderWishdate').setValue(null);
    } else {
      this.hotspotscreateform.get('BOUWOrderWishdate').setValue(this.transformDate(this.hotspotscreateform.get('BOUWOrderWishdate').value));
    }

    if (this.hotspotscreateform.get('BOUWSOrderWishdate').value == '' || this.hotspotscreateform.get('BOUWSOrderWishdate').value == null) {
      this.hotspotscreateform.get('BOUWSOrderWishdate').setValue(null);
    } else {
      this.hotspotscreateform.get('BOUWSOrderWishdate').setValue(this.transformDate(this.hotspotscreateform.get('BOUWSOrderWishdate').value));
    }






    this.orderbase = [
      {
        hstorderid: '',
        orderstatus: '1',
        orderstate: '1',
        remarks: (this.hotspotscreateform.get('description').value == '') ? '' : this.hotspotscreateform.get('description').value.toString().trim(),
        creationdate: this.jstoday,
        updationdate: null,
        ponumber: '',
        ordertype: '2',
        locationid: this.locationid,
        productcatalogueid: 3,
        productcataloguegroup: 3,
        billingstartdate: null,
        billingstatus: (this.hotspotscreateform.get('facturatie_status').value == '') ? '' : this.hotspotscreateform.get('facturatie_status').value.toString().trim(),
        isstartpaketactive: this.hotspotscreateform.get('BOUWSOStartpacket').value,
        startpaketcatalogue: this.hotspotscreateform.get('BOUWSOStartpaketCatRefID').value,
        stratpaketname: this.hotspotscreateform.get('BOUWSOStartpaketProductNaam').value,
        isconnection: this.hotspotscreateform.get('BOUWSOConnection').value,
        bouwtype: 2, //New Hotspot
      }
    ];

    this.counter = 0;
    Object.keys(this.hotspotscreateform.controls).forEach(key => {
      if (key == 'BOUWOrderContactid' || key == 'BOUWOrderWishdate' ||
        key == 'BOUWOrderContractor' || key == 'BOUWOrderPlanneddate' || key == 'BOUWOrderCabling' ||
        key == 'BOUWSOStartpacket' || key == 'BOUWSOConnection' || key == 'BOUWSOTelephonenumber' ||
        key == 'BOUWSOPlaceisrapoint' || key == 'BOUWSOLinequantity' || key == 'BOUWSODescription' ||
        key == 'BOUWProgressNotification' || key == 'BOUWSOrderContractor' || key == 'BOUWSOrderWishdate' ||
        key == 'BOUWOrderCoverage' || key == 'BOUWOrderSelectedType' || key == 'BOUWOrderTerminationReason') {
        this.order.push({
          id: '',
          orderattributevalue: (this.hotspotscreateform.get(key).value == null || this.hotspotscreateform.get(key).value == '') ? '' : this.hotspotscreateform.get(key).value.toString().trim(),
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
    if (this.hotspotscreateform.invalid) {

      const invalid = [];
      const controls = this.hotspotscreateform.controls;
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


    if (this.hotspotscreateform.get('BOUWOrderWishdate').value == '' || this.hotspotscreateform.get('BOUWOrderWishdate').value == null) {
      this.hotspotscreateform.get('BOUWOrderWishdate').setValue(null);
    } else {
      this.hotspotscreateform.get('BOUWOrderWishdate').setValue(this.transformDate(this.hotspotscreateform.get('BOUWOrderWishdate').value));
    }

    if (this.hotspotscreateform.get('BOUWSOrderWishdate').value == '' || this.hotspotscreateform.get('BOUWSOrderWishdate').value == null) {
      this.hotspotscreateform.get('BOUWSOrderWishdate').setValue(null);
    } else {
      this.hotspotscreateform.get('BOUWSOrderWishdate').setValue(this.transformDate(this.hotspotscreateform.get('BOUWSOrderWishdate').value));
    }

    if (this.hotspotscreateform.get('BOUWOrderPlanneddate').value == '' || this.hotspotscreateform.get('BOUWOrderPlanneddate').value == null) {
      this.hotspotscreateform.get('BOUWOrderPlanneddate').setValue(null);
    } else {
      this.hotspotscreateform.get('BOUWOrderPlanneddate').setValue(this.transformDate(this.hotspotscreateform.get('BOUWOrderPlanneddate').value));
    }

    if (this.hotspotscreateform.get('orderstate').value) {
      this.hotspotscreateform.get('orderstate').setValue(this.hotspotscreateform.get('orderstate').value);
    } else {
      this.hotspotscreateform.get('orderstate').setValue(this.local_data.orderstate);
    }


    this.orderbase = [
      {
        hstorderid: this.local_data.orderid,
        orderstatus: '1',
        orderstate: this.hotspotscreateform.get('orderstate').value ? this.hotspotscreateform.get('orderstate').value : this.local_data.orderstate,
        remarks: (this.hotspotscreateform.get('description').value == '') ? '' : this.hotspotscreateform.get('description').value.toString().trim(),
        creationdate: this.local_data.creationdateEdit,
        updationdate: this.jstoday,
        ponumber: '',
        ordertype: '2',
        locationid: this.locationid,
        productcatalogueid: 3,
        productcataloguegroup: 3,
        billingstartdate: null,
        billingstatus: (this.hotspotscreateform.get('facturatie_status').value == '') ? '' : this.hotspotscreateform.get('facturatie_status').value.toString().trim(),
        isstartpaketactive: this.hotspotscreateform.get('BOUWSOStartpacket').value,
        startpaketcatalogue: this.hotspotscreateform.get('BOUWSOStartpaketCatRefID').value,
        stratpaketname: this.hotspotscreateform.get('BOUWSOStartpaketProductNaam').value,
        isconnection: this.hotspotscreateform.get('BOUWSOConnection').value,
        bouwtype: 2, //New Hotspot
      }
    ];

    this.counter = 0;
    Object.keys(this.hotspotscreateform.controls).forEach(key => {
      if (key == 'BOUWOrderContactid' || key == 'BOUWOrderWishdate' ||
        key == 'BOUWOrderContractor' || key == 'BOUWOrderPlanneddate' || key == 'BOUWOrderCabling' ||
        key == 'BOUWSOStartpacket' || key == 'BOUWSOConnection' || key == 'BOUWSOTelephonenumber' ||
        key == 'BOUWSOPlaceisrapoint' || key == 'BOUWSOLinequantity' || key == 'BOUWSODescription' ||
        key == 'BOUWProgressNotification' || key == 'BOUWSOrderContractor' || key == 'BOUWSOrderWishdate' ||
        key == 'BOUWOrderCoverage' || key == 'BOUWOrderSelectedType' || key == 'BOUWOrderTerminationReason') {
        this.order.push({
          id: this.orderattributevalue.get(this.orderattribute.get(key)),
          orderattributevalue: (this.hotspotscreateform.get(key).value == null || this.hotspotscreateform.get(key).value == '') ? '' : this.hotspotscreateform.get(key).value.toString().trim(),
          orderattribute: this.orderattribute.get(key),
          orderbasef: this.orderbase[0]
        });

      }

    });




    var BOUWTypeName = this.BouwTypeList.find(r =>
      r.id == '2'
    ).name;

    var orderstatename = this.bouwAllState.find(r =>
      r.value == this.hotspotscreateform.get('orderstate').value
    ).name;

    var BOUWOrderSelectedTypeName = this.BOUWOrderSelectedTypeList.find(r =>
      r.id == this.hotspotscreateform.get('BOUWOrderSelectedType').value
    ).name;


    var BOUWOrderContractorName = this.hotspotscreateform.get('BOUWOrderContractor').value ? this.communicationgroupList.find(r =>
      r.communicationvalue == this.hotspotscreateform.get('BOUWOrderContractor').value
    ).communicationname : '';


    var updateDateformat = moment().format('DD-MM-YYYY');
    this.orderFormUpdatedValue.push({
      id: this.local_data.id,
      orderstate: this.hotspotscreateform.get('orderstate').value ? this.hotspotscreateform.get('orderstate').value : this.local_data.orderstate,
      antal: this.hotspotscreateform.get('BOUWSOLinequantity').value,
      BOUWOrderContactid: this.hotspotscreateform.get('BOUWOrderContactid').value,
      BOUWOrderWishdate: this.hotspotscreateform.get('BOUWOrderWishdate').value ? formatDate(this.hotspotscreateform.get('BOUWOrderWishdate').value, 'dd-MM-yyyy', 'en-US') : '',
      BOUWOrderWishdateEdit: this.hotspotscreateform.get('BOUWOrderWishdate').value,
      BOUWOrderContractor: this.hotspotscreateform.get('BOUWOrderContractor').value,
      BOUWOrderPlanneddate: this.hotspotscreateform.get('BOUWOrderPlanneddate').value ? formatDate(this.hotspotscreateform.get('BOUWOrderPlanneddate').value, 'dd-MM-yyyy', 'en-US') : '',
      BOUWOrderPlanneddateEdit: this.hotspotscreateform.get('BOUWOrderPlanneddate').value,
      BOUWProgressNotification: this.hotspotscreateform.get('BOUWProgressNotification').value,
      BOUWOrderCabling: this.hotspotscreateform.get('BOUWOrderCabling').value,
      BOUWSOStartpacket: this.hotspotscreateform.get('BOUWSOStartpacket').value,
      BOUWSOConnection: this.hotspotscreateform.get('BOUWSOConnection').value,
      BOUWSOTelephonenumber: this.hotspotscreateform.get('BOUWSOTelephonenumber').value,
      BOUWSOPlaceisrapoint: this.hotspotscreateform.get('BOUWSOPlaceisrapoint').value,
      BOUWSOLinequantity: this.hotspotscreateform.get('BOUWSOLinequantity').value,
      description: this.hotspotscreateform.get('description').value,
      BOUWOrderSelectedType: this.hotspotscreateform.get('BOUWOrderSelectedType').value,

      BOUWOrderContractorName: BOUWOrderContractorName,
      BOUWTypeName: BOUWTypeName,
      orderstatename: orderstatename,
      BOUWOrderSelectedTypeName: BOUWOrderSelectedTypeName

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
          this.hotspotscreateform.patchValue({
            BOUWOrderContactid: Number(newContactId)
          })
      }, error => this.toasterservice.showError(error));
  }


  populateformdropdown() {


    this._orderservice.getBouwStateList().subscribe(data => {
      this.bouwAllState = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
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


    this._orderservice.getOrderProperty('BOUWOrderSelectedType').subscribe(data => {
      this.BOUWOrderSelectedTypeList = data;

    }, error => this.toasterservice.showError(error));


    this._orderservice.getOrderProperty('BOUWSOConnection').subscribe(data => {
      this.BOUWSOConnectionList = data;
    }, error => this.toasterservice.showError(error));

    this._orderservice.getOrderProperty('BouwType').subscribe(data => {
      this.BouwTypeList = data;
    }, error => this.toasterservice.showError(error));

    this._orderservice.getBouwStateList().subscribe(data => {
      this.BouwStateList = data;

    }, error => this.toasterservice.showError(error));

    this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;

        if (this.local_data.action == 'Update') {
          this.selectCustomerContact(Number(this.local_data.BOUWOrderContactid));
        }
      }, error => this.toasterservice.showError(error));

    this.ticketservice.getCommunicationgroup().subscribe(data => {
      this.communicationgroupList = data;

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });



  }



  public hasError = (controlName: string, errorName: string) => {
    return this.hotspotscreateform.get(controlName).hasError(errorName);
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



  selectCustomerContact(customercontactid) {
    let selectedcontactperson = this.customercontactList.find(r => r.id == customercontactid
    );
    this.hotspotscreateform.get('BOUWOrderContactPersonEmail').setValue(selectedcontactperson.contactpersonemail);
    this.hotspotscreateform.get('BOUWOrderContactPersonTelephone').setValue(selectedcontactperson.contactpersontelephone);
    this.hotspotscreateform.get('BOUWOrderContactPersonFunction').setValue(selectedcontactperson.contactpersonfunction);

  }




  selectConnection(checkValue) {
    if (checkValue == '1') {
      this.isConn = checkValue;
      this.ConType = 'DSL';
    } else {
      this.isConn = checkValue;
      this.ConType = 'Glas';
      this.hotspotscreateform.get('BOUWSOTelephonenumber').setValue('');
      this.hotspotscreateform.get('BOUWSOPlaceisrapoint').setValue('');
      this.hotspotscreateform.get('BOUWSOLinequantity').setValue('');
    }
  }









  getProductCatalogueFilterByDate(creationdate, ordertype) {

    this.productservice.getProductCatalogueFilterByDate('2', creationdate, ordertype, this.location_parentcustomerid).subscribe(data => {
      this.catalogueProperty = data;

      this.productnameList = this.catalogueProperty.find(r => r.productgroup == '2'
        && r.producttype == '1' && r.productname == '20'
      );

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
  }

  selectStartpakket(checkValue) {
    let productnameListID = this.catalogueProperty.find(r => r.productgroup == '2'
      && r.producttype == '1' && r.productname == '20'
    ).id;
    let productnameListName = this.catalogueProperty.find(r => r.productgroup == '2'
      && r.producttype == '1' && r.productname == '20'
    ).productname;
    this.hotspotscreateform.get('BOUWSOStartpaketCatRefID').setValue(productnameListID);
    this.hotspotscreateform.get('BOUWSOStartpaketProductNaam').setValue(productnameListName);
  }

}