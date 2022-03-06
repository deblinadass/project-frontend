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
import { CustomerContactdialogBoxComponent } from '../customercontactdialog-box/customercontactdialog-box.component';
import { MatDialog } from '@angular/material/dialog';
import moment from "moment";
import 'moment-timezone';
//import { DateValidator } from '../_shared/date.validator';

import { CommonService } from '../_services/common.service';
moment.tz.setDefault('Europe/Amsterdam');
declare var $: any;

export class Custom {
  name: string;
  id: number;
}

@Component({
  selector: 'app-administrative-ticketdialog-box',
  templateUrl: './administrative-ticketdialog-box.component.html',
  styleUrls: ['./administrative-ticketdialog-box.component.scss']
})

export class AdministrativeTicketdialogBoxComponent {
  customercontactList: any[] = [];
  slaAddonValue: string;
  action: string;
  local_data: any;
  submitted = false;
  _id: string;
  loading = false;

  jsonArray: any[]
  today = new Date();
  jstoday = '';
  buttondisabled = true;

  installproviderList: any[];
  urgencyList: any[];
  channelList: any[];
  issuetypeList: any[];
  issuestatusList: any[];
  issuenextstateList: any[];

  returnUrl: string;
  locationid: number;
  ticketid;
  userrole;
  isplandateedit: boolean = false;
  hasnextstateid;

