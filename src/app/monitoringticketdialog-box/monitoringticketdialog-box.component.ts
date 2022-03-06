import { Component, Inject, Optional, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn, NgForm, FormControlDirective, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

import { TicketService } from '../_services/ticket.service';
import moment from "moment";
import 'moment-timezone';
import { CommonService } from '../_services/common.service';
import { ToasterService } from '../_services/toastr.service';
//import { DateValidator } from '../_shared/date.validator';
import { CustomerContactdialogBoxComponent } from '../customercontactdialog-box/customercontactdialog-box.component';
import { LocationService } from '../_services/location.service';
import { MatDialog } from '@angular/material/dialog';

moment.tz.setDefault('Europe/Amsterdam');
declare var jQuery: any;

export class Custom {
  name: string;
  id: number;
}

@Component({
  selector: 'app-monitoringticketdialog-box',
  templateUrl: './monitoringticketdialog-box.component.html',
  styleUrls: ['./monitoringticketdialog-box.component.scss']
})

export class MonitoringTicketdialogBoxComponent {
  action: string;
  local_data: any;
  submitted = false;
  _id: string;
  loading = false;
  jsonArray: any[]
  today = new Date();
  jstoday = '';
  buttondisabled = true;

  urgencyList: any[];
  issuetypeList: any[];
  issuestatusList: any[];
  issuenextstateList: any[];
  issueAllState: any[] = [];
  customissuestate: any[] = [];
  customercontacts: any[] = [];

  returnUrl: string;
  locationid: number;
  ticketid;
  userrole;
  hasnextstateid;

  ticketcreateform: FormGroup;
  TicketFormUpdatedValue: any[] = [];
  communicationgroupList;
  checkedList: any[] = [];
  selectedState;
  tabSectionList: any[] = [];
  customercontactList: any[] = [];
  tabSectionListContact: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public dialogRef: MatDialogRef<MonitoringTicketdialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private ticketservice: TicketService,
    public _commonService: CommonService,
    private toasterservice: ToasterService,
    private _locationService: LocationService,
    public dialog: MatDialog,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.action == 'Update' || this.action == 'Transfer' || this.action == 'Delete') {
      this.locationid = +this.local_data.locationid;
    } else {
      this.locationid = +data.locationid;
    }
    this.tabSectionList = this._commonService.getSectionList('InfraTab');
    this.tabSectionListContact = this._commonService.getSectionList('Contact');
  }

  ngOnInit() {
    this.ticketid = this.local_data.id;
    this.buttondisabled = false;
    this._id = this.route.snapshot.paramMap.get("id");

    if (this.local_data.action == 'Add') {
      this.populateformdropdown();
      this.ticketcreateform = this.formBuilder.group({
        description: ['', Validators.required],
        locationid: this.locationid,
        contactpersonid: ['', Validators.required],
        postponeddate: [''],
        contractor: ['', Validators.required],
        astridticketno: [''],
        locationtype: '2',
        locationname: this.local_data.location_name,
        issuestate: ['501'],  //default state for add order
        locationparentcustomerid: this.local_data.locationparentcustomerid,
        urgency: ['', Validators.required],
        shortdescription: ['Aangemaakt obv monitoring alarm'],
        issuetype: ['70'],
        contacttelephone: [''],
        contactemail: [''],
        contactfunction: [''],
      });


      this.ticketservice.getStateList().subscribe(data => {
        this.issueAllState = data;

      }, (err) => {
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      });

      
      
      this.ticketservice.getIssueProperty('urgency',4).subscribe(data => {
        this.urgencyList = data;
      }, (err) => {
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      });
    } else if (this.local_data.action == 'Update') {
      this.populateformdropdown();
      this.ticketcreateform = this.formBuilder.group({
        issuetype: ['70'],
        issuestate: [Number(this.local_data.currentstate_id)],
        urgency: ['', Validators.required],
        shortdescription: ['Aangemaakt obv monitoring alarm'],
        description: ['', Validators.required],
        locationid: this.locationid,
        locationtype: '2',
        locationname: this.local_data.location_name,
        locationparentcustomerid: this.local_data.locationparentcustomerid,
        contactpersonid: [Number(this.local_data.contactpersonid), Validators.required],
        postponeddate: [''],
        contractor: [Number(this.local_data.contractor), Validators.required],
        astridticketno: [''],
        contacttelephone: [''],
        contactemail: [''],
        contactfunction: [''],
      });

      //this.userrole = sessionStorage.getItem('additionalToken');
      this.userrole = '01000010';
      this.ticketservice.getIssueNextStateProperty(this.local_data.currentstate_id).subscribe(data => {
        this.issuenextstateList = data;
        this.hasnextstateid = (data.length > 0) ? data[0].nextstate_id : 0;

        if(data.length > 0){
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
          }
        this.selectedState = Number(this.local_data.currentstate_id);
      }, (err) => {
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      });
      
      this.ticketservice.getIssueProperty('urgency',4).subscribe(data => {
        this.urgencyList = data;
      }, (err) => {
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      });
    } else if (this.local_data.action == 'Transfer') {
      
    }
  }

  ngAfterViewInit(): void {
    
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
    this.ticketcreateform.get('postponeddate').setValue((this.ticketcreateform.get('postponeddate').value != '' && this.ticketcreateform.get('postponeddate').value != null) ?
      formatDate(this.ticketcreateform.get('postponeddate').value, 'yyyy-MM-dd', 'en-US') : null);
    this.ticketservice.addMonitoringTicket(JSON.stringify(form.value))
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
    this.buttondisabled = true;
    this.jsonArray = form.value;

    this.jstoday = formatDate(this.today, 'dd-MM-yyyy', 'en-US');

    this.ticketcreateform.get('postponeddate').setValue((this.ticketcreateform.get('postponeddate').value != '' && this.ticketcreateform.get('postponeddate').value != null) ?
      formatDate(this.ticketcreateform.get('postponeddate').value, 'yyyy-MM-dd', 'en-US') : null);

    if (this.ticketcreateform.get('issuestate').value) {
      this.ticketcreateform.get('issuestate').setValue(this.ticketcreateform.get('issuestate').value);
    } else {
      this.ticketcreateform.get('issuestate').setValue(this.local_data.currentstate_id);
    }

    let urgency = this.urgencyList.find(r =>
      r.id == this.ticketcreateform.get('urgency').value
    ).name;

    let issuetype = this.issuetypeList.find(r =>
      r.id == this.ticketcreateform.get('issuetype').value
    ).name;

    let currentstatename = this.issueAllState.find(r =>
      r.value == Number(this.ticketcreateform.get('issuestate').value)).name

    this.TicketFormUpdatedValue.push(
      {
        id: this.local_data.id,
        issuetypeid: this.ticketcreateform.get('issuetype').value,
        issuetype: issuetype,
        urgency: urgency,
        urgencyid: this.ticketcreateform.get('urgency').value,
        locationid: this.local_data.locationid,
        shortdescription: this.ticketcreateform.get('shortdescription').value,
        description: this.ticketcreateform.get('description').value,
        incidentid: this.local_data.incidentid,
        updationdate: this.jstoday,
        postponeddateEdit: this.ticketcreateform.get('postponeddate').value,
        postponeddate: (this.ticketcreateform.get('postponeddate').value != '' && this.ticketcreateform.get('postponeddate').value != null) ?
          formatDate(this.ticketcreateform.get('postponeddate').value, 'dd-MM-yyyy', 'en-US') : null,
        currentstate_id: this.ticketcreateform.get('issuestate').value,
        currentstatename: currentstatename,
        contactpersonid: this.ticketcreateform.get('contactpersonid').value,
        contractor: this.ticketcreateform.get('contractor').value,
        astridticketno: this.ticketcreateform.get('astridticketno').value,
      }
    );
    form.value.postponeddate = (this.ticketcreateform.get('postponeddate').value != '' && this.ticketcreateform.get('postponeddate').value != null) ?
      formatDate(this.ticketcreateform.get('postponeddate').value, 'yyyy-MM-dd', 'en-US') : null;
    this.ticketservice.updateMonitoringTicket(JSON.stringify(form.value), this.local_data.id)
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

    this.TicketFormUpdatedValue.push(
      {
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
            contactpersonid: Number(newContactId)
          })
      },
      err => console.error(err),
      () => console.log('')
    );
  }

  populateformdropdown() {
    this.ticketservice.getcommunicationgroupticket('4').subscribe(data => {
      this.communicationgroupList = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this.ticketservice.getStateList().subscribe(data => {
      this.issueAllState = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
    });

    this.ticketservice.getIssueProperty('issuestatus',4).subscribe(data => {
      this.issuestatusList = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });
    this.ticketservice.getIssueProperty('issuetype',4).subscribe(data => {
      this.issuetypeList = data;
    }, (err) => {
      this.dialogRef.close({ event: 'Cancel' });
      this.toasterservice.showError(err);
    });

    this._locationService.getCustomerContactListSatellite(this.locationid).subscribe(
      data => {
        this.customercontactList = data;
        if (this.local_data.action == 'Update') {
          this.selectCustomerContact(Number(this.local_data.contactpersonid));
        }
      },
      err => console.error(err),
      () => console.log('')
    );
  }

  selectCustomerContact(customercontactid) {
    let selectedcontactperson = this.customercontactList.find(r => r.id == customercontactid
    );
    this.ticketcreateform.get('contacttelephone').setValue(selectedcontactperson.contactpersontelephone);
      this.ticketcreateform.get('contactemail').setValue(selectedcontactperson.contactpersonemail);
      this.ticketcreateform.get('contactfunction').setValue(selectedcontactperson.contactpersonfunction);

  }

  public hasError = (controlName: string, errorName: string) => {
    return this.ticketcreateform.controls[controlName].hasError(errorName);
  }
}
