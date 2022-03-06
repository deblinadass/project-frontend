import { Component, OnInit, Injectable } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ValidatorFn, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, delay, tap, filter, map, takeUntil } from 'rxjs/operators';

import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { MatSelectSearchVersion } from 'ngx-mat-select-search';

import { LocationService } from '../_services/location.service';
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from '../_services/authentication.service';
import { Customer } from '../interface/interface';
import { ToasterService } from '../_services/toastr.service';
declare var $: any;

export interface BillingModel {
  id: string;
  name: string;
}

export interface Onboardingcompleted {
  id: string;
  name: string;
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
  selector: 'app-createlocation',
  templateUrl: './createlocation.component.html',
  styleUrls: ['./createlocation.component.scss']
})
export class CreatelocationComponent implements OnInit {
  createlocForm: FormGroup;
  _id: string = null;
  parentcustomerid: String;
  //status: String;
  indeterminate: String;
  customertypeid: String;
  billinguser: boolean;
  regelreferentiestatus: boolean = true;
  ponumberstatus: boolean = false;

  isLoadingResults = false;
  submitted = false;
  validate = true;

  billingmodelList: any[];
  locationstatusList: any[];
  monitoringList: any[];
  onboardingcompleted: any[];
  locationopenList: any[];
  istestlocationList: any[];
  slaList: any[];


