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
import { Observable } from 'rxjs';
import { CommonService } from '../_services/common.service';
import { CustomerContactdialogBoxComponent } from '../customercontactdialog-box/customercontactdialog-box.component';
import { MatDialog } from '@angular/material/dialog';
moment.tz.setDefault('Europe/Amsterdam');
declare var jQuery: any;
declare const editClick: any;
declare var $: any;
@Component({
  selector: 'app-multiservicewlan',
  templateUrl: './multiservicewlan.component.html',
  styleUrls: ['./multiservicewlan.component.scss']
})
export class MultiservicewlanComponent implements OnInit {

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
  order: any[] = [];
  orderbase: any[];
  orderStatusUpdate: any[] = [];
  orderattribute = new Map<string, string>();
  orderattributevalue = new Map<string, string>();
  productattributelist = new Map<string, string>();
  orderFormUpdatedValue: any[] = [];
  orderFormUpdateStatusValue: any[] = [];
  orderActvateOnDelivery: any[];
  orderrestrictOnLocation: any[];
  MultiServiceTypeList: any[];
  isplandateedit;
  bouwAllState: any[];

  isConn;

  WLANcreateform: FormGroup;
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
  wlanswitch;
  wlanuserprofile;
  wlanbroadbandssid;
  wlanpriority;
  wlanencryption;
  communicationgroupInstallContractorList;
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
    public dialogRef: MatDialogRef<MultiservicewlanComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _Activatedroute: ActivatedRoute,
    private route: ActivatedRoute,
    private authenticationservice: AuthenticationService,
    private ticketservice: TicketService,
    private toasterservice: ToasterService,
    private _orderservice: OrderService,
    private datePipe: DatePipe,
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
      this.WLANcreateform = this.formBuilder.group({
        /****** New Attr ******/
        customerid: this.locationid,
        MultiserviceWlanContactid: ['', Validators.required],
        MultiserviceWlanContactPerson: [''],
        MultiserviceWlanContactPersonTelephone: [''],
        MultiserviceWlanContactPersonEmail: [''],
        MultiserviceWlanContactPersonFunction: [''],
        MultiserviceWlanWishdate: ['', Validators.required],
        MultiserviceWlanContractor: ['', Validators.required],
        MultiserviceWlanSwitchPresent: [''],
        MultiserviceWlanSSIDDescription: [],
        MultiserviceWlanUserProfile: [''],
        MultiserviceWlanBroadcastSSID: [],
        MultiserviceWlanSSID: [],
        MultiserviceWlanInstallContractor: [],
        MultiserviceWlanEncryptionType: [],
        MultiserviceWlanPassphrase: [],
        MultiserviceWlanHighPriority: [],
        MultiserviceWlanProgressNotification: [''],
        description: [''],
        facturatie_status: [''],
        MultiserviceWlanPlanneddate: [''],
        orderstatus: [''],
        orderstate: [''],
        /****** New Attr ******/

      });

