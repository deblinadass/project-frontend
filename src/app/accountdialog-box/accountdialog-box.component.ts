import { Component, OnInit, Optional, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { LocationService } from '../_services/location.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { formatDate } from '@angular/common';
import { ToasterService } from '../_services/toastr.service';


declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-accountdialog-box',
  templateUrl: './accountdialog-box.component.html',
  styleUrls: ['./accountdialog-box.component.scss']
})
export class AccountdialogBoxComponent implements OnInit {
  action: string;
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

  accountcreateform: FormGroup;
  accountupdateform: FormGroup;
  account: any[] = [];

  AccountFormUpdatedValue: any[] = [];

  @ViewChild('pickerbillingmonth', { static: true }) datePicker: MatDatepicker<any>;
  constructor(
    private formBuilder: FormBuilder,
    private _locationService: LocationService,
    public router: Router,
    public dialogRef: MatDialogRef<AccountdialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private toasterservice: ToasterService,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
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
      this.accountupdateform = this.formBuilder.group({
        accountfirstname: ['', Validators.required],
        accountlastname: ['', Validators.required],
        accountfunction: ['', Validators.required],
        accountemail: ['', Validators.required],
        accounttelephone: ['', Validators.required],
        accountdescription: [''],
      });
    } else if (this.local_data.action == 'Add') {
      this.accountcreateform = this.formBuilder.group({
        accountlastname: ['', Validators.required],
        accountfirstname: ['', Validators.required],
        accountemail: ['', Validators.required],
        accounttelephone: ['', Validators.required],
        accountfunction: ['', Validators.required],
        accountdescription: [''],
      });
    }
    this.buttondisabled = false;
  }

  onSubmit(form: NgForm) {
    if (this.accountcreateform.invalid) {
      return;
    }
    this.buttondisabled = true;
    this.jsonArray = form.value;

    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');

    this.counter = 0;
    this._locationService.addAccount(JSON.stringify(form.value))
      .subscribe(res => {
        this.account = [];
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, (err) => {
        this.toasterservice.showError(err);
        this.buttondisabled = false;
      });
  }

  onUpdate(form: NgForm) {
    if (this.accountupdateform.invalid) {
      return;
    }
    this.buttondisabled = true;
    this.jsonArray = form.value;
    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');
    this.AccountFormUpdatedValue.push({
      id: this.local_data.id,
      accountfirstname: this.accountupdateform.get('accountfirstname').value.toString(),
      accountlastname: this.accountupdateform.get('accountlastname').value.toString(),
      accountemail: this.accountupdateform.get('accountemail').value,
      accounttelephone: this.accountupdateform.get('accounttelephone').value.toString(),
      accountfunction: this.accountupdateform.get('accountfunction').value.toString(),
      accountdescription: this.accountupdateform.get('accountdescription').value.toString(),
    });

    this._locationService.updateAccount(JSON.stringify(form.value), this.local_data.id)
      .subscribe(res => {
        this.account = [];
        this.dialogRef.close({ event: 'Update', data: this.AccountFormUpdatedValue });
        this.buttondisabled = false;
      }, (err) => {
        this.toasterservice.showError(err);
        this.buttondisabled = false;
      });
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.accountcreateform.controls[controlName].hasError(errorName);
  }

  public hasErrorUpdate = (controlName: string, errorName: string) => {
    return this.accountupdateform.controls[controlName].hasError(errorName);
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
