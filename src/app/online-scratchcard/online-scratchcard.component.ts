import { Component, Inject, Optional, Input } from '@angular/core';
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
import * as FileSaver from 'file-saver';
import moment from "moment";
import 'moment-timezone';
import { Customer } from '../interface/interface';
import { Order, Orderbase, OrderStatusUpdate } from './scratch';
//import { DateValidator } from '../_shared/date.validator';
import { ScratchService } from '../_services/scratch.service';

import { Observable } from 'rxjs';
import { CommonService } from '../_services/common.service';
moment.tz.setDefault('Europe/Amsterdam');
declare var jQuery: any;
declare const editClick: any;
declare var $: any;



@Component({
  selector: 'app-online-scratchcard',
  templateUrl: './online-scratchcard.component.html',
  styleUrls: ['./online-scratchcard.component.scss'],
})

export class OnlineScratchcardComponent {
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
  // Order Variable define
  order: any[] = [];
  orderbase: any[];
  orderStatusUpdate: OrderStatusUpdate[] = [];
  orderattribute = new Map<string, string>();
  orderattributevalue = new Map<string, string>();
  productattributelist = new Map<string, string>();
  orderFormUpdatedValue: any[] = [];
  orderFormUpdateStatusValue: any[] = [];
  orderActvateOnDelivery: any[];
  orderrestrictOnLocation: any[];

  OnlineSCardOrderShipmentStreet;
  OnlineSCardOrderShipmentHouseNo;
  OnlineSCardOrderShipmentHouseNoExt;
  OnlineSCardOrderShipmentCity;

