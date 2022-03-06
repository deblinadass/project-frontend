import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn, NgForm, FormControlDirective } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../_services/location.service';
import { Order, Orderbase, OrderStatusUpdate } from '../mktorderdialog-box/mktorder';
import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';
import { OrderService } from '../_services/order.service';
import { ProductService } from '../_services/product.service';
//import { AccessService } from '../_services/access.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToasterService } from '../_services/toastr.service';
import { DateValidator } from '../_shared/date.validator';
import { GlobalConstants } from '../common/global-constants';
import { MatSelectChange, MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, delay, tap, filter, map, takeUntil } from 'rxjs/operators';
import { CustomerContactdialogBoxComponent } from '../customercontactdialog-box/customercontactdialog-box.component';
import { MatDialog } from '@angular/material/dialog';
import { Customer } from '../interface/interface';
import moment from "moment";
import 'moment-timezone';
import { CommonService } from '../_services/common.service';
moment.tz.setDefault('Europe/Amsterdam');
declare var jQuery: any;
declare const editClick: any;
declare var $: any;


export class Custom {
  name: string;
  id: number;
}


@Component({
  selector: 'app-mktorderdialog-box',
  templateUrl: './mktorderdialog-box.component.html',
  styleUrls: ['./mktorderdialog-box.component.scss']
})
export class MKTorderdialogBoxComponent {
  action: string;
  local_data: any;
  submitted = false;
  _id: string;
  loading = false;
  customer_details: any;
  isChecked: number = 1;
  isCheckedStatus = true;
  hardwareList: any[];
  channelPackageList: any[]
  jsonArray: any[]
  array = [];
  attribute: number;
  today = new Date();
  jstoday = '';
  buttondisabled = true;
  ordertypeList: any[];
  orderstatusList: any[];
  productnameList: any[];
  accesscosevcList: any[];
  billingmonthList: any[];
  productData: any;
  counter: number;
  statusInNum: number;
  onetimecostRelocateForm: FormGroup;
  returnUrl: string;
  locationid: any;
  click: boolean;
  isstart: boolean=false;
  isdisabled: boolean=false;
  isdisabledadd: boolean=false;
  accessAddonName: string;
  mktAddonName: string;
  selectAccess: string;
  accessaddonsla: string;
  width: string;
  AccessBilledByMST: any[];
  Prijs;

  accessupdateform: FormGroup;
  accesscreateform: FormGroup;
  mktcreateform: FormGroup;
  mktupdatestatusform: FormGroup;
  onetimecost: any[] = [];
  productTypeList: any[];
  evcCosList: any[];
  OTCFormUpdatedValue: any[] = [];

  // Order Variable define
  order: Order[] = [];
  orderbase: Orderbase[];
  orderStatusUpdate: OrderStatusUpdate[] = [];
  orderattribute = new Map<string, string>();
  orderattributevalue = new Map<string, string>();
  productattributelist = new Map<string, string>();
  orderFormUpdatedValue: any[] = [];
  orderFormUpdateStatusValue: any[] = [];
  ordertypename;
  orderstatusname;
  orderproductname;
  accesscosevc_name;
  orderaddonlist;
  startdatum_facturatie_val: string;
  AccessRfsDate_val: string;
  totalSum = '0,00';
  totalAmountChanges;
  addonJson;
  maxviewingpoint;
  AccessAmountConnection;
  orderAddOnLevel: any[] = [];
  orderaddon_name: any;
  list: any[] = [];
  accesscosevc: any[];

  Product_naam: any;
  Product_naam_name: any;
  product_list: any;
  productstatus: any;
  attributeValue: any;
  listarray: any;
  errMax: boolean = false;
  orderaddonsla_name;
  addonslaList;
  orderaddonMap = new Map<string, string>();
  minBillingDate;
  orderUpdatedStatusList: any[] = [];
  catalogueProperty: any[];
  mainselectedpriceplan;
  addonselectedpriceplan;
  productnameListFromOrderProperty: any[];
  orderaddonlistFromOrderProperty: any[];

  productnameListFromCatalogueProperty: any[];
  orderaddonlistFromCatalogueProperty: any[];
  productpropertyMianProduct;
  productpropertyAddonProduct;
  MKTCatRefID;
  prodnameid;
  price;
  remarks;
  sourcesystem;
  externalorderid;
  ponumber;
  billingstatus;
  billingstartdateEdit;
  startdateRFSEdit;
  AccessMCEndDate;
  AccessID;
  AccessEvcID;
  AccessBwEVC;
  AccessCosEVC;
  AccessProvidedBy;
  accessBilledByMST;
  AccessCCStartDate;
  location_parentcustomerid;
  locationdata_dict: any;
  countryid;
  countryList: any;
  countryVal;
  noRecordFound;
  MktOrderUserConfirmationEmail;
  customerremarks;
  OrderShipmentMode;
  MktOrderShipmentTAV;
  MktOrderShipmentStreet;
  MktOrderShipmentHouseNo;
  MktOrderShipmentHouseNoExt;
  MktOrderShipmentPostalCode;
  MktOrderShipmentCity;
  MktOrderShipmentCountry;
  MktOrderAmount;
  MktProductNaam: any;
  MKTAddOnAantal: any;
  nameVal: any;
  ordertrackcode: any;
  location_name: any;
  tabSectionList: any[] = [];
  customercontactList: any[] = [];
  tabSectionListContact: any[] = [];
  constructor(
    private api: OrderService,

    public dialog: MatDialog,
    //private accessservice: AccessService,
    private productservice: ProductService,
    private formBuilder: FormBuilder,
    private _locationService: LocationService,
    public router: Router,
    public dialogRef: MatDialogRef<MKTorderdialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _Activatedroute: ActivatedRoute,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private toasterservice: ToasterService,
    public _commonService: CommonService,
  ) {
    this.local_data = { ...data };
    this.locationdata_dict = this.local_data.locationdata_dict;
    this.action = this.local_data.action;
    if (this.action == 'Update' || this.action == 'UpdateStatus' || this.action == 'Delete') {
      this.locationid = +this.local_data.locationid;
      this.location_parentcustomerid = +this.local_data.location_parentcustomerid;
      //this.location_name = +this.local_data.location_name;
    } else {
      this.locationid = +data.locationid;
      this.location_parentcustomerid = +data.location_parentcustomerid;
      this.location_name = +data.location_name;
    }
    this.tabSectionList = this._commonService.getSectionList('MKTTab');
    this.tabSectionListContact = this._commonService.getSectionList('Contact');
  }




