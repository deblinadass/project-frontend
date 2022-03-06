import { ViewEncapsulation, Component, Inject, Optional, OnDestroy, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ValidatorFn, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketService } from '../_services/ticket.service';
import { VERSION } from '@angular/material/core';
import { MatSelectSearchVersion } from 'ngx-mat-select-search';
import { ToasterService } from '../_services/toastr.service';

@Component({
  selector: 'app-ticketdialogmail',
  templateUrl: './ticketdialogmail.component.html',
  styleUrls: ['./ticketdialogmail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TicketdialogmailComponent {
  version = VERSION;
  matSelectSearchVersion = MatSelectSearchVersion;

  action: string;
  local_data: any;

  today = new Date();
  jstoday = '';
  loading = true;
  mailData: any[] = [];
  locationid;
  showInView: boolean = false;
  buttondisabled: boolean = true;
  constructor(
    private api: TicketService,
    public router: Router,
    public dialogRefShow: MatDialogRef<TicketdialogmailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toasterservice: ToasterService,
  ) {

    this.local_data = { ...data };
    this.action = this.local_data.action;

    if (this.action == 'ShowHTML') {
      this.locationid = +this.local_data.locationid;
    } else {
      this.locationid = +data.locationid;
    }
  }

  ngOnInit() {
    this.api.getMailDetails(this.local_data.mailid).subscribe(data => {
      this.mailData = data;
      this.loading = false;
      this.showInView = true;
      this.buttondisabled = false;
    }, error => this.toasterservice.showError(error));
  }





  htmlDecode(input) {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
    /*var e = document.createElement('div');
    e.innerHTML = input.template_content;
    return e.childNodes[0].nodeValue;*/
    //return new DOMParser().parseFromString(input.template_content, 'text/html');
    //return this.sanitized.bypassSecurityTrustHtml(input.template_content);

  }



  closeDialog() {
    this.dialogRefShow.close({ event: 'Cancel' });
  }

}