      var crdate = moment().format('YYYY-MM-DD');
      var ordertype = 'add';
      // this.getProductCatalogueFilterByDate(crdate, ordertype);
      this.WLANcreateform.get('facturatie_status').setValue('Ready');

    } else if (this.local_data.action == 'Update') {
      this.local_data.MultiserviceWlanContactid = Number(this.local_data.MultiserviceWlanContactid);
      this.local_data.MultiserviceWlanContractor = Number(this.local_data.MultiserviceWlanContractor);

      this.populateformdropdown();
      this.getOrderStateList();

      this._orderservice.getAtrbval(this.local_data.id).subscribe(data => {
        for (let item in data) {
          this.orderattributevalue.set(data[item]['orderattribute'], data[item]['id']);
        }
      }, error => this.toasterservice.showError(error));


      this.WLANcreateform = this.formBuilder.group({
        /****** New Attr ******/
        customerid: this.locationid,
        MultiserviceWlanContactid: [this.local_data.MultiserviceWlanContactid, Validators.required],
        MultiserviceWlanContactPerson: [this.local_data.MultiserviceWlanContactPerson],
        MultiserviceWlanContactPersonTelephone: [this.local_data.MultiserviceWlanContactPersonTelephone],
        MultiserviceWlanContactPersonEmail: [this.local_data.MultiserviceWlanContactPersonEmail],
        MultiserviceWlanContactPersonFunction: [this.local_data.MultiserviceWlanContactPersonFunction],
        MultiserviceWlanWishdate: [this.local_data.MultiserviceWlanWishdateEdit, Validators.required],
        MultiserviceWlanContractor: [this.local_data.MultiserviceWlanContractor, Validators.required],
        MultiserviceWlanSwitchPresent: [this.local_data.MultiserviceWlanSwitchPresent],
        MultiserviceWlanSSIDDescription: [this.local_data.MultiserviceWlanSSIDDescription],
        MultiserviceWlanUserProfile: [this.local_data.MultiserviceWlanUserProfile],
        MultiserviceWlanBroadcastSSID: [this.local_data.MultiserviceWlanBroadcastSSID],
        MultiserviceWlanSSID: [this.local_data.MultiserviceWlanSSID],
        MultiserviceWlanInstallContractor: [Number(this.local_data.MultiserviceWlanInstallContractor)],
        MultiserviceWlanEncryptionType: [this.local_data.MultiserviceWlanEncryptionType],
        MultiserviceWlanPassphrase: [this.local_data.MultiserviceWlanPassphrase],
        MultiserviceWlanHighPriority: [this.local_data.MultiserviceWlanHighPriority],
        MultiserviceWlanPlanneddate: [''],
        MultiserviceWlanProgressNotification: [this.local_data.MultiserviceWlanProgressNotification],
        description: [this.local_data.opmerking],
        facturatie_status: [this.local_data.billingstatus],
        orderstatus: [this.local_data.orderstatus],
        orderstate: [Number(this.local_data.orderstate)],

        /****** New Attr ******/

      });

      var ordertype = 'add';
      var crdate = formatDate(this.local_data.creationdateEdit, 'yyyy-MM-dd', 'en-US');
      // this.getProductCatalogueFilterByDate(crdate, ordertype);
      this.WLANcreateform.get('facturatie_status').setValue('Ready');

    } else if (this.local_data.action == 'UpdateStatus') {

      //this.populatestate();
      this.populateformdropdown();

      this.WLANcreateform = this.formBuilder.group({

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
      this.toasterservice.showError(err);
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
          this.toasterservice.showError(error);
        });

  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onSubmit(form: NgForm) {
    if (this.WLANcreateform.invalid) {

      const invalid = [];
      const controls = this.WLANcreateform.controls;
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

    if (this.WLANcreateform.get('MultiserviceWlanWishdate').value == '' || this.WLANcreateform.get('MultiserviceWlanWishdate').value == null) {
      this.WLANcreateform.get('MultiserviceWlanWishdate').setValue(null);
    } else {
      this.WLANcreateform.get('MultiserviceWlanWishdate').setValue(this.transformDate(this.WLANcreateform.get('MultiserviceWlanWishdate').value));
    }

    this.orderbase = [
      {
        hstorderid: '',
        orderstatus: '',
        orderstate: '1',
        remarks: (this.WLANcreateform.get('description').value == '') ? '' : this.WLANcreateform.get('description').value.toString().trim(),
        creationdate: this.jstoday,
        updationdate: null,
        ponumber: '',
        ordertype: '1',
        locationid: this.locationid,
        productcatalogueid: 5,
        productcataloguegroup: 5,
        billingstartdate: null,
        isstartpaketactive: '',
        startpaketcatalogue: '',
        stratpaketname: '',
        isconnection: '',
        billingstatus: (this.WLANcreateform.get('facturatie_status').value == '') ? '' : this.WLANcreateform.get('facturatie_status').value.toString().trim(),
        bouwtype: 6, //New SSID
      }
    ];

    this.counter = 0;
    Object.keys(this.WLANcreateform.controls).forEach(key => {
      if (key == 'MultiserviceWlanContactid' || key == 'MultiserviceWlanWishdate' ||
        key == 'MultiserviceWlanContractor' || key == 'MultiServiceChainid' || key == 'SSIDname'
        || key == 'MultiServiceSSIDDescription' || key == 'MultiserviceWlanSwitchPresent' || key == 'MultiserviceWlanSSIDDescription' || key == 'MultiserviceWlanUserProfile'
        || key == 'MultiserviceWlanBroadcastSSID' || key == 'MultiserviceWlanSSID' || key == 'MultiserviceWlanInstallContractor' || key == 'MultiserviceWlanEncryptionType'
        || key == 'MultiserviceWlanPassphrase' || key == 'MultiserviceWlanHighPriority' || key == 'MultiserviceWlanPlanneddate'
        || key == 'MultiserviceWlanProgressNotification') {

        this.order.push({
          id: '',
          orderattributevalue: (this.WLANcreateform.get(key).value == null || this.WLANcreateform.get(key).value == '') ? '' : this.WLANcreateform.get(key).value.toString().trim(),
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
        this.toasterservice.showError(err);
      });
  }

  onUpdate(form: NgForm) {
    if (this.WLANcreateform.invalid) {

      const invalid = [];
      const controls = this.WLANcreateform.controls;
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
    if (this.WLANcreateform.get('MultiserviceWlanWishdate').value == '' || this.WLANcreateform.get('MultiserviceWlanWishdate').value == null) {
      this.WLANcreateform.get('MultiserviceWlanWishdate').setValue(null);
    } else {
      this.WLANcreateform.get('MultiserviceWlanWishdate').setValue(this.transformDate(this.WLANcreateform.get('MultiserviceWlanWishdate').value));
    }

    this.orderbase = [
      {
        hstorderid: this.local_data.orderid,
        orderstatus: '',
        orderstate: this.WLANcreateform.get('orderstate').value ? this.WLANcreateform.get('orderstate').value : this.local_data.orderstate,
        remarks: (this.WLANcreateform.get('description').value == '') ? '' : this.WLANcreateform.get('description').value.toString().trim(),
        creationdate: this.local_data.creationdateEdit,
        updationdate: this.jstoday,
        ponumber: '',
        ordertype: '1',
        locationid: this.locationid,
        productcatalogueid: 5,
        productcataloguegroup: 5,
        billingstartdate: null,
        isstartpaketactive: '',
        startpaketcatalogue: '',
        stratpaketname: '',
        isconnection: '',
        billingstatus: (this.WLANcreateform.get('facturatie_status').value == '') ? '' : this.WLANcreateform.get('facturatie_status').value.toString().trim(),

        bouwtype: 6, //ssid
      }
    ];

    this.counter = 0;
    Object.keys(this.WLANcreateform.controls).forEach(key => {
      if (key == 'MultiserviceWlanContactid' || key == 'MultiserviceWlanWishdate' ||
        key == 'MultiserviceWlanContractor' || key == 'MultiServiceChainid' || key == 'SSIDname'
        || key == 'MultiServiceSSIDDescription' || key == 'MultiserviceWlanSwitchPresent' || key == 'MultiserviceWlanSSIDDescription'
        || key == 'MultiserviceWlanUserProfile'
        || key == 'MultiserviceWlanBroadcastSSID' || key == 'MultiserviceWlanSSID' || key == 'MultiserviceWlanInstallContractor' ||
        key == 'MultiserviceWlanEncryptionType'
        || key == 'MultiserviceWlanPassphrase' || key == 'MultiserviceWlanHighPriority' || key == 'MultiserviceWlanPlanneddate'
        || key == 'MultiserviceWlanProgressNotification') {
        this.order.push({
          id: this.orderattributevalue.get(this.orderattribute.get(key)),
          orderattributevalue: (this.WLANcreateform.get(key).value == null || this.WLANcreateform.get(key).value == '') ? '' : this.WLANcreateform.get(key).value.toString().trim(),
          orderattribute: this.orderattribute.get(key),
          orderbasef: this.orderbase[0]
        });

      }

    });

    var MultiserviceWlanContractorName = this.WLANcreateform.get('MultiserviceWlanContractor').value ? this.communicationgroupList.find(r =>
      r.communicationvalue == this.WLANcreateform.get('MultiserviceWlanContractor').value
    ).communicationname : '';

    var MultiserviceWlanHighPriority = this.WLANcreateform.get('MultiserviceWlanHighPriority').value ? this.wlanpriority.find(r =>
      r.id == this.WLANcreateform.get('MultiserviceWlanHighPriority').value
    ).name : '';

    var MultiserviceWlanEncryptionType = this.WLANcreateform.get('MultiserviceWlanEncryptionType').value ? this.wlanencryption.find(r =>
      r.id == this.WLANcreateform.get('MultiserviceWlanEncryptionType').value
    ).name : '';

    var MultiserviceWlanBroadcastSSID = this.WLANcreateform.get('MultiserviceWlanBroadcastSSID').value ? this.wlanbroadbandssid.find(r =>
      r.id == this.WLANcreateform.get('MultiserviceWlanBroadcastSSID').value
    ).name : '';

    var MultiserviceWlanSwitchPresent = this.WLANcreateform.get('MultiserviceWlanSwitchPresent').value ? this.wlanswitch.find(r =>
      r.id == this.WLANcreateform.get('MultiserviceWlanSwitchPresent').value
    ).name : '';

    var MultiserviceWlanInstallContractor = this.WLANcreateform.get('MultiserviceWlanInstallContractor').value ? this.communicationgroupInstallContractorList.find(r =>
      r.communicationvalue == this.WLANcreateform.get('MultiserviceWlanInstallContractor').value
    ).communicationname : '';

    var orderstatename = this.bouwAllState.find(r =>
      r.value == this.WLANcreateform.get('orderstate').value
    ).name;

    var orderstate = this.WLANcreateform.get('orderstate').value ? this.WLANcreateform.get('orderstate').value : this.local_data.orderstate;

    var updateDateformat = moment().format('DD-MM-YYYY');

    this.orderFormUpdatedValue.push({
      id: this.local_data.id,

      MultiserviceWlanContactid: this.WLANcreateform.get('MultiserviceWlanContactid').value,
      MultiserviceWlanContractor: this.WLANcreateform.get('MultiserviceWlanContractor').value,
      description: this.WLANcreateform.get('description').value,
      MultiserviceContractorname: MultiserviceWlanContractorName,
      MultiserviceWlanWishdate: this.WLANcreateform.get('MultiserviceWlanWishdate').value ? formatDate(this.WLANcreateform.get('MultiserviceWlanWishdate').value, 'dd-MM-yyyy', 'en-US') : '',
      MultiserviceWlanWishdateEdit: this.WLANcreateform.get('MultiserviceWlanWishdate').value,
      BOUWTypeName: this.local_data.bouwtype,
      MultiserviceWlanSSID: this.WLANcreateform.get('MultiserviceWlanSSID').value,
      MultiserviceWlanSSIDDescription: this.WLANcreateform.get('MultiserviceWlanSSIDDescription').value,
      orderstatename: orderstatename,
      orderstate: orderstate,
      MultiserviceWlanHighPriority: this.WLANcreateform.get('MultiserviceWlanHighPriority').value,
      MultiserviceWlanHighPriorityname: MultiserviceWlanHighPriority,
      MultiserviceWlanEncryptionType: this.WLANcreateform.get('MultiserviceWlanEncryptionType').value,
      MultiserviceWlanEncryptionTypename: MultiserviceWlanEncryptionType,
      MultiserviceWlanInstallContractor: this.WLANcreateform.get('MultiserviceWlanInstallContractor').value,
      MultiserviceWlanInstallContractorname: MultiserviceWlanInstallContractor,
      MultiserviceWlanPassphrase: this.WLANcreateform.get('MultiserviceWlanPassphrase').value,
      MultiserviceWlanBroadcastSSID: this.WLANcreateform.get('MultiserviceWlanBroadcastSSID').value,
      MultiserviceWlanBroadcastSSIDname: MultiserviceWlanBroadcastSSID,
      MultiserviceWlanSwitchPresent: this.WLANcreateform.get('MultiserviceWlanSwitchPresent').value,
      MultiserviceWlanSwitchPresentname: MultiserviceWlanSwitchPresent,
      MultiserviceWlanUserProfile: this.WLANcreateform.get('MultiserviceWlanUserProfile').value,
      MultiserviceWlanProgressNotification: this.WLANcreateform.get('MultiserviceWlanProgressNotification').value,

    });
    this.order.sort(this.GetSortOrder("orderattribute"));
    this._orderservice.updateOrderMultiService(JSON.stringify(this.order), this.local_data.id)
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Update', data: this.orderFormUpdatedValue });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }

  openContactDialogAdd(action) {
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

  resetContactList(newContactId) {
    this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;
        this.selectCustomerContact(Number(newContactId));
        this.WLANcreateform.patchValue({
          MultiserviceWlanContactid: Number(newContactId)
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
    this._orderservice.getOrderProperty('MultiserviceWlanSwitchPresent').subscribe(data => {
      this.wlanswitch = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
    this._orderservice.getOrderProperty('MultiserviceWlanHighPriority').subscribe(data => {
      this.wlanpriority = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
    this._orderservice.getOrderProperty('MultiserviceWlanEncryptionType').subscribe(data => {
      this.wlanencryption = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
    this._orderservice.getOrderProperty('MultiserviceWlanUserProfile').subscribe(data => {
      this.wlanuserprofile = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
    this._orderservice.getOrderProperty('MultiserviceWlanBroadcastSSID').subscribe(data => {
      this.wlanbroadbandssid = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;

        if (this.local_data.action == 'Update') {
          this.selectCustomerContact(Number(this.local_data.MultiserviceWlanContactid));
        }
      }, error => this.toasterservice.showError(error));

    this.ticketservice.getCommunicationgroupByID(6).subscribe(data => {
      this.communicationgroupList = data;

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this.ticketservice.getCommunicationgroupByID(7).subscribe(data => {
      this.communicationgroupInstallContractorList = data;

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    //$('.overlay').show();

    this._orderservice.getAtrbe(5).subscribe(data => {
      for (let item in data) {
        this.orderattribute.set(data[item]['attributename'], data[item]['id']);
      }
      this.buttondisabled = false;
    }, error => this.toasterservice.showError(error));
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.WLANcreateform.get(controlName).hasError(errorName);
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
    this.WLANcreateform.get('MultiserviceWlanContactPersonEmail').setValue(selectedcontactperson.contactpersonemail);
    this.WLANcreateform.get('MultiserviceWlanContactPersonTelephone').setValue(selectedcontactperson.contactpersontelephone);
    this.WLANcreateform.get('MultiserviceWlanContactPersonFunction').setValue(selectedcontactperson.contactpersonfunction);

  }
}