  scratchcardcreateform: FormGroup;
  orderChainList: any;
  ordertypeList: any[];
  orderstatusList;
  isMainLocationListBlank;
  location_parentcustomerid;
  catalogueProperty: any[];
  OnlineSCardOrderType: any[];
  OnlineSCardOrderStatus: any[];
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
  version = VERSION;
  noRecordFound;
  matSelectSearchVersion = MatSelectSearchVersion;
  OnlineSCardOrderShipmentPostalCode;
  tabSectionList: any[] = [];
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
    public dialogRef: MatDialogRef<OnlineScratchcardComponent>,
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
    this.tabSectionList = this._commonService.getSectionList('ScratchcardTab');

  }

  fetchDetailsDropdown() {

    /**Fetch chains */
    $('.overlay').show();
    this._locationService.getAllChain().subscribe(data => {
     
      this.chaindata = data;
     

      if (data != null || data.length !== 0) {
        this.chaindata = data;
      }
      $('.overlay').hide();
    }, error => this.toasterservice.showError(error));

    $('.overlay').show();
    if (this.action == 'Add') {
      this.countryid = Number(this.locationdata_dict.country);
    } else {
      this.countryid = Number(this.local_data.OnlineSCardOrderShipmentCountry);
    }
    

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
    

  }

  ngOnInit() {

    this.buttondisabled = false;
    this._id = this.route.snapshot.paramMap.get("id");

    this.fetchDetailsDropdown();


    if (this.local_data.action == 'Add') {
      this.OnlineSCardOrderShipmentPostalCode = this.locationdata_dict.postcode;
      this.OnlineSCardOrderShipmentStreet = this.locationdata_dict.streetname;
      this.OnlineSCardOrderShipmentHouseNo = this.locationdata_dict.housenumber;
      this.OnlineSCardOrderShipmentHouseNoExt = this.locationdata_dict.housenumberaddition;
      this.OnlineSCardOrderShipmentCity = this.locationdata_dict.city;
      this.populateformdropdown();

      //this.countryid = Number(this.local_data.OnlineSCardOrderShipmentCountry);

      this.scratchcardcreateform = this.formBuilder.group({

        customerid: this.locationid,
        description: [''],
        facturatie_status: [''],
        customerremarks: [''],
        ordertrackcode: [''],
        OnlineSCardOrderEmail: [''],
        OnlineSCardOrderCatRefID: [''],
        OnlineSCardOrderQuantity: ['', [Validators.required, Validators.min(1), Validators.max(5000)]],
        OnlineSCardOrderCardType: ['', Validators.required],
        OnlineSCardOrderRestrictionOnLocation: ['', Validators.required],
        OnlineSCardOrderActivate: ['1', Validators.required],
        OnlineSCardOrderValidForLocation: [''],
        OnlineSCardOrderTypeKraskaartID: [''],
        orderstate: [''],
        OnlineSCardOrderTotalPrice: [''],
        OnlineSCardOrderRTLMemoline: [''],
        OnlineSCardOrderPrice: ['', [Validators.required, Validators.pattern('([0-9]{1}[0-9]{0,3}|[0-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[0]{1}[,.][0-9]{1}[1-9]{1}|[0]{1}[,.][1-9]{1}[0-9]{1}|[0]{1}[,.][1-9]{1})')]]
      });

      var crdate = moment().format('YYYY-MM-DD');
      var ordertype = 'add';
      this.getProductCatalogueFilterByDate(crdate, ordertype);
      this.scratchcardcreateform.get('facturatie_status').setValue('Ready');
      this.caculateAmountAdd();
    } 

    
  }






  ngAfterViewInit(): void {
    this.dropdownchanges();
  }



  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onSubmit(form: NgForm) {
    if (this.scratchcardcreateform.invalid) {

      const invalid = [];
      const controls = this.scratchcardcreateform.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }

      return invalid;
      this.buttondisabled = false;
      return;
    }

    //let extraOrderFields = ['ZTVCWEndDate', 'ZTVTTDate', 'ZTVNoticePeriod', 'ZTVCTFineSystem', 'ZTVCTFineUser'];
    this.buttondisabled = true;
    this.jsonArray = form.value;
    this.jstoday = moment().format('YYYY-MM-DD HH:mm:ss');




    

    if (this.scratchcardcreateform.get('OnlineSCardOrderPrice').value != '' && this.scratchcardcreateform.get('OnlineSCardOrderPrice').value != undefined) {
      //Always storing prices with 2 decimal 
      this.scratchcardcreateform.get('OnlineSCardOrderPrice').setValue(parseFloat(this.scratchcardcreateform.get('OnlineSCardOrderPrice').value.replace(',', ".")).toFixed(2).toString().replace('.', ","));
    }

    

    this.orderbase = [
      {
        hstorderid: '',
        orderstatus: '2',
        orderstate: '',
        remarks: (this.scratchcardcreateform.get('description').value == '') ? '' : this.scratchcardcreateform.get('description').value.toString().trim(),
        creationdate: this.jstoday,
        updationdate: null,
        ponumber: '',
        ordertype: '1',
        locationid: this.locationid,
        productcatalogueid: this.scratchcardcreateform.get('OnlineSCardOrderCatRefID').value,
        productcataloguegroup: 8,
        billingstartdate: null,
        billingstatus: '',
        ordertrackcode: '',
        customerremarks: '',
        antal: this.scratchcardcreateform.get('OnlineSCardOrderQuantity').value ,
        validAt_id: (this.scratchcardcreateform.get('OnlineSCardOrderValidForLocation').value && this.scratchcardcreateform.get('OnlineSCardOrderValidForLocation').value!='') ? this.scratchcardcreateform.get('OnlineSCardOrderValidForLocation').value : 0,
        producttypeid: this.scratchcardcreateform.get('OnlineSCardOrderCardType').value,
        price: this.scratchcardcreateform.get('OnlineSCardOrderPrice').value,
        totalprice: this.scratchcardcreateform.get('OnlineSCardOrderTotalPrice').value,
        productstatus: 1,
        block: this.scratchcardcreateform.get('OnlineSCardOrderActivate').value,
        orderfrom: 1
      }
    ];

    this.counter = 0;
    Object.keys(this.scratchcardcreateform.controls).forEach(key => {
      if (key == 'OnlineSCardOrderQuantity' || key == 'OnlineSCardOrderCardType' || key == 'OnlineSCardOrderRestrictionOnLocation' ||
        key == 'OnlineSCardOrderActivate' ||  key == 'OnlineSCardOrderValidForLocation' || key == 'OnlineSCardOrderTypeKraskaartID' || 
        key == 'OnlineSCardOrderPrice' || key == 'OnlineSCardOrderTotalPrice' || key == 'OnlineSCardOrderRTLMemoline' || key == 'OnlineSCardOrderEmail') {
        this.order.push({
          id: '',
          orderattributevalue: (this.scratchcardcreateform.controls[key].value == null || this.scratchcardcreateform.controls[key].value == '') ? '' : this.scratchcardcreateform.controls[key].value.toString().trim(),
          orderattribute: this.orderattribute.get(key),
          orderbasef: this.orderbase[0]
        });

      }



    });


    this.order.sort(this.GetSortOrder("orderattribute"));
    this._orderservice.addOnlineScratchOrder(JSON.stringify(this.order))
      .subscribe(
        response => {
          console.log('online scard', response);
          if ((response != undefined)) {
            if(response.status == 200){
              let file = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
              FileSaver.saveAs(file, 'Online-Kraskaarten' + '-' + moment().format('D-M-YYYY H_m') + '.xlsx');
              this.buttondisabled = false;
            }
          }else{
            this.toasterservice.showErrorScratchcard("Something went wrong. Try again");
          }
          
          this.dialogRef.close({ event: 'Add', data: this.local_data });
        },
       (err) => {
        this.toasterservice.showError(err);
        this.buttondisabled = false;
      });
  }


  





  onUpdateStatus(form: NgForm) {
    if (this.scratchcardcreateform.invalid) {
      return;
    }
    var orderproductjson: {};
    this.buttondisabled = true;
    var orderstat = '';
    orderproductjson = {
      'antal': this.local_data.antal,
      'validAt_id': (this.local_data.OnlineSCardOrderValidForLocation) ? this.local_data.OnlineSCardOrderValidForLocation : 0,
      'orderid': this.local_data.id,
      'status': 1,
      'producttypeid': this.local_data.OnlineSCardOrderCardType,
      'price': this.local_data.OnlineSCardOrderPrice,
      'totalprice': this.local_data.OnlineSCardOrderTotalPrice
    }

    let orderstatusname = this.ordertypeList.find(r =>
      r.attrname == 'OnlineSCardOrderStatus' && r.id == this.scratchcardcreateform.get('orderstate').value
    ).name;

    this.orderStatusUpdate.push({
      id: this.local_data.id,
      orderstatus: this.scratchcardcreateform.get('orderstate').value,
      productid: 0,
      orderdata: orderproductjson
    });

    this.orderFormUpdateStatusValue.push({
      orderstatus: this.scratchcardcreateform.get('orderstate').value,
      orderstatusname: orderstatusname
    });

    this._orderservice.UpdateOrderStatusGenerateProduct(this.local_data.id, JSON.stringify(this.orderStatusUpdate))
      .subscribe(res => {
        if (res['message'] != undefined) {
          this.toasterservice.showErrorOrderCompletion(res['message']);
          this.dialogRef.close({ event: 'Cancel' });
        } else {
          this.dialogRef.close({ event: 'UpdateStatus', data: this.orderFormUpdateStatusValue });
        }
        this.buttondisabled = false;
      }, (err) => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      }
      );
  }

 

  populateformdropdown() {

    this._scratchservice.cataloguepropertybygroup('1').subscribe(data3 => {
      this.cataloguepropertybygroupList = data3;
     
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
    });

    this.ticketservice.getStateList().subscribe(data => {
      this.issueAllState = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this._orderservice.getAtrbe(8).subscribe(data => {
      for (let item in data) {
        this.orderattribute.set(data[item]['attributename'], data[item]['id']);
      }
      this.buttondisabled = false;
    }, error => this.toasterservice.showError(error));


    this._scratchservice.getOrderPropertyByCatalogue(8).subscribe(res => {
      this.ordertypeList = res;

      this.OnlineSCardOrderStatus = this.ordertypeList.filter(r =>
        r.attrname == 'OnlineSCardOrderStatus' && (r.id != 7 && r.id != 9)
      );

      this.orderrestrictOnLocation = this.ordertypeList.filter(r =>
        r.attrname == 'OnlineSCardOrderRestrictionOnLocation'
      );

      this.OnlineSCardOrderType = this.ordertypeList.filter(r =>
        r.attrname == 'OnlineSCardOrderType'
      );

      

      this.orderActvateOnDelivery = this.ordertypeList.filter(r =>
        r.attrname == 'OnlineSCardOrderActivate'
      );

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });


    this._locationService.getAllChain().subscribe(reschain => {
      this.orderChainList = reschain;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
  }

  

  public hasError = (controlName: string, errorName: string) => {
    return this.scratchcardcreateform.controls[controlName].hasError(errorName);
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

  caculateAmountAdd() {
    var OnlineSCardOrderQuantity = this.scratchcardcreateform.get('OnlineSCardOrderQuantity');
    var OnlineSCardOrderPrice = this.scratchcardcreateform.get('OnlineSCardOrderPrice');
    var OnlineSCardOrderTotalPrice = this.scratchcardcreateform.get('OnlineSCardOrderTotalPrice');
    this.calculateAmount(OnlineSCardOrderQuantity, OnlineSCardOrderPrice, OnlineSCardOrderTotalPrice);
  }

  calculateAmount(OnlineSCardOrderQuantity: AbstractControl, OnlineSCardOrderPrice: AbstractControl, OnlineSCardOrderTotalPrice: AbstractControl) {
    OnlineSCardOrderQuantity.valueChanges
      .subscribe(() => {
        if (OnlineSCardOrderQuantity.value != undefined) {
          if (OnlineSCardOrderPrice.value != undefined) {
            OnlineSCardOrderTotalPrice.setValue((Number(OnlineSCardOrderQuantity.value) * Number(OnlineSCardOrderPrice.value.replace(',', '.'))).toFixed(2).toString().replace('.', ','));
          } else {
            OnlineSCardOrderTotalPrice.setValue(OnlineSCardOrderQuantity.value);
          }
        }
      }, error => this.toasterservice.showError(error));
    OnlineSCardOrderPrice.valueChanges
      .subscribe(() => {
        if (OnlineSCardOrderPrice.value != undefined) {
          if (OnlineSCardOrderQuantity.value != undefined) {
            OnlineSCardOrderTotalPrice.setValue((Number(OnlineSCardOrderQuantity.value) * Number(OnlineSCardOrderPrice.value.replace(',', '.'))).toFixed(2).toString().replace('.', ','));
          } else {
            OnlineSCardOrderTotalPrice.setValue(OnlineSCardOrderPrice.value.replace('.', ','));
          }
        }
      }, error => this.toasterservice.showError(error));
  }

  getProductCatalogueFilterByDate(creationdate: string, type: string) {

    this.productservice.getProductCatalogueFilterByDate('1', creationdate, type, this.location_parentcustomerid).subscribe(data => {
      this.catalogueProperty = data;
      // While opening new access add dialog
      /*this.productnameList = this.catalogueProperty.filter((r: { productgroup: string; producttype: string; productuserrole:any[] }) => r.productgroup == '1'
        && r.producttype == '1' && r.productuserrole!==null && r.productuserrole.includes(this.loggedinuserrole)
      );
      if(this.productnameList.length == 0){
        this.productnameList = this.catalogueProperty.filter((r: { productgroup: string; producttype: string }) => r.productgroup == '1'
          && r.producttype == '1' 
        );
      }*/
      this.productnameList = this.catalogueProperty.filter((r: { productgroup: string; producttype: string }) => r.productgroup == '1'
        && r.producttype == '1'
      );


      this.orderaddonlist = this.catalogueProperty.filter((r: { productgroup: string; producttype: string; }) => r.productgroup == '1'
        && r.producttype == '2'
      );

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
  }

  selectTypePlan(productnameid) {

    this.mainselectedpriceplan = this.catalogueProperty.find(r => r.productgroup == '1'
      && r.producttype == '1' && r.productname == productnameid
    );
    this.scratchcardcreateform.get('OnlineSCardOrderPrice').setValue(this.mainselectedpriceplan.productprice);
    this.scratchcardcreateform.get('OnlineSCardOrderTypeKraskaartID').setValue(this.mainselectedpriceplan.productname);
    this.scratchcardcreateform.get('OnlineSCardOrderCatRefID').setValue(this.mainselectedpriceplan.id);
    this.scratchcardcreateform.get('OnlineSCardOrderRTLMemoline').setValue(this.mainselectedpriceplan.rtlmemoline);
  }

  selectRestrictionOnLocation(checkValue) {

    if (checkValue == '1') {
      this.isRestrictionOnChain = true;
      this.scratchcardcreateform.get('OnlineSCardOrderValidForLocation').setValidators([Validators.required]);
      this.scratchcardcreateform.get('OnlineSCardOrderValidForLocation').updateValueAndValidity();
    } else {
      this.isRestrictionOnChain = false;
      this.scratchcardcreateform.get('OnlineSCardOrderValidForLocation').setValue('');
      this.scratchcardcreateform.get('OnlineSCardOrderValidForLocation').clearValidators();
      this.scratchcardcreateform.get('OnlineSCardOrderValidForLocation').updateValueAndValidity();
    }

  }

  


  dateValidation() {
    var OnlineSCardOrderActivationDate = this.scratchcardcreateform.get('OnlineSCardOrderActivationDate');
    if (OnlineSCardOrderActivationDate.value != '' && OnlineSCardOrderActivationDate.value != null) {
      OnlineSCardOrderActivationDate.setValidators([DateValidator.dateVaidator]);
      OnlineSCardOrderActivationDate.updateValueAndValidity();
    } else {
      OnlineSCardOrderActivationDate.setValue('');
      OnlineSCardOrderActivationDate.clearValidators();
      OnlineSCardOrderActivationDate.updateValueAndValidity();
    }
  }

}