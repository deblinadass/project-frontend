import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../_services/location.service';
import { CustomerContact } from './customercontact';
import { formatDate } from '@angular/common';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ToasterService } from '../_services/toastr.service';
declare const editClick: any;
declare var $: any;

export class Custom {
  name: string;
  id: number;
}

@Component({
  selector: 'app-customercontactdialog-box',
  templateUrl: './customercontactdialog-box.component.html',
  styleUrls: ['./customercontactdialog-box.component.scss']
})

export class CustomerContactdialogBoxComponent {
  gender1;
  gender2;
  action: string;
  show: boolean;
  local_data: any;
  submitted = false;
  _id: string;
  loading = false;
  customer_details: any;
  isChecked: number = 1;
  isCheckedStatus = true;
  jsonArray: any[]
  array = [];
  attribute: number;
  today = new Date();
  jstoday = '';
  buttondisabled = true;
  counter: number;
  statusInNum: number;
  onetimecostRelocateForm: FormGroup;
  returnUrl: string;
  locationid: number;
  inheritanceFlag = false;

  customercontactcreateform: FormGroup;
  customercontactupdateform: FormGroup;
  customercontact: CustomerContact[] = [];

  CustomerContactFormUpdatedValue: any[] = [];

  @ViewChild('pickerbillingmonth', { static: true }) datePicker: MatDatepicker<any>;

  constructor(
    private formBuilder: FormBuilder,
    private _locationService: LocationService,
    public router: Router,
    public dialogRef: MatDialogRef<CustomerContactdialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
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

    if (this.local_data.action == 'Relocate') {
      $('.overlay').show();
      this.onetimecostRelocateForm = this.formBuilder.group({
        location_id: ['', Validators.required]
      });

      $('.overlay').hide();
    } else if (this.local_data.action == 'Update') {
      this.inheritanceFlag = this.local_data.inheritance;
      this.customercontactupdateform = this.formBuilder.group({
        contactpersonfirstname: ['', Validators.required],
        contactpersonlastname: ['', Validators.required],
        contactpersonfunction: ['', Validators.required],
        contactpersonemail: ['', Validators.required],
        contactpersontelephone: ['', Validators.required],
        contactpersondescription: [''],
        customerid: this.locationid,
        newsletter: this.local_data.newsletter,
        nps: this.local_data.nps,
        report: this.local_data.report,

        gender: this.local_data.gender,
        mijn: this.local_data.mijn,
        type: ['satlocation'],
        satlocationid: this.local_data.satlocationid,
        mijn1: this.local_data.mijn1,
        mijn2: this.local_data.mijn2,
        mijn3: this.local_data.mijn3,
        mijn4: this.local_data.mijn4,
        mijn5: this.local_data.mijn5,

      });
      this.gender1 = (this.local_data.gender == 1) ? true : false;
      this.gender2 = (this.local_data.gender == 2) ? true : false;
      if (this.local_data.mijn == true)
        this.show = true;
      else
        this.show = false;
    } else if (this.local_data.action == 'Add') {
      this.customercontactcreateform = this.formBuilder.group({
        contactpersonlastname: ['', Validators.required],
        contactpersonfirstname: ['', Validators.required],
        contactpersonemail: ['', Validators.required],
        contactpersontelephone: ['', Validators.required],
        contactpersonfunction: ['', Validators.required],
        contactpersondescription: [''],
        customerid: this.locationid,
        newsletter: [''],
        nps: [''],
        report: [''],
        gender: [''],
        mijn: [''],
        mijn1: [''],
        mijn2: [''],
        mijn3: [''],
        mijn4: [''],
        mijn5: [''],
        type: ['satlocation'],
        satlocationid: this.local_data.satlocationid,
      });
    }
    this.buttondisabled = false;
  }
  checkValue() {

    if ($("#mijn").is(':checked') == true) {
      this.show = true;
    }
    else {
      this.show = false;
    }


  }
  onSubmit(form: NgForm) {
    if (this.customercontactcreateform.invalid) {
      return;
    }
    this.buttondisabled = true;
    this.jsonArray = form.value;

    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');
    if (form.value.newsletter == true)
      form.value.newsletter = 1;
    else
      form.value.newsletter = 0;
    if (form.value.nps == true)
      form.value.nps = 1;
    else
      form.value.nps = 0;
    if (form.value.report == true)
      form.value.report = 1;
    else
      form.value.report = 0;
    if (form.value.inheritance == true)
      form.value.inheritance = 1;
    else
      form.value.inheritance = 0;
    if (form.value.mijn == true)
      form.value.mijn = 1;
    else
      form.value.mijn = 0;
    this.counter = 0;

    this._locationService.addCustomerContact(JSON.stringify(form.value))
      .subscribe(res => {
        this.customercontact = [];
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data, response: res });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }

  onUpdate(form: NgForm) {
    if (this.customercontactupdateform.invalid) {
      return;
    }
    this.buttondisabled = true;
    this.jsonArray = form.value;
    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');

    this.CustomerContactFormUpdatedValue.push({
      id: this.local_data.id,
      contactpersonfirstname: this.customercontactupdateform.get('contactpersonfirstname').value.toString(),
      contactpersonlastname: this.customercontactupdateform.get('contactpersonlastname').value.toString(),
      contactpersonemail: this.customercontactupdateform.get('contactpersonemail').value,
      contactpersontelephone: this.customercontactupdateform.get('contactpersontelephone').value.toString(),
      contactpersonfunction: this.customercontactupdateform.get('contactpersonfunction').value.toString(),
      contactpersondescription: this.customercontactupdateform.get('contactpersondescription').value.toString(),
      customerid: this.customercontactupdateform.get('customerid').value.toString(),
      newsletter: (this.customercontactupdateform.get('newsletter').value == true) ? 1 : 0,
      nps: (this.customercontactupdateform.get('nps').value == true) ? 1 : 0,

      report: (this.customercontactupdateform.get('report').value == true) ? 1 : 0,
      gender: this.customercontactupdateform.get('gender').value,
      mijn: this.customercontactupdateform.get('mijn').value,
      mijn1: this.customercontactupdateform.get('mijn1').value,
      mijn2: this.customercontactupdateform.get('mijn2').value,
      mijn3: this.customercontactupdateform.get('mijn3').value,
      mijn4: this.customercontactupdateform.get('mijn4').value,
      mijn5: this.customercontactupdateform.get('mijn5').value,
    });

    this._locationService.updateCustomerContact(JSON.stringify(form.value), this.local_data.id)
      .subscribe(res => {
        this.customercontact = [];
        this.dialogRef.close({ event: 'Update', data: this.CustomerContactFormUpdatedValue });
        this.buttondisabled = false;
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.customercontactcreateform.controls[controlName].hasError(errorName);
  }

  public hasErrorUpdate = (controlName: string, errorName: string) => {
    return this.customercontactupdateform.controls[controlName].hasError(errorName);
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onDelete() {
    this.buttondisabled = true;
    this._locationService.deleteCustomerContact(this.local_data.id).subscribe(
      data => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Delete', data: this.local_data });
      }, error => this.toasterservice.showError(error));
  }

}