  billingmodels = '';
  onboardingcomplete = '';
  istestlocation = '';
  sla = '';
  status = '';
  chain = '';
  monitoring = '';
  locationopen = '';
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

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private api: LocationService,
    private route: ActivatedRoute,
    private authenticationservice: AuthenticationService,
    private toasterservice: ToasterService,
  ) { }

  change() {

    this.createlocForm.get('kvkname').setValue(this.createlocForm.get('customername').value);
  }


  ngOnInit() {
    this.billingmodels = '';
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
      customertypeid: 1,
      netcode: '',
      onboardingcompleted: '',
      parentcustomerid: '0',
      status: '',
      monitoring: '1',
      locationopen: '',
      istestlocation: '',
      sla: '',
      newsitenumber: '',
      billingid: '',
      billingmodel: '',
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

    });
    this.billinguser = this.authenticationservice.isBillingUser();
    if (this.billinguser) {
      this.regelreferentiestatus = false;
      this.ponumberstatus = false;
    }

    this.isLoadingResults = false;

    this.api.getLocationProperty('billingmodel').subscribe(data => {
      this.billingmodelList = data;
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




    this.api.getLocationProperty('onboardingcompleted').subscribe(data => {
      this.onboardingcompleted = data;
    }, err => this.toasterservice.showError(err));


    /**Fetch chains */
    $('.overlay').show();
    this.api.getAllChain().subscribe(data => {
      this.chaindata = data;
      if (data != null || data.length !== 0) {
        this.chaindata = data;
      }
      $('.overlay').hide();
    }, err => this.toasterservice.showError(err));
    /**Fetch Accountmanger **/
    $('.overlay').show();
    this.api.getLocationProperty('accountmanager').subscribe(data => {
      this.accountmanagerdata = data;

      if (data != null || data.length !== 0) {
        this.accountmanagerdata = data;
      }
      $('.overlay').hide();
    }, err => this.toasterservice.showError(err));
    /**Fetch Locationtype **/
    $('.overlay').show();
    this.api.getLocationProperty('locationtype').subscribe(data => {
      this.locationtypedata = data;
      if (data != null || data.length !== 0) {
        this.locationtypedata = data;
      }
      $('.overlay').hide();
    }, err => this.toasterservice.showError(err));

    /**Fetch Country **/
    $('.overlay').show();
    this.api.getAllCountry().subscribe(data => {
      this.countrydata = data;
      if (data != null || data.length !== 0) {
        this.countrydata = data;
      }
      $('.overlay').hide();
    }, err => this.toasterservice.showError(err));

  }
  ngAfterViewInit(): void {

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
          this.toasterservice.showError(error);
          this.searchingChain = false;
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
      netcode: ['', Validators.required],
      onboardingcompleted: ['', Validators.required],
      parentcustomerid: [''],
      monitoring: [''],
      locationopen: ['', Validators.required],
      istestlocation: ['', Validators.required],
      sla: ['', Validators.required],
      status: ['', Validators.required],
      newsitenumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-._]+$')]],
      //billingid: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-._]+$')]],
      billingid: [''],
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
    });
  }
  selectbillingmodel() {
    const netcode = this.createlocForm.get('netcode');
    const newsitenumber = this.createlocForm.get('newsitenumber');
    const billingid = this.createlocForm.get('billingid');
    const clientaccountnumber = this.createlocForm.get('clientaccountnumber');
    const onboardingcompleted = this.createlocForm.get('onboardingcompleted');

    const comarchcustomerid = this.createlocForm.get('comarchcustomerid');
    const comarchinvoiceaccountid = this.createlocForm.get('comarchinvoiceaccountid');
    const comarchcontract = this.createlocForm.get('comarchcontract');
    const comarchkrn = this.createlocForm.get('comarchkrn');

    if (this.billingmodels == '') {
      $('#onboarding').hide();
      $('#onboarding1').hide();
      $('#netcode').hide();
      $('#retailbilling').hide();
      $('#retailbilling_ponumber').hide();
      $('#intern').hide();
    }

    else if (this.billingmodels == '1') {
      $('#onboarding').show();
      $('#retailbilling').show();
      $('#retailbilling_ponumber').show();
      $('#netcode').hide();
      $('#onboarding1').hide();
      $('#intern').hide();
      clientaccountnumber.setValidators([Validators.required, Validators.pattern('^[0-9A-Za-z. \-]+$')]);
      newsitenumber.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-._]+$')]);
      newsitenumber.setValue('');
      billingid.clearValidators();
      netcode.clearValidators();
      onboardingcompleted.setValue('');
      comarchcustomerid.setValue('');
      comarchinvoiceaccountid.setValue('');
      comarchcontract.setValue('');
      comarchkrn.setValue('');
    }
    else if (this.billingmodels == '2') {
      $('#onboarding').hide();
      $('#retailbilling').hide();
      $('#retailbilling_ponumber').hide();
      $('#netcode').hide();
      $('#onboarding1').hide();
      $('#intern').show();
      clientaccountnumber.clearValidators();
      newsitenumber.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-._]+$')]);
      newsitenumber.setValue('');
      billingid.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9- \+-._]+$')]);
      netcode.clearValidators();
      onboardingcompleted.clearValidators();
    }
    newsitenumber.updateValueAndValidity();
    clientaccountnumber.updateValueAndValidity();
    netcode.updateValueAndValidity();
    onboardingcompleted.updateValueAndValidity();
    billingid.updateValueAndValidity();
    comarchcustomerid.updateValueAndValidity();
    comarchinvoiceaccountid.updateValueAndValidity();
    comarchcontract.updateValueAndValidity();
    comarchkrn.updateValueAndValidity();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //console.error(error); // log to console instead
      return of(result as T);
    };
  }

  cancel() {
    this.createlocForm.reset();
    this.router.navigate(['/customersearch']);
  }

  onSubmit(form: NgForm) {
    if (this.createlocForm.invalid) {
      return;
    }

    this.submitted = true;
    this.validate = false;


    if (this.billingmodels == '') {
      this.createlocForm.get('comarchcustomerid').setValue('');
      this.createlocForm.get('comarchinvoiceaccountid').setValue('');
      this.createlocForm.get('comarchcontract').setValue('');
      this.createlocForm.get('comarchkrn').setValue('');
    }
    else if (this.billingmodels == '1') {
      this.createlocForm.get('billingid').setValue('');
    }

    $('.overlay').show();

    //console.log(JSON.stringify(form.value));
    this.api.addLocation(JSON.stringify(form.value))

      .subscribe(res => {
        let customerid = res['customerid'];
        this.isLoadingResults = false;
        this.router.navigateByUrl('/locationview', { state: { id: customerid } });
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
