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
  selector: 'app-billingexport',
  templateUrl: './billingexport.component.html',
  styleUrls: ['./billingexport.component.scss'],
  animations: [
    routerTransition()
  ],
})

export class BillingExportComponent implements OnInit {

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

    this.billinguser = this.authenticationservice.isBillingUser();
    customObj = new Custom();
    customObj.id = 112;
    customObj.name = 'Factureringsbestand (Alle Producten - Comarch)';
    this.exportList.push(customObj);

    let billingtypeObj = new BillingType();
    billingtypeObj.id = 106;
    billingtypeObj.name = 'Old Billing File';
    this.Billingtype.push(billingtypeObj);

    billingtypeObj = new BillingType();
    billingtypeObj.id = 107;
    billingtypeObj.name = 'Previous Month Billing File';
    this.Billingtype.push(billingtypeObj);

    billingtypeObj = new BillingType();
    billingtypeObj.id = 108;
    billingtypeObj.name = 'Current Month Billing File';
    this.Billingtype.push(billingtypeObj);
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

  getProductReportName(reportParam) {
    switch (reportParam) {
      case 1: {
        return 'Product Digitenne';
      }
      case 2: {
        return 'Product Access';
      }
      case 3: {
        return 'Product zTV Classic';
      }
      case 4: {
        return 'Product Internet';
      }
    }
  }

  getOrderReportName(reportParam) {
    switch (reportParam) {
      case 1: {
        return 'Order Digitenne';
      }
      case 2: {
        return 'Order Access';
      }
      case 3: {
        return 'Order zTV Classic';
      }
      case 4: {
        return 'Order Internet';
      }
    }
  }

  onSubmit() {
    if (this.exportForm.get('export').value != 104) {
      this.exportForm.get('oldexport').disable();
    } else {
      // this.exportForm.get('oldexport').disable();
    }
    if (this.exportForm.invalid) {
      return;
    }
    this.buttondisabled = true;
    if (this.authenticationservice.isSuperUser() || true) {
      switch (this.exportForm.get('export').value) {
        case 112: {
          this._exportService.downloadComarchCombinedBillingFile(this.exportForm.get('oldexport').value, '0').subscribe(response => {
            let file = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            this.exportForm.get('export').enable();
            this.exportForm.get('oldexport').enable();
            this.buttondisabled = false;
            var currentmonthyear = moment(('0' + (new Date().getMonth() + 1).toString()).slice(-2), 'MM').format('MMM') + new Date().getFullYear().toString();
            var currentmonthyearformatted = moment(('0' + (new Date().getMonth() + 1).toString()).slice(-2), 'MM').format('MMM') + '-' + new Date().getFullYear().toString();
            var previousmonthyearformatted = moment(('0' + (new Date().getMonth()).toString()).slice(-2), 'MM').format('MMM') + '-' + new Date().getFullYear().toString();
            if (moment(('0' + (new Date().getMonth()).toString()).slice(-2), 'MM').format('MMM') == 'Dec') {
              previousmonthyearformatted = moment(('0' + (new Date().getMonth()).toString()).slice(-2), 'MM').format('MMM') + '-' + (new Date().getFullYear() - 1).toString();
            }
            var actual_billperiod = this.exportForm.get('oldexport').value;
            this.onetimecostService.checkconfirmbilling(this.exportForm.get('oldexport').value, '0').subscribe(response => {
              if (currentmonthyear == actual_billperiod) {
                FileSaver.saveAs(file, 'Forecast-' + currentmonthyearformatted + '---BCS_' + moment().format('YYYYMMDD') + '_001_OrderGen.xlsx');
              } else if (response['message'] == 'Billing_Not_Confirmed') {
                FileSaver.saveAs(file, 'NietGesloten-' + previousmonthyearformatted + '---BCS_' + moment().format('YYYYMMDD') + '_001_OrderGen.xlsx');
                this.router.navigateByUrl('/billing-confirmation', { state: { billperiod: actual_billperiod, mainproduct: '0', productcatalogue: '0' } });
              } else {
                FileSaver.saveAs(file, 'Gesloten-' + previousmonthyearformatted + '---BCS_' + moment().format('YYYYMMDD') + '_001_OrderGen.xlsx');
              }
            }, error => this.toasterservice.showError(error));
          }, error => this.toasterservice.showError(error));
          break;
        }
      }
    }
  }
  selectBillinFile() {
    var data = this.exportForm.get('export').value;
    if (data == '112') {
      this.onetimecostService.getOldBillingFile('0').subscribe(data => {
        if (data['message'] == 'No_Data_Found') {
          this.dataCheck = 0;
        } else {
          this.OldBillingFile = data;
        }
      }, error => this.toasterservice.showError(error));
      this.exportForm.get('oldexport').enable();
      $('#billingfile').show();
    }
  }
  selectBillinFiletype() {
    var data = this.exportForm.get('export').value;
    if (data == '104') {
      $('#billingfiletype').show();
    } else {
      $('#billingfiletype').hide();
      //this.OldBillingFile = data;
    }
  }
}