import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '../editlocation/location';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ValidatorFn, NgForm } from '@angular/forms';
import { debounceTime, delay, tap, filter, map, takeUntil } from 'rxjs/operators';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { LocationService } from '../_services/location.service';
import { Customer } from '../interface/interface';
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from '../_services/authentication.service';
import { MatSelectSearchVersion } from 'ngx-mat-select-search';
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
  selector: 'app-create-satellite-location',
  templateUrl: './create-satellite-location.component.html',
  styleUrls: ['./create-satellite-location.component.scss']
})
export class CreateSatelliteLocationComponent implements OnInit {
  createlocForm: FormGroup;
  _id: string = null;
  parentcustomerid: String;
  indeterminate: String;
  customertypeid: String;
  //status: String;
  superuser: boolean;
  mainbillingmodel: string;
  billinguser: boolean;
  regelreferentiestatus: boolean = true;
  ponumberstatus: boolean = true;
  chain = '';
  accountmanager = '';
  locationtype = '';
  matSelectSearchVersion = MatSelectSearchVersion;
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
  chainlist = new Map<number, string>();
  chainVal;
  chainid;
  accountmanagerList = new Map<string, string>();
  accountmanagerid;
  accountmanagerVal;
  locationtypeList = new Map<string, string>();
  locationtypeid;
  locationtypeVal;
  countryList = new Map<string, string>();
  countryid;
  countryVal;

  isLoadingResults = false;
  submitted = false;
  billingmodelList: any[];
  onboardingcompleted: any[];
  billingmodelstatus: boolean = true;
  locationstatusList: any[];
  monitoringList: any[];
  locationopenList: any[];
  istestlocationList: any[];
  slaList: any[];
  validate = true;
  billingmodels = '';
  onboardingcomplete = '';
  istestlocation = '';
  sla = '';
  status = '';
  monitoring = '';
  locationopen = '';
  accessdata: any[];

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
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

