import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { LocationService } from '../_services/location.service';
import { formatDate } from '@angular/common';
import { CommonService } from '../_services/common.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ValidatorFn, NgForm } from '@angular/forms';
import { ModalService } from '../modal/modal.service';
//import { CustomerContactdialogBoxComponent } from '../customercontactdialog-box/customercontactdialog-box.component';
import moment from "moment";
import 'moment-timezone';
moment.tz.setDefault('Europe/Amsterdam');
import { DatePipe } from '@angular/common';
import { ToasterService } from '../_services/toastr.service';

declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ContractComponent implements OnInit, AfterViewInit {
  currentlyOpenedItemIndex = -1;
  contracts: any[] = [];
  contractForm: FormGroup;
  revenueForm: FormGroup;
  valuationForm: FormGroup;
  secondlevel;
  id;
  formLoaded = false;
  contract_list: any;
  attribute_value_list: any;
  loading = true;
  rowoverlay = false;
  enddatefixed: any[];
  locationinvestigation: any[];
  ponumberrequired: any[];
  customerservicei: any[];
  customerserviceii: any[];
  segmentationbasedrevenue: any[];
  ebitda: any[];
  strategicvaluehs: any[];
  conclusioncustomer: any[];
  activeLinkIndex = -1;
  apiUrl: any;
  statusCheck: boolean = false;
  superuser: boolean;
  expandedElement: any[] = [];
  statusDateTime: any;
  statusVal;
  additionalContactInfo: any[] = [];
  tabSectionList: any[] = [];
  tabsubsections: Array<any> = [];
  minDate = new Date(2020, 0, 1);
  contractid = '';
  revenueid = '';
  valuationid = '';

  displayedContactColumns: string[] = ['contactpersonname', 'gender', 'contactpersonemail', 'contactpersontelephone', 'contactpersonfunction', 'newsletter', 'nps', 'report', 'mijn', 'action', 'overlayrow'];
  dataSourceContact = new MatTableDataSource<any>();
  @ViewChild('contactSort', { static: true }) contactSort: MatSort;
  @ViewChild('paginatorContact', { static: true }) paginatorContact: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private _locationService: LocationService,
    public _commonService: CommonService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private toasterservice: ToasterService,
  ) {
    this.tabSectionList = this._commonService.getSectionList('Contract');
    console.log(this.tabSectionList);
    if (sessionStorage.getItem('sessionMainID')) {
      this.id = sessionStorage.getItem('sessionMainID');
    } else {
      //sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionMainID');
    }
    // this.tabSectionList = this._commonService.getSectionList('Contacten');

    this._locationService.getLocationProperty('enddatefixed').subscribe(data => {
      this.enddatefixed = data;
    }, error => this.toasterservice.showError(error));
    this._locationService.getLocationProperty('locationinvestigation').subscribe(data => {
      this.locationinvestigation = data;
    }, error => this.toasterservice.showError(error));
    this._locationService.getLocationProperty('ponumberrequired').subscribe(data => {
      this.ponumberrequired = data;
    }, error => this.toasterservice.showError(error));
    this._locationService.getLocationProperty('customerservicei').subscribe(data => {
      this.customerservicei = data;
    }, error => this.toasterservice.showError(error));
    this._locationService.getLocationProperty('customerserviceii').subscribe(data => {
      this.customerserviceii = data;
    }, error => this.toasterservice.showError(error));
    this._locationService.getLocationProperty('segmentationbasedrevenue').subscribe(data => {
      this.segmentationbasedrevenue = data;
    }, error => this.toasterservice.showError(error));
    this._locationService.getLocationProperty('ebitda').subscribe(data => {
      this.ebitda = data;
    }, error => this.toasterservice.showError(error));
    this._locationService.getLocationProperty('strategicvaluehs').subscribe(data => {
      this.strategicvaluehs = data;
    }, error => this.toasterservice.showError(error));
    this._locationService.getLocationProperty('conclusioncustomer').subscribe(data => {
      this.conclusioncustomer = data;
    }, error => this.toasterservice.showError(error));

  }

  ngOnInit() {

    this.contractForm = this.formBuilder.group({
      customerid: [this.id],
      signdate: [''],
      startdate: [''],
      duration: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      initialenddate: [''],
      extensionperiod: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      enddateextensions: [''],
      noticeperiod: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      cancelbefore: [''],
      enddatefixed: [''],
      notescontract: [''],
      paymentbehaviornotes: [''],
      othercomments: [''],
      lastcontactmoment: [''],
      locationinvestigation: [''],
      purchasedsubscriptions: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ponumberrequired: [''],
      customerservicei: [''],
      customerserviceii: [''],
      segmentationbasedrevenue: [''],
      ebitda: [''],
      strategicvaluehs: [''],
      conclusioncustomer: ['']
    });

    this._locationService.getContractList(this.id).subscribe(
      data => {
        this.contract_list = data;

        this.viewContractForm(this.contract_list);


      }, error => this.toasterservice.showError(error));
    this._locationService.getRevenueList(this.id).subscribe(
      data => {
        let revenuelist = data;

        this.viewRevenueForm(revenuelist);


      }, error => this.toasterservice.showError(error));

    this._locationService.getValuationList(this.id).subscribe(
      data => {
        let valuationlist = data;
        this.viewValuationForm(valuationlist);


      }, error => this.toasterservice.showError(error));



    this.revenueForm = this.formBuilder.group({
      customerid: [this.id],
      scratchcard: [''],
      onlinemaps: [''],
      creditcard: [''],
      payout: ['']
    });
    this.valuationForm = this.formBuilder.group({
      customerid: [this.id],
      total: [''],
      revenue: [''],
      usage: [''],
      pos: [''],
      positionwebsite: [''],
      positionfolder: [''],
      positionmailing: [''],
    });

  }
  viewContractForm(contract_list) {

    if (contract_list.length > 0) {
      this.contractid = contract_list[0]['id'];
      this.contractForm.setValue({

        customerid: this.id,
        signdate: contract_list[0]['signdate'],
        startdate: contract_list[0]['startdate'],
        duration: contract_list[0]['duration'],
        initialenddate: contract_list[0]['initialenddate'],
        extensionperiod: contract_list[0]['extensionperiod'],
        enddateextensions: contract_list[0]['enddateextensions'],
        noticeperiod: contract_list[0]['noticeperiod'],
        cancelbefore: contract_list[0]['cancelbefore'],
        enddatefixed: contract_list[0]['enddatefixed'],
        notescontract: contract_list[0]['notescontract'],
        paymentbehaviornotes: contract_list[0]['paymentbehaviornotes'],
        othercomments: contract_list[0]['othercomments'],
        lastcontactmoment: contract_list[0]['lastcontactmoment'],
        locationinvestigation: contract_list[0]['locationinvestigation'],
        purchasedsubscriptions: contract_list[0]['purchasedsubscriptions'],
        ponumberrequired: contract_list[0]['ponumberrequired'],
        customerservicei: contract_list[0]['customerservicei'],
        customerserviceii: contract_list[0]['customerserviceii'],
        segmentationbasedrevenue: contract_list[0]['segmentationbasedrevenue'],
        ebitda: contract_list[0]['ebitda'],
        strategicvaluehs: contract_list[0]['strategicvaluehs'],
        conclusioncustomer: contract_list[0]['conclusioncustomer'],

      });
    }

  }
  viewRevenueForm(revenue_list) {

    if (revenue_list.length > 0) {
      this.revenueid = revenue_list[0]['id'];
      this.revenueForm.setValue({
        customerid: this.id,
        scratchcard: revenue_list[0]['scratchcard'],
        onlinemaps: revenue_list[0]['onlinemaps'],
        creditcard: revenue_list[0]['creditcard'],
        payout: revenue_list[0]['payout'],
      });
    }
  }
  viewValuationForm(valuation_list) {
    if (valuation_list.length > 0) {
      this.valuationid = valuation_list[0]['id'];
      this.valuationForm.setValue({
        customerid: this.id,
        total: valuation_list[0]['total'],
        revenue: valuation_list[0]['revenue'],
        usage: valuation_list[0]['usage'],
        pos: valuation_list[0]['pos'],
        positionwebsite: valuation_list[0]['positionwebsite'],
        positionfolder: valuation_list[0]['positionfolder'],
        positionmailing: valuation_list[0]['positionmailing'],
      });
    }
  }





  ngAfterViewInit(): void {


  }
  onSubmitContract(form: NgForm) {

    if (this.contractForm.invalid) {

      return;
    }
    $('.overlay').show();
    if (this.contractForm.get('signdate').value == '' || this.contractForm.controls['signdate'].value == null) {
      this.contractForm.get('signdate').setValue(null);
    } else {
      this.contractForm.get('signdate').setValue(this.transformDate(this.contractForm.get('signdate').value));
    }

    if (this.contractForm.get('startdate').value != '' && this.contractForm.get('startdate').value != undefined) {

      this.contractForm.get('startdate').setValue(this.transformDate(this.contractForm.get('startdate').value));
    }

    if (this.contractForm.get('initialenddate').value != '' && this.contractForm.get('initialenddate').value != undefined) {

      this.contractForm.get('initialenddate').setValue(this.transformDate(this.contractForm.get('initialenddate').value));
    }
    if (this.contractForm.get('enddateextensions').value != '' && this.contractForm.get('enddateextensions').value != undefined) {

      this.contractForm.get('enddateextensions').setValue(this.transformDate(this.contractForm.get('enddateextensions').value));
    }
    if (this.contractForm.get('cancelbefore').value != '' && this.contractForm.get('cancelbefore').value != undefined) {

      this.contractForm.get('cancelbefore').setValue(this.transformDate(this.contractForm.get('cancelbefore').value));
    }
    if (this.contractid != '') {

      this._locationService.updateContract(JSON.stringify(form.value), this.contractid)
        .subscribe(res => {
        });
    } else {

      this._locationService.addContracts(JSON.stringify(form.value))

        .subscribe(res => {

          $('.overlay').hide();


        }, (err) => {
          $('.overlay').hide();
          this.toasterservice.showError(err);
        });
    }

  }
  onSubmitRevenue(form: NgForm) {

    if (this.revenueForm.invalid) {

      return;
    }
    $('.overlay').show();
    if (this.revenueid != '') {

      this._locationService.updateRevenue(JSON.stringify(form.value), this.revenueid)
        .subscribe(res => {

        });
    } else {
      this._locationService.addRevenue(JSON.stringify(form.value))

        .subscribe(res => {



        }, (err) => {
          $('.overlay').hide();
          this.toasterservice.showError(err);
        });
    }
  }

  onSubmitValuation(form: NgForm) {

    if (this.valuationForm.invalid) {

      return;
    }
    $('.overlay').show();
    if (this.valuationid != '') {

      this._locationService.updateValuation(JSON.stringify(form.value), this.valuationid)
        .subscribe(res => {
        }, error => this.toasterservice.showError(error));
    } else {
      this._locationService.addValuation(JSON.stringify(form.value))

        .subscribe(res => {



        }, (err) => {
          $('.overlay').hide();
          this.toasterservice.showError(err);
        });
    }
  }
  applyFilterContact(filterValue: string) {
    this.dataSourceContact.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceContact.paginator) {
      this.dataSourceContact.paginator.firstPage();
    }
  }
  setOpened(itemIndex) {
    this.currentlyOpenedItemIndex = itemIndex;
  }

  setClosed(itemIndex) {
    if (this.currentlyOpenedItemIndex === itemIndex) {
      this.currentlyOpenedItemIndex = -1;
    }
  }



  showExpand(elementid) {
    $('#info_icon' + elementid).hide();
    $('#arrow_icon' + elementid).show();
    $('#expand_id' + elementid).show();

    $('#info_icon_addon' + elementid).show();
    $('#arrow_icon_addon' + elementid).hide();
    $('#expand_id_addon' + elementid).hide();
  }

  hideExpand(elementid) {
    $('#info_icon' + elementid).show();
    $('#arrow_icon' + elementid).hide();
    $('#expand_id' + elementid).hide();
  }
  showExpandOrder(elementid) {
    $('#info_icon_order' + elementid).hide();
    $('#arrow_icon_order' + elementid).show();
    $('#expand_id_order' + elementid).show();

    $('#info_icon_addon' + elementid).show();
    $('#arrow_icon_addon' + elementid).hide();
    $('#expand_id_addon' + elementid).hide();
  }

  hideExpandOrder(elementid) {
    $('#info_icon_order' + elementid).show();
    $('#arrow_icon_order' + elementid).hide();
    $('#expand_id_order' + elementid).hide();
  }
  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.contractForm.controls[controlName].hasError(errorName);
  }
}
