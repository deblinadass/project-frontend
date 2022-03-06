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
import { ProductService } from '../_services/product.service';
import { OrderService } from '../_services/order.service';
import { ToasterService } from '../_services/toastr.service';
import { DateValidator } from '../_shared/date.validator';
import { CustomerContactdialogBoxComponent } from '../customercontactdialog-box/customercontactdialog-box.component';
import { MatDialog } from '@angular/material/dialog';
import moment from "moment";
import 'moment-timezone';
import { Customer } from '../interface/interface';
import { Order, Orderbase, OrderStatusUpdate } from './scratch';
//import { DateValidator } from '../_shared/date.validator';
import { ScratchService } from '../_services/scratch.service';

import { Observable } from 'rxjs';
import { CommonService } from '../_services/common.service';
moment.tz.setDefault('Europe/Amsterdam');
declare var jQuery: any;
declare const editClick: any;
declare var $: any;



@Component({
  selector: 'app-scratchdialog-box',
  templateUrl: './scratchdialog-box.component.html',
  styleUrls: ['./scratchdialog-box.component.scss'],
})

export class ScratchdialogBoxComponent {
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
  ordernextstateList: any[];
  hasnextstateid;
  locationdata_dict: any;
  returnUrl: string;
  locationid: number;
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

  SCardOrderShipmentStreet;
  SCardOrderShipmentHouseNo;
  SCardOrderShipmentHouseNoExt;
  SCardOrderShipmentCity;