  change() {
    this.createlocForm.get('kvkname').setValue(this.createlocForm.get('customername').value);
  }
  fetchDetailsDropdown() {

    /**Fetch chains */
    $('.overlay').show();
    this.api.getAllChain().subscribe(data => {
      this.chaindata = data;

      if (data != null || data.length !== 0) {
        this.chaindata = data;
      }
      $('.overlay').hide();
    }, error => this.toasterservice.showError(error));
    /**Fetch Accountmanger **/
    $('.overlay').show();
    this.api.getLocationProperty('accountmanager').subscribe(data => {
      this.accountmanagerdata = data;

      if (data != null || data.length !== 0) {
        this.accountmanagerdata = data;
      }
      $('.overlay').hide();
    }, error => this.toasterservice.showError(error));
    /**Fetch Locationtype **/
    $('.overlay').show();
    this.api.getLocationProperty('locationtype').subscribe(data => {
      this.locationtypedata = data;
      if (data != null || data.length !== 0) {
        this.locationtypedata = data;
      }
      $('.overlay').hide();
    }, error => this.toasterservice.showError(error));

    /**Fetch Country **/
    $('.overlay').show();
    this.api.getAllCountry().subscribe(data => {
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

  ngOnInit() {

    this.billingmodels = '';
    this.fetchDetailsDropdown();
    $('.overlay').hide();
    this.subLocationForm();
    this.createlocForm.setValue({
      customername: '',
      streetname: '',
      country: '',
      kvknumber: '',
      kvkname: '',
      btwnumber: '',
      housenumber: '',
      housenumberaddition: '',
      postcode: '',
      city: '',
      clientaccountnumber: '',
      customertypeid: 2,
      onboardingcompleted: '',
      parentcustomerid: this._id,
      status: '',
      monitoring: '1',
      locationopen: '',
      istestlocation: '',
      sla: '',
      newsitenumber: '',
      billingid: '',
      billingmodel: this.billingmodels,
      ponumber: '',
      regelreferentie: '',
      chainid: '',
      accountmanagerid: '',
      locationtypeid: '',
      comarchcustomerid: '',
      comarchinvoiceaccountid: '',
      comarchcontract: '',
      comarchkrn: '',
      filiaalnummer: '',
      contactinheritance: '',
      contractinheritance: '',
      servicenotesinheritance: '',
      //customerid: this._id,
    });



    this.isLoadingResults = false;
    this.api.getLocationProperty('billingmodelsatellite').subscribe(data => {
      this.billingmodelList = data;
      this.superuser = this.authenticationservice.isSuperUser();
      this.billinguser = this.authenticationservice.isBillingUser();
      if (this.billinguser) {
        this.regelreferentiestatus = false;
        this.ponumberstatus = false;
      }

      this.api.getMainBillingmodel(this._id).subscribe(data => {
        this.mainbillingmodel = data.result;
        this.billingmodels = "0";

      }, error => this.toasterservice.showError(error));

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



    this.selectbillingmodel();

    this.api.getLocationProperty('onboardingcompleted').subscribe(data => {
      this.onboardingcompleted = data;
    }, error => this.toasterservice.showError(error));
  }
  ngAfterViewInit(): void {
    this.dropdownchanges();
  }

  subLocationForm() {
    this.createlocForm = this.formBuilder.group({
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
      status: ['', Validators.required],
      monitoring: [''],
      locationopen: ['', Validators.required],
      istestlocation: ['', Validators.required],
      sla: ['', Validators.required],
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
      contactinheritance: '',
      contractinheritance: '',
      servicenotesinheritance: '',
      //customerid: this._id,

    });
  }
  updateDropdownValuesMainLocation(id) {
    this.api.getLocation(id).subscribe(data => {

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

        this.countryVal = [{ "countryid": this.countryid, "countryname": this.countryList.get(this.countryid) }];
        this.filteredServerSideCountry.next(this.countryVal);

        this.countrydata = data;
        if (data != null || data.length !== 0) {
          this.countrydata = data;
        }
        $('.overlay').hide();
      }, error => this.toasterservice.showError(error));
    }, error => this.toasterservice.showError(error));
  }
  inheritValueFromMain() {
    $('.overlay').show();
    this.billingmodels = "0";
    this.updateDropdownValuesMainLocation(this._id);
    this.api.getLocation(this._id).subscribe(data => {
      this.billingmodels = '0';
      this.selectbillingmodel();
      this.onboardingcomplete = data.onboardingcompleted;

      $('.overlay').hide();
      this.createlocForm.setValue({
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
        customertypeid: 2,
        onboardingcompleted: data.onboardingcompleted,
        parentcustomerid: this._id,
        status: data.status,
        newsitenumber: data.newsitenumber,
        billingid: data.billingid,
        billingmodel: this.billingmodels,
        ponumber: data.ponumber,
        regelreferentie: data.regelreferentie,
        chainid: data.chainid,
        accountmanagerid: data.accountmanagerid,
        locationtypeid: data.locationtypeid,
        comarchcustomerid: data.comarchcustomerid,
        comarchinvoiceaccountid: data.comarchinvoiceaccountid,
        comarchcontract: data.comarchcontract,
        comarchkrn: data.comarchkrn,
        monitoring: data.monitoring,
        locationopen:data.locationopen,
        istestlocation: data.istestlocation,
        sla: data.sla,
        contactinheritance:0,
        contractinheritance: 0,
        servicenotesinheritance: 0,
        filiaalnummer: (data.filiaalnummer != null && data.filiaalnummer != '') ? data.filiaalnummer : '',

      });
    }, error => this.toasterservice.showError(error));

  }
  selectbillingmodel() {
    const newsitenumber = this.createlocForm.get('newsitenumber');
    const billingid = this.createlocForm.get('billingid');
    const clientaccountnumber = this.createlocForm.get('clientaccountnumber');
    const onboardingcompleted = this.createlocForm.get('onboardingcompleted');
    if (this.billingmodels.trim() == '' || this.billingmodels.trim() == '0') {
      $('#onboarding').hide();
      $('#retailbilling').hide();
      $('#onboarding1').hide();
      $('#retailbilling_ponumber').hide();
      $('#mainbilling_regelreferentie').show();
      $('#intern').hide();
      newsitenumber.clearValidators();
      clientaccountnumber.clearValidators();
      onboardingcompleted.setValue('0');
      billingid.setValue('');
      billingid.clearValidators();
      onboardingcompleted.clearValidators();
    }

    else if (this.billingmodels.trim() == '1') {
      $('#onboarding').show();
      $('#retailbilling').show();

      $('#onboarding1').hide();
      $('#retailbilling_ponumber').show();
      $('#mainbilling_regelreferentie').hide();
      $('#intern').hide();
      clientaccountnumber.setValidators([Validators.required, Validators.pattern('^[0-9A-Za-z. \-]+$')]);
      newsitenumber.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-._]+$')]);
      newsitenumber.setValue('');
      billingid.clearValidators();
      onboardingcompleted.setValue('');
    }
    else if (this.billingmodels.trim() == '2') {
      $('#onboarding').hide();
      $('#retailbilling').hide();

      $('#onboarding1').hide();
      $('#retailbilling_ponumber').hide();
      $('#mainbilling_regelreferentie').hide();
      $('#intern').show();
      clientaccountnumber.clearValidators();
      newsitenumber.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-._]+$')]);
      newsitenumber.setValue('');
      billingid.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-._]+$')]);
      onboardingcompleted.clearValidators();
    }
    newsitenumber.updateValueAndValidity();
    clientaccountnumber.updateValueAndValidity();
    billingid.updateValueAndValidity();
    onboardingcompleted.updateValueAndValidity();
  }

  cancel() {
    this.createlocForm.reset();
    this.router.navigate(['/locationview', this._id]);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //console.error(error); // log to console instead
      return of(result as T);
    };
  }

  onSubmit(form: NgForm) {
    if (this.createlocForm.invalid) {
      const invalid = [];
      const controls = this.createlocForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }

      return;
    }
    this.submitted = true;

    if (this.billingmodels == '' || this.billingmodels == '0') {
      this.createlocForm.get('clientaccountnumber').setValue('');
      this.createlocForm.get('newsitenumber').setValue('');
      this.createlocForm.get('billingid').setValue('');
      this.createlocForm.get('onboardingcompleted').setValue('0');
      this.createlocForm.controls['ponumber'].setValue('');
      this.createlocForm.get('comarchcustomerid').setValue('');
      this.createlocForm.get('comarchinvoiceaccountid').setValue('');
      this.createlocForm.get('comarchcontract').setValue('');
      this.createlocForm.get('comarchkrn').setValue('');
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

    if (this.billingmodels == '2') {
      this.createlocForm.controls['regelreferentie'].setValue('');
    }
    $('.overlay').show();

    this.api.addLocation(JSON.stringify(form.value))
      .subscribe(res => {
        let id = res['parentcustomerid'];
        this.isLoadingResults = false;
        $('.overlay').hide();
        this.router.navigateByUrl('/locationview', { state: { id: this._id } });
      }, (err) => {
        $('.overlay').hide();
        this.isLoadingResults = false;
        this.toasterservice.showError(err);
      });
  }

  get sf() {
    return this.createlocForm.controls;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.createlocForm.controls[controlName].hasError(errorName);
  }
}