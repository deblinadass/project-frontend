import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../_services/location.service';
import { OneTimeCost } from './onetimecost';
import { formatDate } from '@angular/common';
import { OneTimeCostService } from '../_services/onetimecost.service';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { DateValidator } from '../_shared/date.validator';
import { ToasterService } from '../_services/toastr.service';
declare var jQuery: any;
declare const editClick: any;
declare var $: any;

export class Custom {
  name: string;
  id: number;
}

@Component({
  selector: 'app-onetimecostdialog-box',
  templateUrl: './onetimecostdialog-box.component.html',
  styleUrls: ['./onetimecostdialog-box.component.scss']
})

export class OneTimeCostdialogBoxComponent {
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

  counter: number;
  statusInNum: number;
  onetimecostRelocateForm: FormGroup;
  returnUrl: string;
  locationid: number;
  minBillingDate;

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
    this._id = this.route.snapshot.paramMap.get("id");
    this.populateformdropdown();

    if (this.local_data.action == 'Relocate') {
      $('.overlay').show();
      this.onetimecostRelocateForm = this.formBuilder.group({
        location_id: ['', Validators.required]
      });

      var dt = new Date();
      var month = dt.getMonth(), year = dt.getFullYear();
      this.minBillingDate = new Date(year, month, 1);

      $('.overlay').hide();
    } else if (this.local_data.action == 'Update') {
      this.onetimecostupdateform = this.formBuilder.group({
        sourcesystemorder: [''],
        orderidexternal: [''],
        deliverydate: null,
        ordertype: ['', Validators.required],
        productmain: ['', Validators.required],
        productname: ['', Validators.required],
        description: ['', Validators.compose([Validators.pattern('^[0-9A-Za-z. \-]+$')])],
        ponumber: ['', Validators.pattern('^[0-9A-Za-z. \-]+$')],
        serviceid: [''],
        quantity: ['', Validators.compose([Validators.required, Validators.pattern(/^([1-9]{1}[0-9]{0,1})$/)])],
        price: ['', Validators.compose([Validators.required, Validators.pattern(/^([-]?[1-9]{1}[0-9]{0,3}|[-]?[1-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[-]?[0]{1}[,.][0-9]{1}[1-9]{1}|[-]?[0]{1}[,.][1-9]{1}[0-9]{1}|[-]?[0]{1}[,.][1-9]{1})$/)])],
        amount: [''],
        billingmonth: [''],
        customerid: this.locationid,
      });
      //this.local_data.sourcesystemorder = this.local_data.sourcesystemorder.toString();
      this.local_data.ordertype = this.local_data.ordertype.toString();
      this.local_data.productmain = this.local_data.productmain.toString();

      this.local_data.productname = this.local_data.productname.toString();
      //this.populateformdropdown();
      this.caculateAmountUpdate();
    } else if (this.local_data.action == 'Add') {
      
      this.onetimecostcreateform = this.formBuilder.group({
        sourcesystemorder: [''],
        orderidexternal: [''],
        deliverydate: null,
        ordertype: ['', Validators.required],
        productmain: ['', Validators.required],
        productname: ['', Validators.required],
        description: ['', Validators.compose([Validators.pattern('^[0-9A-Za-z. \-]+$')])],
        ponumber: ['', Validators.pattern('^[0-9A-Za-z. \-]+$')],
        serviceid: [''],
        quantity: ['', Validators.compose([Validators.required, Validators.pattern(/^([1-9]{1}[0-9]{0,1})$/)])],
        price: ['', Validators.compose([Validators.required, Validators.pattern(/^([-]?[1-9]{1}[0-9]{0,3}|[-]?[1-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[-]?[0]{1}[,.][0-9]{1}[1-9]{1}|[-]?[0]{1}[,.][1-9]{1}[0-9]{1}|[-]?[0]{1}[,.][1-9]{1})$/)])],
        amount: [''],
        billingmonth: [''],
        customerid: this.locationid,
      });
      this.populateformdropdown();
      this.caculateAmountAdd();
    }
    this.buttondisabled = false;
  }

  onSubmit(form: NgForm) {
    if (this.onetimecostcreateform.invalid) {
      return;
    }
    this.buttondisabled = true;
    //this.onetimecostcreateform.controls['price'].setValue(this.onetimecostcreateform.controls['price'].value.replace('.', ','));
    var otcprice = this.onetimecostcreateform.controls['price'].value;
    if (otcprice != '' && otcprice != undefined) {
      //Always storing prices with 2 decimal 
      this.onetimecostcreateform.controls['price'].setValue(parseFloat(otcprice.replace(',', ".")).toFixed(2).toString().replace('.', ","));
    }
    if (this.onetimecostcreateform.get('deliverydate').value != '') { this.onetimecostcreateform.get('deliverydate').setValue(this.transformDate(this.onetimecostcreateform.get('deliverydate').value)); }
    this.jsonArray = form.value;

    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');

    this.counter = 0;

    this.api.addOneTimeCost(JSON.stringify(form.value))
      .subscribe(res => {

        this.onetimecost = [];
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }

  onUpdate(form: NgForm) {
    if (this.onetimecostupdateform.invalid) {
      return;
    }
    this.buttondisabled = true;
    this.jsonArray = form.value;
    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');
    if (this.onetimecostupdateform.get('deliverydate').value == '') { this.onetimecostupdateform.get('deliverydate').setValue(null); } else {
      this.onetimecostupdateform.get('deliverydate').setValue(this.transformDate(this.onetimecostupdateform.get('deliverydate').value));
    }
    this.onetimecostupdateform.controls['price'].setValue(this.onetimecostupdateform.controls['price'].value.replace('.', ','));
    this.OTCFormUpdatedValue.push({
      id: this.local_data.id,
      sourcesystemorder: this.onetimecostupdateform.controls['sourcesystemorder'].value.toString(),
      orderidexternal: this.onetimecostupdateform.controls['orderidexternal'].value.toString(),
      deliverydate: this.onetimecostupdateform.controls['deliverydate'].value,
      ordertype: this.onetimecostupdateform.controls['ordertype'].value.toString(),
      productmain: this.onetimecostupdateform.controls['productmain'].value.toString(),
      productname: this.onetimecostupdateform.controls['productname'].value.toString(),
      description: this.onetimecostupdateform.controls['description'].value.toString(),
      ponumber: this.onetimecostupdateform.controls['ponumber'].value.toString(),
      serviceid: this.onetimecostupdateform.controls['serviceid'].value.toString(),
      quantity: this.onetimecostupdateform.controls['quantity'].value.toString(),
      price: this.onetimecostupdateform.controls['price'].value.toString(),
      amount: this.onetimecostupdateform.controls['amount'].value.toString(),
      billingmonth: this.onetimecostupdateform.controls['billingmonth'].value.toString()

    });

    this.api.updateOneTimeCost(JSON.stringify(form.value), this.local_data.id)
      .subscribe(res => {
        this.onetimecost = [];
        this.dialogRef.close({ event: 'Update', data: this.OTCFormUpdatedValue });
        this.buttondisabled = false;
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

  closeDatePickerUpdate(elem: MatDatepicker<any>, event: MatDatepickerInputEvent<Date>) {
    elem.close();
    this.onetimecostupdateform.get('billingmonth').setValue(String(event).split(' ')[1] + '-' + String(event).split(' ')[3]);
  }
  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
}