  scratchcardcreateform: FormGroup;
  orderChainList: any;
  ordertypeList: any[];
  orderstatusList;
  isMainLocationListBlank;
  location_parentcustomerid;
  catalogueProperty: any[];
  SCardOrderType: any[];
  SCardOrderStatus: any[];
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
  tabSectionListContact: any[] = [];
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
  tabSectionList: any[] = [];
  scratchcardstartreadonly = true;
  scratchcardbuttondisplay = false;
  customercontactList: any[] = [];
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
    public dialogRef: MatDialogRef<ScratchdialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _Activatedroute: ActivatedRoute,
    private route: ActivatedRoute,
    private authenticationservice: AuthenticationService,
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
    this.tabSectionList = this._commonService.getSectionList('ScratchcardTab');
    this.tabSectionListContact = this._commonService.getSectionList('Contact');

  }

  fetchDetailsDropdown() {

    /**Fetch chains */
    $('.overlay').show();
    this._locationService.getAllChain().subscribe(data => {
      if (this.action == 'Update') {
        for (let item in data['result']) {
          this.chainlist.set(data['result'][item]['chainid'], data['result'][item]['chainname']);
        }
        this.chainid = Number(this.local_data.SCardOrderValidForLocation);
        //Assinging selected chain value to dropdown while edit loads   
        this.chainVal = [{ "chainid": this.chainid, "chainname": this.chainlist.get(this.chainid) }];
        this.filteredServerSideChains.next(this.chainVal);
      }
      this.chaindata = data;

      if (data != null || data.length !== 0) {
        this.chaindata = data;
      }
      $('.overlay').hide();
    }, error => this.toasterservice.showError(error));

    $('.overlay').show();
    if (this.action == 'Add') {
      this.countryid = Number(this.locationdata_dict.country);
    } else {
      this.countryid = Number(this.local_data.SCardOrderShipmentCountry);
    }
    this._locationService.getAllCountry().subscribe(data => {


      for (let item in data['result']) {
        this.countryList.set(data['result'][item]['countryid'], data['result'][item]['countryname']);
      }
      //Assinging selected country  value to dropdown while edit loads   
      this.countryVal = [{ "countryid": this.countryid, "countryname": this.countryList.get(this.countryid) }];
      this.filteredServerSideCountry.next(this.countryVal);


      this.countrydata = data;
      if (data != null || data.length !== 0) {
        this.countrydata = data;
      }
      $('.overlay').hide();
    }, error => this.toasterservice.showError(error));

  }
  dropdownchanges() {

    /**** Auto Search chain  ******/
    this.chainFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searchingChain = true),
        takeUntil(this._onDestroyChain),
        debounceTime(200),
        map(search => {
          if (!this.chaindata) {
            return [];
          }

          return this.chaindata.result.filter(chainval =>
            chainval.chainname.toLowerCase().indexOf(search.toLowerCase()) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredChains => {

        if (filteredChains == null || filteredChains === 0 || filteredChains.length === 0) {
          this.noRecordFound = 0;
          this.filteredServerSideChains.next(filteredChains);
        } else {
          this.noRecordFound = 1;
          this.searchingChain = false;
          this.filteredServerSideChains.next(filteredChains);
        }

      },
        error => {
          this.searchingChain = false;
          this.toasterservice.showError(error);
        });

    /** Auto Search chain Move **/
    /**** Auto Search country  ******/
    this.countryFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searchingCountry = true),
        takeUntil(this._onDestroyCountry),
        debounceTime(200),
        map(search => {
          if (!this.countrydata) {
            return [];
          }
          return this.countrydata.result.filter(countryval => countryval.countryname.toLowerCase().indexOf(search.toLowerCase()) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredcountry => {

        if (filteredcountry == null || filteredcountry === 0 || filteredcountry.length === 0) {
          this.noRecordFound = 0;
          this.filteredServerSideCountry.next(filteredcountry);
        } else {
          this.noRecordFound = 1;
          this.searchingCountry = false;
          this.filteredServerSideCountry.next(filteredcountry);
        }
      },
        error => {
          this.searchingCountry = false;
          this.toasterservice.showError(error);
        });

    /** Auto Search country  **/

  }

  ngOnInit() {

    this.buttondisabled = false;
    this._id = this.route.snapshot.paramMap.get("id");

    this.fetchDetailsDropdown();


    if (this.local_data.action == 'Add') {
      this.SCardOrderShipmentPostalCode = this.locationdata_dict.postcode;
      this.SCardOrderShipmentStreet = this.locationdata_dict.streetname;
      this.SCardOrderShipmentHouseNo = this.locationdata_dict.housenumber;
      this.SCardOrderShipmentHouseNoExt = this.locationdata_dict.housenumberaddition;
      this.SCardOrderShipmentCity = this.locationdata_dict.city;
      this.populateformdropdown();

      //this.countryid = Number(this.local_data.SCardOrderShipmentCountry);

      this.scratchcardcreateform = this.formBuilder.group({
        SCardContactid:['',Validators.required],
        SCardContactPersonTelephone: [''],
        SCardContactPersonEmail: [''],
        SCardContactPersonFunction: [''],
        customerid: this.locationid,
        description: [''],
        ponumber: ['', Validators.pattern('^[a-zA-Z0-9- \.]+$')],
        facturatie_status: [''],
        customerremarks: [''],
        ordertrackcode: [''],
        SCardOrderCatRefID: [''],
        SCardOrderQuantity: ['', [Validators.required, Validators.min(1), Validators.max(5000)]],
        SCardOrderCardType: ['', Validators.required],
        SCardOrderRestrictionOnLocation: ['', Validators.required],
        SCardOrderActivateOnShipment: ['', Validators.required],
        SCardOrderActivationDate: [''],
        SCardOrderValidForLocation: [''],
        SCardOrderShipmentMode: ['', Validators.required],
        SCardOrderShipmentTAV: [''],
        SCardOrderShipmentStreet: [''],
        SCardOrderShipmentHouseNo: [''],
        SCardOrderShipmentHouseNoExt: [''],
        SCardOrderShipmentPostalCode: [''],
        SCardOrderShipmentCity: [''],
        SCardOrderShipmentCountry: [''],
        SCardOrderShipmentEmail: ['', Validators.email],
        SCardOrderTypeKraskaartID: [''],
        orderstate: ['101'],
        SCardOrderTotalPrice: [''],
        SCardOrderRTLMemoline: [''],
        SCardOrderPrice: ['', [Validators.required, Validators.pattern('([0-9]{1}[0-9]{0,3}|[0-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[0]{1}[,.][0-9]{1}[1-9]{1}|[0]{1}[,.][1-9]{1}[0-9]{1}|[0]{1}[,.][1-9]{1})')]],
        SCardStartNumber: '',
        SCardEndNumber: ''
      });

      var crdate = moment().format('YYYY-MM-DD');
      var ordertype = 'add';
      this.getProductCatalogueFilterByDate(crdate, ordertype);
      this.scratchcardcreateform.get('facturatie_status').setValue('Ready');
      this.caculateAmountAdd();
    } else if (this.local_data.action == 'Update') {

      this.SCardOrderShipmentPostalCode = this.local_data.SCardOrderShipmentPostalCode;
      this.SCardOrderShipmentStreet = this.local_data.SCardOrderShipmentStreet;
      this.SCardOrderShipmentHouseNo = this.local_data.SCardOrderShipmentHouseNo;
      this.SCardOrderShipmentHouseNoExt = this.local_data.SCardOrderShipmentHouseNoExt;
      this.SCardOrderShipmentCity = this.local_data.SCardOrderShipmentCity;

      this.populateformdropdown();

      this._orderservice.getAtrbval(this.local_data.id).subscribe(data => {

        for (let item in data) {
          this.orderattributevalue.set(data[item]['orderattribute'], data[item]['id']);
        }

      }, error => this.toasterservice.showError(error));


      this.scratchcardcreateform = this.formBuilder.group({
        SCardContactid:[Number(this.local_data.SCardContactid),Validators.required],
        SCardContactPersonTelephone: [this.local_data.SCardContactPersonTelephone],
        SCardContactPersonEmail: [this.local_data.SCardContactPersonEmail],
        SCardContactPersonFunction: [this.local_data.SCardContactPersonFunction],
        customerid: this.locationid,
        description: [''],
        ponumber: ['', Validators.pattern('^[a-zA-Z0-9- \.]+$')],
        facturatie_status: [''],
        customerremarks: [''],
        ordertrackcode: [''],
        SCardOrderCatRefID: [''],
        SCardOrderQuantity: ['', [Validators.required, Validators.pattern('^[0-9- \.]+$')]],
        SCardOrderCardType: ['', Validators.required],
        SCardOrderRestrictionOnLocation: ['', Validators.required],
        SCardOrderActivateOnShipment: ['', Validators.required],
        SCardOrderActivationDate: [''],
        SCardOrderValidForLocation: [''],
        SCardOrderShipmentMode: ['', Validators.required],
        SCardOrderShipmentTAV: [''],
        SCardOrderShipmentStreet: [''],
        SCardOrderShipmentHouseNo: [''],
        SCardOrderShipmentHouseNoExt: [''],
        SCardOrderShipmentPostalCode: [''],
        SCardOrderShipmentCity: [''],
        SCardOrderShipmentCountry: [''],
        SCardOrderShipmentEmail: ['', Validators.email],
        SCardOrderTypeKraskaartID: [''],
        orderstate: [''],
        SCardOrderTotalPrice: [''],
        SCardOrderRTLMemoline: [''],
        SCardOrderPrice: ['', [Validators.required, Validators.pattern('([0-9]{1}[0-9]{0,3}|[0-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[0]{1}[,.][0-9]{1}[1-9]{1}|[0]{1}[,.][1-9]{1}[0-9]{1}|[0]{1}[,.][1-9]{1})')]],
        SCardStartNumber: [''],
        SCardEndNumber: [''],

      });
      if (this.local_data.orderstate == 106) {  //Display secion to add scracth card number
        const scardStartNumber = this.scratchcardcreateform.get('SCardStartNumber');
        const scardEndNumber = this.scratchcardcreateform.get('SCardEndNumber');
        scardStartNumber.setValidators([Validators.required]);
        scardEndNumber.setValidators([Validators.required]);
        scardStartNumber.updateValueAndValidity();
        scardEndNumber.updateValueAndValidity();
        this.scratchcardstartreadonly = false;
        this.scratchcardbuttondisplay = true;
      }
      this.selectActivation(this.local_data.SCardOrderActivateOnShipment);
      this.selectRestrictionOnLocation(this.local_data.SCardOrderRestrictionOnLocation);
      var ordertype = 'add';
      var crdate = formatDate(this.local_data.creationdateEdit, 'yyyy-MM-dd', 'en-US');
      this.getProductCatalogueFilterByDate(crdate, ordertype);
      this.scratchcardcreateform.get('facturatie_status').setValue('Ready');
      this.selectShipmentMode(this.local_data.SCardOrderShipmentMode);
      this.caculateAmountAdd();
      this.populatestate();

    } else if (this.local_data.action == 'UpdateStatus') {


      this.populateformdropdown();

      this.scratchcardcreateform = this.formBuilder.group({

        orderstate: ['', Validators.required],

      });

    }
  }

  ngAfterViewInit(): void {
    this.dropdownchanges();
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onSubmit(form: NgForm) {
    if (this.scratchcardcreateform.invalid) {

      const invalid = [];
      const controls = this.scratchcardcreateform.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      this.buttondisabled = false;
      return invalid;
    }

    //let extraOrderFields = ['ZTVCWEndDate', 'ZTVTTDate', 'ZTVNoticePeriod', 'ZTVCTFineSystem', 'ZTVCTFineUser'];
    this.buttondisabled = true;
    this.jsonArray = form.value;
    this.jstoday = moment().format('YYYY-MM-DD HH:mm:ss');

    if (this.scratchcardcreateform.get('SCardOrderActivationDate').value == '' || this.scratchcardcreateform.get('SCardOrderActivationDate').value == null) {
      this.scratchcardcreateform.get('SCardOrderActivationDate').setValue(null);
    } else {
      this.scratchcardcreateform.get('SCardOrderActivationDate').setValue(this.transformDate(this.scratchcardcreateform.get('SCardOrderActivationDate').value));
    }

    if (this.scratchcardcreateform.get('SCardOrderPrice').value != '' && this.scratchcardcreateform.get('SCardOrderPrice').value != undefined) {
      //Always storing prices with 2 decimal 
      this.scratchcardcreateform.get('SCardOrderPrice').setValue(parseFloat(this.scratchcardcreateform.get('SCardOrderPrice').value.replace(',', ".")).toFixed(2).toString().replace('.', ","));
    }

    this.orderbase = [
      {
        hstorderid: '',
        orderstatus: '2',
        orderstate: '101',
        remarks: (this.scratchcardcreateform.get('description').value == '') ? '' : this.scratchcardcreateform.get('description').value.toString().trim(),
        creationdate: this.jstoday,
        updationdate: null,
        ponumber: (this.scratchcardcreateform.get('ponumber').value == '') ? '' : this.scratchcardcreateform.get('ponumber').value.toString().trim(),
        ordertype: '1',
        locationid: this.locationid,
        productcatalogueid: this.scratchcardcreateform.get('SCardOrderCatRefID').value,
        productcataloguegroup: 1,
        billingstartdate: null,
        billingstatus: (this.scratchcardcreateform.get('facturatie_status').value == '') ? '' : this.scratchcardcreateform.get('facturatie_status').value.toString().trim(),
        ordertrackcode: this.scratchcardcreateform.get('ordertrackcode').value,
        customerremarks: this.scratchcardcreateform.get('customerremarks').value,
      }
    ];

    this.counter = 0;
    Object.keys(this.scratchcardcreateform.controls).forEach(key => {
      if (key == 'SCardOrderQuantity' || key == 'SCardOrderCardType' || key == 'SCardOrderRestrictionOnLocation' ||
        key == 'SCardOrderActivateOnShipment' || key == 'SCardOrderActivationDate' || key == 'SCardOrderValidForLocation' ||
        key == 'SCardOrderShipmentMode' || key == 'SCardOrderShipmentTAV' || key == 'SCardOrderShipmentStreet' || key == 'SCardOrderShipmentHouseNo' ||
        key == 'SCardOrderShipmentHouseNoExt' || key == 'SCardOrderShipmentPostalCode' ||
        key == 'SCardOrderShipmentCity' || key == 'SCardOrderShipmentCountry' ||
        key == 'SCardOrderShipmentEmail' || key == 'SCardOrderTypeKraskaartID' || key == 'SCardOrderPrice' ||
        key == 'SCardOrderTotalPrice' || key == 'SCardOrderRTLMemoline' || key == 'SCardStartNumber' || key == 'SCardEndNumber' ||
        key == 'SCardContactid' || key == 'SCardContactPersonTelephone' || key == 'SCardContactPersonEmail' || key == 'SCardContactPersonFunction'
        ) {
        this.order.push({
          id: '',
          orderattributevalue: (this.scratchcardcreateform.controls[key].value == null || this.scratchcardcreateform.controls[key].value == '') ? '' : this.scratchcardcreateform.controls[key].value.toString().trim(),
          orderattribute: this.orderattribute.get(key),
          orderattributename: key,
          orderbasef: this.orderbase[0]
        });

      }
    });

    this.order.sort(this.GetSortOrder("orderattribute"));
    this._orderservice.addOrder(JSON.stringify(this.order))
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }


  onUpdate(form: NgForm) {
    if (this.scratchcardcreateform.invalid) {

      const invalid = [];
      const controls = this.scratchcardcreateform.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }
      this.buttondisabled = false;
      return invalid;
    }

    this.buttondisabled = true;
    this.jsonArray = form.value;
    this.jstoday = moment().format('YYYY-MM-DD HH:mm:ss');

    if (this.scratchcardcreateform.get('SCardOrderActivationDate').value == '' || this.scratchcardcreateform.get('SCardOrderActivationDate').value == null) {
      this.scratchcardcreateform.get('SCardOrderActivationDate').setValue(null);
    } else {
      this.scratchcardcreateform.get('SCardOrderActivationDate').setValue(this.transformDate(this.scratchcardcreateform.get('SCardOrderActivationDate').value));
    }



    this.orderbase = [
      {
        hstorderid: this.local_data.orderid,
        orderstatus: this.local_data.orderstatus,
        remarks: (this.scratchcardcreateform.get('description').value == '') ? '' : this.scratchcardcreateform.get('description').value.toString().trim(),
        creationdate: this.local_data.creationdateEdit,
        updationdate: this.jstoday,
        ponumber: (this.scratchcardcreateform.get('ponumber').value == '') ? '' : this.scratchcardcreateform.get('ponumber').value.toString().trim(),
        ordertype: '1',
        locationid: this.locationid,
        productcatalogueid: this.scratchcardcreateform.get('SCardOrderCatRefID').value,
        productcataloguegroup: 1,
        billingstartdate: null,
        billingstatus: this.local_data.billingstatus,
        ordertrackcode: this.scratchcardcreateform.get('ordertrackcode').value,
        customerremarks: this.scratchcardcreateform.get('customerremarks').value,
        orderstate: this.scratchcardcreateform.get('orderstate').value,
      }
    ];

    this.counter = 0;
    Object.keys(this.scratchcardcreateform.controls).forEach(key => {
      if (key == 'SCardOrderQuantity' || key == 'SCardOrderCardType' || key == 'SCardOrderRestrictionOnLocation' ||
        key == 'SCardOrderActivateOnShipment' || key == 'SCardOrderActivationDate' || key == 'SCardOrderValidForLocation' ||
        key == 'SCardOrderShipmentMode' || key == 'SCardOrderShipmentTAV' || key == 'SCardOrderShipmentStreet' || key == 'SCardOrderShipmentHouseNo' ||
        key == 'SCardOrderShipmentHouseNoExt' || key == 'SCardOrderShipmentPostalCode' ||
        key == 'SCardOrderShipmentCity' || key == 'SCardOrderShipmentCountry' ||
        key == 'SCardOrderShipmentEmail' || key == 'SCardOrderTypeKraskaartID' || key == 'SCardOrderPrice' ||
        key == 'SCardOrderTotalPrice' || key == 'SCardOrderRTLMemoline' || key == 'SCardStartNumber' || key == 'SCardEndNumber' || 
        key == 'SCardContactid' || key == 'SCardContactPersonTelephone' || key == 'SCardContactPersonEmail' || key == 'SCardContactPersonFunction'
        ) {
        this.order.push({
          id: this.orderattributevalue.get(this.orderattribute.get(key)),
          orderattributevalue: (this.scratchcardcreateform.controls[key].value == '' || this.scratchcardcreateform.controls[key].value == null) ? '' : this.scratchcardcreateform.controls[key].value.toString().trim(),
          orderattribute: this.orderattribute.get(key),
          orderattributename: key,
          orderbasef: this.orderbase[0]
        });

      }
    });
    let chain_name = '';
    let country_name = '';
    let retrictionCheckedOnLocation = '';
    let ordershipment_name = '';
    let activationonshipment = '';
    let productcataloguename = '';
    retrictionCheckedOnLocation = this.orderrestrictOnLocation.find(r =>
      r.attrname == 'SCardOrderRestrictionOnLocation' && r.id == this.scratchcardcreateform.get('SCardOrderRestrictionOnLocation').value
    ).name;


    /*this.orderstatus_name =  this.issueAllState.find(r =>
       r.value == this.local_data.orderstatus
    ).name;*/

    /*this.orderstatus_name =  this.ordertypeList.find(r =>
      r.attrname == 'SCardOrderStatus' && r.id == product.orderstatus
    ).name;*/

    productcataloguename = this.cataloguepropertybygroupList.find((r: { catalogueproperty: string; cataloguepropertygroup: string; cataloguepropertytype: string; cataloguepropertyvalue: string; }) =>
      r.catalogueproperty == 'productname' && r.cataloguepropertygroup == '1' && r.cataloguepropertytype == '1' &&
      r.cataloguepropertyvalue == this.scratchcardcreateform.get('SCardOrderTypeKraskaartID').value
    ).cataloguepropertyname;

    this.ordertypename = this.ordertypeList.find(r =>
      r.attrname == 'SCardOrderType' && r.id == "1"
    ).name;

    ordershipment_name = this.ordershipmentMode.find(r =>
      r.attrname == 'SCardOrderShipmentMode' && r.id == this.scratchcardcreateform.get('SCardOrderShipmentMode').value
    ).name;

    if (this.scratchcardcreateform.get('SCardOrderValidForLocation').value) {
      chain_name = this.orderChainList.result.find(r =>
        r.chainid == this.scratchcardcreateform.get('SCardOrderValidForLocation').value
      ).chainname;
    }

    activationonshipment = this.orderActvateOnDelivery.find(r =>
      r.attrname == 'SCardOrderActivateOnShipment' && r.id == this.scratchcardcreateform.get('SCardOrderActivateOnShipment').value
    ).name;

    country_name = (this.scratchcardcreateform.get('SCardOrderShipmentCountry').value) ?
      this.countryList.get(this.scratchcardcreateform.get('SCardOrderShipmentCountry').value) : '';

    var updateDateformat = moment().format('DD-MM-YYYY');
    this.orderFormUpdatedValue.push({
      id: this.local_data.id,

      antal: this.scratchcardcreateform.get('SCardOrderQuantity').value,
      opmerking: this.scratchcardcreateform.get('description').value,
      customerremarks: this.scratchcardcreateform.get('customerremarks').value,
      updationdate: updateDateformat,
      billingstartdate: null,
      billingstartdateEdit: null,
      creationdate: this.local_data.creationdate,
      creationdateEdit: this.local_data.creationdateEdit,
      billingstatus: this.local_data.billingstatus,

      productcatalogue: this.scratchcardcreateform.get('SCardOrderCatRefID').value,
      orderid: this.local_data.orderid,
      ordertype: "1",

      orderstatus: this.local_data.orderstatus,
      kraskaarttype: productcataloguename,
      //orderstatusname: this.orderstatus_name,
      ordertypename: this.ordertypename,
      SCardOrderRestrictionOnLocationName: retrictionCheckedOnLocation,
      SCardOrderActivateOnShipmentName: activationonshipment,
      SCardOrderValidForLocationName: chain_name,
      SCardOrderShipmentCountryName: country_name,
      SCardOrderShipmentModeName: ordershipment_name,

      ordertrackcode: this.scratchcardcreateform.get('ordertrackcode').value,
      SCardOrderActivationDateShow: this.scratchcardcreateform.get('SCardOrderActivationDate').value ? formatDate(this.scratchcardcreateform.get('SCardOrderActivationDate').value, 'dd-MM-yyyy', 'en-US') : '',
      SCardOrderQuantity: this.scratchcardcreateform.get('SCardOrderQuantity').value,
      SCardOrderCardType: this.scratchcardcreateform.get('SCardOrderCardType').value,
      SCardOrderRestrictionOnLocation: this.scratchcardcreateform.get('SCardOrderRestrictionOnLocation').value,
      SCardOrderActivateOnShipment: this.scratchcardcreateform.get('SCardOrderActivateOnShipment').value,
      SCardOrderActivationDate: this.scratchcardcreateform.get('SCardOrderActivationDate').value,
      SCardOrderValidForLocation: this.scratchcardcreateform.get('SCardOrderValidForLocation').value,
      SCardOrderShipmentMode: this.scratchcardcreateform.get('SCardOrderShipmentMode').value,
      SCardOrderShipmentTAV: this.scratchcardcreateform.get('SCardOrderShipmentTAV').value,
      SCardOrderShipmentStreet: this.scratchcardcreateform.get('SCardOrderShipmentStreet').value,
      SCardOrderShipmentHouseNo: this.scratchcardcreateform.get('SCardOrderShipmentHouseNo').value,
      SCardOrderShipmentHouseNoExt: this.scratchcardcreateform.get('SCardOrderShipmentHouseNoExt').value,
      SCardOrderShipmentPostalCode: this.scratchcardcreateform.get('SCardOrderShipmentPostalCode').value,
      SCardOrderShipmentCity: this.scratchcardcreateform.get('SCardOrderShipmentCity').value,
      SCardOrderShipmentCountry: this.scratchcardcreateform.get('SCardOrderShipmentCountry').value,
      SCardOrderShipmentEmail: this.scratchcardcreateform.get('SCardOrderShipmentEmail').value,
      SCardOrderTypeKraskaartID: this.scratchcardcreateform.get('SCardOrderTypeKraskaartID').value,
      SCardOrderRTLMemoline: this.scratchcardcreateform.get('SCardOrderRTLMemoline').value,
      SCardOrderPrice: this.scratchcardcreateform.get('SCardOrderPrice').value,
      SCardOrderTotalPrice: this.scratchcardcreateform.get('SCardOrderTotalPrice').value,
    });

    this.order.sort(this.GetSortOrder("orderattribute"));
    this._orderservice.updateOrder(JSON.stringify(this.order), this.local_data.id)
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Update', data: this.orderFormUpdatedValue });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }

  onUpdateStatus(form: NgForm) {
    if (this.scratchcardcreateform.invalid) {
      return;
    }
    var orderproductjson: {};
    this.buttondisabled = true;
    var orderstat = '';
    orderproductjson = {
      'antal': this.local_data.antal,
      'validAt_id': (this.local_data.SCardOrderValidForLocation) ? this.local_data.SCardOrderValidForLocation : 0,
      'orderid': this.local_data.id,
      'status': 1,
      'producttypeid': this.local_data.SCardOrderCardType,
      'price': this.local_data.SCardOrderPrice,
      'totalprice': this.local_data.SCardOrderTotalPrice
    }

    let orderstatusname = this.ordertypeList.find(r =>
      r.attrname == 'SCardOrderStatus' && r.id == this.scratchcardcreateform.get('orderstate').value
    ).name;

    this.orderStatusUpdate.push({
      id: this.local_data.id,
      orderstatus: this.scratchcardcreateform.get('orderstate').value,
      productid: 0,
      orderdata: orderproductjson
    });

    this.orderFormUpdateStatusValue.push({
      orderstatus: this.scratchcardcreateform.get('orderstate').value,
      orderstatusname: orderstatusname
    });

    this._orderservice.UpdateOrderStatusGenerateProduct(this.local_data.id, JSON.stringify(this.orderStatusUpdate))
      .subscribe(res => {
        if (res['message'] != undefined) {
          this.toasterservice.showErrorOrderCompletion(res['message']);
          this.dialogRef.close({ event: 'Cancel' });
        } else {
          this.dialogRef.close({ event: 'UpdateStatus', data: this.orderFormUpdateStatusValue });
        }
        this.buttondisabled = false;
      }, (err) => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      }
      );
  }

  selectShipmentMode(changedValue) {
    if (changedValue.toString() == '1') {

      this.shipmentmail = false;
      this.shipmentpost = true;
      this.scratchcardcreateform.get('SCardOrderShipmentEmail').setValue('');
      if (this.local_data.action == 'Add') {
        this.SCardOrderShipmentPostalCode = this.locationdata_dict.postcode;
        this.SCardOrderShipmentStreet = this.locationdata_dict.streetname;
        this.SCardOrderShipmentHouseNo = this.locationdata_dict.housenumber;
        this.SCardOrderShipmentHouseNoExt = this.locationdata_dict.housenumberaddition;
        this.SCardOrderShipmentCity = this.locationdata_dict.city;
        this.countryid = Number(this.locationdata_dict.country);
      } else {
        this.SCardOrderShipmentPostalCode = (this.local_data.SCardOrderShipmentPostalCode) ? (this.local_data.SCardOrderShipmentPostalCode) :
          ((this.locationdata_dict.postcode) ? (this.locationdata_dict.postcode) : (''));
        this.SCardOrderShipmentStreet = (this.local_data.SCardOrderShipmentStreet) ? (this.local_data.SCardOrderShipmentStreet) :
          ((this.locationdata_dict.streetname) ? (this.locationdata_dict.streetname) : (''));
        this.SCardOrderShipmentHouseNo = (this.local_data.SCardOrderShipmentHouseNo) ? (this.local_data.SCardOrderShipmentHouseNo) :
          ((this.locationdata_dict.housenumber) ? (this.locationdata_dict.housenumber) : (''));
        this.SCardOrderShipmentHouseNoExt = (this.local_data.SCardOrderShipmentHouseNoExt) ? (this.local_data.SCardOrderShipmentHouseNoExt) :
          ((this.locationdata_dict.housenumberaddition) ? (this.locationdata_dict.housenumberaddition) : (''));
        this.SCardOrderShipmentCity = (this.local_data.SCardOrderShipmentCity) ? (this.local_data.SCardOrderShipmentCity) :
          ((this.locationdata_dict.city) ? (this.locationdata_dict.city) : (''));
        //this.countryid = Number(this.local_data.SCardOrderShipmentCountry);

        this.countryid = (this.local_data.SCardOrderShipmentCountry) ? Number(this.local_data.SCardOrderShipmentCountry) :
          ((this.locationdata_dict.country) ? Number(this.locationdata_dict.country) : (''));

      }

    } else {
      this.shipmentmail = true;
      this.shipmentpost = false;
      this.scratchcardcreateform.get('SCardOrderShipmentEmail').setValue('');
      this.scratchcardcreateform.get('SCardOrderShipmentPostalCode').setValue('');
      this.scratchcardcreateform.get('SCardOrderShipmentCity').setValue('');
      this.scratchcardcreateform.get('SCardOrderShipmentStreet').setValue('');
      this.scratchcardcreateform.get('SCardOrderShipmentHouseNo').setValue('');
      this.scratchcardcreateform.get('SCardOrderShipmentHouseNoExt').setValue('');
      this.scratchcardcreateform.get('SCardOrderShipmentCountry').setValue('');

    }
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
          this.scratchcardcreateform.patchValue({
            SCardContactid: Number(newContactId)
          })
      }, error => this.toasterservice.showError(error));
  }

  selectCustomerContact(customercontactid) {
    let selectedcontactperson = this.customercontactList.find(r => r.id == customercontactid
    );
    this.scratchcardcreateform.get('SCardContactPersonEmail').setValue(selectedcontactperson.contactpersonemail);
    this.scratchcardcreateform.get('SCardContactPersonTelephone').setValue(selectedcontactperson.contactpersontelephone);
    this.scratchcardcreateform.get('SCardContactPersonFunction').setValue(selectedcontactperson.contactpersonfunction);

  }

  populateformdropdown() {

    this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;

        if (this.local_data.action == 'Update') {
          this.selectCustomerContact(Number(this.local_data.SCardContactid));
        }
      }, error => this.toasterservice.showError(error));

    this._scratchservice.cataloguepropertybygroup('1').subscribe(data3 => {
      this.cataloguepropertybygroupList = data3;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this._orderservice.getAtrbe(1).subscribe(data => {
      for (let item in data) {
        this.orderattribute.set(data[item]['attributename'], data[item]['id']);
      }
      this.buttondisabled = false;
    }, error => this.toasterservice.showError(error));


    this._scratchservice.getOrderPropertyByCatalogue(1).subscribe(res => {
      this.ordertypeList = res;

      this.SCardOrderStatus = this.ordertypeList.filter(r =>
        r.attrname == 'SCardOrderStatus' && (r.id != 7 && r.id != 9)
      );

      this.orderrestrictOnLocation = this.ordertypeList.filter(r =>
        r.attrname == 'SCardOrderRestrictionOnLocation'
      );

      this.SCardOrderType = this.ordertypeList.filter(r =>
        r.attrname == 'SCardOrderType'
      );

      this.ordershipmentMode = this.ordertypeList.filter(r =>
        r.attrname == 'SCardOrderShipmentMode'
      );

      this.orderActvateOnDelivery = this.ordertypeList.filter(r =>
        r.attrname == 'SCardOrderActivateOnShipment'
      );

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });


    this._locationService.getAllChain().subscribe(reschain => {
      this.orderChainList = reschain;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
  }

  populatestate() {
    this.userrole = '01000010';

    this._orderservice.getScartchCardOrderNextStateProperty(this.local_data.orderstate).subscribe(data => {
      this.ordernextstateList = data;
      this.hasnextstateid = (data.length > 0) ? data[0].nextstate_id : 0;
      this.customissuestate.push({
        id: Number(this.ordernextstateList[0].currentstate_id),
        name: this.ordernextstateList[0].currentstatename
      });
      for (let state of this.ordernextstateList) {
        this.customissuestate.push({
          id: Number(state.nextstate_id),
          name: state.nextstatename
        });

      }
      this.selectedState = this.local_data.orderstate;
	  this.scratchcardcreateform.patchValue({
        orderstate: Number(this.local_data.orderstate)
        })
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

  }

  public hasError = (controlName: string, errorName: string) => {
    return this.scratchcardcreateform.controls[controlName].hasError(errorName);
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

  caculateAmountAdd() {
    var SCardOrderQuantity = this.scratchcardcreateform.get('SCardOrderQuantity');
    var SCardOrderPrice = this.scratchcardcreateform.get('SCardOrderPrice');
    var SCardOrderTotalPrice = this.scratchcardcreateform.get('SCardOrderTotalPrice');
    this.calculateAmount(SCardOrderQuantity, SCardOrderPrice, SCardOrderTotalPrice);
  }

  calculateAmount(SCardOrderQuantity: AbstractControl, SCardOrderPrice: AbstractControl, SCardOrderTotalPrice: AbstractControl) {
    SCardOrderQuantity.valueChanges
      .subscribe(() => {
        if (SCardOrderQuantity.value != undefined) {
          if (SCardOrderPrice.value != undefined) {
            SCardOrderTotalPrice.setValue((Number(SCardOrderQuantity.value) * Number(SCardOrderPrice.value.replace(',', '.'))).toFixed(2).toString().replace('.', ','));
          } else {
            SCardOrderTotalPrice.setValue(SCardOrderQuantity.value);
          }
        }
      }, error => this.toasterservice.showError(error));
    SCardOrderPrice.valueChanges
      .subscribe(() => {
        if (SCardOrderPrice.value != undefined) {
          if (SCardOrderQuantity.value != undefined) {
            SCardOrderTotalPrice.setValue((Number(SCardOrderQuantity.value) * Number(SCardOrderPrice.value.replace(',', '.'))).toFixed(2).toString().replace('.', ','));
          } else {
            SCardOrderTotalPrice.setValue(SCardOrderPrice.value.replace('.', ','));
          }
        }
      }, error => this.toasterservice.showError(error));
  }

  async checkScratchCardAlreadyExist() {
    var startnumber = this.scratchcardcreateform.get('SCardStartNumber');
    if (startnumber.value.length != 5 && startnumber.value.length != 8) {
      this.toasterservice.showErrorOrderCompletion(startnumber.value + ' is geen geldig productnummer.Productnummer bestaat uit 5 of 8 tekens');
      startnumber.setValue('');
      return
    }
    var endnumber = this.scratchcardcreateform.get('SCardEndNumber');
    let resOrder = await this._scratchservice.checkScratchCardAlreadyExist(startnumber.value);
    if (resOrder['message'] != undefined) {
      this.scratchcardstartreadonly = false;
      this.toasterservice.showErrorOrderCompletion(resOrder['message']);
      startnumber.setValue('');
      endnumber.setValue('');
      return
    } else {
      this.scratchcardstartreadonly = true;
      var amount = this.scratchcardcreateform.get('SCardOrderQuantity').value;
      endnumber.setValue(Number(startnumber.value) + Number(amount) - 1);
    }
  }

  getProductCatalogueFilterByDate(creationdate: string, type: string) {

    this.productservice.getProductCatalogueFilterByDate('1', creationdate, type, this.location_parentcustomerid).subscribe(data => {
      this.catalogueProperty = data;
      // While opening new access add dialog
      /*this.productnameList = this.catalogueProperty.filter((r: { productgroup: string; producttype: string; productuserrole:any[] }) => r.productgroup == '1'
        && r.producttype == '1' && r.productuserrole!==null && r.productuserrole.includes(this.loggedinuserrole)
      );
      if(this.productnameList.length == 0){
        this.productnameList = this.catalogueProperty.filter((r: { productgroup: string; producttype: string }) => r.productgroup == '1'
          && r.producttype == '1' 
        );
      }*/
      this.productnameList = this.catalogueProperty.filter((r: { productgroup: string; producttype: string }) => r.productgroup == '1'
        && r.producttype == '1'
      );


      this.orderaddonlist = this.catalogueProperty.filter((r: { productgroup: string; producttype: string; }) => r.productgroup == '1'
        && r.producttype == '2'
      );

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
  }

  selectTypePlan(productnameid) {

    this.mainselectedpriceplan = this.catalogueProperty.find(r => r.productgroup == '1'
      && r.producttype == '1' && r.productname == productnameid
    );
    this.scratchcardcreateform.get('SCardOrderPrice').setValue(this.mainselectedpriceplan.productprice);
    this.scratchcardcreateform.get('SCardOrderTypeKraskaartID').setValue(this.mainselectedpriceplan.productname);
    this.scratchcardcreateform.get('SCardOrderCatRefID').setValue(this.mainselectedpriceplan.id);
    this.scratchcardcreateform.get('SCardOrderRTLMemoline').setValue(this.mainselectedpriceplan.rtlmemoline);
  }

  selectRestrictionOnLocation(checkValue) {

    if (checkValue == '1') {
      this.isRestrictionOnChain = true;
    } else {
      this.isRestrictionOnChain = false;
      this.scratchcardcreateform.get('SCardOrderValidForLocation').setValue('');
    }

  }

  selectActivation(checkValue) {
    if (checkValue == '1') {
      this.isActivation = true;
    } else {
      this.isActivation = false;
      this.scratchcardcreateform.get('SCardOrderActivationDate').setValue(null);
    }
  }


  dateValidation() {
    var SCardOrderActivationDate = this.scratchcardcreateform.get('SCardOrderActivationDate');
    if (SCardOrderActivationDate.value != '' && SCardOrderActivationDate.value != null) {
      SCardOrderActivationDate.setValidators([DateValidator.dateVaidator]);
      SCardOrderActivationDate.updateValueAndValidity();
    } else {
      SCardOrderActivationDate.setValue('');
      SCardOrderActivationDate.clearValidators();
      SCardOrderActivationDate.updateValueAndValidity();
    }
  }

  clearScratchCardNumber() {
    this.scratchcardstartreadonly = false;
    var startnumber = this.scratchcardcreateform.get('SCardStartNumber');
    var endnumber = this.scratchcardcreateform.get('SCardEndNumber');
    startnumber.setValue('');
    endnumber.setValue('');
  }

  getScratchCardEndNumber() {
    this.checkScratchCardAlreadyExist();
  }

}