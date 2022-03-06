import { Component, OnInit, ViewChild, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { OneTimeCost } from '../onetimecostdialog-box/onetimecost';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { OneTimeCostService } from '../_services/onetimecost.service';
import { LocationService } from '../_services/location.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OneTimeCostdialogBoxComponent } from '../onetimecostdialog-box/onetimecostdialog-box.component';
import { DatePipe, formatDate } from '@angular/common';
import { DateValidator } from '../_shared/date.validator';
import { ToasterService } from '../_services/toastr.service';
declare var jQuery: any;
declare const editClick: any;
declare var $: any;

@Component({
  selector: 'app-onetimecostsequencedialog-box',
  templateUrl: './onetimecostsequencedialog-box.component.html',
  styleUrls: ['./onetimecostsequencedialog-box.component.scss']
})
export class OnetimecostsequencedialogBoxComponent implements OnInit {

  action: string;
  local_data: any;
  submitted = false;
  _id: string;
  loading = true;
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
  productmainList: any[];
  productnameList: any[];
  billingmonthList: any[];
  selectedproductnameList: any[];
  periodic: any[];
  billingmonths: any[]

  counter: number;
  statusInNum: number;
  onetimecostRelocateForm: FormGroup;
  returnUrl: string;
  locationid: number;
  minBillingDate;
  periodic_default;

  onetimecostcreateform: FormGroup;
  onetimecostupdateform: FormGroup;
  onetimecost: OneTimeCost[] = [];

  productTypeList: any[];
  evcCosList: any[];
  OTCFormUpdatedValue: any[] = [];
  minDate = new Date(2020, 0, 1);

  @ViewChild('pickerbillingmonth', { static: true }) datePicker: MatDatepicker<any>;
  constructor(
    private api: OneTimeCostService,
    private formBuilder: FormBuilder,
    private _locationService: LocationService,
    public router: Router,
    public dialogRef: MatDialogRef<OneTimeCostdialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _Activatedroute: ActivatedRoute,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private toasterservice: ToasterService,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;

    if (this.action == 'Update' || this.action == 'Relocate' || this.action == 'Delete') {
      this.locationid = +this.local_data.locationid;
    } else {
      this.locationid = +data.locationid;
    }
  }

  ngOnInit() {
    
    this.buttondisabled = true;
    this.periodic_default = '1';
    this._id = this.route.snapshot.paramMap.get("id");
    this.populateformdropdown();

    this.api.getBillingProperty('periodic').subscribe(data => {
      this.periodic = data;
    }, error => this.toasterservice.showError(error));

      this.onetimecostcreateform = this.formBuilder.group({
        frombillingmonth:['', Validators.required],
        tobillingmonth:['', Validators.required],
        billinglineamount:'',
        periodic:'',
        ordertype: ['', Validators.required],
        productmain: ['', Validators.required],
        productname: ['', Validators.required],
        description: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9A-Za-z. \-]+$')])],
        ponumber: ['', Validators.pattern('^[0-9A-Za-z. \-]+$')],
        quantity: ['', Validators.compose([Validators.required, Validators.pattern(/^([1-9]{1}[0-9]{0,1})$/)])],
        price: ['', Validators.compose([Validators.required, Validators.pattern(/^([-]?[1-9]{1}[0-9]{0,3}|[-]?[1-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[-]?[0]{1}[,.][0-9]{1}[1-9]{1}|[-]?[0]{1}[,.][1-9]{1}[0-9]{1}|[-]?[0]{1}[,.][1-9]{1})$/)])],
        amount: [''],
        billingmonths: [''],
        customerid: this.locationid,
      });
      this.populateformdropdown();
      this.caculateAmountAdd();
    
    this.buttondisabled = false;
  }

  onSubmit(form: NgForm) {
    if (this.onetimecostcreateform.invalid) {
      return;
    }
    
    this.buttondisabled = true;
    //this.onetimecostcreateform.controls['price'].setValue(Number(this.onetimecostcreateform.controls['price'].value).toFixed(2).toString().replace('.', ","));
    var otcprice = this.onetimecostcreateform.controls['price'].value;
    if (otcprice != '' && otcprice != undefined) {
      //Always storing prices with 2 decimal 
      this.onetimecostcreateform.controls['price'].setValue(parseFloat(otcprice.replace(',', ".")).toFixed(2).toString().replace('.', ","));
    }
    this.onetimecostcreateform.controls['billingmonths'].setValue(this.billingmonths);
    //if (this.onetimecostcreateform.get('deliverydate').value != '') { this.onetimecostcreateform.get('deliverydate').setValue(this.transformDate(this.onetimecostcreateform.get('deliverydate').value)); }
    this.jsonArray = form.value;

    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');

    this.counter = 0;

    this.api.addOneTimeCostSequence(JSON.stringify(form.value))
      .subscribe(res => {
        this.onetimecost = [];
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }

  dateValidation() {
    var deliverydate = this.onetimecostcreateform.get('deliverydate');
    if (deliverydate.value != '' && deliverydate.value != null) {
      deliverydate.setValidators([DateValidator.dateVaidator]);
      deliverydate.updateValueAndValidity();
    } else {
      deliverydate.setValue('');
      deliverydate.clearValidators();
      deliverydate.updateValueAndValidity();
    }
  }

  dateValidationUpdate() {
    var deliverydate = this.onetimecostupdateform.get('deliverydate');
    if (deliverydate.value != '' && deliverydate.value != null) {
      deliverydate.setValidators([DateValidator.dateVaidator]);
      deliverydate.updateValueAndValidity();
    } else {
      deliverydate.setValue('');
      deliverydate.clearValidators();
      deliverydate.updateValueAndValidity();
    }
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.onetimecostcreateform.controls[controlName].hasError(errorName);
  }

  public hasErrorUpdate = (controlName: string, errorName: string) => {
    return this.onetimecostupdateform.controls[controlName].hasError(errorName);
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onDelete() {
    this.buttondisabled = true;
    this.api.deleteOneTimeCost(this.local_data.id).subscribe(
      data => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Delete', data: this.local_data });
      }, error => this.toasterservice.showError(error));
  }

  checkValue(isChecked) {
    if (isChecked == 1) {
      this.isChecked = 0;
      this.isCheckedStatus = false;
    } else {
      this.isChecked = 1;
      this.isCheckedStatus = true;
    }
  }

  calculateNumberOfOTC() {
    var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
      var month_arr = [];
    var startdate = this.onetimecostcreateform.get('frombillingmonth');
    var enddate = this.onetimecostcreateform.get('tobillingmonth');
    var periodic = this.onetimecostcreateform.get('periodic').value;
   
    var startdate_val = startdate.value;
    var enddate_val = enddate.value;
    var from = new Date(startdate_val);
    var to = new Date(enddate_val);
    
    var months;
    months = (from.getFullYear() - to.getFullYear()) * 12;
    var fromYear = from.getFullYear();
    months -= from.getMonth();
    months += to.getMonth() + 1;
    var fromYear =  from.getFullYear();
    var toYear =  to.getFullYear();
    var diffYear = (12 * (toYear - fromYear)) + to.getMonth();
    for (var i = from.getMonth(); i <= diffYear; i=i+Number(periodic)) {
      month_arr.push(monthNames[i%12] + "-" + Math.floor(fromYear+(i/12)));
    }
    this.billingmonths = month_arr;
    months = month_arr.length;
    if(!isNaN(months)) {
      this.onetimecostcreateform.get('billinglineamount').setValue(months);
    }
    //return months <= 0 ? 0 : months;
  }

  populateformdropdown() {
    
    this.api.getBillingProperty('ordertype').subscribe(data => {
      this.ordertypeList = data;
      
    }, error => this.toasterservice.showError(error));
    
    this.api.getBillingProperty('productmain').subscribe(data => {
      this.productmainList = data;
      this.api.getBillingProperty('productname').subscribe(data => {
        this.productnameList = data;        
        this.getProductName(this.local_data.productmain);
      }, error => this.toasterservice.showError(error));
    }, error => this.toasterservice.showError(error));
    
  }

  selectmainproduct() {
    if (this.onetimecostcreateform) {
      var productmainselected = this.onetimecostcreateform.get('productmain').value;
    } else {
      var productmainselected = this.onetimecostupdateform.get('productmain').value;
    }

    var attributeid;
    for (let productmain of this.productmainList) {
      if (productmain.id == productmainselected) {
        attributeid = productmain.attributeid;
      }
    }
    this.selectedproductnameList = this.productnameList.filter(e => e.parentbillingattributeid === attributeid && !['1','2','3','4','5','6'].includes(e.id));
    //this.selectedproductnameList = this.productnameList;
  }

  getProductName(selectedproductmain) {
   
    var attributeid;
    for (let productmain of this.productmainList) {
      if (productmain.id == selectedproductmain) {
        attributeid = productmain.attributeid;
      }
    }
    this.selectedproductnameList = this.productnameList.filter(e => e.parentbillingattributeid === attributeid && !['1','2','3','4','5','6'].includes(e.id));
   
  }

  caculateAmountUpdate() {
    var quantity = this.onetimecostupdateform.get('quantity');
    var price = this.onetimecostupdateform.get('price');
    var amount = this.onetimecostupdateform.get('amount');
    this.calculateAmount(quantity, price, amount);
  }

  caculateAmountAdd() {
    var quantity = this.onetimecostcreateform.get('quantity');
    var price = this.onetimecostcreateform.get('price');
    var amount = this.onetimecostcreateform.get('amount');
    this.calculateAmount(quantity, price, amount);
  }

  calculateAmount(quantity, price, amount) {
    quantity.valueChanges
      .subscribe(() => {
        if (quantity.value != undefined) {
          if (price.value != undefined) {
            amount.setValue((Number(quantity.value) * Number(price.value.replace(',', '.'))).toFixed(2).toString().replace('.', ','));
          } else {
            amount.setValue(quantity.value);
          }
        }
      });
    price.valueChanges
      .subscribe(() => {
        if (price.value != undefined) {
          if (quantity.value != undefined) {
            amount.setValue((Number(quantity.value) * Number(price.value.replace(',', '.'))).toFixed(2).toString().replace('.', ','));
          } else {
            amount.setValue(price.value.replace('.', ','));
          }
        }
      });
  }

  closeDatePicker(elem: MatDatepicker<any>, event: MatDatepickerInputEvent<Date>) {
    elem.close();
    this.onetimecostcreateform.get('billingmonth').setValue(String(event).split(' ')[1] + '-' + String(event).split(' ')[3]);
  }

  closeDatePickerFromUpdate(elem: MatDatepicker<any>, event: MatDatepickerInputEvent<Date>) {
    elem.close();
    this.onetimecostcreateform.get('frombillingmonth').setValue(String(event).split(' ')[1] + '-' + String(event).split(' ')[3]);
    this.calculateNumberOfOTC();
  }
  closeDatePickerToUpdate(elem: MatDatepicker<any>, event: MatDatepickerInputEvent<Date>) {
    elem.close();
    this.onetimecostcreateform.get('tobillingmonth').setValue(String(event).split(' ')[1] + '-' + String(event).split(' ')[3]);
    this.calculateNumberOfOTC();
  }
  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

}
