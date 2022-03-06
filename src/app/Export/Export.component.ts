import { Component, OnInit } from '@angular/core';
import { ExportService } from '../_services/export.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import * as FileSaver from 'file-saver';
import moment from "moment";
import 'moment-timezone';
import { Router } from '@angular/router';
import { OneTimeCostService } from '../_services/onetimecost.service';
import { routerTransition } from '../router.animations';
import { ToasterService } from '../_services/toastr.service';
moment.tz.setDefault('Europe/Amsterdam');

declare var $: any;

export class Custom {
  name: string;
  id: number;
}
export class OldBillingFile {
  name: string;
  oldmonth: string;
}
export class BillingType {
  name: string;
  id: number;
}

@Component({
  selector: 'app-Export',
  templateUrl: './Export.component.html',
  styleUrls: ['./Export.component.scss'],
  animations: [
    routerTransition()
  ],
})

export class ExportComponent implements OnInit {

  exportData: any;
  exportForm: FormGroup;
  OldBillingFile: any[];
  Billingtype: any[] = [];
  exportList: any[] = [];
  buttondisabled: boolean = false;
  date: any;
  dateInFormat: any;
  dataCheck;
  billinguser: boolean;

  constructor(
    private _exportService: ExportService,
    private formBuilder: FormBuilder,
    private authenticationservice: AuthenticationService,
    private onetimecostService: OneTimeCostService,
    public router: Router,
    private toasterservice: ToasterService,
  ) { }

  ngOnInit() {

    let customObj = new Custom();
    customObj = new Custom();
    customObj.id = 101;
    customObj.name = 'Klantrapport';
    this.exportList.push(customObj);


    //let customObj = new Custom();

    customObj = new Custom();
    customObj.id = 500;
    customObj.name = 'HST Kosten';
    this.exportList.push(customObj);

    customObj = new Custom();
    customObj.id = 600;
    customObj.name = 'Terugkerende Factuurregels';
    this.exportList.push(customObj);


    customObj = new Custom();
    customObj.id = 103;
    customObj.name = 'Ticket';
    this.exportList.push(customObj);

    customObj = new Custom();
    customObj.id = 200;
    customObj.name = 'Order Marketing';
    this.exportList.push(customObj);

    customObj = new Custom();
    customObj.id = 201;
    customObj.name = 'Order Kraskaart';
    this.exportList.push(customObj);

    customObj = new Custom();
    customObj.id = 300;
    customObj.name = 'Mac adres';
    this.exportList.push(customObj);

    customObj = new Custom();
    customObj.id = 204;
    customObj.name = 'Order Multiservice';
    this.exportList.push(customObj);

    customObj = new Custom();
    customObj.id = 301;
    customObj.name = 'Contracten';
    this.exportList.push(customObj);


    this.billinguser = this.authenticationservice.isBillingUser();
    if (this.billinguser) {

    }
    //});

    this.exportFormBuilder();
  }

  exportFormBuilder() {
    this.exportForm = this.formBuilder.group({
      export: ['', Validators.required],
      oldexport: ['', Validators.required],
      billingtype: [''],
    }
    )
  }


  onSubmit() {
    if (this.exportForm.get('export').value != 104) {
      //this.exportForm.get('oldexport').setValue(0);
      this.exportForm.get('oldexport').disable();
    } else {
      // this.exportForm.get('oldexport').disable();
    }
    if (this.exportForm.invalid) {
      return;
    }
    this.buttondisabled = true;
    // if (this.authenticationservice.isSuperUser() || true) {
    switch (this.exportForm.get('export').value) {

      case 101: {
        this._exportService.downloadFile().subscribe(response => {
          let file = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          FileSaver.saveAs(file, 'Klantrapport ' + moment().format('D-M-YYYY H_m') + '.xlsx');
          this.buttondisabled = false;
        }, error => this.toasterservice.showError(error));
        break;
      }
      case 500: {
        this._exportService.downloadFileOneTimeCost(this.exportForm.get('export').value / 100).subscribe(response => {
          let file = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          FileSaver.saveAs(file, 'HST Kosten ' + moment().format('D-M-YYYY H_m') + '.xlsx');
          this.buttondisabled = false;
        }, error => this.toasterservice.showError(error));
        break;
      }
      case 600: {
        this._exportService.downloadFileOneTimeCost(this.exportForm.get('export').value / 100).subscribe(response => {
          let file = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          FileSaver.saveAs(file, 'Terugkerende Factuurregels ' + moment().format('D-M-YYYY H_m') + '.xlsx');
          this.buttondisabled = false;
        }, error => this.toasterservice.showError(error));
        break;
      }
      case 103: {
        this._exportService.downloadFileTicket().subscribe(response => {
          let file = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          FileSaver.saveAs(file, 'Ticket ' + moment().format('D-M-YYYY H_m') + '.xlsx');
          this.buttondisabled = false;
        }, error => this.toasterservice.showError(error));
        break;
      }
      case 200: {
        this._exportService.downloadFileOrder(this.exportForm.get('export').value / 100).subscribe(response => {
          let file = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          FileSaver.saveAs(file, 'Order Marketing ' + moment().format('D-M-YYYY H_m') + '.xlsx');
          this.buttondisabled = false;
        }, error => this.toasterservice.showError(error));
        break;
      }
      case 201: {
        this._exportService.downloadFileOrder(this.exportForm.get('export').value % 100).subscribe(response => {
          let file = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          FileSaver.saveAs(file, 'Order Kraskaart ' + moment().format('D-M-YYYY H_m') + '.xlsx');
          this.buttondisabled = false;
        }, error => this.toasterservice.showError(error));
        break;
      } case 300: {
        this._exportService.downloadFileMacauth(this.exportForm.get('export').value / 100).subscribe(response => {
          let file = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          FileSaver.saveAs(file, 'Mac adres ' + moment().format('D-M-YYYY H_m') + '.xlsx');
          this.buttondisabled = false;
        }, error => this.toasterservice.showError(error));
        break;
      }
      case 204: {
        this._exportService.downloadFileOrder(this.exportForm.get('export').value % 100).subscribe(response => {
          let file = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          FileSaver.saveAs(file, 'Order Multiservice ' + moment().format('D-M-YYYY H_m') + '.xlsx');
          this.buttondisabled = false;
        }, error => this.toasterservice.showError(error));
        break;
      }
      case 301: {

        this._exportService.downloadContract().subscribe(response => {
          let file = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          FileSaver.saveAs(file, 'Contracten ' + moment().format('D-M-YYYY H_m') + '.xlsx');
          this.buttondisabled = false;
        }, error => this.toasterservice.showError(error));
        break;

      }
      default: {
        break;
      }
    }
    //}
  }
}
