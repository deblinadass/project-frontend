import { Component, Inject, Optional, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn, NgForm, FormControlDirective, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../_services/location.service';
import { AuthenticationService } from '../_services/authentication.service';
import { formatDate } from '@angular/common';


import { TicketService } from '../_services/ticket.service';
import { ProductService } from '../_services/product.service';
import { ToasterService } from '../_services/toastr.service';
import moment from "moment";
import 'moment-timezone';
//import { DateValidator } from '../_shared/date.validator';

import { Observable } from 'rxjs';
import { CommonService } from '../_services/common.service';
import { CustomerContactdialogBoxComponent } from '../customercontactdialog-box/customercontactdialog-box.component';
import { MatDialog } from '@angular/material/dialog';
moment.tz.setDefault('Europe/Amsterdam');
declare var jQuery: any;
declare const editClick: any;
declare var $: any;

export class Custom {
  name: string;
  id: number;
}

@Component({
  selector: 'app-ticketdialog-box',
  templateUrl: './ticketdialog-box.component.html',
  styleUrls: ['./ticketdialog-box.component.scss']
})

export class TicketdialogBoxComponent {
  slaAddonValue: string;
  action: string;
  local_data: any;
  submitted = false;
  _id: string;
  loading = false;


  jsonArray: any[]
  today = new Date();
  jstoday = '';
  todaydate = '';
  buttondisabled = true;

  installproviderList: any[];
  urgencyList: any[];
  channelList: any[];
  issuetypeList: any[];
  issuestatusList: any[];
  issuenextstateList: any[];
  issueAllState: any[] = [];
  customissuestate: any[] = [];

  returnUrl: string;
  locationid: number;
  ticketid;
  userrole;
  billinguserrole;
  adminuserrole;
  isplandateedit: boolean = false;
  hasnextstateid;

  ticketcreateform: FormGroup;
  TicketFormUpdatedValue: any[] = [];
  communicationgroupList;
  checkedList: any[] = [];
  billinginstallprovider: any[] = [];
  //htmlStr;
  isCommErr;
  selectedState;
  tabSectionList: any[] = [];
  customercontactList: any[] = [];
  tabSectionListContact: any[] = [];
  constructor(
    private productservice: ProductService,
    private formBuilder: FormBuilder,
    private _locationService: LocationService,
    public router: Router,
    public dialogRef: MatDialogRef<TicketdialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _Activatedroute: ActivatedRoute,
    private route: ActivatedRoute,
    private authenticationservice: AuthenticationService,
    private ticketservice: TicketService,
    private toasterservice: ToasterService,
    public _commonService: CommonService,
    public dialog: MatDialog,
  ) {

    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.action == 'Update' || this.action == 'Transfer' || this.action == 'Delete') {
      this.locationid = +this.local_data.locationid;
    } else {
      this.locationid = +data.locationid;
    }
    this.tabSectionList = this._commonService.getSectionList('TicketTab');
    this.tabSectionListContact = this._commonService.getSectionList('Contact');
  }

  ngOnInit() {
    this.ticketid = this.local_data.id;
    this.buttondisabled = false;
    this._id = this.route.snapshot.paramMap.get("id");


    if (this.local_data.action == 'Add') {
      this.populateformdropdown();
      this.ticketcreateform = this.formBuilder.group({
        TicketContactid:['', Validators.required],
        TicketContactPersonTelephone: [''],
        TicketContactPersonEmail: [''],
        TicketContactPersonFunction:[''],
        issuetype: ['', Validators.required],
        ticketno: [''],
        channel: ['', Validators.required],
        urgency: ['', Validators.required],
        installprovider: ['', Validators.required],
        shortdescription: ['', Validators.required],
        description: ['', Validators.required],
        solution: [''],
        locationid: this.locationid,
        locationtype: '2',
        locationname: this.local_data.location_name,
        issuestate: ['1'],
        locationparentcustomerid: this.local_data.locationparentcustomerid,
      });

    } else if (this.local_data.action == 'Update') {
      this.populateformdropdown();
      this.ticketcreateform = this.formBuilder.group({
        TicketContactid:[Number(this.local_data.TicketContactid), Validators.required],
        TicketContactPersonTelephone: [this.local_data.TicketContactPersonTelephone],
        TicketContactPersonEmail: [this.local_data.TicketContactPersonEmail],
        TicketContactPersonFunction:[this.local_data.TicketContactPersonFunction],
        issuetype: ['', Validators.required],
        ticketno: [''],
        plandate: ['', Validators.required],
        issuestate: [Number(this.local_data.currentstate_id)],
        closeddate: [this.local_data.closeddateEdit],
        channel: ['', Validators.required],
        urgency: ['', Validators.required],
        installprovider: ['', Validators.required],
        shortdescription: ['', Validators.required],
        description: ['', Validators.required],
        solution: [''],
        locationid: this.locationid,
        locationtype: '2',
        locationname: this.local_data.location_name,
        locationparentcustomerid: this.local_data.locationparentcustomerid,
        incidentid: this.local_data.incidentid,
        communicationgroup: [''],

      });



      


      this.ticketservice.getIssueNextStateProperty(this.local_data.currentstate_id).subscribe(data => {
        this.issuenextstateList = data;
        this.isplandateedit = (data.length > 0 && Number(data[0].isplandateedit) == 1) ? true : false;
        this.hasnextstateid = (data.length > 0) ? data[0].nextstate_id : 0;
        this.customissuestate.push({
          id: Number(this.issuenextstateList[0].currentstate_id),
          name: this.issuenextstateList[0].currentstatename
        });
        for (let state of this.issuenextstateList) {
          this.customissuestate.push({
            id: Number(state.nextstate_id),
            name: state.nextstatename
          });

        }
        this.selectedState = Number(this.local_data.currentstate_id);
      }, (err) => {
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      });
    } else if (this.local_data.action == 'Transfer') {
      this.populateinstallprovider(this.local_data.tickettype);
      this.ticketcreateform = this.formBuilder.group({
        installprovider: ['', Validators.required],
        locationparentcustomerid: this.local_data.locationparentcustomerid,
        locationid: this.locationid,
      });
    }
  }



  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onSubmit(form: NgForm) {
    if (this.ticketcreateform.invalid) {
      return;
    }
    this.buttondisabled = true;
    this.jsonArray = form.value;

    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');

    form.value.issuestate = '1';
    form.value.tickettype = 1;
    this.ticketservice.addTicket(JSON.stringify(form.value))
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }



  onUpdate(form: NgForm) {
    if (this.ticketcreateform.invalid) {
      return;
    }
    this.checkedList = [];
    for (var i = 0; i < this.communicationgroupList.length; i++) {
      if ($("#" + this.communicationgroupList[i].communicationvalue).is(':checked') == true) {
        this.checkedList.push(this.communicationgroupList[i].communicationvalue);
      }
    }
    if (!this.checkedList.length) {
      this.isCommErr = true;
      return;
    }

    this.isCommErr = false;
    this.buttondisabled = true;
    this.jsonArray = form.value;
    let closedDate = '';
    let closedDateEdit = '';
    this.jstoday = formatDate(this.today, 'dd-MM-yyyy', 'en-US');
    let todaydate = formatDate(this.today, 'yyyy-MM-dd', 'en-US');

    if (this.ticketcreateform.get('issuestate').value) {
      this.ticketcreateform.get('issuestate').setValue(this.ticketcreateform.get('issuestate').value);

    } else {
      this.ticketcreateform.get('issuestate').setValue(this.local_data.currentstate_id);
    }

    if (this.ticketcreateform.get('issuestate').value == '100' && this.local_data.closeddate == '') {
      this.ticketcreateform.get('closeddate').setValue(todaydate);
      closedDate = this.jstoday;
      closedDateEdit = todaydate;
    } else if (this.ticketcreateform.get('issuestate').value == '100' && this.local_data.closeddate != '') {
      this.ticketcreateform.get('closeddate').setValue(this.local_data.closeddateEdit);
      closedDate = this.local_data.closeddate;
      closedDateEdit = this.local_data.closeddateEdit;
    } else {
      this.ticketcreateform.get('closeddate').setValue(null);
      closedDate = '';
      closedDateEdit = '';
    }


    let urgency = this.urgencyList.find(r =>
      r.id == this.ticketcreateform.get('urgency').value
    ).name;

    let issuetype = this.issuetypeList.find(r =>
      r.id == this.ticketcreateform.get('issuetype').value
    ).name;

    let channel = this.channelList.find(r =>
      r.id == this.ticketcreateform.get('channel').value
    ).name;

    let installprovider = this.installproviderList.find(r =>
      r.id == this.ticketcreateform.get('installprovider').value
    ).name;



    let currentstatename = this.issueAllState.find(r =>
      r.value == Number(this.ticketcreateform.get('issuestate').value)).name



    this.ticketcreateform.get('communicationgroup').setValue(this.checkedList);
    this.TicketFormUpdatedValue.push(
      {
        id: this.local_data.id,
        issuetypeid: this.ticketcreateform.get('issuetype').value,
        issuetype: issuetype,
        //issuestatus: issuestatusname,
        ticketno: this.ticketcreateform.get('ticketno').value,
        channel: channel,
        channelid: this.ticketcreateform.get('channel').value,
        urgency: urgency,
        urgencyid: this.ticketcreateform.get('urgency').value,
        installprovider: installprovider,
        installproviderid: this.ticketcreateform.get('installprovider').value,
        locationid: this.local_data.locationid,
        shortdescription: this.ticketcreateform.get('shortdescription').value,
        description: this.ticketcreateform.get('description').value,
        solution: this.ticketcreateform.get('solution').value,
        //creationdate: this.jstoday
        incidentid: this.local_data.incidentid,
        updationdate: this.jstoday,
        plandateEdit: this.ticketcreateform.get('plandate').value,
        plandate: (this.ticketcreateform.get('plandate').value != '' && this.ticketcreateform.get('plandate').value != null) ?
          formatDate(this.ticketcreateform.get('plandate').value, 'dd-MM-yyyy', 'en-US') : null,
        currentstate_id: this.ticketcreateform.get('issuestate').value,
        currentstatename: currentstatename,
        communicationgroup: this.ticketcreateform.get('communicationgroup').value,
        closeddate: closedDate,
        closeddateEdit: closedDateEdit
      }
    );
    form.value.plandate = (this.ticketcreateform.get('plandate').value != '' && this.ticketcreateform.get('plandate').value != null) ?
      formatDate(this.ticketcreateform.get('plandate').value, 'yyyy-MM-dd', 'en-US') : null;
    form.value.tickettype = 1;
    this.ticketservice.updateTicket(JSON.stringify(form.value), this.local_data.id)
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Update', data: this.TicketFormUpdatedValue });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }



  onTransfer(form: NgForm) {
    if (this.ticketcreateform.invalid) {
      return;
    }



    this.buttondisabled = true;
    this.jsonArray = form.value;

    this.jstoday = formatDate(this.today, 'dd-MM-yyyy', 'en-US');


    let installprovider = this.installproviderList.find(r =>
      r.id == this.ticketcreateform.get('installprovider').value
    ).name;

    this.TicketFormUpdatedValue.push(
      {
        installprovider: installprovider,
        installproviderid: this.ticketcreateform.get('installprovider').value,
        updationdate: this.jstoday,
      }
    );

    this.ticketservice.ticketTransfer(JSON.stringify(form.value), this.local_data.id)
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Transfer', data: this.TicketFormUpdatedValue });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }


  onValidationCheck() {
    this.isCommErr = false;
  }


  makeRemarkBlank(currentvalue) {
    this.ticketcreateform.get('description').setValue('');
  }



  onCheckboxChange() {

    this.checkedList = [];
    for (var i = 0; i < this.communicationgroupList.length; i++) {

      if ($("#" + this.communicationgroupList[i].communicationvalue).is(':checked') == true) {
        
        this.checkedList.push(this.communicationgroupList[i].communicationvalue);
        
      }
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
    });

  }

  resetContactList(newContactId){
   this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;
        this.selectCustomerContact(Number(newContactId));
          this.ticketcreateform.patchValue({
            TicketContactid: Number(newContactId)
          })
      },
      err => console.error(err),
      () => console.log('')
    );
  }

  populateformdropdown() {


    this.ticketservice.getcommunicationgroupticket('1').subscribe(data => {
      this.communicationgroupList = data;

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this.ticketservice.getStateList().subscribe(data => {
      this.issueAllState = data;

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this.ticketservice.getIssueProperty('issuetype',1).subscribe(data => {
      this.issuetypeList = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this.ticketservice.getIssueProperty('installprovider',1).subscribe(data => {
      this.installproviderList = data;

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this.ticketservice.getIssueProperty('urgency',1).subscribe(data => {
      this.urgencyList = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this.ticketservice.getIssueProperty('channel',1).subscribe(data => {
      this.channelList = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });


    this.ticketservice.getIssueProperty('issuestatus',1).subscribe(data => {
      this.issuestatusList = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;

        if (this.local_data.action == 'Update') {
          this.selectCustomerContact(Number(this.local_data.TicketContactid));
        }
      },
      err => console.error(err),
      () => console.log('')
    );


  }

  selectCustomerContact(customercontactid) {
    let selectedcontactperson = this.customercontactList.find(r => r.id == customercontactid
    );
    this.ticketcreateform.get('TicketContactPersonEmail').setValue(selectedcontactperson.contactpersonemail);
    this.ticketcreateform.get('TicketContactPersonTelephone').setValue(selectedcontactperson.contactpersontelephone);
    this.ticketcreateform.get('TicketContactPersonFunction').setValue(selectedcontactperson.contactpersonfunction);

  }

  populateinstallprovider(tickettype) {
    //if(tickettype == 2){
    this.ticketservice.getIssueProperty('installprovider',tickettype).subscribe(data => {
      this.installproviderList = data;

      /*for (let ip of data) {
        if (ip.id === "110") {
          this.billinginstallprovider.push({
            id: ip.id,
            name: ip.name
          });
        }
      }*/

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
    /*}else{
      this.ticketservice.getIssueProperty('installprovider').subscribe(data => {
        this.installproviderList = data;
        
      }, (err) => {
        this.dialogRef.close({ event: 'Cancel' });
      });
    }*/
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.ticketcreateform.controls[controlName].hasError(errorName);
  }

}
