import { Component, OnInit, Optional, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { DocumentService } from '../_services/document.service';
import { DatePipe } from '@angular/common';
import { LocationService } from '../_services/location.service';
import FileSaver from 'file-saver';
import moment from "moment";
import 'moment-timezone';
import { ToasterService } from '../_services/toastr.service';

export interface checkbox {
  id: number;
  name: string;
}
declare var $: any;

@Component({
  selector: 'app-letteragreementform',
  templateUrl: './letteragreementform.component.html',
  styleUrls: ['./letteragreementform.component.scss']
})
export class LetteragreementformComponent implements OnInit {
  local_data: any;
  action;
  templateid: string;
  contactpersons;
  orderaccounts;
  doccreateform: FormGroup;
  buttondisabled = false;
  legitimatietypes;
  customerid;
  contactDetail: any;
  docname: any;
  docheaders: { id: number; name: string; }[];
  businessmodels: { id: number; name: string; }[];
  definities_check = true;

  //@ViewChild('pickerbillingmonth', { static: true }) datePicker: MatDatepicker<any>;
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public dialogRef: MatDialogRef<LetteragreementformComponent>,
    private formBuilder: FormBuilder,
    private api: DocumentService,
    private locationapi: LocationService,
    private datePipe: DatePipe,
    private toasterservice: ToasterService,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.customerid = this.local_data.locationid;
    this.templateid = this.local_data.docid;
  }

  checkValue(event: any, name: string) {
    if (name == 'Scope' && event == 1) {
      $('#Scope').value = 1;

    }
    else
      $('#' + name).value = 0;
  }

  ngOnInit(): void {
    this.templateid = this.local_data.docid;
    this.docname = this.local_data.docname;
    this.populateformdropdown();

    this.legitimatietypes = [
      { id: 1, name: "Passport" },
      { id: 2, name: "Identiteitskaart" },
      { id: 3, name: "Rijbewijs" },
    ];

    this.docheaders = [
      { id: 1, name: "Overeenkomst" },
      { id: 2, name: "Addendum" },

    ];

    this.businessmodels = [
      { id: 1, name: "Gratis" },
      { id: 2, name: "Betaald" },
      { id: 3, name: "Hybride" },
      { id: 3, name: "Gratis 2.0" },
    ];

    if (this.local_data.docname == 'offerte') {
      this.doccreateform = this.formBuilder.group({
        contactperson: ['', Validators.required],
        PRODUCTAANTAL: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        TOTAALBEDRAG: ['', Validators.pattern('([1-9]{1}[0-9]{0,3}|[1-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[0]{1}[,.][0-9]{1}[1-9]{1}|[0]{1}[,.][1-9]{1}[0-9]{1}|[0]{1}[,.][1-9]{1})')],
        TEKENNAAM: [''],
        TEKENFUNCTIE: [''],
        LEGNR: [''],
        GEBDAT: [''],
        LEGTYPE: [''],
        PRODUCTNAAM: [''],
        TEKENDATUM: [''],
        customerid: [this.customerid],
        templateid: [this.templateid]
      });
    } else if (this.local_data.docname == 'brief-(bevestiging-opzegging)') {
      this.doccreateform = this.formBuilder.group({
        EINDDATUM: ['', Validators.required],
        customerid: [this.customerid],
        templateid: [this.templateid]
      });
    } else if ((this.local_data.docname == 'brief-(contractbreuk-nevennetwerk)') || (this.local_data.docname == 'brief-(contractbreuk-uitzetten-netwerk)')) {
      this.doccreateform = this.formBuilder.group({
        CONTRACTBREUKDATUM: ['', Validators.required],
        SCHADEBEDRAG: ['', Validators.pattern('([1-9]{1}[0-9]{0,3}|[1-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[0]{1}[,.][0-9]{1}[1-9]{1}|[0]{1}[,.][1-9]{1}[0-9]{1}|[0]{1}[,.][1-9]{1})')],
        REKENINGBEDRAG: ['', Validators.pattern('([1-9]{1}[0-9]{0,3}|[1-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[0]{1}[,.][0-9]{1}[1-9]{1}|[0]{1}[,.][1-9]{1}[0-9]{1}|[0]{1}[,.][1-9]{1})')],
        customerid: [this.customerid],
        templateid: [this.templateid]
      });
    } else if (this.local_data.docname == 'overeenkomst-addendum') {
      this.doccreateform = this.formBuilder.group({
        DOCUMENTHEADER: ['', Validators.required],
        facturatiegegevens: [''],
        contractgegevens: [''],
        Kraskaarten: ['', Validators.pattern('([1-9]{1}[0-9]{0,3}|[1-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[0]{1}[,.][0-9]{1}[1-9]{1}|[0]{1}[,.][1-9]{1}[0-9]{1}|[0]{1}[,.][1-9]{1})')],
        Creditcard: ['', Validators.pattern('([1-9]{1}[0-9]{0,3}|[1-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[0]{1}[,.][0-9]{1}[1-9]{1}|[0]{1}[,.][1-9]{1}[0-9]{1}|[0]{1}[,.][1-9]{1})')],
        contactperson: ['', Validators.required],
        BUSINESSMODEL: ['', Validators.required],
        Looptijd: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        Verlenging: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        MAANDELIJKSEKOSTEN: ['', Validators.pattern('([1-9]{1}[0-9]{0,3}|[1-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[0]{1}[,.][0-9]{1}[1-9]{1}|[0]{1}[,.][1-9]{1}[0-9]{1}|[0]{1}[,.][1-9]{1})')],
        EENMALIGEKOSTEN: ['', Validators.pattern('([1-9]{1}[0-9]{0,3}|[1-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[0]{1}[,.][0-9]{1}[1-9]{1}|[0]{1}[,.][1-9]{1}[0-9]{1}|[0]{1}[,.][1-9]{1})')],
        ACCESSPOINTSAANTAL: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
        ORDERNUMMER: [''],
        OPMERKING: [''],
        Scope: [''],
        Marketing: [''],
        customerid: [this.customerid],
        templateid: [this.templateid]
      });
      this.doccreateform.controls['DOCUMENTHEADER'].setValue('Overeenkomst');
    } else if (this.local_data.docname == 'Oplevering') {
      this.doccreateform = this.formBuilder.group({
        contactperson: ['', Validators.required],
        BESTELACCOUNT: ['', Validators.required],
        customerid: [this.customerid],
        templateid: [this.templateid]
      });
    } else if (this.local_data.docname == 'Specifieke Voorwaarden KPN Hotspots') {
      this.doccreateform = this.formBuilder.group({
        Definities: ['', Validators.required],
        Reikwijdte_overeenkomst: [''],
        Marketing: [''],
        Verkrijgen_internetverbinding: [''],
        Gebruikersprofiel: [''],
        ISRA_punt: [''],
        Stacken_2: [''],
        Stacken_4: [''],
        FTU: [''],
        FttH: [''],
        FttO: [''],
        Overige_Bandbreedte: [''],
        Bestaande_glas_access: [''],
        Levering_internet: [''],
        Stroomvoorziening: [''],
        WiFi_dekking_vooraf_bepaald: [''],
        WiFi_dekking_niet_vooraf_bepaald: [''],
        WiFi_dekking_WLAN_Partner: [''],
        Ongewijzigde_WiFi_dekking: [''],
        Vervallen_locatie: [''],
        Vervangen_apparatuur: [''],
        Servicelevel_afspraken_standaard: [''],
        Servicelevel_afspraken_high: [''],
        Masten: [''],
        Netwerk_Locatie: [''],
        Bekabeling_overige_infrastructuur: [''],
        COAX: [''],
        Projectleider: [''],
        Bekabelde_aansluiting: [''],
        Overname_bekabeling_na_opheffing: [''],
        Overname_netwerk: [''],
        Tarieven_eindgebruikers: [''],
        Indexering: [''],
        Terugname_codekaarten: [''],
        Schade: [''],
        Timely_uitzetten_WiFi_dienstverlening: [''],
        customerid: [this.customerid],
        templateid: [this.templateid]
      });
    }

  }

  populateformdropdown() {

    this.locationapi.getContactDetail(this.customerid).subscribe(data => {
      this.contactpersons = data;
    }, error => this.toasterservice.showError(error));
    this.locationapi.getOrderAccounts(this.customerid).subscribe(data => {
      this.orderaccounts = data;
    }, error => this.toasterservice.showError(error));
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onSubmit(form: NgForm) {
    if (this.doccreateform.invalid) {
      return;
    }
    this.buttondisabled = true;

    if (this.local_data.docname == 'offerte') {
      if (this.doccreateform.get('GEBDAT').value != '') { this.doccreateform.get('GEBDAT').setValue(this.transformDate(this.doccreateform.get('GEBDAT').value)); }
      if (this.doccreateform.get('TEKENDATUM').value != '') { this.doccreateform.get('TEKENDATUM').setValue(this.transformDate(this.doccreateform.get('TEKENDATUM').value)); }
    } else if (this.local_data.docname == 'brief-(bevestiging-opzegging)') {
      if (this.doccreateform.get('EINDDATUM').value != '') { this.doccreateform.get('EINDDATUM').setValue(this.transformDate(this.doccreateform.get('EINDDATUM').value)); }
    } else if ((this.local_data.docname == 'brief-(contractbreuk-nevennetwerk)') || (this.local_data.docname == 'brief-(contractbreuk-uitzetten-netwerk)')) {
      if (this.doccreateform.get('CONTRACTBREUKDATUM').value != '') { this.doccreateform.get('CONTRACTBREUKDATUM').setValue(this.transformDate(this.doccreateform.get('CONTRACTBREUKDATUM').value)); }
    } else if (this.local_data.docname == 'overeenkomst-addendum') {
      if (form.value.Scope == true)
        form.value.Scope = 1;
      else
        form.value.Scope = 0;
      if (form.value.Marketing == true)
        form.value.Marketing = 1;
      else
        form.value.Marketing = 0;
    }
    // this.jsonArray = form.value;
    var docname = this.local_data.docname;
    this.api.createDocument(JSON.stringify(form.value))
      .subscribe(response => {
        let file = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        FileSaver.saveAs(file, docname + '-' + moment().format('D-M-YYYY H_m') + '.docx');
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.doccreateform.controls[controlName].hasError(errorName);
  }
  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

}