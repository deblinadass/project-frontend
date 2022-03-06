import { Component, OnInit, ViewChild, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, NgForm, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { formatDate } from '@angular/common';
import { LocationService } from '../_services/location.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from '../_services/toastr.service';

declare var jQuery: any;
declare const editClick: any;
declare var $: any;

@Component({
  selector: 'app-chaindialog-box',
  templateUrl: './chaindialog-box.component.html',
  styleUrls: ['./chaindialog-box.component.scss']
})
export class ChaindialogBoxComponent implements OnInit {
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

  chaincreateform: FormGroup;
  chainupdateform: FormGroup;

  ChainFormUpdatedValue: any[] = [];

  @ViewChild('pickerbillingmonth', { static: true }) datePicker: MatDatepicker<any>;

  constructor(
    private formBuilder: FormBuilder,
    private _locationService: LocationService,
    public router: Router,
    public dialogRef: MatDialogRef<ChaindialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private toasterservice: ToasterService,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;

  }

  ngOnInit(): void {
    this.buttondisabled = true;
    this._id = this.route.snapshot.paramMap.get("id");

   if (this.local_data.action == 'Update') {
      this.chainupdateform = this.formBuilder.group({
        chainname: ['', Validators.required],
      });
    } else if (this.local_data.action == 'Add') {
      this.chaincreateform = this.formBuilder.group({
        chainname: ['', Validators.required],
      });
    }
    this.buttondisabled = false;
  }

  
  onSubmit(form: NgForm) {
    if (this.chaincreateform.invalid) {
      return;
    }
    this.buttondisabled = true;
    this.jsonArray = form.value;

    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');

    this.counter = 0;
    this._locationService.addChain(JSON.stringify(form.value))
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }

  onUpdate(form: NgForm) {
    if (this.chainupdateform.invalid) {
      return;
    }
    this.buttondisabled = true;
    this.jsonArray = form.value;
    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');
    this.ChainFormUpdatedValue.push({
      chainid: this.local_data.id,
      chainname: this.chainupdateform.controls['chainname'].value.toString(),
    });

    this._locationService.updateChain(JSON.stringify(form.value), this.local_data.id)
      .subscribe(res => {
        //this.customercontact = [];
        this.dialogRef.close({ event: 'Update', data: this.ChainFormUpdatedValue });
        this.buttondisabled = false;
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.chaincreateform.controls[controlName].hasError(errorName);
  }

  public hasErrorUpdate = (controlName: string, errorName: string) => {
    return this.chainupdateform.controls[controlName].hasError(errorName);
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
