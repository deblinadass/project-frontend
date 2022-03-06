import { Component, OnInit, Injectable } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ValidatorFn, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { LocationService } from '../_services/location.service';
import { debounceTime, delay, tap, filter, map, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from '../_services/authentication.service';
import { MatSelectSearchVersion } from 'ngx-mat-select-search';
import { Customer } from '../interface/interface';
import { Location } from './location';
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
  selector: 'app-editlocation',
  templateUrl: './editlocation.component.html',
  styleUrls: ['./editlocation.component.scss']
})

export class EditlocationComponent implements OnInit {

  sublocForm: FormGroup;
  _id: string = null;
  parentcustomerid: String;
  //status: String;
  indeterminate: String;
  customertypeid: String;
  billinguser: boolean;
  regelreferentiestatus: boolean = true;
  ponumberstatus: boolean = true;
  checkbillingmodel: String;
  checkonboarding: String;

  location: Location = {
    _id: '', customername: '', streetname: '', country: null, kvknumber: null,
    kvkname: null, btwnumber: null, housenumber: null,
    housenumberaddition: null, onboardingcompleted: null,
    newsitenumber: null, billingid: null, clientaccountnumber: null, parentcustomerid: null, status: null, istestlocation: null, sla: null, monitoring: null, locationopen: null, customertypeid: null,
    postcode: null, city: null, billingmodel: null, ponumber: null, regelreferentie: null, accountmanagerid: null, locationtypeid: null, chainid: null,
    locationnote: null, comarchcustomerid: null, comarchinvoiceaccountid: null, comarchcontract: null, comarchkrn: null, filiaalnummer: null, contactinheritance: null, contractinheritance: null, servicenotesinheritance: null
  };

  isLoadingResults = true;
  submitted = false;
  validate = true;

  billingmodels = '';
  onboardingcomplete = '';

  billingmodelList: any[];
  onboardingcompletedList: any[];
  locationstatusList: any[];
  monitoringList: any[];
  onboardingcompleted: any[];
  locationopenList: any[];
  istestlocationList: any[];
  slaList: any[];


