import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { LocationService } from '../_services/location.service';
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
  selector: 'app-contractsatellite',
  templateUrl: './contractsatellite.component.html',
  styleUrls: ['./contractsatellite.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ContractsatelliteComponent implements OnInit, AfterViewInit {
  currentlyOpenedItemIndex = -1;
  contracts: any[] = [];
  contractForm: FormGroup;
  revenueForm: FormGroup;
  valuationForm: FormGroup;
  businessmodelForm: FormGroup;
  macauthenticationForm: FormGroup;
  paymentstatisticsForm: FormGroup;
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
  conclusioncustomerid;
  businessmodel: any[];
  hybridSetting: any[];
  activeLinkIndex = -1;
  apiUrl: any;
  statusCheck: boolean = false;
  superuser: boolean;
  expandedElement: any[] = [];
  statusDateTime: any;
  statusVal;
  additionalContactInfo: any[] = [];
  navLinks: any;
  //tabsubsections: any;
  tabSectionList: any[] = [];
  tabsubsections: Array<any> = [];
  minDate = new Date(2020, 0, 1);
  contractid = '';
  revenueid = '';
  valuationid = '';
  businessmodelid = '';
  macauthenticationid = '';
  lastmonth;
  thisyear;
  lastyear;
  calculateddata;
  lastmonthtotal = 0;
  lastyeartotal = 0;
  thisyeartotal = 0;
  inheritance = false;
  contractsavebtn = false;
  businessmodelsavebtn = false;
  valuationsavebtn = false;
  revenuesavebtn = false;
  macauthsavebtn = false;

  displayedContractColumns: string[] = ['type', 'lastmonth', 'thisyear', 'lastyear'];
  dataSourceContract = new MatTableDataSource<any>();
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


    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.id = sessionStorage.getItem('sessionSatelliteID');
    } else {

      this.id = sessionStorage.getItem('sessionSatelliteID');
    }


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
    this._locationService.getLocationProperty('hybridSetting').subscribe(data => {
      this.hybridSetting = data;
    }, error => this.toasterservice.showError(error));
    this._locationService.getLocationProperty('businessmodel').subscribe(data => {
      this.businessmodel = data;
    }, error => this.toasterservice.showError(error));


  }

  ngOnInit() {
    this.loading=false;
    this.contractsavebtn = false;
    //Setting inheritance Flag
    if (sessionStorage.getItem('SatContractInheritance') && sessionStorage.getItem('SatContractInheritance') == '1') {
      this.inheritance = true;
    }
    this._locationService.getTabList('2').subscribe(data => {
      this.navLinks = data;
      for (let navlink of this.navLinks) {
        if (navlink.label == 'Contracten') {
          this.tabsubsections = navlink.tabsubsections;
        }

      }
    });
    this.conclusioncustomerid = 1;

    this.contractForm = this.formBuilder.group({
      customerid: [this.id],
      signdate: [''],
      startdate: [''],
      duration: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      initialenddate: ['', Validators.required],
      extensionperiod: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      enddateextensions: ['', Validators.required],
      noticeperiod: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      cancelbefore: ['', Validators.required],
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
      conclusioncustomer: ['1']
    });

    this.revenueForm = this.formBuilder.group({
      customerid: [this.id],
      scratchcard: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      onlinemaps: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      creditcard: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
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

    this.businessmodelForm = this.formBuilder.group({
      customerid: [this.id],
      changedate: [''],
      businessmodel: [''],
      hybridsetting: [''],
      remark: [''],
    });
    this.macauthenticationForm = this.formBuilder.group({
      customerid: [this.id],
      blocksize: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      blockprice: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      discountpercentage: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      numberofblocks: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
    });
    this.contractsavebtn = true;
    this.revenuesavebtn = true;
    this.macauthsavebtn = true;
    this.valuationsavebtn = true;
    this.businessmodelsavebtn = true;
    var res=[];
    res['message'] = '';
    this.getContractList(res);
    this.getRevenueList(res);
    this.getValuationList(res);
    this.getBussinessModelList(res);
    this.getMacAuthList(res);
    //this.id = 3397;
    this._locationService.omzetCalculation(this.id).subscribe(
      data => {
         this.calculateddata = data;
        //console.log('calt',this.calculateddata);
        
      //this.loading = false;
      this.dataSourceContract = new MatTableDataSource<any>(this.calculateddata);
      this.dataSourceContract.sort = this.contactSort;
      this.dataSourceContract.paginator = this.paginatorContact;
      
      }, error => this.toasterservice.showError(error));
    this._locationService.getstatisticspayment(this.id).subscribe(
      data => {
        let statisticspaymentlist = data;
      
      }, error => this.toasterservice.showError(error));

  }
  getContractList(res) {
    this._locationService.getContractList(this.id).subscribe(
      data => {
        this.contract_list = data;
        this.viewContractForm(this.contract_list);
        this.contractsavebtn = false;
        if(res['message'] != '')
          this.toasterservice.showOrderCompletion(res['message']);
      }, error => this.toasterservice.showError(error));
  }
  getMacAuthList(res) {
    this._locationService.getMacauthticationList(this.id).subscribe(
      data => {
        let maclist = data;
        this.viewMacauthenticationForm(maclist);
        this.macauthsavebtn = false;
        if(res['message'] != '')
          this.toasterservice.showOrderCompletion(res['message']);
      }, error => this.toasterservice.showError(error));
  }
  getBussinessModelList(res) {
    this._locationService.getBusinessmodelList(this.id).subscribe(
      data => {
        let businessmodellist = data;
        this.viewBusinessmodelForm(businessmodellist);
        this.businessmodelsavebtn = false;
        if(res['message'] != '')
          this.toasterservice.showOrderCompletion(res['message']);
      }, error => this.toasterservice.showError(error));
  }
  getValuationList(res) {
    this._locationService.getValuationList(this.id).subscribe(
      data => {
        let valuationlist = data;
        this.viewValuationForm(valuationlist);
        this.valuationsavebtn = false;
        if(res['message'] != '')
          this.toasterservice.showOrderCompletion(res['message']);
      }, error => this.toasterservice.showError(error));
  }
  getRevenueList(res) {
    this._locationService.getRevenueList(this.id).subscribe(
      data => {
        let revenuelist = data;
        this.viewRevenueForm(revenuelist);
        this.revenuesavebtn = false;
        if(res['message'] != '')
          this.toasterservice.showOrderCompletion(res['message']);
      }, error => this.toasterservice.showError(error));
  }

  viewContractForm(contract_list) {

    if (contract_list.length > 0) {
      console.log(contract_list[0])
      this.contractid = contract_list[0]['id'];
      this.conclusioncustomerid = 2;


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
  viewBusinessmodelForm(businesslist) {

    if (businesslist.length > 0) {
      this.businessmodelid = businesslist[0]['id'];
      this.businessmodelForm.setValue({
        customerid: this.id,
        changedate: businesslist[0]['changedate'],
        businessmodel: businesslist[0]['businessmodel'],
        hybridsetting: businesslist[0]['hybridsetting'],
        remark: businesslist[0]['remark'],

      });
    }
  }
  viewMacauthenticationForm(Maclist) {

    if (Maclist.length > 0) {
      this.macauthenticationid = Maclist[0]['id'];
      this.macauthenticationForm.setValue({
        customerid: this.id,
        blocksize: Maclist[0]['blocksize'],
        blockprice: Maclist[0]['blockprice'],
        discountpercentage: Maclist[0]['discountpercentage'],
        numberofblocks: Maclist[0]['numberofblocks'],

      });
    }
  }




  ngAfterViewInit(): void {

  }
  onSubmitContract(form: NgForm) {

    if (this.contractForm.invalid) {
      const invalid = [];
        const controls = this.contractForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {
            invalid.push(name);
          }
        }
        console.log(invalid)

      return;
    }
    //this.loading=true;
    this.contractsavebtn = true;
    $('.overlay').show();
    if (this.contractForm.get('signdate').value == '' || this.contractForm.controls['signdate'].value == null) {
      this.contractForm.get('signdate').setValue(null);
    } else {
      this.contractForm.get('signdate').setValue(this.transformDate(this.contractForm.get('signdate').value));
    }

    if (this.contractForm.get('startdate').value == '' && this.contractForm.get('startdate').value == null) {
      this.contractForm.get('startdate').setValue(null);
    }else {
      this.contractForm.get('startdate').setValue(this.transformDate(this.contractForm.get('startdate').value));
    }

    if (this.contractForm.get('initialenddate').value == '' && this.contractForm.get('initialenddate').value == null) {
      this.contractForm.get('initialenddate').setValue(null);
    }else {
      this.contractForm.get('initialenddate').setValue(this.transformDate(this.contractForm.get('initialenddate').value));
    }

    if (this.contractForm.get('enddateextensions').value == '' && this.contractForm.get('enddateextensions').value == null) {
      this.contractForm.get('enddateextensions').setValue(null);
    }else {
      this.contractForm.get('enddateextensions').setValue(this.transformDate(this.contractForm.get('enddateextensions').value));
    }

    if (this.contractForm.get('cancelbefore').value == '' && this.contractForm.get('cancelbefore').value == null) {
      this.contractForm.get('cancelbefore').setValue(null);
    }else {
      this.contractForm.get('cancelbefore').setValue(this.transformDate(this.contractForm.get('cancelbefore').value));
    }


    if (this.contractid != '') {

      this._locationService.updateContract(JSON.stringify(form.value), this.contractid)
        .subscribe(res => {
          this.getContractList(res);
          this.loading=false;
         // this.toasterservice.showOrderCompletion(res['message']);
          //this.contractsavebtn = false;
        }, error => this.toasterservice.showError(error));
    } else {

      this._locationService.addContracts(JSON.stringify(form.value))

        .subscribe(res => {
          this.getContractList(res);
          //this.contractsavebtn = false;

          $('.overlay').hide();
          this.loading=false;
         // this.toasterservice.showOrderCompletion(res['message']);
          //this.contractsavebtn = false;


        }, error => this.toasterservice.showError(error));
    }

  }
  onSubmitBusinessmodel(form: NgForm) {

    if (this.businessmodelForm.invalid) {
      return;
    }
    $('.overlay').show();
    this.businessmodelsavebtn = true;
    if (this.businessmodelForm.get('changedate').value != '') {

      this.businessmodelForm.get('changedate').setValue(this.transformDate(this.businessmodelForm.get('changedate').value));
    }
    if (this.businessmodelid != '') {

      this._locationService.updateBusinessmodel(JSON.stringify(form.value), this.businessmodelid)
        .subscribe(res => {
          this.getBussinessModelList(res);
          //this.toasterservice.showOrderCompletion(res['message']);
        }, error => this.toasterservice.showError(error));
    } else {
      this._locationService.addBusinessmodel(JSON.stringify(form.value))

        .subscribe(res => {
          this.getBussinessModelList(res);
          //this.toasterservice.showOrderCompletion(res['message']);
        }, error => this.toasterservice.showError(error));
    }

  }
  onSubmitmac(form: NgForm) {

    if (this.macauthenticationForm.invalid) {

      return;
    }
    this.macauthsavebtn = true;
    $('.overlay').show();
    if (this.macauthenticationid != '') {

      this._locationService.updateMacauthentication(JSON.stringify(form.value), this.macauthenticationid)
        .subscribe(res => {
          this.getMacAuthList(res);
          //this.toasterservice.showOrderCompletion(res['message']);
        }, error => this.toasterservice.showError(error));
    } else {
      this._locationService.addMacauthentication(JSON.stringify(form.value))

        .subscribe(res => {
          this.getMacAuthList(res);
          ///this.toasterservice.showOrderCompletion(res['message']);
        }, error => this.toasterservice.showError(error));
    }
  }
  onSubmitRevenue(form: NgForm) {

    if (this.revenueForm.invalid) {

      return;
    }
    this.revenuesavebtn = true;
    $('.overlay').show();
    if (this.revenueid != '') {
      this._locationService.updateRevenue(JSON.stringify(form.value), this.revenueid)
        .subscribe(res => {
          this.getRevenueList(res);
          //this.toasterservice.showOrderCompletion(res['message']);
        }, error => this.toasterservice.showError(error));
    } else {
      this._locationService.addRevenue(JSON.stringify(form.value))
        .subscribe(res => {
          this.getRevenueList(res);
          //this.toasterservice.showOrderCompletion(res['message']);
        }, error => this.toasterservice.showError(error));
    }
  }

  onSubmitValuation(form: NgForm) {

    if (this.valuationForm.invalid) {

      return;
    }
    $('.overlay').show();
    this.valuationsavebtn = true;
    if (this.valuationid != '') {

      this._locationService.updateValuation(JSON.stringify(form.value), this.valuationid)
        .subscribe(res => {
          this.getValuationList(res);
          //this.toasterservice.showOrderCompletion(res['message']);
        }, error => this.toasterservice.showError(error));
    } else {
      this._locationService.addValuation(JSON.stringify(form.value))
        .subscribe(res => {
          this.getValuationList(res);
          //this.toasterservice.showOrderCompletion(res['message']);
        }, error => this.toasterservice.showError(error));
    }
  }
  applyFilterContact(filterValue: string) {
    this.dataSourceContract.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceContract.paginator) {
      this.dataSourceContract.paginator.firstPage();
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
  public hasErrorRevenue = (controlName: string, errorName: string) => {
    return this.revenueForm.controls[controlName].hasError(errorName);
  }
  public hasErrorMacauth = (controlName: string, errorName: string) => {
    return this.macauthenticationForm.controls[controlName].hasError(errorName);
  }
}
