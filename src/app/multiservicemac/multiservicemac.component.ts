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
import { CustomerContactdialogBoxComponent } from '../customercontactdialog-box/customercontactdialog-box.component';
import { MatDialog } from '@angular/material/dialog';
moment.tz.setDefault('Europe/Amsterdam');
declare var jQuery: any;
declare const editClick: any;
declare var $: any;
@Component({
  selector: 'app-multiservicemac',
  templateUrl: './multiservicemac.component.html',
  styleUrls: ['./multiservicemac.component.scss']
})
export class MultiservicemacComponent implements OnInit {

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
  isdisabled : boolean = false;
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
  minDate;
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
  addonJson;
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
  requesttypelist;
  wlanuserprofile;
  wlanbroadbandssid;
  wlanpriority;
  wlanencryption;
  communicationgroupInstallContractorList;
  version = VERSION;
  noRecordFound;
  matSelectSearchVersion = MatSelectSearchVersion;
  SCardOrderShipmentPostalCode;
  macUBDownloadList;
  macUBUploadList;
  MacOrderAmount
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
    public dialogRef: MatDialogRef<MultiservicemacComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _Activatedroute: ActivatedRoute,
    private route: ActivatedRoute,
    private authenticationservice: AuthenticationService,
    private ticketservice: TicketService,
    private toasterservice: ToasterService,
    private _orderservice: OrderService,
    private datePipe: DatePipe,
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

  }

  ngOnInit() {
    this.buttondisabled = false;
    this._id = this.route.snapshot.paramMap.get("id");
    var dt = new Date();
    var month = dt.getMonth(), year = dt.getFullYear();
    this.minDate = new Date(year, month, 1);
    if (this.local_data.action == 'Add') {
      this.populateformdropdown();
      this.WLANcreateform = this.formBuilder.group({
        /****** New Attr ******/
        customerid: this.locationid,
        MultiserviceMacContactid: ['', Validators.required],
        MultiserviceWlanContactPerson: [''],
        MultiserviceWlanContactPersonTelephone: [''],
        MultiserviceWlanContactPersonEmail: [''],
        MultiserviceWlanContactPersonFunction: [''],
        MultiserviceMacWishdate: ['', Validators.required],
        MultiserviceMacContractor: ['', Validators.required],
        MultiserviceMacRequestType: ['', Validators.required],
        MacOrderAmount: [''],
        //macaddress: ['',[Validators.required, Validators.pattern('^([0-9a-fA-F]{2}[:.-]){5}[0-9a-fA-F]{2}$')]],
        //ubprofileupload: [''],
        //ubprofiledownload: [''],
        //enddate: [''],
        description: [''],
        facturatie_status: [''],
        MultiserviceMacPlanneddate: [''],
        orderstatus: [''],
        orderstate: [''],
        MacOrderAddon: this.formBuilder.array([
          // load first row at start
          this.getUnit()
        ])

        /****** New Attr ******/

      });

      var crdate = moment().format('YYYY-MM-DD');
      var ordertype = 'add';
      // this.getProductCatalogueFilterByDate(crdate, ordertype);
      this.WLANcreateform.get('facturatie_status').setValue('Ready');

    } else if (this.local_data.action == 'Update') {
      this.local_data.MultiserviceMacContactid = Number(this.local_data.MultiserviceMacContactid);
      this.local_data.MultiserviceMacContractor = Number(this.local_data.MultiserviceMacContractor);

      this.populateformdropdown();
      this.getOrderStateList();

      this._orderservice.getAtrbval(this.local_data.id).subscribe(data => {
        for (let item in data) {
          this.orderattributevalue.set(data[item]['orderattribute'], data[item]['id']);
        }
      }, error => this.toasterservice.showError(error));
      console.log(this.local_data);
      
      this.WLANcreateform = this.formBuilder.group({
        /****** New Attr ******/
        customerid: this.locationid,
        MultiserviceMacContactid: [this.local_data.MultiserviceMacContactid, Validators.required],
        MultiserviceWlanContactPerson: [this.local_data.MultiserviceWlanContactPerson],
        MultiserviceWlanContactPersonTelephone: [this.local_data.MultiserviceWlanContactPersonTelephone],
        MultiserviceWlanContactPersonEmail: [this.local_data.MultiserviceWlanContactPersonEmail],
        MultiserviceWlanContactPersonFunction: [this.local_data.MultiserviceWlanContactPersonFunction],
        MultiserviceMacWishdate: [this.local_data.MultiserviceMacWishdateEdit, Validators.required],
        MultiserviceMacContractor: [this.local_data.MultiserviceMacContractor, Validators.required],
        MultiserviceMacRequestType: [this.local_data.MultiserviceMacRequestType, Validators.required],
        /*macaddress: [this.local_data.macaddress, Validators.required],
        ubprofileupload: [this.local_data.ubprofileupload, Validators.required],
        ubprofiledownload: [this.local_data.ubprofiledownload, Validators.required],
        enddate: [this.local_data.enddateEdit, Validators.required],*/
        MultiserviceMacPlanneddate: [''],
        description: [this.local_data.opmerking],
        MacOrderAmount: [this.local_data.MacOrderAmount],
        facturatie_status: [this.local_data.billingstatus],
        orderstatus: [this.local_data.orderstatus],
        orderstate: [Number(this.local_data.orderstate)],

        /****** New Attr ******/

      });
      this.addonJson = (this.local_data.MacAddOns) ? JSON.parse(this.local_data.MacAddOns) : '';
      this.updateAddOnForm();
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
    this.dropdownchanges();
    if (this.local_data.action == 'Update' || this.local_data.action == 'Add') {
      this.setTotalMacCount();
    }
  }
  
  updateAddOnForm() {
    let addonarr = [];
    if (this.addonJson != '') {

      for (let i = 0; i < this.addonJson.length; i++) {
        addonarr.push(this.BuildFormDynamic(this.addonJson[i]))
      }
    }
    this.WLANcreateform = this.formBuilder.group({
      customerid: this.locationid,
      MultiserviceMacContactid: [this.local_data.MultiserviceMacContactid, Validators.required],
      MultiserviceWlanContactPerson: [this.local_data.MultiserviceWlanContactPerson],
      MultiserviceWlanContactPersonTelephone: [this.local_data.MultiserviceWlanContactPersonTelephone],
      MultiserviceWlanContactPersonEmail: [this.local_data.MultiserviceWlanContactPersonEmail],
      MultiserviceWlanContactPersonFunction: [this.local_data.MultiserviceWlanContactPersonFunction],
      MultiserviceMacWishdate: [this.local_data.MultiserviceMacWishdateEdit, Validators.required],
      MultiserviceMacContractor: [this.local_data.MultiserviceMacContractor, Validators.required],
      MultiserviceMacRequestType: [this.local_data.MultiserviceMacRequestType],
      //macaddress: ['',[Validators.required, Validators.pattern('^([0-9a-fA-F]{2}[:.-]){5}[0-9a-fA-F]{2}$')]],
        //ubprofileupload: [''],
        //ubprofiledownload: [''],
        //enddate: [''],
        MultiserviceMacPlanneddate: [''],
        description: [this.local_data.opmerking],
        MacOrderAmount: [this.local_data.MacOrderAmount],
        facturatie_status: [this.local_data.billingstatus],
        orderstatus: [this.local_data.orderstatus],
        orderstate: [this.local_data.orderstate],
        MacOrderAddon: this.formBuilder.array(addonarr)
    });
  }

  BuildFormDynamic(addon: { macaddress: any; ubprofiledownload: any; ubprofileupload: any; enddate: any; }): FormGroup {

    return this.formBuilder.group({

      macaddress: [addon.macaddress,[Validators.required, Validators.pattern('^([0-9a-fA-F]{2}[:.-]){5}[0-9a-fA-F]{2}$')]],
      ubprofiledownload: [addon.ubprofiledownload, Validators.required],
      ubprofileupload: [addon.ubprofileupload, Validators.required],
      enddate: [addon.enddate],
      
    })
  }

  private getUnit() {
    return this.formBuilder.group({
      macaddress: ['',[Validators.required, Validators.pattern('^([0-9a-fA-F]{2}[:.-]){5}[0-9a-fA-F]{2}$')]],
      ubprofiledownload: ['', Validators.required],
      ubprofileupload: ['',Validators.required],
      enddate: [''],
      
    });
  }

  private getUnitUpdate() {

    return this.formBuilder.group({
      macaddress: ['',[Validators.required, Validators.pattern('^([0-9a-fA-F]{2}[:.-]){5}[0-9a-fA-F]{2}$')]],
      ubprofiledownload: ['', Validators.required],
      ubprofileupload: ['',Validators.required],
      enddate: [''],
    });
  }

  /**
   * Add new unit row into form
   */
  addUnit() {
    const control = <FormArray>this.WLANcreateform.get('MacOrderAddon');
    control.push(this.getUnit());
    this.setTotalMacCount();
    
  }

  addUnitUpdate() {

    const control = <FormArray>this.WLANcreateform.get('MacOrderAddon');
    control.push(this.getUnitUpdate());
    this.setTotalMacCount();

    
  }

  /**
   * Remove unit row from form on click delete button
   */
  removeUnit(i: number) {
    const control = <FormArray>this.WLANcreateform.get('MacOrderAddon');
    control.removeAt(i);
    this.setTotalMacCount();

    
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

  setTotalMacCount() {
    var control = <FormArray>this.WLANcreateform.get('MacOrderAddon');
    var count = 0;
    this.isdisabled = true;
    for (let i in control.value) {
      count = count + 1;
    }
    //console.log(count);
    if(count>1){
      this.isdisabled = false;
    }
    this.WLANcreateform.get('MacOrderAmount').setValue(count);
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

    if (this.WLANcreateform.get('MultiserviceMacWishdate').value == '' || this.WLANcreateform.get('MultiserviceMacWishdate').value == null) {
      this.WLANcreateform.get('MultiserviceMacWishdate').setValue(null);
    } else {
      this.WLANcreateform.get('MultiserviceMacWishdate').setValue(this.transformDate(this.WLANcreateform.get('MultiserviceMacWishdate').value));
    }
    
    /*if (this.WLANcreateform.get('enddate').value == '' || this.WLANcreateform.controls['enddate'].value == null) {
      this.WLANcreateform.get('enddate').setValue(null);
    } else {
      this.WLANcreateform.get('enddate').setValue(this.transformDate(this.WLANcreateform.get('enddate').value));
    }
    if (this.WLANcreateform.get('ubprofiledownload').value == '' || this.WLANcreateform.controls['ubprofiledownload'].value == null) {
      this.WLANcreateform.get('ubprofiledownload').setValue(0);
    } else {
      this.WLANcreateform.get('ubprofiledownload').setValue(this.WLANcreateform.get('ubprofiledownload').value);
    }
    if (this.WLANcreateform.get('ubprofileupload').value == '' || this.WLANcreateform.controls['ubprofileupload'].value == null) {
      this.WLANcreateform.get('ubprofileupload').setValue(0);
    } else {
      this.WLANcreateform.get('ubprofileupload').setValue(this.WLANcreateform.get('ubprofileupload').value);
    }*/
    

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
        productcatalogueid: 7,
        productcataloguegroup: 7,
        billingstartdate: null,
        isstartpaketactive: '',
        startpaketcatalogue: '',
        stratpaketname: '',
        isconnection: '',
        billingstatus: (this.WLANcreateform.get('facturatie_status').value == '') ? '' : this.WLANcreateform.get('facturatie_status').value.toString().trim(),
        bouwtype: 8, //New SSID
      }
    ];

    this.counter = 0;
    Object.keys(this.WLANcreateform.controls).forEach(key => {
      if (key == 'MultiserviceMacContactid' || key == 'MultiserviceMacWishdate' ||
        key == 'MultiserviceMacContractor' || key == 'MultiserviceMacRequestType' || key == 'MultiserviceMacPlanneddate'|| key == 'MacOrderAmount') {

        this.order.push({
          id: '',
          orderattributevalue: (this.WLANcreateform.get(key).value == null || this.WLANcreateform.get(key).value == '') ? '' : this.WLANcreateform.get(key).value.toString().trim(),
          orderattribute: this.orderattribute.get(key),
          orderbasef: this.orderbase[0]
        });
      }
      if (key == 'MacOrderAddon') {
        this.order.push({
          id: '',
          orderattributevalue: (Object.keys(this.WLANcreateform.get('MacOrderAddon')).length == 0) ? '' : JSON.stringify(this.WLANcreateform.get('MacOrderAddon').value),
          orderattribute: this.orderattribute.get('MacOrderAddon'),
          orderbasef: this.orderbase[0]
        });

      }


    });
    this.order.sort(this.GetSortOrder("orderattribute"));
    //console.log(JSON.stringify(this.order))
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
    if (this.WLANcreateform.get('MultiserviceMacWishdate').value == '' || this.WLANcreateform.get('MultiserviceMacWishdate').value == null) {
      this.WLANcreateform.get('MultiserviceMacWishdate').setValue(null);
    } else {
      this.WLANcreateform.get('MultiserviceMacWishdate').setValue(this.transformDate(this.WLANcreateform.get('MultiserviceMacWishdate').value));
    }
    /*if (this.WLANcreateform.get('enddate').value == '' || this.WLANcreateform.get('enddate').value == null) {
      this.WLANcreateform.get('enddate').setValue(null);
    } else {
      this.WLANcreateform.get('enddate').setValue(this.transformDate(this.WLANcreateform.get('enddate').value));
    }*/


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
        productcatalogueid: 7,
        productcataloguegroup: 7,
        billingstartdate: null,
        isstartpaketactive: '',
        startpaketcatalogue: '',
        stratpaketname: '',
        isconnection: '',
        billingstatus: (this.WLANcreateform.get('facturatie_status').value == '') ? '' : this.WLANcreateform.get('facturatie_status').value.toString().trim(),

        bouwtype: 8, //mac
      }
    ];

    this.counter = 0;
    Object.keys(this.WLANcreateform.controls).forEach(key => {
      if (key == 'MultiserviceMacContactid' || key == 'MultiserviceMacWishdate' ||
        key == 'MultiserviceMacContractor' || key == 'MultiserviceMacRequestType' || key == 'MultiserviceMacPlanneddate'|| key == 'MacOrderAmount') {
        this.order.push({
          id: this.orderattributevalue.get(this.orderattribute.get(key)),
          orderattributevalue: (this.WLANcreateform.get(key).value == null || this.WLANcreateform.get(key).value == '') ? '' : this.WLANcreateform.get(key).value.toString().trim(),
          orderattribute: this.orderattribute.get(key),
          orderbasef: this.orderbase[0]
        });

      }
      if (key == 'MacOrderAddon') {
        this.order.push({
          id: this.orderattributevalue.get(this.orderattribute.get('MacOrderAddon')),
          orderattributevalue: (Object.keys(this.WLANcreateform.get('MacOrderAddon').value).length == 0) ? '' : JSON.stringify(this.WLANcreateform.get('MacOrderAddon').value),
          orderattribute: this.orderattribute.get('MacOrderAddon'),
          orderbasef: this.orderbase[0]
        });

      }

    });

    var MultiserviceWlanContractorName = this.WLANcreateform.get('MultiserviceMacContractor').value ? this.communicationgroupList.find(r =>
      r.communicationvalue == this.WLANcreateform.get('MultiserviceMacContractor').value
    ).communicationname : '';

    
    var MultiserviceMacRequestType = this.WLANcreateform.get('MultiserviceMacRequestType').value ? this.requesttypelist.find(r =>
      r.id == this.WLANcreateform.get('MultiserviceMacRequestType').value
    ).name : '';

   /* var ubprofiledownload = this.WLANcreateform.get('ubprofiledownload').value ? this.macUBDownloadList.find(r =>
      r.id == this.WLANcreateform.get('ubprofiledownload').value
    ).name : '';

    var ubprofileupload = this.WLANcreateform.get('ubprofileupload').value ? this.macUBUploadList.find(r =>
      r.id == this.WLANcreateform.get('ubprofileupload').value
    ).name : '';*/


    var orderstatename = this.bouwAllState.find(r =>
      r.value == this.WLANcreateform.get('orderstate').value
    ).name;

    var orderstate = this.WLANcreateform.get('orderstate').value ? this.WLANcreateform.get('orderstate').value : this.local_data.orderstate;

    var updateDateformat = moment().format('DD-MM-YYYY');

    this.orderFormUpdatedValue.push({
      id: this.local_data.id,
      MultiserviceMacContactid: this.WLANcreateform.get('MultiserviceMacContactid').value,
      MultiserviceMacContractor: this.WLANcreateform.get('MultiserviceMacContractor').value,
      description: this.WLANcreateform.get('description').value,
      MultiserviceContractorname: MultiserviceWlanContractorName,
      MultiserviceMacWishdate: this.WLANcreateform.get('MultiserviceMacWishdate').value ? formatDate(this.WLANcreateform.get('MultiserviceMacWishdate').value, 'dd-MM-yyyy', 'en-US') : '',
      MultiserviceMacWishdateEdit: this.WLANcreateform.get('MultiserviceMacWishdate').value,
      BOUWTypeName: this.local_data.bouwtype,
      /*macaddress: this.WLANcreateform.get('macaddress').value,
      ubprofiledownload: this.WLANcreateform.get('ubprofiledownload').value,
      ubprofiledownloadname: ubprofiledownload,
      ubprofileupload: this.WLANcreateform.get('ubprofileupload').value,
      ubprofileuploadname: ubprofileupload,
      enddate: this.WLANcreateform.get('enddate').value ? formatDate(this.WLANcreateform.get('enddate').value, 'dd-MM-yyyy', 'en-US') : '',
      enddateEdit: this.WLANcreateform.get('enddate').value,*/
      orderstatename: orderstatename,
      orderstate: orderstate,
      MultiserviceMacRequestType: this.WLANcreateform.get('MultiserviceMacRequestType').value,
      MultiserviceMacRequestTypename: MultiserviceMacRequestType,
      MacOrderAmount: this.WLANcreateform.get('MacOrderAmount').value,
      MacAddOns: JSON.stringify(this.WLANcreateform.get('MacOrderAddon').value),
      
    });
    this.order.sort(this.GetSortOrder("orderattribute"));
    //console.log(JSON.stringify(this.order));
    this._orderservice.updateOrderMultiService(JSON.stringify(this.order), this.local_data.id)
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
          this.WLANcreateform.patchValue({
            MultiserviceMacContactid: Number(newContactId)
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
    this._orderservice.getOrderProperty('MultiserviceMacRequestType').subscribe(data => {
      this.requesttypelist = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
    this._orderservice.getOrderProperty('ubprofiledownload').subscribe(data => {
      this.macUBDownloadList = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
    this._orderservice.getOrderProperty('ubprofileupload').subscribe(data => {
      this.macUBUploadList = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
    
    this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;

        if (this.local_data.action == 'Update') {
          this.selectCustomerContact(Number(this.local_data.MultiserviceMacContactid));
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

    $('.overlay').show();

    this._orderservice.getAtrbe(7).subscribe(data => {
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
