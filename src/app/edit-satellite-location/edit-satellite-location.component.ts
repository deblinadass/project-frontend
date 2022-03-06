import { Component, OnInit, Injectable } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ValidatorFn, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { Location } from './location';
import { debounceTime, delay, tap, filter, map, takeUntil } from 'rxjs/operators';
import { LocationService } from '../_services/location.service';
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from '../_services/authentication.service';
//import{ EditlocationComponent }  from '../editlocation/editlocation.component';
import { MatSelectSearchVersion } from 'ngx-mat-select-search';
import { Customer } from '../interface/interface';
import { ToasterService } from '../_services/toastr.service';
declare var $: any;


export interface BillingModel {
  id: string;
  name: string;
}

export interface Onboardingcompleted {
  name: string;
  value: string;
}

export interface Monitoring {
  id: string;
  name: string;
}

export interface Locationopen {
  id: string;
  name: string;
}

export interface Status {
  id: string;
  name: string;
}

export interface Sla {
  id: string;
  name: string;
}

export interface Istestlocation {
  id: string;
  name: string;
}

@Component({
  selector: 'app-edit-satellite-location',
  templateUrl: './edit-satellite-location.component.html',
  styleUrls: ['./edit-satellite-location.component.scss']
})

export class EditSatelliteLocationComponent implements OnInit {
  sublocForm: FormGroup;
  _id: string = null;
  parentcustomerid: String;
  //status: String;
  indeterminate: String;
  customertypeid: String;
  billinguser: boolean;
  regelreferentiestatus: boolean = true;
  ponumberstatus: boolean = true;

  location: Location = {
    _id: '', customername: '', streetname: '', country: null, kvknumber: null,
    kvkname: null, btwnumber: null, salescloudreferencenumber: null, housenumber: null,
    housenumberaddition: null, netcode: null, onboardingcompleted: null,
    newsitenumber: null, billingid: null, clientaccountnumber: null, parentcustomerid: null, status: null, istestlocation: null, sla: null, monitoring: null, locationopen: null, customertypeid: null,
    postcode: null, city: null, contactpersonname: null, contactpersontelephone: null, contactpersonfunction: null,
    contactpersonemail: null, billingmodel: null, ponumber: null, regelreferentie: null
  };

  isLoadingResults = true;
  submitted = false;
  billingmodels = '';
  onboardingcomplete = '';
  istestlocation = '';
  sla = '';
  status = '';
  monitoring = '';
  locationopen = '';
  billingmodelList: any[];
  onboardingcompletedList: any[];
  locationstatusList: any[];
  monitoringList: any[];
  onboardingcompleted: any[];
  locationopenList: any[];
  istestlocationList: any[];
  slaList: any[];
  checkbillingmodel = '';
  checkonboarding = '';
  validate = true;
  billingmodelstatus: boolean;
  accessdata: any[];
  chain = '';
  accountmanager = '';
  locationtype = '';
  matSelectSearchVersion = MatSelectSearchVersion;
  chainlist = new Map<number, string>();
  chainid;
  chainVal;
  accountmanagerList = new Map<string, string>();
  accountmanagerid;
  accountmanagerVal;
  locationtypeList = new Map<string, string>();
  locationtypeid;
  locationtypeVal;
  countryList = new Map<string, string>();
  countryid;
  countryVal;