  ngOnInit() {


    $(".addonField").css("width", "100%");
    this.width = "100";
    this.buttondisabled = true;
    //this.fetchCountryDropDown();
    this._locationService.location_details(this.locationid).subscribe(
      data => {
        this.location_name = data.customername;
        this.location_parentcustomerid = data.parentcustomerid;

      }, error => this.toasterservice.showError(error));

    this.api.getMKTAtrbe().subscribe(data => {
     
      for (let item in data) {
        this.orderattribute.set(data[item]['attributename'], data[item]['id']);
      }
      this.buttondisabled = false;
    }, error => this.toasterservice.showError(error));
    this.populateformdropdown();

    if (this.local_data.action == 'UpdateStatus') {
      this.api.getOrderProperty('MKTOrderStatus').subscribe(data => {
        this.orderstatusList = data;
        for (var orderstatus of this.orderstatusList) {

          this.orderUpdatedStatusList.push({
            id: orderstatus.id, name: orderstatus.name
          });


        }
      }, (err) => {
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      });

      this.mktupdatestatusform = this.formBuilder.group({
        orderstatus: ['', Validators.required]
      });
      this.buttondisabled = false;
    } else if (this.local_data.action == 'Update') {

      this.MKTCatRefID = this.local_data.productcatalogue;
      this.MktProductNaam = this.local_data.MktProductNaam;
      this.MktOrderUserConfirmationEmail = this.local_data.MktOrderUserConfirmationEmail;
      this.customerremarks = this.local_data.customerremarks;
      this.OrderShipmentMode = this.local_data.OrderShipmentMode;
      this.MktOrderShipmentTAV = this.local_data.MktOrderShipmentTAV;
      this.MktOrderShipmentStreet = this.local_data.MktOrderShipmentStreet;
      this.MktOrderShipmentHouseNo = this.local_data.MktOrderShipmentHouseNo;
      this.MktOrderShipmentHouseNoExt = this.local_data.MktOrderShipmentHouseNoExt;
      this.MktOrderShipmentPostalCode = this.local_data.MktOrderShipmentPostalCode;
      this.MktOrderShipmentCity = this.local_data.MktOrderShipmentCity;
      this.MktOrderShipmentCountry = this.local_data.MktOrderShipmentCountry;
      this.MktOrderAmount = this.local_data.MktOrderAmount;
      this.remarks = this.local_data.opmerking;
      this.ordertrackcode = this.local_data.ordertrackcode;

      console.log(this.MktProductNaam);
      if(GlobalConstants.Startpacket == this.MktProductNaam) {
        this.isstart=true;
      }else{
        this.isstart=false;
      }


      this.api.getAtrbval(this.local_data.id).subscribe(data => {
        for (let item in data) {
          this.orderattributevalue.set(data[item]['orderattribute'], data[item]['id']);
        }
      }, error => this.toasterservice.showError(error));
      this.addonJson = (this.local_data.MKTAddOns) ? JSON.parse(this.local_data.MKTAddOns) : '';
      this.updateAddOnForm();
      var ordertype = 'add';
      var crdate = formatDate(this.local_data.creationdateEdit, 'yyyy-MM-dd', 'en-US');
      this.getProductCatalogueFilterByDate(crdate, ordertype);

    } else if (this.local_data.action == 'Add') {
      $(".addonField").css("width", "100% !important");

      this.mktcreateform = this.formBuilder.group({
        MKTContactid:['',Validators.required],
        MKTContactPersonTelephone: [''],
        MKTContactPersonEmail: [''],
        MKTContactPersonFunction: [''],
        MKTCatRefID: [''],
        MktProductNaam: ['', Validators.required],
        MktOrderUserConfirmationEmail: ['', Validators.required],
        customerremarks: [''],
        description: [''],
        ordertrackcode: [''],
        OrderShipmentMode: [''],
        MktOrderShipmentTAV: ['', Validators.required],
        MktOrderShipmentStreet: ['', Validators.required],
        MktOrderShipmentHouseNo: ['', Validators.required],
        MktOrderShipmentHouseNoExt: [''],
        MktOrderShipmentPostalCode: ['', Validators.required],
        MktOrderShipmentCity: ['', Validators.required],
        MktOrderShipmentCountry: ['', Validators.required],
        MktOrderAmount: [''],
        customerid: this.locationid,
        MktOrderAddon: this.formBuilder.array([
          // load first row at start
          this.getUnit()
        ])
      });

      this.mktcreateform.get('OrderShipmentMode').setValue('Per Post');
      this.mktcreateform.get('MktOrderShipmentCountry').setValue('Netherlands');
      var crdate = moment().format('YYYY-MM-DD');
      var ordertype = 'add';
      this.getProductCatalogueFilterByDate(crdate, ordertype);
    }
    this.buttondisabled = false;
  }

