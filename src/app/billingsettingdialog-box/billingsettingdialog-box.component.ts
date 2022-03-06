import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../_services/location.service';
import { BillingSetting } from './billingsetting';
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
  selector: 'app-billingsettingdialog-box',
  templateUrl: './billingsettingdialog-box.component.html',
  styleUrls: ['./billingsettingdialog-box.component.scss']
})

export class BillingSettingdialogBoxComponent {
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
  termList: any[];
  productmainList: any[];
  productnameList: any[];
  billingmonthList: any[];
  selectedproductnameList: any[];
  minBillingDate;

  counter: number;
  statusInNum: number;
  onetimecostRelocateForm: FormGroup;
  returnUrl: string;
  locationid: number;

  billingsettingcreateform: FormGroup;
  billingsettingupdateform: FormGroup;
  billingsetting: BillingSetting[] = [];

  productTypeList: any[];
  evcCosList: any[];
  BSFormUpdatedValue: any[] = [];
  minDate = new Date(2021, 0, 1);

  @ViewChild('pickerbillingmonth', { static: true }) datePicker: MatDatepicker<any>;


  constructor(
    private api: OneTimeCostService,
    private formBuilder: FormBuilder,
    private _locationService: LocationService,
    public router: Router,
    public dialogRef: MatDialogRef<BillingSettingdialogBoxComponent>,
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
    var dt = new Date();
    var month = dt.getMonth(), year = dt.getFullYear();
    this.minBillingDate = new Date(year, month, 1);
    this.populateformdropdown();
    if (this.local_data.action == 'Update') {
      this.billingsettingupdateform = this.formBuilder.group({
        startdate: ['', Validators.required],
        enddate: null,
        productmain: ['', Validators.required],
        productname: ['', Validators.required],
        term: ['', Validators.required],
        billingmonth: ['', Validators.required],
        quantity: ['', Validators.compose([Validators.required, Validators.pattern(/^([1-9]{1}[0-9]{0,1})$/)])],
        price: ['', Validators.compose([Validators.required, Validators.pattern(/^([-]?[1-9]{1}[0-9]{0,3}|[-]?[1-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[-]?[0]{1}[,.][0-9]{1}[1-9]{1}|[-]?[0]{1}[,.][1-9]{1}[0-9]{1}|[-]?[0]{1}[,.][1-9]{1})$/)])],
        amount: [''],
        description: ['', Validators.compose([Validators.pattern('^[0-9A-Za-z. \-]+$')])],
        invoicereference: [''],
        regelreference: [''],
        ponumber: ['', Validators.pattern('^[0-9A-Za-z. \-]+$')],
        calculationrule: [''],
        settlement: [''],
        customerid: this.locationid,
        status: this.local_data.status,
        //hstbillingsettingid: this.local_data.hstbillingsettingid
      });
      this.local_data.term = this.local_data.term.toString();
      this.local_data.productmain = this.local_data.productmain.toString();

      this.local_data.productname = this.local_data.productname.toString();
      this.caculateAmountUpdate();
    } else if (this.local_data.action == 'Add') {

      this.billingsettingcreateform = this.formBuilder.group({
        startdate: ['', Validators.required],
        enddate: null,
        productmain: ['', Validators.required],
        productname: ['', Validators.required],
        term: ['', Validators.required],
        billingmonth: ['', Validators.required],
        quantity: ['', Validators.compose([Validators.required, Validators.pattern(/^([1-9]{1}[0-9]{0,1})$/)])],
        price: ['', Validators.compose([Validators.required, Validators.pattern(/^([-]?[1-9]{1}[0-9]{0,3}|[-]?[1-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[-]?[0]{1}[,.][0-9]{1}[1-9]{1}|[-]?[0]{1}[,.][1-9]{1}[0-9]{1}|[-]?[0]{1}[,.][1-9]{1})$/)])],
        amount: [''],
        description: ['', Validators.compose([Validators.pattern('^[0-9A-Za-z. \-]+$')])],
        invoicereference: [''],
        regelreference: [''],
        ponumber: ['', Validators.pattern('^[0-9A-Za-z. \-]+$')],
        calculationrule: [''],
        settlement: [''],
        customerid: this.locationid,
        status: 0

      });
      this.populateformdropdown();
      this.caculateAmountAdd();
    }
    this.buttondisabled = false;
  }

  onSubmit(form: NgForm) {
    if (this.billingsettingcreateform.invalid) {
      return;
    }
    this.buttondisabled = true;
    var bsprice = this.billingsettingcreateform.get('price').value;
    if (bsprice != '' && bsprice != undefined) {
      //Always storing prices with 2 decimal 
      this.billingsettingcreateform.get('price').setValue(parseFloat(bsprice.replace(',', ".")).toFixed(2).toString().replace('.', ","));
    }
    if (this.billingsettingcreateform.get('startdate').value != '') { this.billingsettingcreateform.get('startdate').setValue(this.transformDate(this.billingsettingcreateform.get('startdate').value)); }
    if (this.billingsettingcreateform.get('enddate').value != '') { this.billingsettingcreateform.get('enddate').setValue(this.transformDate(this.billingsettingcreateform.get('enddate').value)); }
    this.jsonArray = form.value;

    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');

    this.counter = 0;
    this.api.addBillingSetting(JSON.stringify(form.value))
      .subscribe(res => {

        this.billingsetting = [];
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }

  onUpdate(form: NgForm) {
    if (this.billingsettingupdateform.invalid) {
      return;
    }
    this.buttondisabled = true;
    this.jsonArray = form.value;
    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');
    if (this.billingsettingupdateform.get('startdate').value == '') { this.billingsettingupdateform.get('startdate').setValue(null); } else {
      this.billingsettingupdateform.get('startdate').setValue(this.transformDate(this.billingsettingupdateform.get('startdate').value));
    }
    if (this.billingsettingupdateform.get('enddate').value == '') { this.billingsettingupdateform.get('enddate').setValue(null); } else {
      this.billingsettingupdateform.get('enddate').setValue(this.transformDate(this.billingsettingupdateform.get('enddate').value));
    }
    this.billingsettingupdateform.get('price').setValue(this.billingsettingupdateform.get('price').value.replace('.', ','));
    this.BSFormUpdatedValue.push({
      id: this.local_data.id,
      startdate: this.billingsettingupdateform.get('startdate').value,
      enddate: this.billingsettingupdateform.get('enddate').value,
      term: this.billingsettingupdateform.get('term').value,
      billingmonth: this.billingsettingupdateform.get('billingmonth').value,
      quantity: this.billingsettingupdateform.get('quantity').value,
      price: this.billingsettingupdateform.get('price').value,
      amount: this.billingsettingupdateform.get('amount').value,
      productmain: this.billingsettingupdateform.get('productmain').value,
      productname: this.billingsettingupdateform.get('productname').value,
      description: this.billingsettingupdateform.get('description').value,
      invoicereference: this.billingsettingupdateform.get('invoicereference').value,
      regelreference: this.billingsettingupdateform.get('regelreference').value,
      ponumber: this.billingsettingupdateform.get('ponumber').value,
      calculationrule: this.billingsettingupdateform.get('calculationrule').value,
      settlement: this.billingsettingupdateform.get('settlement').value,
      status: this.local_data.status,
      //hstbillingsettingid: this.local_data.hstbillingsettingid
    });
    this.api.updateBillingSetting(JSON.stringify(form.value), this.local_data.id)
      .subscribe(res => {
        this.billingsetting = [];
        this.dialogRef.close({ event: 'Update', data: this.BSFormUpdatedValue });
        this.buttondisabled = false;
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }


  dateValidation() {
    var startdate = this.billingsettingcreateform.get('startdate');
    if (startdate.value != '' && startdate.value != null) {
      startdate.setValidators([DateValidator.dateVaidator]);
      startdate.updateValueAndValidity();
    } else {
      startdate.setValue('');
      startdate.clearValidators();
      startdate.updateValueAndValidity();
    }
  }

  dateValidationUpdate() {
    var startdate = this.billingsettingupdateform.get('startdate');
    if (startdate.value != '' && startdate.value != null) {
      startdate.setValidators([DateValidator.dateVaidator]);
      startdate.updateValueAndValidity();
    } else {
      startdate.setValue('');
      startdate.clearValidators();
      startdate.updateValueAndValidity();
    }
  }

  dateValidationEnd() {
    var enddate = this.billingsettingcreateform.get('enddate');
    if (enddate.value != '' && enddate.value != null) {
      enddate.setValidators([DateValidator.dateVaidator]);
      enddate.updateValueAndValidity();
    } else {
      enddate.setValue('');
      enddate.clearValidators();
      enddate.updateValueAndValidity();
    }
  }

  dateValidationUpdateEnd() {
    var enddate = this.billingsettingupdateform.get('enddate');
    if (enddate.value != '' && enddate.value != null) {
      enddate.setValidators([DateValidator.dateVaidator]);
      enddate.updateValueAndValidity();
    } else {
      enddate.setValue('');
      enddate.clearValidators();
      enddate.updateValueAndValidity();
    }
  }



  public hasError = (controlName: string, errorName: string) => {
    return this.billingsettingcreateform.controls[controlName].hasError(errorName);
  }

  public hasErrorUpdate = (controlName: string, errorName: string) => {
    return this.billingsettingupdateform.controls[controlName].hasError(errorName);
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onDelete() {
    this.buttondisabled = true;
    this.api.deletBillingSetting(this.local_data.id).subscribe(
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

    this.api.getBillingProperty('periodic').subscribe(data => {
      this.termList = data;

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
    if (this.billingsettingcreateform) {
      var productmainselected = this.billingsettingcreateform.get('productmain').value;
    } else {
      var productmainselected = this.billingsettingupdateform.get('productmain').value;
    }

    var attributeid;
    for (let productmain of this.productmainList) {
      if (productmain.id == productmainselected) {
        attributeid = productmain.attributeid;
      }
    }
    this.selectedproductnameList = this.productnameList.filter(e => e.parentbillingattributeid === attributeid && !['1', '2', '3', '4', '5', '6'].includes(e.id));
    //this.selectedproductnameList = this.productnameList;
  }

  getProductName(selectedproductmain) {

    var attributeid;
    for (let productmain of this.productmainList) {
      if (productmain.id == selectedproductmain) {
        attributeid = productmain.attributeid;
      }
    }
    this.selectedproductnameList = this.productnameList.filter(e => e.parentbillingattributeid === attributeid && !['1', '2', '3', '4', '5', '6'].includes(e.id));

  }

  caculateAmountUpdate() {
    var quantity = this.billingsettingupdateform.get('quantity');
    var price = this.billingsettingupdateform.get('price');
    var amount = this.billingsettingupdateform.get('amount');
    this.calculateAmount(quantity, price, amount);
  }

  caculateAmountAdd() {
    var quantity = this.billingsettingcreateform.get('quantity');
    var price = this.billingsettingcreateform.get('price');
    var amount = this.billingsettingcreateform.get('amount');
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
      }, error => this.toasterservice.showError(error));
    price.valueChanges
      .subscribe(() => {
        if (price.value != undefined) {
          if (quantity.value != undefined) {
            amount.setValue((Number(quantity.value) * Number(price.value.replace(',', '.'))).toFixed(2).toString().replace('.', ','));
          } else {
            amount.setValue(price.value.replace('.', ','));
          }
        }
      }, error => this.toasterservice.showError(error));
  }

  closeDatePicker(elem: MatDatepicker<any>, event: MatDatepickerInputEvent<Date>) {
    elem.close();
    this.billingsettingcreateform.get('billingmonth').setValue(String(event).split(' ')[1] + '-' + String(event).split(' ')[3]);
  }

  closeDatePickerUpdate(elem: MatDatepicker<any>, event: MatDatepickerInputEvent<Date>) {
    elem.close();
    this.billingsettingupdateform.get('billingmonth').setValue(String(event).split(' ')[1] + '-' + String(event).split(' ')[3]);
  }
  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
}