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
  selector: 'app-multiservicerouted',
  templateUrl: './multiservicerouted.component.html',
  styleUrls: ['./multiservicerouted.component.scss']
})
export class MultiserviceroutedComponent implements OnInit {

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
  
    routedcreateform: FormGroup;
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
    Routedswitch;
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
      public dialogRef: MatDialogRef<MultiserviceroutedComponent>,
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
      console.log('local data--', this.local_data);
      if (this.local_data.action == 'Add') {
        this.populateformdropdown();
        this.routedcreateform = this.formBuilder.group({
          /****** New Attr ******/
          customerid: this.locationid,
          MultiserviceRoutedContactid: ['', Validators.required],
          MultiserviceRoutedContactPerson: [''],
          MultiserviceRoutedContactPersonTelephone: [''],
          MultiserviceRoutedContactPersonEmail: [''],
          MultiserviceRoutedContactPersonFunction: [''],
          MultiserviceRoutedWishdate: ['', Validators.required],
          MultiserviceRoutedContractor: ['', Validators.required],
          MultiserviceRoutedSwitchPresent: [''],
          MultiserviceRoutedDescription: [],
          MultiserviceRoutedInstallContractor: [],
          MultiserviceRoutedIPaddress: [],
          MultiserviceRoutedSubnetMask: [],
          MultiserviceRoutedPlanneddate:[],
          MultiserviceRoutedProgressNotification:[''],
          description: [''],
          facturatie_status: [''],
          orderstatus: [''],
          orderstate: [''],
          /****** New Attr ******/
  
        });
  
        var crdate = moment().format('YYYY-MM-DD');
        var ordertype = 'add';
        // this.getProductCatalogueFilterByDate(crdate, ordertype);
        this.routedcreateform.get('facturatie_status').setValue('Ready');
  
      } else if (this.local_data.action == 'Update') {
        this.local_data.MultiserviceRoutedContactid = Number(this.local_data.MultiserviceRoutedContactid);
        this.local_data.MultiserviceRoutedContractor = Number(this.local_data.MultiserviceRoutedContractor);
  
        this.populateformdropdown();
        this.getOrderStateList();
  
        this._orderservice.getAtrbval(this.local_data.id).subscribe(data => {
          for (let item in data) {
            this.orderattributevalue.set(data[item]['orderattribute'], data[item]['id']);
          }
        }, error => this.toasterservice.showError(error));
  
  
        this.routedcreateform = this.formBuilder.group({
          /****** New Attr ******/
          customerid: this.locationid,
          MultiserviceRoutedContactid: [this.local_data.MultiserviceRoutedContactid, Validators.required],
          MultiserviceRoutedContactPerson: [this.local_data.MultiserviceRoutedContactPerson],
          MultiserviceRoutedContactPersonTelephone: [this.local_data.MultiserviceRoutedContactPersonTelephone],
          MultiserviceRoutedContactPersonEmail: [this.local_data.MultiserviceRoutedContactPersonEmail],
          MultiserviceRoutedContactPersonFunction: [this.local_data.MultiserviceRoutedContactPersonFunction],
          MultiserviceRoutedWishdate: [this.local_data.MultiserviceRoutedWishdateEdit, Validators.required],
          MultiserviceRoutedContractor: [this.local_data.MultiserviceRoutedContractor, Validators.required],
          MultiserviceRoutedSwitchPresent: [this.local_data.MultiserviceRoutedSwitchPresent],
          MultiserviceRoutedDescription: [this.local_data.MultiserviceRoutedDescription],
          MultiserviceRoutedInstallContractor: [Number(this.local_data.MultiserviceRoutedInstallContractor)],
          MultiserviceRoutedIPaddress: [this.local_data.MultiserviceRoutedIPaddress],
          MultiserviceRoutedSubnetMask: [this.local_data.MultiserviceRoutedSubnetMask],
          MultiserviceRoutedPlanneddate: [''],
          MultiserviceRoutedProgressNotification: [this.local_data.MultiserviceRoutedProgressNotification],
          description: [this.local_data.opmerking],
          facturatie_status: [this.local_data.billingstatus],
          orderstatus: [this.local_data.orderstatus],
          orderstate: [Number(this.local_data.orderstate)],
          
          /****** New Attr ******/
  
        });
  
        var ordertype = 'add';
        var crdate = formatDate(this.local_data.creationdateEdit, 'yyyy-MM-dd', 'en-US');
        // this.getProductCatalogueFilterByDate(crdate, ordertype);
        this.routedcreateform.get('facturatie_status').setValue('Ready');
  
      } else if (this.local_data.action == 'UpdateStatus') {
  
        //this.populatestate();
        this.populateformdropdown();
  
        this.routedcreateform = this.formBuilder.group({
  
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
      if (this.routedcreateform.invalid) {
  
        const invalid = [];
        const controls = this.routedcreateform.controls;
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
  
      if (this.routedcreateform.get('MultiserviceRoutedWishdate').value == '' || this.routedcreateform.get('MultiserviceRoutedWishdate').value == null) {
        this.routedcreateform.get('MultiserviceRoutedWishdate').setValue(null);
      } else {
        this.routedcreateform.get('MultiserviceRoutedWishdate').setValue(this.transformDate(this.routedcreateform.get('MultiserviceRoutedWishdate').value));
      }
  
      this.orderbase = [
        {
          hstorderid: '',
          orderstatus: '',
          orderstate: '1',
          remarks: (this.routedcreateform.get('description').value == '') ? '' : this.routedcreateform.get('description').value.toString().trim(),
          creationdate: this.jstoday,
          updationdate: null,
          ponumber: '',
          ordertype: '1',
          locationid: this.locationid,
          productcatalogueid: 6,
          productcataloguegroup: 6,
          billingstartdate: null,
          isstartpaketactive: '',
          startpaketcatalogue: '',
          stratpaketname: '',
          isconnection: '',
          billingstatus: (this.routedcreateform.get('facturatie_status').value == '') ? '' : this.routedcreateform.get('facturatie_status').value.toString().trim(),
          bouwtype: 7, //New Routed
        }
      ];
  
      this.counter = 0;
      Object.keys(this.routedcreateform.controls).forEach(key => {
        if (key == 'MultiserviceRoutedContactid' || key == 'MultiserviceRoutedWishdate' || key == 'MultiserviceRoutedProgressNotification' ||
          key == 'MultiserviceRoutedContractor' || key == 'MultiserviceRoutedIPaddress' || key == 'MultiserviceRoutedSubnetMask'
          || key == 'MultiserviceRoutedDescription' || key == 'MultiserviceRoutedSwitchPresent' || key == 'MultiserviceRoutedDescription'
          || key == 'MultiserviceRoutedInstallContractor' || key == 'MultiserviceRoutedPlanneddate') {
  
          this.order.push({
            id: '',
            orderattributevalue: (this.routedcreateform.get(key).value == null || this.routedcreateform.get(key).value == '') ? '' : this.routedcreateform.get(key).value.toString().trim(),
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
      if (this.routedcreateform.invalid) {
  
        const invalid = [];
        const controls = this.routedcreateform.controls;
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
      if (this.routedcreateform.get('MultiserviceRoutedWishdate').value == '' || this.routedcreateform.get('MultiserviceRoutedWishdate').value == null) {
        this.routedcreateform.get('MultiserviceRoutedWishdate').setValue(null);
      } else {
        this.routedcreateform.get('MultiserviceRoutedWishdate').setValue(this.transformDate(this.routedcreateform.get('MultiserviceRoutedWishdate').value));
      }
  
      this.orderbase = [
        {
          hstorderid: this.local_data.orderid,
          orderstatus: '',
          orderstate: this.routedcreateform.get('orderstate').value ? this.routedcreateform.get('orderstate').value : this.local_data.orderstate,
          remarks: (this.routedcreateform.get('description').value == '') ? '' : this.routedcreateform.get('description').value.toString().trim(),
          creationdate: this.local_data.creationdateEdit,
          updationdate: this.jstoday,
          ponumber: '',
          ordertype: '1',
          locationid: this.locationid,
          productcatalogueid: 6,
          productcataloguegroup: 6,
          billingstartdate: null,
          isstartpaketactive: '',
          startpaketcatalogue: '',
          stratpaketname: '',
          isconnection: '',
          billingstatus: (this.routedcreateform.get('facturatie_status').value == '') ? '' : this.routedcreateform.get('facturatie_status').value.toString().trim(),
  
          bouwtype: 7, //routed
        }
      ];
  
      this.counter = 0;
      Object.keys(this.routedcreateform.controls).forEach(key => {
        if (key == 'MultiserviceRoutedContactid' || key == 'MultiserviceRoutedWishdate' || key == 'MultiserviceRoutedProgressNotification' || 
        key == 'MultiserviceRoutedContractor' || key == 'MultiserviceRoutedIPaddress' || key == 'MultiserviceRoutedSubnetMask'
        || key == 'MultiserviceRoutedDescription' || key == 'MultiserviceRoutedSwitchPresent' || key == 'MultiserviceRoutedDescription'
        || key == 'MultiserviceRoutedInstallContractor' || key == 'MultiserviceRoutedPlanneddate') {
          this.order.push({
            id: this.orderattributevalue.get(this.orderattribute.get(key)),
            orderattributevalue: (this.routedcreateform.get(key).value == null || this.routedcreateform.get(key).value == '') ? '' : this.routedcreateform.get(key).value.toString().trim(),
            orderattribute: this.orderattribute.get(key),
            orderbasef: this.orderbase[0]
          });
  
        }
  
      });
  
      var MultiserviceRoutedContractorName = this.routedcreateform.get('MultiserviceRoutedContractor').value ? this.communicationgroupList.find(r =>
        r.communicationvalue == this.routedcreateform.get('MultiserviceRoutedContractor').value
      ).communicationname : '';
  
      var MultiserviceRoutedSwitchPresent = this.routedcreateform.get('MultiserviceRoutedSwitchPresent').value ? this.Routedswitch.find(r =>
        r.id == this.routedcreateform.get('MultiserviceRoutedSwitchPresent').value
      ).name : '';
  
      var MultiserviceRoutedInstallContractor = this.routedcreateform.get('MultiserviceRoutedInstallContractor').value ? this.communicationgroupInstallContractorList.find(r =>
        r.communicationvalue == this.routedcreateform.get('MultiserviceRoutedInstallContractor').value
      ).communicationname : '';
  
      var orderstatename = this.bouwAllState.find(r =>
        r.value == this.routedcreateform.get('orderstate').value
      ).name;
  
      var orderstate = this.routedcreateform.get('orderstate').value ? this.routedcreateform.get('orderstate').value : this.local_data.orderstate;
  
      var updateDateformat = moment().format('DD-MM-YYYY');
  
      this.orderFormUpdatedValue.push({
        id: this.local_data.id,
  
        MultiserviceRoutedContactid: this.routedcreateform.get('MultiserviceRoutedContactid').value,
        MultiserviceRoutedContractor: this.routedcreateform.get('MultiserviceRoutedContractor').value,
        description: this.routedcreateform.get('description').value,
        MultiserviceContractorname: MultiserviceRoutedContractorName,
        MultiserviceRoutedWishdate: this.routedcreateform.get('MultiserviceRoutedWishdate').value ? formatDate(this.routedcreateform.get('MultiserviceRoutedWishdate').value, 'dd-MM-yyyy', 'en-US') : '',
        MultiserviceRoutedWishdateEdit: this.routedcreateform.get('MultiserviceRoutedWishdate').value,
        BOUWTypeName: this.local_data.bouwtype,
        MultiserviceRoutedDescription: this.routedcreateform.get('MultiserviceRoutedDescription').value,
        orderstatename: orderstatename,
        orderstate: orderstate,
        MultiserviceRoutedInstallContractor: this.routedcreateform.get('MultiserviceRoutedInstallContractor').value,
        MultiserviceRoutedInstallContractorname: MultiserviceRoutedInstallContractor,

        MultiserviceRoutedSwitchPresent: this.routedcreateform.get('MultiserviceRoutedSwitchPresent').value,
        MultiserviceRoutedSwitchPresentname: MultiserviceRoutedSwitchPresent,
        MultiserviceRoutedIPaddress: this.routedcreateform.get('MultiserviceRoutedIPaddress').value,
        MultiserviceRoutedSubnetMask: this.routedcreateform.get('MultiserviceRoutedSubnetMask').value,
        MultiserviceRoutedProgressNotification: this.routedcreateform.get('MultiserviceRoutedProgressNotification').value,
  
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
  
    populateformdropdown() {
      this._orderservice.getBouwStateList().subscribe(data => {
        this.bouwAllState = data;
      }, (err) => {
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      });
      this._orderservice.getOrderProperty('MultiserviceRoutedSwitchPresent').subscribe(data => {
        this.Routedswitch = data;
      }, (err) => {
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      });
  
      this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
        data => {
          this.customercontactList = data;
  
          if (this.local_data.action == 'Update') {
            this.selectCustomerContact(Number(this.local_data.MultiserviceRoutedContactid));
          }
        }, error => this.toasterservice.showError(error));
  
      this.ticketservice.getCommunicationgroupByID(8).subscribe(data => {
        this.communicationgroupList = data;
  
      }, (err) => {
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      });
  
      this.ticketservice.getCommunicationgroupByID(9).subscribe(data => {
        this.communicationgroupInstallContractorList = data;
  
      }, (err) => {
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      });
  
      //$('.overlay').show();
  
      this._orderservice.getAtrbe(6).subscribe(data => {
        for (let item in data) {
          this.orderattribute.set(data[item]['attributename'], data[item]['id']);
        }
        this.buttondisabled = false;
      }, error => this.toasterservice.showError(error));
    }
  
    public hasError = (controlName: string, errorName: string) => {
      return this.routedcreateform.get(controlName).hasError(errorName);
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
          this.routedcreateform.patchValue({
            MultiserviceRoutedContactid: Number(newContactId)
          })
      }, error => this.toasterservice.showError(error));
  }
  
  
  
    selectCustomerContact(customercontactid) {
      let selectedcontactperson = this.customercontactList.find(r => r.id == customercontactid
      );
      this.routedcreateform.get('MultiserviceRoutedContactPersonEmail').setValue(selectedcontactperson.contactpersonemail);
      this.routedcreateform.get('MultiserviceRoutedContactPersonTelephone').setValue(selectedcontactperson.contactpersontelephone);
      this.routedcreateform.get('MultiserviceRoutedContactPersonFunction').setValue(selectedcontactperson.contactpersonfunction);
  
    }
  

}