  istestlocation = '';
  sla = '';
  status = '';
  monitoring = '';
  locationopen = '';
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
    public router: Router,
    private formBuilder: FormBuilder,
    private api: LocationService,
    private route: ActivatedRoute,
    private authenticationservice: AuthenticationService,
    private toasterservice: ToasterService,
  ) {
    if (sessionStorage.getItem('sessionMainID')) {
      this._id = sessionStorage.getItem('sessionMainID');
    } else {
      sessionStorage.setItem('sessionMainID', this.router.getCurrentNavigation().extras.state.id);
      this._id = sessionStorage.getItem('sessionMainID');
    }
  }
  fetchDetailsDropdown() {
    this.api.getLocation(this._id).subscribe(data => {
      //console.log(data);
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
      }, err => this.toasterservice.showError(err));
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
      }, err => this.toasterservice.showError(err));
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
      }, err => this.toasterservice.showError(err));

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
      }, err => this.toasterservice.showError(err));
      this.billingmodels = data.billingmodel;
      this.onboardingcomplete = data.onboardingcompleted;
      this.checkbillingmodel = data.billingmodel;
      this.checkonboarding = data.onboardingcompleted;
      this.sla = data.sla;
      this.istestlocation = data.istestlocation;
      this.locationopen = data.locationopen;
      this.monitoring = data.monitoring;
      this.status = data.status;
      //console.log(data.billingmodel);

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
        monitoring: data.monitoring,
        locationopen: data.locationopen,
        istestlocation: data.istestlocation,
        sla: data.sla,
        parentcustomerid: data.parentcustomerid,
        status: data.status,
        newsitenumber: data.newsitenumber,
        billingid: data.billingid,

        billingmodel: data.billingmodel,
        ponumber: data.ponumber,
        regelreferentie: '',
        chainid: data.chainid,
        accountmanagerid: data.accountmanagerid,
        locationtypeid: data.locationtypeid,
        //countryid:data.country,
        comarchcustomerid: data.comarchcustomerid,
        comarchinvoiceaccountid: data.comarchinvoiceaccountid,
        comarchcontract: data.comarchcontract,
        comarchkrn: data.comarchkrn,
        filiaalnummer: data.filiaalnummer,

      });
    }, error => this.toasterservice.showError(error));

  }

  ngOnInit() {
    $('.overlay').show();
    this.subLocationForm();
    this.fetchDetailsDropdown();

    this.billinguser = this.authenticationservice.isBillingUser();
    if (this.billinguser) {
      this.regelreferentiestatus = false;
      this.ponumberstatus = false;
    }
    this.isLoadingResults = false;
    this.api.getLocationProperty('billingmodel').subscribe(data => {
      this.billingmodelList = data;
    }, err => this.toasterservice.showError(err));

    this.api.getLocationProperty('onboardingcompleted').subscribe(data => {
      this.onboardingcompletedList = data;
    }, err => this.toasterservice.showError(err));

    this.api.getLocationProperty('status').subscribe(data => {
      this.locationstatusList = data;
    }, err => this.toasterservice.showError(err));

    this.api.getLocationProperty('monitoring').subscribe(data => {
      this.monitoringList = data;
    }, err => this.toasterservice.showError(err));

    this.api.getLocationProperty('locationopen').subscribe(data => {
      this.locationopenList = data;
    }, err => this.toasterservice.showError(err));

    this.api.getLocationProperty('istestlocation').subscribe(data => {
      this.istestlocationList = data;
    }, err => this.toasterservice.showError(err));

    this.api.getLocationProperty('sla').subscribe(data => {
      this.slaList = data;
    }, err => this.toasterservice.showError(err));


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
      filiaalnummer: ['']
    });
  }
  selectbillingmodel() {

    const newsitenumber = this.sublocForm.get('newsitenumber');
    const billingid = this.sublocForm.get('billingid');
    const clientaccountnumber = this.sublocForm.get('clientaccountnumber');
    const onboardingcompleted = this.sublocForm.get('onboardingcompleted');
    if (this.billingmodels == '') {
      $('#onboarding').hide();
      $('#onboarding1').hide();

      $('#retailbilling').hide();
      $('#retailbilling_ponumber').hide();
      $('#intern').hide();
    }
    /*else if (this.billingmodels == '1') {
      $('#onboarding1').show();
    
      $('#retailbilling').hide();
      $('#onboarding').hide();
      $('#retailbilling_ponumber').hide();
     
      newsitenumber.clearValidators();
      clientaccountnumber.clearValidators();
      onboardingcompleted.setValue('');
    }*/
    else if (this.billingmodels == '1') {
      $('#retailbilling').show();
      $('#onboarding').show();

      $('#onboarding1').hide();
      $('#retailbilling_ponumber').show();
      $('#intern').hide();
      clientaccountnumber.setValidators([Validators.required, Validators.pattern('^[0-9A-Za-z. \-]+$')]);
      newsitenumber.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-._]+$')]);
      newsitenumber.setValue('');
      onboardingcompleted.setValue('');
      billingid.clearValidators();
    }
    else if (this.billingmodels == '2') {
      $('#retailbilling').hide();
      $('#onboarding').hide();

      $('#onboarding1').hide();
      $('#retailbilling_ponumber').hide();
      $('#intern').show();
      clientaccountnumber.clearValidators();
      newsitenumber.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-._]+$')]);
      newsitenumber.setValue('');
      billingid.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-._]+$')]);
      onboardingcompleted.clearValidators();
    }
    newsitenumber.updateValueAndValidity();
    clientaccountnumber.updateValueAndValidity();
    onboardingcompleted.updateValueAndValidity();
    billingid.updateValueAndValidity();
  }
  cancel() {
    this.router.navigate(['/locationview/', this._id]);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

  onSubmit(form: NgForm) {
    if (this.sublocForm.invalid) {
      return;
    }

    this.submitted = true;
    this.validate = false;
    if (this.billingmodels == '') {
      this.sublocForm.get('clientaccountnumber').setValue('');
      this.sublocForm.get('newsitenumber').setValue('');
      this.sublocForm.get('billingid').setValue('');
      this.sublocForm.get('onboardingcompleted').setValue('');
      this.sublocForm.get('comarchcustomerid').setValue('');
      this.sublocForm.get('comarchinvoiceaccountid').setValue('');
      this.sublocForm.get('comarchcontract').setValue('');
      this.sublocForm.get('comarchkrn').setValue('');
    }


    $('.overlay').show();

    this.api.updateLocation(this._id, JSON.stringify(form.value))

      .subscribe(res => {
        let id = res['_id'];
        $('.overlay').hide();
        this.router.navigateByUrl('/locationview', { state: { id: this._id } });
      }, error => this.toasterservice.showError(error));
  }

  get sf() {
    return this.sublocForm.controls;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.sublocForm.controls[controlName].hasError(errorName);
  }
}