  /* Chain Dropdown */
  noRecordFound;
  public chainFilteringCtrl: FormControl = new FormControl();
  protected chaindata;
  public searchingChain: boolean = false;
  public filteredServerSideChains: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  protected _onDestroyChain = new Subject<void>();
  /* Accountmanager Dropdown */
  public accountmanagerFilteringCtrl: FormControl = new FormControl();
  protected accountmanagerdata;
  public searchingAccountmanager: boolean = false;
  public filteredServerSideAccountmanagers: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  protected _onDestroyAccountmanager = new Subject<void>();
  /* locationtype Dropdown */
  public locationtypeFilteringCtrl: FormControl = new FormControl();
  protected locationtypedata;
  public searchingLocationtype: boolean = false;
  public filteredServerSideLocationtypes: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  protected _onDestroyLocationtype = new Subject<void>();
  /* country Dropdown */
  public countryFilteringCtrl: FormControl = new FormControl();
  protected countrydata;
  public searchingCountry: boolean = false;
  public filteredServerSideCountry: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  protected _onDestroyCountry = new Subject<void>();
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private api: LocationService,
    private route: ActivatedRoute,
    private authenticationservice: AuthenticationService,
    private toasterservice: ToasterService,
    // private editlocationObj:EditlocationComponent
  ) {

    if (sessionStorage.getItem('sessionSatelliteID')) {
      this._id = sessionStorage.getItem('sessionSatelliteID');
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this._id = sessionStorage.getItem('sessionSatelliteID');
    }
  }
  fetchDetailsDropdown() {

    this.api.getLocation(this._id).subscribe(data => {

      this.chainid = data.chainid;
      this.locationtypeid = data.locationtypeid;
      this.accountmanagerid = data.accountmanagerid;
      this.countryid = data.country;
      /**Fetch chains */
      $('.overlay').show();

      this.api.getAllChain().subscribe(data => {

        for (let item in data['result']) {
          this.chainlist.set(data['result'][item]['chainid'], data['result'][item]['chainname']);
        }
        //Assinging selected chain value to dropdown while edit loads   
        this.chainVal = [{ "chainid": this.chainid, "chainname": this.chainlist.get(this.chainid) }];
        this.filteredServerSideChains.next(this.chainVal);

        this.chaindata = data;
        if (data != null || data.length !== 0) {
          this.chaindata = data;
        }
        $('.overlay').hide();
      }, error => this.toasterservice.showError(error));
      /**Fetch Accountmanger **/
      $('.overlay').show();
      this.api.getLocationProperty('accountmanager').subscribe(data => {

        for (let item in data) {
          this.accountmanagerList.set(data[item]['id'], data[item]['name']);
        }
        //Assinging selected accountmanager value to dropdown while edit loads   
        this.accountmanagerVal = [{ "id": this.accountmanagerid, "name": this.accountmanagerList.get(String(this.accountmanagerid)) }];
        this.filteredServerSideAccountmanagers.next(this.accountmanagerVal);
        this.accountmanagerdata = data;

        if (data != null || data.length !== 0) {
          this.accountmanagerdata = data;
        }
        $('.overlay').hide();
      }, error => this.toasterservice.showError(error));
      /**Fetch Locationtype **/
      $('.overlay').show();
      this.api.getLocationProperty('locationtype').subscribe(data => {

        for (let item in data) {
          this.locationtypeList.set(data[item]['id'], data[item]['name']);
        }
        //Assinging selected locationtype value to dropdown while edit loads   
        this.locationtypeVal = [{ "id": this.locationtypeid, "name": this.locationtypeList.get(String(this.locationtypeid)) }];
        this.filteredServerSideLocationtypes.next(this.locationtypeVal);

        this.locationtypedata = data;
        if (data != null || data.length !== 0) {
          this.locationtypedata = data;
        }
        $('.overlay').hide();
      }, error => this.toasterservice.showError(error));

      /**Fetch Country **/
      $('.overlay').show();
      this.api.getAllCountry().subscribe(data => {

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
      this.billingmodels = data.billingmodel;
      this.onboardingcomplete = data.onboardingcompleted;
      this.checkbillingmodel = data.billingmodel;
      this.checkonboarding = data.onboardingcompleted;
      this.sla = data.sla;
      this.istestlocation = data.istestlocation;
      this.locationopen = data.locationopen;
      this.monitoring = data.monitoring;
      this.status = data.status;


      this.selectbillingmodel();
      $('.overlay').hide();

      this.sublocForm.setValue({
        customername: data.customername,
        streetname: data.streetname,
        country: data.country,
        kvknumber: data.kvknumber,
        kvkname: data.kvkname,
        btwnumber: data.btwnumber,

        housenumber: data.housenumber,
        housenumberaddition: data.housenumberaddition,
        postcode: data.postcode,
        city: data.city,
        clientaccountnumber: data.clientaccountnumber,
        customertypeid: data.customertypeid,

        onboardingcompleted: data.onboardingcompleted,
        parentcustomerid: data.parentcustomerid,
        monitoring: data.monitoring,
        locationopen: data.locationopen,
        istestlocation: data.istestlocation,
        sla: data.sla,
        status: data.status,
        newsitenumber: data.newsitenumber,
        billingid: data.billingid,

        billingmodel: data.billingmodel,
        ponumber: data.ponumber,
        regelreferentie: '',
        chainid: data.chainid,
        accountmanagerid: data.accountmanagerid,
        locationtypeid: data.locationtypeid,
        comarchcustomerid: data.comarchcustomerid,
        comarchinvoiceaccountid: data.comarchinvoiceaccountid,
        comarchcontract: data.comarchcontract,
        comarchkrn: data.comarchkrn,
        filiaalnummer: data.filiaalnummer,
        contactinheritance: data.contactinheritance == 1 ? true : false,
        contractinheritance: data.contractinheritance == 1 ? true : false,
        servicenotesinheritance: data.servicenotesinheritance == 1 ? true : false

      });
    }, error => this.toasterservice.showError(error));

  }

  ngOnInit() {
    $('.overlay').show();
    this.subLocationForm();
    this.fetchDetailsDropdown();

    this.isLoadingResults = false;



    this.api.getLocationProperty('billingmodelsatellite').subscribe(data => {
      this.billingmodelList = data;

    }, error => this.toasterservice.showError(error));

    this.api.getLocationProperty('onboardingcompleted').subscribe(data => {
      this.onboardingcompletedList = data;
    }, error => this.toasterservice.showError(error));

    this.api.getLocationProperty('status').subscribe(data => {
      this.locationstatusList = data;
    }, error => this.toasterservice.showError(error));

    this.api.getLocationProperty('monitoring').subscribe(data => {
      this.monitoringList = data;
    }, error => this.toasterservice.showError(error));

    this.api.getLocationProperty('locationopen').subscribe(data => {
      this.locationopenList = data;
    }, error => this.toasterservice.showError(error));

    this.api.getLocationProperty('istestlocation').subscribe(data => {
      this.istestlocationList = data;
    }, error => this.toasterservice.showError(error));

    this.api.getLocationProperty('sla').subscribe(data => {
      this.slaList = data;
    }, error => this.toasterservice.showError(error));


  }

  subLocationForm() {
    this.sublocForm = this.formBuilder.group({
      customername: ['', [Validators.required, Validators.pattern('^[0-9A-Za-z. \-]+$')]],
      streetname: ['', Validators.required],
      country: ['', Validators.required],
      kvknumber: ['', [Validators.required, Validators.pattern('^[0-9A-Za-z. \-]+$')]],
      kvkname: ['', [Validators.required, Validators.pattern('^[0-9A-Za-z. \-]+$')]],
      btwnumber: ['', Validators.pattern('^[0-9A-Za-z. \-]+$')],

      housenumber: ['', Validators.required],
      housenumberaddition: [''],
      postcode: ['', Validators.required],
      city: ['', Validators.required],
      clientaccountnumber: ['', [Validators.required, Validators.pattern('^[0-9A-Za-z. \-]+$')]],
      customertypeid: ['', Validators.required],

      onboardingcompleted: ['', Validators.required],
      parentcustomerid: ['', Validators.required],
      monitoring: [''],
      locationopen: ['', Validators.required],
      istestlocation: ['', Validators.required],
      sla: ['', Validators.required],
      status: ['', Validators.required],
      newsitenumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-._]+$')]],
      billingid: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-._]+$')]],

      billingmodel: ['', Validators.required],
      ponumber: ['', Validators.pattern('^[0-9A-Za-z. \-]+$')],
      regelreferentie: [''],
      chainid: ['', Validators.required],
      accountmanagerid: ['', Validators.required],
      locationtypeid: ['', Validators.required],
      comarchcustomerid: [''],
      comarchinvoiceaccountid: [''],
      comarchcontract: [''],
      comarchkrn: [''],
      filiaalnummer: [''],
      contactinheritance: [''],
      contractinheritance: [''],
      servicenotesinheritance: ['']
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

    /** Auto Search chain Move **/
    /**** Auto Search accountmanager Move ******/
    this.accountmanagerFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searchingAccountmanager = true),
        takeUntil(this._onDestroyAccountmanager),
        debounceTime(200),
        map(search => {
          if (!this.accountmanagerdata) {
            return [];
          }

          return this.accountmanagerdata.filter(accountmanagerval => accountmanagerval.name.toLowerCase().indexOf(search.toLowerCase()) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredAccountmanagers => {
        if (filteredAccountmanagers == null || filteredAccountmanagers === 0 || filteredAccountmanagers.length === 0) {
          this.noRecordFound = 0;
          this.filteredServerSideAccountmanagers.next(filteredAccountmanagers);
        } else {
          this.noRecordFound = 1;
          this.searchingAccountmanager = false;
          this.filteredServerSideAccountmanagers.next(filteredAccountmanagers);
        }

      },
        error => {
          this.searchingAccountmanager = false;
          this.toasterservice.showError(error);
        });

    /** Auto Search accountmanager Move **/
    /**** Auto Search locationtype Move ******/
    this.locationtypeFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searchingLocationtype = true),
        takeUntil(this._onDestroyLocationtype),
        debounceTime(200),
        map(search => {
          if (!this.locationtypedata) {
            return [];
          }
          return this.locationtypedata.filter(locationtypeval => locationtypeval.name.toLowerCase().indexOf(search.toLowerCase()) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredLocationtypes => {
        if (filteredLocationtypes == null || filteredLocationtypes === 0 || filteredLocationtypes.length === 0) {
          this.noRecordFound = 0;
          this.filteredServerSideLocationtypes.next(filteredLocationtypes);
        } else {
          this.noRecordFound = 1;
          this.searchingLocationtype = false;
          this.filteredServerSideLocationtypes.next(filteredLocationtypes);
        }

      },
        error => {
          this.searchingLocationtype = false;
          this.toasterservice.showError(error);
        });

    /** Auto Search locationtype  **/
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
  ngAfterViewInit(): void {
    this.dropdownchanges();
  }

  selectbillingmodel() {


    const newsitenumber = this.sublocForm.get('newsitenumber');
    const billingid = this.sublocForm.get('billingid');
    const clientaccountnumber = this.sublocForm.get('clientaccountnumber');
    const onboardingcompleted = this.sublocForm.get('onboardingcompleted');

    if (this.billingmodels == '' || this.billingmodels == '0') {
      $('#onboarding').hide();
      $('#onboarding1').hide();

      $('#retailbilling').hide();
      $('#retailbilling_ponumber').hide();
      $('#mainbilling_regelreferentie').show();
      $('#intern').hide();

      newsitenumber.clearValidators();
      billingid.clearValidators();
      clientaccountnumber.clearValidators();
      onboardingcompleted.setValue('0');
    }
    /*else if (this.billingmodels == '1') {
      $('#onboarding1').show();
     
      $('#retailbilling').hide();
      $('#onboarding').hide();
      $('#retailbilling_ponumber').hide();
      $('#mainbilling_regelreferentie').hide();
     
      newsitenumber.clearValidators();
      clientaccountnumber.clearValidators();
      onboardingcompleted.setValue('');
    }*/
    else if (this.billingmodels == '1') {
      $('#retailbilling').show();
      $('#onboarding').show();
      // $('#netcode').hide();
      $('#onboarding1').hide();
      $('#retailbilling_ponumber').show();
      $('#mainbilling_regelreferentie').hide();
      $('#intern').hide();
      clientaccountnumber.setValidators([Validators.required, Validators.pattern('^[0-9A-Za-z. \-]+$')]);
      newsitenumber.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-_.]+$')]);
      newsitenumber.setValue('');
      billingid.clearValidators();
      onboardingcompleted.setValue('');
    }
    else if (this.billingmodels == '2') {

      $('#retailbilling').hide();
      $('#onboarding').hide();
      // $('#netcode').hide();
      $('#onboarding1').hide();
      $('#retailbilling_ponumber').hide();
      $('#mainbilling_regelreferentie').hide();
      $('#intern').show();
      clientaccountnumber.clearValidators();
      newsitenumber.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-_.]+$')]);
      newsitenumber.setValue('');
      billingid.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-_.]+$')]);
      onboardingcompleted.clearValidators();
    }
    newsitenumber.updateValueAndValidity();
    clientaccountnumber.updateValueAndValidity();
    billingid.updateValueAndValidity();
    onboardingcompleted.updateValueAndValidity();
  }

  cancel() {
    this.router.navigate(['/satellite', this._id]);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //console.error(error); // log to console instead
      return of(result as T);
    };
  }

  onSubmit(form: NgForm) {
    if (this.sublocForm.invalid) {
      return;
    }
    this.submitted = true;
    //this.validate = false;


    if (this.billingmodels == '' || this.billingmodels == '0') {
      this.sublocForm.get('billingid').setValue('');
      this.sublocForm.get('clientaccountnumber').setValue('');
      this.sublocForm.get('newsitenumber').setValue('');
      this.sublocForm.get('onboardingcompleted').setValue('0');
      this.sublocForm.controls['ponumber'].setValue('');
      this.sublocForm.get('comarchcustomerid').setValue('');
      this.sublocForm.get('comarchinvoiceaccountid').setValue('');
      this.sublocForm.get('comarchcontract').setValue('');
      this.sublocForm.get('comarchkrn').setValue('');
    }
    if (form.value.contactinheritance == true)
      form.value.contactinheritance = 1;
    else
      form.value.contactinheritance = 0;
    if (form.value.contractinheritance == true)
      form.value.contractinheritance = 1;
    else
      form.value.contractinheritance = 0;
    if (form.value.servicenotesinheritance == true)
      form.value.servicenotesinheritance = 1;
    else
      form.value.servicenotesinheritance = 0;
    if (this.billingmodels == '1') {
      // this.sublocForm.get('netcode').setValue('');
      this.sublocForm.controls['regelreferentie'].setValue('');
    }
    $('.overlay').show();

    this.api.updateLocation(this._id, JSON.stringify(form.value))
      .subscribe(res => {
        let id = res['_id'];
        $('.overlay').hide();
        this.router.navigateByUrl('/satellite', { state: { id: this._id } });
      }, error => this.toasterservice.showError(error));
  }

  get sf() {
    return this.sublocForm.controls;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.sublocForm.controls[controlName].hasError(errorName);
  }
}