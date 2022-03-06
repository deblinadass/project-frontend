import { Component, Inject, Optional, Input, OnInit } from '@angular/core';
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
import { Order, Orderbase, OrderStatusUpdate } from '../newhotspotsconnectiondialog-box/hotspots';
//import { DateValidator } from '../_shared/date.validator';
import { ScratchService } from '../_services/scratch.service';

import { Observable } from 'rxjs';
import { CommonService } from '../_services/common.service';
import { CustomerContactdialogBoxComponent } from '../customercontactdialog-box/customercontactdialog-box.component';
import { MatDialog } from '@angular/material/dialog';
moment.tz.setDefault('Europe/Amsterdam');
declare var jQuery: any;
declare const editClick: any;
declare var $: any;

@Component({
  selector: 'app-multiservice-ssid',
  templateUrl: './multiservice-ssid.component.html',
  styleUrls: ['./multiservice-ssid.component.scss']
})

export class MultiserviceSsidComponent implements OnInit {

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
  orderbase: any[];
  orderStatusUpdate: OrderStatusUpdate[] = [];
  orderattribute = new Map<string, string>();
  orderattributevalue = new Map<string, string>();
  productattributelist = new Map<string, string>();
  orderFormUpdatedValue: any[] = [];
  orderFormUpdateStatusValue: any[] = [];
  orderActvateOnDelivery: any[];
  orderrestrictOnLocation: any[];
  MultiServiceTypeList: any[];
  isplandateedit;


  isConn;