  ngAfterViewInit(): void {
    //this.countryDropDownChange();
    if (this.local_data.action == 'Update' || this.local_data.action == 'Add') {
      this.setTotalMktCount();
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
          this.mktcreateform.patchValue({
            MKTContactid: Number(newContactId)
          })
      }, error => this.toasterservice.showError(error));
  }

  selectCustomerContact(customercontactid) {
    let selectedcontactperson = this.customercontactList.find(r => r.id == customercontactid
    );
    this.mktcreateform.get('MKTContactPersonEmail').setValue(selectedcontactperson.contactpersonemail);
    this.mktcreateform.get('MKTContactPersonTelephone').setValue(selectedcontactperson.contactpersontelephone);
    this.mktcreateform.get('MKTContactPersonFunction').setValue(selectedcontactperson.contactpersonfunction);

  }


  populateformdropdown() {
    this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;

        if (this.local_data.action == 'Update') {
          this.selectCustomerContact(Number(this.local_data.MKTContactid));
        }
      }, error => this.toasterservice.showError(error));

    this.api.getOrderProperty('MKTOrderType').subscribe(data => {
      this.ordertypeList = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this.api.getOrderProperty('MKTOrderStatus').subscribe(data2 => {
      this.orderstatusList = data2;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this.api.cataloguepropertybygroup('2').subscribe(data => {

      this.productnameListFromOrderProperty = data;
      this.buttondisabled = false;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });



  }

  selectAddon(i: number, productnameid) {
    const control = <FormArray>this.mktcreateform.get('MktOrderAddon');
    this.mktAddonName = control.at(+i).get('MKTAddOnName').value;



    this.addonselectedpriceplan = this.catalogueProperty.find(r => r.productgroup == '2'
      && r.producttype == '2' && r.productname == productnameid
    );
    if (this.addonselectedpriceplan) {
      control.at(+i).get('MKTAddOnCatRefID').setValue(this.addonselectedpriceplan.id);
      control.at(+i).get('MKTAddOnInhoudVerpakking').setValue(this.addonselectedpriceplan.pieceperproduct);
      control.at(+i).get('MKTAddOnMaxBestelbaar').setValue(this.addonselectedpriceplan.maximumquantity);
      control.at(+i).get('MKTAddOnAantal').setValidators([Validators.required, Validators.max(control.at(+i).get('MKTAddOnMaxBestelbaar').value)]);
      control.at(+i).get('MKTAddOnAantal').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }

  }

  updateAddOnForm() {
    let addonarr = [];
    if (this.addonJson != '') {

      for (let i = 0; i < this.addonJson.length; i++) {
        addonarr.push(this.BuildFormDynamic(this.addonJson[i]))
      }
    }
    this.mktcreateform = this.formBuilder.group({
      MKTContactid:[Number(this.local_data.MKTContactid),Validators.required],
      MKTContactPersonTelephone: [this.local_data.MKTContactPersonTelephone],
      MKTContactPersonEmail: [this.local_data.MKTContactPersonEmail],
      MKTContactPersonFunction: [this.local_data.MKTContactPersonFunction],
      MKTCatRefID: [this.local_data.productcatalogue],
      MktProductNaam: ['', Validators.required],
      MktOrderUserConfirmationEmail: [''],
      customerremarks: [''],
      description: [''],
      ordertrackcode: [''],
      OrderShipmentMode: [''],
      MktOrderShipmentTAV: ['', Validators.required],
      MktOrderShipmentStreet: ['', Validators.required],
      MktOrderShipmentHouseNo: ['', Validators.required],
      MktOrderShipmentHouseNoExt: [''],
      MktOrderShipmentPostalCode: ['', Validators.required],
      MktOrderShipmentCity: ['', Validators.required],
      MktOrderShipmentCountry: ['', Validators.required],
      MktOrderAmount: [''],
      customerid: this.locationid,
      MktOrderAddon: this.formBuilder.array(addonarr)
    });
  }

  BuildFormDynamic(addon: { MKTAddOnCatRefID: any; MKTAddOnName: any; MKTAddOnInhoudVerpakking: any; MKTAddOnMaxBestelbaar: any; MKTAddOnAantal: any; }): FormGroup {

    return this.formBuilder.group({

      MKTAddOnCatRefID: [addon.MKTAddOnCatRefID],
      MKTAddOnName: [addon.MKTAddOnName, Validators.required],
      MKTAddOnInhoudVerpakking: [addon.MKTAddOnInhoudVerpakking,],
      MKTAddOnMaxBestelbaar: [addon.MKTAddOnMaxBestelbaar],
      MKTAddOnAantal: [addon.MKTAddOnAantal, [Validators.required, Validators.max(addon.MKTAddOnMaxBestelbaar)]]

    })
  }


  private getUnit() {
    return this.formBuilder.group({
      MKTAddOnCatRefID: [''],
      MKTAddOnName: ['', Validators.required],
      MKTAddOnInhoudVerpakking: ['',],
      MKTAddOnMaxBestelbaar: ['', Validators.required],
      MKTAddOnAantal: ['1', Validators.required]

    });
  }

  private getUnitStartPacket() {
    return this.formBuilder.group({
      MKTAddOnCatRefID: ['18'],
      MKTAddOnName: ['100', Validators.required],
      MKTAddOnInhoudVerpakking: ['50', Validators.required],
      MKTAddOnMaxBestelbaar: ['5', Validators.required],
      MKTAddOnAantal: ['4', Validators.required]

    });
  }
  private getUnitStartPacket1() {
    return this.formBuilder.group({
      MKTAddOnCatRefID: ['18'],
      MKTAddOnName: ['110', Validators.required],
      MKTAddOnInhoudVerpakking: ['10', Validators.required],
      MKTAddOnMaxBestelbaar: ['4', Validators.required],
      MKTAddOnAantal: ['3', Validators.required]

    });
  }

  private getUnitUpdate() {

    return this.formBuilder.group({
      MKTAddOnCatRefID: [''],
      MKTAddOnName: ['', Validators.required],
      MKTAddOnInhoudVerpakking: ['',],
      MKTAddOnMaxBestelbaar: ['', Validators.required],
      MKTAddOnAantal: ['1', Validators.required]
    });
  }



  /**
 * unsubscribe listener
 */
  ngOnDestroy(): void {
    if (this.local_data.action == 'Update' || this.local_data.action == 'Add') {

    }
  }

  /**
   * Add new unit row into form
   */
  addUnit() {
    const control = <FormArray>this.mktcreateform.get('MktOrderAddon');
    control.push(this.getUnit());
    this.setTotalMktCount();
  }
  addUnitStartPacket() {
    const control = <FormArray>this.mktcreateform.get('MktOrderAddon');
    control.push(this.getUnitStartPacket());
    control.push(this.getUnitStartPacket1());
    this.setTotalMktCount();
  }

  addUnitUpdate() {

    const control = <FormArray>this.mktcreateform.get('MktOrderAddon');
    control.push(this.getUnitUpdate());
    this.setTotalMktCount();
  }

  /**
   * Remove unit row from form on click delete button
   */
  removeUnit(i: number) {
    const control = <FormArray>this.mktcreateform.get('MktOrderAddon');
    control.removeAt(i);
    this.setTotalMktCount();

  }
  removeUnitStart() {
    const control = <FormArray>this.mktcreateform.get('MktOrderAddon');
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }
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





  onSubmit(form: NgForm) {
    if (this.mktcreateform.invalid) {
      this.buttondisabled = false;
      return;
    }

    this.buttondisabled = true;
    this.jsonArray = form.value;
    this.jstoday = moment().format('YYYY-MM-DD HH:mm:ss');


    this.orderbase = [
      {
        hstorderid: '',
        orderstatus: '2',
        remarks: (this.mktcreateform.get('description').value == '') ? '' : this.mktcreateform.get('description').value.toString().trim(),
        ponumber: '',
        creationdate: this.jstoday,
        updationdate: null,
        ordertype: '1',
        customerremarks: (this.mktcreateform.get('customerremarks').value == '') ? '' : this.mktcreateform.get('customerremarks').value.toString().trim(),
        locationid: this.locationid,
        productcatalogueid: this.mktcreateform.get('MKTCatRefID').value,
        productcataloguegroup: 2,
        billingstartdate: '2021-03-09',
        billingstatus: '',
        ordertrackcode: '',
        orderstate: ''

      }
    ];

    this.counter = 0;
    Object.keys(this.mktcreateform.controls).forEach(key => {
      if (key == 'MktProductNaam' || key == 'MktOrderUserConfirmationEmail' || key == 'OrderShipmentMode' || key == 'MktOrderShipmentTAV' ||
        key == 'MktOrderShipmentStreet' || key == 'MktOrderShipmentHouseNo' || key == 'MktOrderShipmentHouseNoExt' || key == 'MktOrderShipmentPostalCode'
        || key == 'MktOrderShipmentCity' || key == 'MktOrderShipmentCountry' || key == 'MktOrderAmount' || key == 'MKTContactid' || key == 'MKTContactPersonTelephone'
        || key == 'MKTContactPersonEmail' || key == 'MKTContactPersonFunction'
      ) {
        this.order.push({
          id: '',
          orderattributevalue: (this.mktcreateform.controls[key].value == null || this.mktcreateform.controls[key].value == '') ? '' : this.mktcreateform.controls[key].value.toString().trim(),
          orderattribute: this.orderattribute.get(key),
          orderbasef: this.orderbase[0]
        });

      }
      if (key == 'MktOrderAddon') {
        this.order.push({
          id: '',
          orderattributevalue: (Object.keys(this.mktcreateform.get('MktOrderAddon')).length == 0) ? '' : JSON.stringify(this.mktcreateform.get('MktOrderAddon').value),
          orderattribute: this.orderattribute.get('MktOrderAddon'),
          orderbasef: this.orderbase[0]
        });

      }

    });

    this.order.sort(this.GetSortOrder("orderattribute"));
    this.api.addOrder(JSON.stringify(this.order))
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });

  }

  onUpdate(form: NgForm) {
    if (this.mktcreateform.invalid) {
      this.buttondisabled = false;
      return;
    }
    this.buttondisabled = true;
    this.jsonArray = form.value;
    this.jstoday = moment().format('YYYY-MM-DD HH:mm:ss');

    this.orderbase = [
      {
        hstorderid: this.local_data.orderid,
        orderstatus: '2',
        remarks: (this.mktcreateform.get('description').value == '') ? '' : this.mktcreateform.get('description').value.toString().trim(),
        ponumber: '',
        updationdate: this.jstoday,
        creationdate: this.local_data.creationdateEdit,
        ordertype: '1',
        customerremarks: (this.mktcreateform.get('customerremarks').value == '') ? '' : this.mktcreateform.get('customerremarks').value.toString().trim(),
        locationid: this.locationid,
        productcatalogueid: this.mktcreateform.get('MKTCatRefID').value,
        productcataloguegroup: 2,
        billingstartdate: '2021-03-09',
        billingstatus: '',
        ordertrackcode: (this.mktcreateform.get('ordertrackcode').value == '') ? '' : this.mktcreateform.get('ordertrackcode').value.toString().trim(),
        orderstate: ''

      }
    ];
    this.counter = 0;
    Object.keys(this.mktcreateform.controls).forEach(key => {
      if (key == 'MktProductNaam' || key == 'MktOrderUserConfirmationEmail' || key == 'OrderShipmentMode' || key == 'MktOrderShipmentTAV' ||
        key == 'MktOrderShipmentStreet' || key == 'MktOrderShipmentHouseNo' || key == 'MktOrderShipmentHouseNoExt' || key == 'MktOrderShipmentPostalCode'
        || key == 'MktOrderShipmentCity' || key == 'MktOrderShipmentCountry' || key == 'MktOrderAmount' || key == 'MKTContactid' || key == 'MKTContactPersonTelephone'
        || key == 'MKTContactPersonEmail' || key == 'MKTContactPersonFunction'
      ) {
        this.order.push({
          id: this.orderattributevalue.get(this.orderattribute.get(key)),
          orderattributevalue: (this.mktcreateform.controls[key].value == '' || this.mktcreateform.controls[key].value == null) ? '' : this.mktcreateform.controls[key].value.toString().trim(),
          orderattribute: this.orderattribute.get(key),
          orderbasef: this.orderbase[0]
        });
      }

      if (key == 'MktOrderAddon') {
        this.order.push({
          id: this.orderattributevalue.get(this.orderattribute.get('MktOrderAddon')),
          orderattributevalue: (Object.keys(this.mktcreateform.get('MktOrderAddon').value).length == 0) ? '' : JSON.stringify(this.mktcreateform.get('MktOrderAddon').value),
          orderattribute: this.orderattribute.get('MktOrderAddon'),
          orderbasef: this.orderbase[0]
        });

      }
    });



    for (let ordertype of this.ordertypeList) {
      if (ordertype.id == '1') {
        this.ordertypename = ordertype.name;
      }
    }
    for (let orderstatus of this.orderstatusList) {
      if (orderstatus.id == "2") {
        this.orderstatusname = orderstatus.name;
      }
    }
    this.orderproductname = this.productnameListFromOrderProperty.find(r => r.cataloguepropertytype == '1'
      && r.cataloguepropertyvalue == this.mktcreateform.get('MktProductNaam').value
    ).cataloguepropertyname;





    var arrAddOn = (this.mktcreateform.get('MktOrderAddon').value) ? (this.mktcreateform.get('MktOrderAddon').value) : '';
    this.orderAddOnLevel = [];
    if (arrAddOn) {
      for (let addSingle of arrAddOn) {




        this.orderaddon_name = this.productnameListFromOrderProperty.find(r => r.cataloguepropertytype == '2'
          && r.cataloguepropertyvalue == addSingle.MKTAddOnName
        ).cataloguepropertyname;



        this.orderAddOnLevel.push(
          {
            mktaddon: addSingle.MKTAddOnName,
            mktaddonname: this.orderaddon_name,
            MKTAddOnInhoudVerpakking: addSingle.MKTAddOnInhoudVerpakking,
            MKTAddOnMaxBestelbaar: addSingle.MKTAddOnMaxBestelbaar,
            MKTAddOnAantal: addSingle.MKTAddOnAantal,
            MKTAddOnName: addSingle.MKTAddOnName,
            MKTAddonvalue: this.nameVal,
            //AccessAddOnid: this.orderaddonMap.get(this.orderaddon_name), //added


          }
        )
      }
    }

    //var updateDateformat = formatDate(this.today, 'dd-MM-yyyy HH:MM', 'en-US');
    var updateDateformat = moment().format('DD-MM-YYYY');
    this.orderFormUpdatedValue.push({
      id: this.local_data.id,
      orderid: this.local_data.orderid,
      orderstatus: '2',
      orderstatusname: this.orderstatusname,
      ordertype: '1',
      ordertypename: this.ordertypename,
      ordertrackcode: this.mktcreateform.get('ordertrackcode').value,
      productname: this.orderproductname,
      opmerking: this.mktcreateform.get('description').value,
      customerremarks: this.mktcreateform.get('customerremarks').value,
      MktOrderUserConfirmationEmail: this.mktcreateform.get('MktOrderUserConfirmationEmail').value,
      OrderShipmentMode: this.mktcreateform.get('OrderShipmentMode').value,
      MktOrderShipmentTAV: this.mktcreateform.get('MktOrderShipmentTAV').value,
      MktOrderShipmentStreet: this.mktcreateform.get('MktOrderShipmentStreet').value,
      MktOrderShipmentHouseNo: this.mktcreateform.get('MktOrderShipmentHouseNo').value,
      MktOrderShipmentHouseNoExt: this.mktcreateform.get('MktOrderShipmentHouseNoExt').value,
      MktOrderShipmentPostalCode: this.mktcreateform.get('MktOrderShipmentPostalCode').value,
      MktOrderShipmentCity: this.mktcreateform.get('MktOrderShipmentCity').value,
      MktOrderShipmentCountry: this.mktcreateform.get('MktOrderShipmentCountry').value,
      MktOrderAmount: this.mktcreateform.get('MktOrderAmount').value,
      productcatalogue: this.mktcreateform.get('MKTCatRefID').value,
      updationdate: updateDateformat,
      billingstartdate: '2021-03-09',
      billingstartdateEdit: this.local_data.billingstartdate,
      creationdate: this.local_data.creationdate,
      creationdateEdit: this.local_data.creationdateEdit,
      addons: (this.mktcreateform.get('MktOrderAddon').value) ? this.orderAddOnLevel : '',
      MKTAddOns: JSON.stringify(this.mktcreateform.get('MktOrderAddon').value),
      ponumber: '',
      billingstatus: '',
      locationid: this.locationid,
      location_name: this.location_name,
      secondlevel_TAV: this.mktcreateform.get('MktOrderShipmentTAV').value,
      secondlevel_Verzendadres: this.mktcreateform.get('MktOrderShipmentStreet').value + ', ' + this.mktcreateform.get('MktOrderShipmentHouseNo').value + ', ' + this.mktcreateform.get('MktOrderShipmentHouseNoExt').value + ', ' + this.mktcreateform.get('MktOrderShipmentPostalCode').value + ', ' + this.mktcreateform.get('MktOrderShipmentCity').value + ', ' + this.mktcreateform.get('MktOrderShipmentCountry').value,
      secondlevel_Email: this.mktcreateform.get('MktOrderUserConfirmationEmail').value,
      secondlevel_customerremarks: this.mktcreateform.get('customerremarks').value,
      secondlevel_Laatste_mutatie: updateDateformat,
      secondlevel_Creation_Datum: this.local_data.creationdate,

    });
    this.order.sort(this.GetSortOrder("orderattribute"));
    this.api.updateOrder(JSON.stringify(this.order), this.local_data.id)
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Update', data: this.orderFormUpdatedValue });
        //this.dialogRef.close({ event: 'Cancel' });
      }, (err) => {
        this.buttondisabled = false;
        this.order = [];
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      });
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.mktcreateform.controls[controlName].hasError(errorName);
  }

  public hasErrorUpdate = (controlName: string, errorName: string) => {
    return this.accessupdateform.controls[controlName].hasError(errorName);
  }

  public hasErrorUpdateStatus = (controlName: string, errorName: string) => {
    return this.mktupdatestatusform.controls[controlName].hasError(errorName);
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  checkValue(isChecked: number) {
    if (isChecked == 1) {
      this.isChecked = 0;
      this.isCheckedStatus = false;
    } else {
      this.isChecked = 1;
      this.isCheckedStatus = true;
    }
  }

  setTotalMktCount() {
    var control = <FormArray>this.mktcreateform.get('MktOrderAddon');
    var count = 0;
    this.isdisabled = true;
    for (let i in control.value) {
      count = count + 1;
    }
    if(count>1){
      this.isdisabled = false;
    }
    if(this.mktcreateform.get('MktProductNaam').value == GlobalConstants.Startpacket){
      this.isdisabled = true;
      this.isdisabledadd = true;
    }
    this.mktcreateform.get('MktOrderAmount').setValue(count);
  }


  billingStatus() {
    var AccessProductNaam = this.accesscreateform.get('AccessProductNaam');
    var mstorderid = this.accesscreateform.get('mstorderid');
    var AccessRfsDate = this.accesscreateform.get('AccessRfsDate');
    //var AccessViewingPoint = this.accesscreateform.get('AccessViewingPoint');
    var AccessPrice = this.accesscreateform.get('AccessPrice');
    //var AccessTotalAmount = this.accesscreateform.get('AccessTotalAmount');
    var startdatum_facturatie = this.accesscreateform.get('startdatum_facturatie');
    var facturatie_status = this.accesscreateform.get('facturatie_status');
    var billingMonth = formatDate(this.transformDate(startdatum_facturatie.value), 'MM', 'en-US');
    var todayMonth = formatDate(this.today, 'MM', 'en-US');

    var billingYear = formatDate(this.transformDate(startdatum_facturatie.value), 'yyyy', 'en-US');
    var todayYear = formatDate(this.today, 'yyyy', 'en-US');




    if (AccessProductNaam.value != '' && AccessRfsDate.value != null &&
      (AccessPrice.value.length > 0 && AccessPrice.value != '0') &&
      (startdatum_facturatie != null && billingMonth == todayMonth)
    ) {
      this.accesscreateform.get('facturatie_status').setValue('Ready for Billing');
    }
    else if (AccessProductNaam.value != '' && AccessRfsDate.value != null &&
      (AccessPrice.value.length > 0 && AccessPrice.value != '0') &&
      (startdatum_facturatie != null && billingMonth > todayMonth)
    ) {
      this.accesscreateform.get('facturatie_status').setValue('Ready for future billing');
    }
    else if (AccessProductNaam.value != '' && AccessRfsDate.value != null &&
      (AccessPrice.value.length > 0 && AccessPrice.value != '0') &&
      (startdatum_facturatie != null && billingMonth != todayMonth && billingYear > todayYear)
    ) {
      this.accesscreateform.get('facturatie_status').setValue('Ready for future billing');
    }
    else {
      this.accesscreateform.get('facturatie_status').setValue('Not Ready');
    }
  }

  billingStatusChange() {
    var AccessProductNaam = this.accesscreateform.get('AccessProductNaam');
    var mstorderid = this.accesscreateform.get('mstorderid');
    var AccessRfsDate = this.accesscreateform.get('AccessRfsDate');
    //var AccessViewingPoint = this.accesscreateform.get('AccessViewingPoint');
    var AccessPrice = this.accesscreateform.get('AccessPrice');
    //var AccessTotalAmount = this.accesscreateform.get('AccessTotalAmount');
    var startdatum_facturatie = this.accesscreateform.get('startdatum_facturatie');
    var facturatie_status = this.accesscreateform.get('facturatie_status');
    var billingMonth = formatDate(this.transformDate(startdatum_facturatie.value), 'MM', 'en-US');
    var todayMonth = formatDate(this.today, 'MM', 'en-US');

    var billingYear = formatDate(this.transformDate(startdatum_facturatie.value), 'yyyy', 'en-US');
    var todayYear = formatDate(this.today, 'yyyy', 'en-US');


    if (startdatum_facturatie.value != '' && startdatum_facturatie.value != null) {

      startdatum_facturatie.setValidators([DateValidator.dateVaidator]);
      startdatum_facturatie.updateValueAndValidity();
    } else {

      startdatum_facturatie.setValue('');
      startdatum_facturatie.clearValidators();
      startdatum_facturatie.updateValueAndValidity();
    }


    if (AccessProductNaam.value != '' && AccessRfsDate.value != null &&
      (AccessPrice.value.length > 0 && AccessPrice.value != '0') &&
      (startdatum_facturatie != null && billingMonth == todayMonth)
    ) {

      this.accesscreateform.get('facturatie_status').setValue('Ready for Billing');
    }
    else if (AccessProductNaam.value != '' && AccessRfsDate.value != null &&
      (AccessPrice.value.length > 0 && AccessPrice.value != '0') &&
      (startdatum_facturatie != null && billingMonth > todayMonth)
    ) {

      this.accesscreateform.get('facturatie_status').setValue('Ready for future billing');
    }
    else if (AccessProductNaam.value != '' && AccessRfsDate.value != null &&
      (AccessPrice.value.length > 0 && AccessPrice.value != '0') &&
      (startdatum_facturatie != null && billingMonth != todayMonth && billingYear > todayYear)
    ) {

      this.accesscreateform.get('facturatie_status').setValue('Ready for future billing');
    }
    else {

      this.accesscreateform.get('facturatie_status').setValue('Not Ready');
    }
  }



  billingStatusChangeRFS() {
    var AccessProductNaam = this.accesscreateform.get('AccessProductNaam');
    var mstorderid = this.accesscreateform.get('mstorderid');
    var AccessRfsDate = this.accesscreateform.get('AccessRfsDate');
    //var AccessViewingPoint = this.accesscreateform.get('AccessViewingPoint');
    var AccessPrice = this.accesscreateform.get('AccessPrice');
    //var AccessTotalAmount = this.accesscreateform.get('AccessTotalAmount');
    var startdatum_facturatie = this.accesscreateform.get('startdatum_facturatie');
    var facturatie_status = this.accesscreateform.get('facturatie_status');
    var billingMonth = formatDate(this.transformDate(startdatum_facturatie.value), 'MM', 'en-US');
    var todayMonth = formatDate(this.today, 'MM', 'en-US');

    var billingYear = formatDate(this.transformDate(startdatum_facturatie.value), 'yyyy', 'en-US');
    var todayYear = formatDate(this.today, 'yyyy', 'en-US');


    if (AccessRfsDate.value != '' && AccessRfsDate.value != null) {

      AccessRfsDate.setValidators([DateValidator.dateVaidator]);
      AccessRfsDate.updateValueAndValidity();
    } else {

      AccessRfsDate.setValue('');
      AccessRfsDate.clearValidators();
      AccessRfsDate.updateValueAndValidity();
    }


    if (AccessProductNaam.value != '' && AccessRfsDate.value != null &&
      (AccessPrice.value.length > 0 && AccessPrice.value != '0') &&
      (startdatum_facturatie != null && billingMonth == todayMonth)
    ) {

      this.accesscreateform.get('facturatie_status').setValue('Ready for Billing');
    }
    else if (AccessProductNaam.value != '' && AccessRfsDate.value != null &&
      (AccessPrice.value.length > 0 && AccessPrice.value != '0') &&
      (startdatum_facturatie != null && billingMonth > todayMonth)
    ) {

      this.accesscreateform.get('facturatie_status').setValue('Ready for future billing');
    }
    else if (AccessProductNaam.value != '' && AccessRfsDate.value != null &&
      (AccessPrice.value.length > 0 && AccessPrice.value != '0') &&
      (startdatum_facturatie != null && billingMonth != todayMonth && billingYear > todayYear)
    ) {

      this.accesscreateform.get('facturatie_status').setValue('Ready for future billing');
    }
    else {

      this.accesscreateform.get('facturatie_status').setValue('Not Ready');
    }
  }

  caculateAmountUpdate() {

  }

  caculateAmountAdd() {
  }

  calculateAmount(ZTVViewingPoint, ZTVPrice, ZTVTotalAmount) {

  }

  setPriceValidators() {

  }

  setVPValidators() {


  }

  onUpdatestatus(form: NgForm) {
    if (this.mktupdatestatusform.invalid) {

      const invalid = [];
      const controls = this.mktupdatestatusform.controls;
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
    var orderstat = '';
    //this.jsonArray = form.value;
    this.jstoday = moment().format('YYYY-MM-DD HH:mm:ss');

    let orderstatusname = '';
    this.api.getOrderProperty('MKTOrderStatus').subscribe(data => {
      this.orderstatusList = data;
      for (var orderstatus of this.orderstatusList) {
        if (this.local_data.orderstatus) {
          orderstatusname = orderstatus.name

        }
      }
    }, error => this.toasterservice.showError(error));

    orderstat = this.mktupdatestatusform.get('orderstatus').value;

    this.orderStatusUpdate.push({
      id: this.local_data.id,
      orderstatus: orderstat,
      //productid: (this.local_data.AccessProductID != '') ? parseInt(this.local_data.AccessProductID) : 0
    });


    this.orderFormUpdateStatusValue.push({
      orderstatus: orderstat
    });
    this.api.UpdateOrderStatus(this.local_data.id, JSON.stringify(this.orderStatusUpdate))
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'UpdateStatus', data: this.orderStatusUpdate });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }


  transformDate(date: any) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }



  getProductCatalogueAddOnFilterByDateUpgrade(creationdate: string, ordertype: string) {
    this.productservice.getProductCatalogueFilterByDate('2', creationdate, ordertype, this.location_parentcustomerid).subscribe(data => {
      this.catalogueProperty = data;

      let upgradeorderaddonlist = this.catalogueProperty.filter((r: { productgroup: string; producttype: string; }) => r.productgroup == '2'
        && r.producttype == '2'
      );

      if (upgradeorderaddonlist) {
        this.orderaddonlist = upgradeorderaddonlist;
      }


    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
  }


  getProductCatalogueFilterByDate(creationdate, ordertype) {

    this.productservice.getProductCatalogueFilterByDate('2', creationdate, ordertype, this.location_parentcustomerid).subscribe(data => {
      this.catalogueProperty = data;
      // While opening new access add dialog
      this.productnameList = this.catalogueProperty.filter(r => r.productgroup == '2'
        && r.producttype == '1'
      );
      this.orderaddonlist = this.catalogueProperty.filter(r => r.productgroup == '2'
        && r.producttype == '2'
      );

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
  }

  selectPricePlan(productnameid) {
    const control = <FormArray>this.mktcreateform.get('MktOrderAddon');
    //this.mktAddonName = control.at(+1).get('MKTAddOnName').value;

    this.mainselectedpriceplan = this.catalogueProperty.find(r => r.productgroup == '2'
      && r.producttype == '1' && r.productname == productnameid
    );
    this.addonselectedpriceplan = this.catalogueProperty.find(r => r.productgroup == '2'
      && r.producttype == '2' && r.productname == '100'
    );
    if (this.mainselectedpriceplan) {
      if (GlobalConstants.Startpacket == this.mainselectedpriceplan.productname) {

        this.mktcreateform.get('MKTCatRefID').setValue(this.mainselectedpriceplan.id);

        this.removeUnitStart();
        this.addUnitStartPacket();
        //this.click = true;
        this.isstart = true;
        

        //control.at(+1).get('MKTAddOnCatRefID').setValue(this.addonselectedpriceplan.id);
        /* control.at(+1).get('MKTAddOnInhoudVerpakking').setValue(this.addonselectedpriceplan.pieceperproduct);
         control.at(+1).get('MKTAddOnMaxBestelbaar').setValue(this.addonselectedpriceplan.maximumquantity);
         control.at(+1).get('MKTAddOnAantal').setValidators([Validators.required,Validators.max(control.at(+1).get('MKTAddOnMaxBestelbaar').value)]);
         control.at(+1).get('MKTAddOnAantal').updateValueAndValidity({ onlySelf: true, emitEvent: false }); */

      }
      else {
        this.isstart = false;
        this.isdisabledadd = false;
        this.removeUnitStart();
        this.addUnit();
        this.mktcreateform.get('MKTCatRefID').setValue(this.mainselectedpriceplan.id);
      }
    }


  }
}