  adminissuetype: any[] = [];
  ticketcreateform: FormGroup;
  TicketFormUpdatedValue: any[] = [];
  communicationgroupList;
  checkedList: any[] = [];
  isCommErr;
  issueAllState: any[] = [];
  selectedState;
  selectedIssueType;
  tabSectionList: any[] = [];
  tabSectionListContact: any[] = [];
  constructor(
    private productservice: ProductService,
    private formBuilder: FormBuilder,
    private _locationService: LocationService,
    public router: Router,
    public dialogRef: MatDialogRef<AdministrativeTicketdialogBoxComponent>,
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
    if (this.action == 'Update' || this.action == 'Relocate' || this.action == 'Delete') {
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
    this.populateformdropdown();
    this.selectedState = Number(this.local_data.currentstate_id);
    if (this.local_data.action == 'Add') {

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
      this.selectedIssueType = this.local_data.issuetype;

      this.ticketcreateform = this.formBuilder.group({
        TicketContactid:[Number(this.local_data.TicketContactid), Validators.required],
        TicketContactPersonTelephone: [this.local_data.TicketContactPersonTelephone],
        TicketContactPersonEmail: [this.local_data.TicketContactPersonEmail],
        TicketContactPersonFunction:[this.local_data.TicketContactPersonFunction],
        issuetype: [this.local_data.issuetype, Validators.required],
        ticketno: [''],
        plandate: ['', Validators.required],
        issuestate: [Number(this.local_data.currentstate_id)],
        closeddate: [''],
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



      //this.userrole = sessionStorage.getItem('additionalToken');

      this.userrole = '01000001';

      this.ticketservice.getIssueNextStateProperty(this.local_data.currentstate_id).subscribe(data => {
        this.issuenextstateList = data;
        this.isplandateedit = (data.length > 0 && Number(data[0].isplandateedit) == 1) ? true : false;
        this.hasnextstateid = (data.length > 0) ? data[0].nextstate_id : 0;
      }, (err) => {
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
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

    form.value.issuestate = '300';
    form.value.tickettype = 3;
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


    this.checkedList = [];
    for (var i = 0; i < this.communicationgroupList.length; i++) {
      if ($("#" + this.communicationgroupList[i].communicationvalue).is(':checked') == true) {
        this.checkedList.push(this.communicationgroupList[i].communicationvalue);
      }
    }

    if (this.ticketcreateform.invalid) {
      if (!this.checkedList.length) {
        this.isCommErr = true;
      }
      return;
    }


    if (this.checkedList.length == 0) {
      this.isCommErr = true;
      return;
    }
    this.isCommErr = false;
    this.buttondisabled = true;
    this.jsonArray = form.value;

    this.jstoday = formatDate(this.today, 'dd-MM-yyyy', 'en-US');
    let todaydate = formatDate(this.today, 'yyyy-MM-dd', 'en-US');
    let closedDate = '';
    let closedDateEdit = '';

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

    let issuestatusname = this.issuestatusList.find(r =>
      r.id == '10'
    ).name;

    let currentstatename = this.issueAllState.find(r =>
      r.value == Number(this.ticketcreateform.get('issuestate').value)).name
    /*let currentstatename = this.issuenextstateList.find(r =>
      r.nextstate_id == this.ticketcreateform.get('issuestate').value ).nextstatename*/

    this.ticketcreateform.get('communicationgroup').setValue(this.checkedList);
    this.TicketFormUpdatedValue.push(
      {
        id: this.local_data.id,
        issuetypeid: this.ticketcreateform.get('issuetype').value,
        issuetype: issuetype,
        issuestatus: issuestatusname,
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
        plandate: this.ticketcreateform.get('plandate').value ? formatDate(this.ticketcreateform.get('plandate').value, 'dd-MM-yyyy', 'en-US') : null,
        currentstate_id: this.ticketcreateform.get('issuestate').value,
        currentstatename: currentstatename,
        communicationgroup: this.ticketcreateform.get('communicationgroup').value,
        closeddate: closedDate,
        closeddateEdit: closedDateEdit
      }
    );
    form.value.plandate = this.ticketcreateform.get('plandate').value ? formatDate(this.ticketcreateform.get('plandate').value, 'yyyy-MM-dd', 'en-US')
      : null;
    form.value.tickettype = 3;
    this.ticketservice.updateTicket(JSON.stringify(form.value), this.local_data.id)
      .subscribe(res => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Update', data: this.TicketFormUpdatedValue });
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
    }, error => this.toasterservice.showError(error));

  }

  resetContactList(newContactId){
   this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;
        this.selectCustomerContact(Number(newContactId));
          this.ticketcreateform.patchValue({
            TicketContactid: Number(newContactId)
          })
      }, error => this.toasterservice.showError(error));
  }

  populateformdropdown() {
    this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;

        if (this.local_data.action == 'Update') {
          this.selectCustomerContact(Number(this.local_data.TicketContactid));
        }
      }, error => this.toasterservice.showError(error));

    this.ticketservice.getcommunicationgroupticket('3').subscribe(data => {
      this.communicationgroupList = data;

    }, (err) => {
      this.toasterservice.showError(err);
      this.dialogRef.close({ event: 'Cancel' });
    });

    this.ticketservice.getStateList().subscribe(data => {
      this.issueAllState = data;

    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this.ticketservice.getIssueProperty('issuetype',3).subscribe(data => {
      this.issuetypeList = data;
      for (let isuue of this.issuetypeList) {
        if (Number(isuue.id) === 20) {
          this.selectedIssueType = isuue.id;
          this.adminissuetype.push({
            id: isuue.id,
            name: isuue.name
          });
        }
      }
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this.ticketservice.getIssueProperty('installprovider',3).subscribe(data => {
      this.installproviderList = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
    });

    this.ticketservice.getIssueProperty('urgency',3).subscribe(data => {
      this.urgencyList = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this.ticketservice.getIssueProperty('channel',3).subscribe(data => {
      this.channelList = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
    });


    this.ticketservice.getIssueProperty('issuestatus',3).subscribe(data => {
      this.issuestatusList = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });


  }

  selectCustomerContact(customercontactid) {
    let selectedcontactperson = this.customercontactList.find(r => r.id == customercontactid
    );
    this.ticketcreateform.get('TicketContactPersonEmail').setValue(selectedcontactperson.contactpersonemail);
    this.ticketcreateform.get('TicketContactPersonTelephone').setValue(selectedcontactperson.contactpersontelephone);
    this.ticketcreateform.get('TicketContactPersonFunction').setValue(selectedcontactperson.contactpersonfunction);

  }

  public hasError = (controlName: string, errorName: string) => {
    return this.ticketcreateform.controls[controlName].hasError(errorName);
  }

}