  SSIDcreateform: FormGroup;
  orderChainList: any;
  ordertypeList: any[];
  orderstatusList;
  MultiServiceSOConnectionList;
  MultiServiceCablingList;
  MultiServiceSOStartpacketList;
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
  countryList = new Map<string, string>();
  countryid;
  countryVal;
  loggedinuserrole;
  MultiServiceAllState;
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
    public dialogRef: MatDialogRef<MultiserviceSsidComponent>,
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
    this.tabSectionList = this._commonService.getSectionList('MultiserviceTab');
    this.tabSectionListContact = this._commonService.getSectionList('Contact');

  }



  ngOnInit() {

    this.buttondisabled = false;
    this._id = this.route.snapshot.paramMap.get("id");

    if (this.local_data.action == 'Add') {

      this.populateformdropdown();
      this.SSIDcreateform = this.formBuilder.group({
        /****** New Attr ******/
        customerid: this.locationid,
        MultiServiceContactid: ['', Validators.required],
        MultiServiceContactPerson: [''],
        MultiServiceContactPersonTelephone: [''],
        MultiServiceContactPersonEmail: [''],
        MultiServiceContactPersonFunction: [''],
        MultiServiceWishdate: ['', Validators.required],
        MultiServiceContractor: ['', Validators.required],
        MultiServiceChainid: [],
        SSIDname: [],
        MultiServiceSSIDDescription: [],
        MultiServiceProgressNotification: [''],
        description: [''],
        facturatie_status: [''],
        orderstatus: [''],
        orderstate: [''],
        /****** New Attr ******/

      });

      var crdate = moment().format('YYYY-MM-DD');
      var ordertype = 'add';
      // this.getProductCatalogueFilterByDate(crdate, ordertype);
      this.SSIDcreateform.get('facturatie_status').setValue('Ready');

    } else if (this.local_data.action == 'Update') {
      this.local_data.MultiServiceContactid = Number(this.local_data.MultiServiceContactid);
      this.local_data.MultiServiceContractor = Number(this.local_data.MultiServiceContractor);

      this.populateformdropdown();
      this.getOrderStateList();

      this._orderservice.getAtrbval(this.local_data.id).subscribe(data => {
        for (let item in data) {
          this.orderattributevalue.set(data[item]['orderattribute'], data[item]['id']);
        }

      });


      this.SSIDcreateform = this.formBuilder.group({
        /****** New Attr ******/
        customerid: this.locationid,
        MultiServiceContactid: [this.local_data.MultiServiceContactid, Validators.required],
        MultiServiceContactPerson: [this.local_data.MultiServiceContactPerson],
        MultiServiceContactPersonTelephone: [this.local_data.MultiServiceContactPersonTelephone],
        MultiServiceContactPersonEmail: [this.local_data.MultiServiceContactPersonEmail],
        MultiServiceContactPersonFunction: [this.local_data.MultiServiceContactPersonFunction],
        MultiServiceWishdate: [this.local_data.MultiServiceWishdateEdit, Validators.required],
        MultiServiceContractor: [this.local_data.MultiServiceContractor, Validators.required],
        MultiServiceChainid: [Number(this.local_data.MultiServiceChainid)],
        SSIDname: [this.local_data.SSIDname],
        MultiServiceSSIDDescription: [this.local_data.MultiServiceSSIDDescription],
        MultiServiceProgressNotification: [this.local_data.MultiServiceProgressNotification],
        description: [this.local_data.opmerking],
        facturatie_status: [this.local_data.billingstatus],
        orderstatus: [this.local_data.orderstatus],
        orderstate: [Number(this.local_data.orderstate)],
        /****** New Attr ******/

      });

      var ordertype = 'add';
      var crdate = formatDate(this.local_data.creationdateEdit, 'yyyy-MM-dd', 'en-US');
      // this.getProductCatalogueFilterByDate(crdate, ordertype);
      this.SSIDcreateform.get('facturatie_status').setValue('Ready');

    } else if (this.local_data.action == 'UpdateStatus') {

      //this.populatestate();
      this.populateformdropdown();

      this.SSIDcreateform = this.formBuilder.group({

        orderstate: ['', Validators.required],

      });

    }
  }

  ngAfterViewInit(): void {
    this.dropdownchanges();
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
    });
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
        });

  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onSubmit(form: NgForm) {
    if (this.SSIDcreateform.invalid) {

      const invalid = [];
      const controls = this.SSIDcreateform.controls;
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

    if (this.SSIDcreateform.get('MultiServiceWishdate').value == '' || this.SSIDcreateform.get('MultiServiceWishdate').value == null) {
      this.SSIDcreateform.get('MultiServiceWishdate').setValue(null);
    } else {
      this.SSIDcreateform.get('MultiServiceWishdate').setValue(this.transformDate(this.SSIDcreateform.get('MultiServiceWishdate').value));
    }

    this.orderbase = [
      {
        hstorderid: '',
        orderstatus: '',
        orderstate: '1',
        remarks: (this.SSIDcreateform.get('description').value == '') ? '' : this.SSIDcreateform.get('description').value.toString().trim(),
        creationdate: this.jstoday,
        updationdate: null,
        ponumber: '',
        ordertype: '1',
        locationid: this.locationid,
        productcatalogueid: 4,
        productcataloguegroup: 4,
        billingstartdate: null,
        isstartpaketactive: '',
        startpaketcatalogue: '',
        stratpaketname: '',
        isconnection: '',
        billingstatus: (this.SSIDcreateform.get('facturatie_status').value == '') ? '' : this.SSIDcreateform.get('facturatie_status').value.toString().trim(),
        bouwtype: 5, //New SSID
      }
    ];

    this.counter = 0;
    Object.keys(this.SSIDcreateform.controls).forEach(key => {
      if (key == 'MultiServiceContactid' || key == 'MultiServiceWishdate' ||
        key == 'MultiServiceContractor' || key == 'MultiServiceChainid' || key == 'SSIDname' || key == 'MultiServiceProgressNotification'
        || key == 'MultiServiceSSIDDescription') {
        this.order.push({
          id: '',
          orderattributevalue: (this.SSIDcreateform.get(key).value == null || this.SSIDcreateform.get(key).value == '') ? '' : this.SSIDcreateform.get(key).value.toString().trim(),
          orderattribute: this.orderattribute.get(key),
          orderbasef: this.orderbase[0]
        });
      }

    });
    this.order.sort(this.GetSortOrder("orderattribute"));
    this._orderservice.addOrderMultiService(JSON.stringify(this.order))
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, (err) => {
        this.buttondisabled = false;
      });
  }

  onUpdate(form: NgForm) {
    if (this.SSIDcreateform.invalid) {

      const invalid = [];
      const controls = this.SSIDcreateform.controls;
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

    if (this.SSIDcreateform.get('MultiServiceWishdate').value == '' || this.SSIDcreateform.get('MultiServiceWishdate').value == null) {
      this.SSIDcreateform.get('MultiServiceWishdate').setValue(null);
    } else {
      this.SSIDcreateform.get('MultiServiceWishdate').setValue(this.transformDate(this.SSIDcreateform.get('MultiServiceWishdate').value));
    }

    this.orderbase = [
      {
        hstorderid: this.local_data.orderid,
        orderstatus: '',
        orderstate: this.SSIDcreateform.get('orderstate').value ? this.SSIDcreateform.get('orderstate').value : this.local_data.orderstate,
        remarks: (this.SSIDcreateform.get('description').value == '') ? '' : this.SSIDcreateform.get('description').value.toString().trim(),
        creationdate: this.local_data.creationdateEdit,
        updationdate: this.jstoday,
        ponumber: '',
        ordertype: '1',
        locationid: this.locationid,
        productcatalogueid: 4,
        productcataloguegroup: 4,
        billingstartdate: null,
        isstartpaketactive: '',
        startpaketcatalogue: '',
        stratpaketname: '',
        isconnection: '',
        billingstatus: (this.SSIDcreateform.get('facturatie_status').value == '') ? '' : this.SSIDcreateform.get('facturatie_status').value.toString().trim(),

        bouwtype: 5, //ssid
      }
    ];

    this.counter = 0;
    Object.keys(this.SSIDcreateform.controls).forEach(key => {
      if (key == 'MultiServiceContactid' || key == 'MultiServiceWishdate' ||
        key == 'MultiServiceContractor' || key == 'MultiServiceChainid' || key == 'SSIDname' || key == 'MultiServiceProgressNotification'
        || key == 'MultiServiceSSIDDescription') {
        this.order.push({
          id: this.orderattributevalue.get(this.orderattribute.get(key)),
          orderattributevalue: (this.SSIDcreateform.get(key).value == null || this.SSIDcreateform.get(key).value == '') ? '' : this.SSIDcreateform.get(key).value.toString().trim(),
          orderattribute: this.orderattribute.get(key),
          orderbasef: this.orderbase[0]
        });
      }

    });
    var MultiServiceContractorName = this.SSIDcreateform.get('MultiServiceContractor').value ? this.communicationgroupList.find(r =>
      r.communicationvalue == this.SSIDcreateform.get('MultiServiceContractor').value
    ).communicationname : '';

    var orderstatename = this.bouwAllState.find(r =>
      r.value == this.SSIDcreateform.get('orderstate').value
    ).name;

    var orderstate = this.SSIDcreateform.get('orderstate').value ? this.SSIDcreateform.get('orderstate').value : this.local_data.orderstate;
    var updateDateformat = moment().format('DD-MM-YYYY');

    this.orderFormUpdatedValue.push({
      id: this.local_data.id,
      MultiServiceContactid: this.SSIDcreateform.get('MultiServiceContactid').value,
      MultiServiceContractor: this.SSIDcreateform.get('MultiServiceContractor').value,
      description: this.SSIDcreateform.get('description').value,
      MultiServiceContractorName: MultiServiceContractorName,
      MultiServiceWishdate: this.SSIDcreateform.get('MultiServiceWishdate').value ? formatDate(this.SSIDcreateform.get('MultiServiceWishdate').value, 'dd-MM-yyyy', 'en-US') : '',
      MultiServiceWishdateEdit: this.SSIDcreateform.get('MultiServiceWishdate').value,
      BOUWTypeName: this.local_data.bouwtype,
      MultiServiceChainid: this.SSIDcreateform.get('MultiServiceChainid').value,
      SSIDname: this.SSIDcreateform.get('SSIDname').value,
      MultiServiceSSIDDescription: this.SSIDcreateform.get('MultiServiceSSIDDescription').value,
      MultiServiceProgressNotification: this.SSIDcreateform.get('MultiServiceProgressNotification').value,
      orderstatename: orderstatename,
      orderstate: orderstate,

    });
    this.order.sort(this.GetSortOrder("orderattribute"));
    this._orderservice.updateOrderMultiService(JSON.stringify(this.order), this.local_data.id)
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Update', data: this.orderFormUpdatedValue });
      }, (err) => {
        this.buttondisabled = false;
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
    });

  }

  resetContactList(newContactId){
   this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;
        this.selectCustomerContact(Number(newContactId));
          this.SSIDcreateform.patchValue({
            MultiServiceContactid: Number(newContactId)
          })
      },
      err => console.error(err),
      () => console.log('')
    );
  }

  populateformdropdown() {
    this._orderservice.getBouwStateList().subscribe(data => {
      this.bouwAllState = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
    });

    this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;

        if (this.local_data.action == 'Update') {
          this.selectCustomerContact(Number(this.local_data.MultiServiceContactid));
        }
      },
      err => console.error(err),
      () => console.log('')
    );

    this.ticketservice.getCommunicationgroupByID(5).subscribe(data => {
      this.communicationgroupList = data;

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
    });

    //$('.overlay').show();
    this._locationService.getAllChain().subscribe(data => {
      if (this.action == 'Update') {
        for (let item in data['result']) {
          this.chainlist.set(data['result'][item]['chainid'], data['result'][item]['chainname']);
        }
        this.chainid = Number(this.local_data.MultiServiceChainid);
        //Assinging selected chain value to dropdown while edit loads   
        this.chainVal = [{ "chainid": this.chainid, "chainname": this.chainlist.get(this.chainid) }];
        this.filteredServerSideChains.next(this.chainVal);
      }
      this.chaindata = data;

      if (data != null || data.length !== 0) {
        this.chaindata = data;
      }
      $('.overlay').hide();
    },
      err => console.error(err),

      () => console.log('')
    );

    this._orderservice.getAtrbe(4).subscribe(data => {
      for (let item in data) {
        this.orderattribute.set(data[item]['attributename'], data[item]['id']);
      }

      this.buttondisabled = false;
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.SSIDcreateform.get(controlName).hasError(errorName);
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
    this.SSIDcreateform.get('MultiServiceContactPersonEmail').setValue(selectedcontactperson.contactpersonemail);
    this.SSIDcreateform.get('MultiServiceContactPersonTelephone').setValue(selectedcontactperson.contactpersontelephone);
    this.SSIDcreateform.get('MultiServiceContactPersonFunction').setValue(selectedcontactperson.contactpersonfunction);

  }

  selectConnection(checkValue) {
    if (checkValue == '1') {
      this.isConn = checkValue;
    } else {
      this.isConn = checkValue;
    }
  }

}
