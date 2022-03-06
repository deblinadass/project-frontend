import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, NgForm } from '@angular/forms';
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
export interface checkbox {
  id: number;
  name: string;
}
/*export class Item{
  name:string;
  value:string;
}
export const ITEMS: Item[] = [
  {
      name:'Item 1',
      value:'item_1'
   },
   {
       name:'Item 2',
       value:'item_2'
    },
    {
        name:'Item 3',
        value:'item_3'
     },
     {
         name:'Item 4',
         value:'item_4'
      },
      {
          name:'Item 5',
          value:'item_5'
       }
];*/


@Component({
  selector: 'app-customercontactmain',
  templateUrl: './customercontactmain.component.html',
  styleUrls: ['./customercontactmain.component.scss']
})
export class CustomerContactMainComponent {
  listOfOptions = {
    "list": [
      {"name": "some name 1", ID: "D1", "checked": false},
      {"name": "some name 2", ID: "D2", "checked": true},
     
    ]
  };
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
  checkedList;
  customercontactcreateform: FormGroup;
  customercontactupdateform: FormGroup;
  customercontact: CustomerContact[] = [];

  CustomerContactFormUpdatedValue: any[] = [];
  gender1 = false;
  gender2 = false;
  /*radioSel:any;
  radioSelected:string;
  radioSelectedString:string;
  
  itemsList: Item[] = ITEMS;*/

  @ViewChild('pickerbillingmonth', { static: true }) datePicker: MatDatepicker<any>;
  values: string[] = ['true','false']; 

  constructor(
    private formBuilder: FormBuilder,
    private _locationService: LocationService,
    public router: Router,
    public dialogRef: MatDialogRef<CustomerContactMainComponent>,
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
  checkValue(event: any,name:string){
    if(name == 'newsletter' && event == 1) {
      $('#newsletter').value = 1;
     
    }
    else
    $('#'+name).value = 0;
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
    
      this.customercontactupdateform = this.formBuilder.group({
        contactpersonfirstname: ['', Validators.required],
        contactpersonlastname: ['', Validators.required],
        contactpersonfunction: ['', Validators.required],
        contactpersonemail: ['', Validators.required],
        contactpersontelephone: ['', Validators.required],
        contactpersondescription: [''],
        customerid: this.locationid,
        newsletter:this.local_data.newsletter,
         nps:this.local_data.nps,
       report:this.local_data.report,
       inheritance:this.local_data.inheritance,
       gender:this.local_data.gender,

      });
      this.gender1 = (this.local_data.gender == 1) ?  true: false;
      this.gender2 = (this.local_data.gender == 2) ?  true: false;
      
      
     
    } else if (this.local_data.action == 'Add') {
      this.customercontactcreateform = this.formBuilder.group({
        contactpersonlastname: ['', Validators.required],
        contactpersonfirstname: ['', Validators.required],
        contactpersonemail: ['', Validators.required],
        contactpersontelephone: ['', Validators.required],
        contactpersonfunction: ['', Validators.required],
        contactpersondescription: [''],
        customerid: this.locationid,
        newsletter:[''],
        nps:[''],
        report:[''],
        inheritance:[''],
        gender:['']
      });
    }
    this.buttondisabled = false;
  }
  /*getSelecteditem(){
    this.radioSel = ITEMS.find(Item => Item.value === this.radioSelected);
    this.radioSelectedString = JSON.stringify(this.radioSel);
  }

  onItemChange(item){
    this.getSelecteditem();
  }*/

  onSubmit(form: NgForm) {
    if (this.customercontactcreateform.invalid) {
      return;
    }
    this.buttondisabled = true;
    this.jsonArray = form.value;

    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');

    this.counter = 0;
    
    if(form.value.newsletter == true)
      form.value.newsletter = 1;
    else
      form.value.newsletter = 0;
    if(form.value.nps == true)
      form.value.nps = 1;
    else
      form.value.nps = 0;
    if(form.value.report == true)
      form.value.report = 1;
    else
      form.value.report = 0;
    if(form.value.inheritance == true)
      form.value.inheritance = 1;
    else
      form.value.inheritance = 0;
    
    this._locationService.addCustomerContact(JSON.stringify(form.value))
      .subscribe(res => {
        this.customercontact = [];
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data });
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
      newsletter : (this.customercontactupdateform.get('newsletter').value == true) ? 1:0,
      nps : (this.customercontactupdateform.get('nps').value == true)?1:0,
      inheritance :(this.customercontactupdateform.get('inheritance').value == true)?1:0,
      report : (this.customercontactupdateform.get('report').value == true)?1:0,
      gender: this.customercontactupdateform.get('gender').value,
      
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
