import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../_services/document.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LetteragreementformComponent } from '../letteragreementform/letteragreementform.component';
import { Router } from '@angular/router';
import moment from "moment";
import 'moment-timezone';
import FileSaver from 'file-saver';
import { ToasterService } from '../_services/toastr.service';

@Component({
  selector: 'app-letters-agreement',
  templateUrl: './letters-agreement.component.html',
  styleUrls: ['./letters-agreement.component.scss']
})
export class LettersAgreementComponent implements OnInit {
  locations_list_table: any[] = [];
  satellite_id;
  location_details: any;
  locations_list: any;
  product_list: any;
  dynamicdocList: any;
  staticdocList: any
  attribute_value_list: any;
  loading = false;
  loadinginvoiced = false;
  navLinks: any[] = [];
  activeLinkIndex = -1;
  dataAdd;
  change_status_value: any;
  hardwareList: any;
  channelPackageList: any;
  routeSub;
  productTypeList: any[];
  buttondisabled;
  docselectform: FormGroup;
  staticdocselectform: FormGroup;
  constructor(private api: DocumentService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private toasterservice: ToasterService,
    public router: Router,) {
      if (sessionStorage.getItem('sessionSatelliteID')) {
        this.satellite_id = sessionStorage.getItem('sessionSatelliteID');
      } else {
        sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
        this.satellite_id = sessionStorage.getItem('sessionSatelliteID');
      }
     }

  ngOnInit(): void {
    this.buttondisabled=false;
    this.populateformdropdown();
    this.docselectform = this.formBuilder.group({
      documentname: ['', Validators.required],
    });
    this.staticdocselectform = this.formBuilder.group({
      staticdocumentname: ['', Validators.required],
    });
  }

  populateformdropdown() {
  
      this.api.getDocument('dynamic').subscribe(data => {
        this.dynamicdocList = data;        
      }, error => this.toasterservice.showError(error));
      this.api.getDocument('static').subscribe(data => {
        this.staticdocList = data;        
      }, error => this.toasterservice.showError(error));
  }

  onSubmit(form: NgForm) {
    if (this.docselectform.invalid) {
      return;
    }
    this.buttondisabled = false;
    //this.onetimecostcreateform.controls['price'].setValue(this.onetimecostcreateform.controls['price'].value.replace('.', ','));
    var docid = this.docselectform.controls['documentname'].value;
    var filtered = this.dynamicdocList.filter(function(e){ 
      return docid == e.id;
  });
  var docname = filtered[0]['templatename'];
  this.openDialog(docname, docid);
    
  }

  downloadStaticDoc(form: NgForm){
    var docid=this.staticdocselectform.controls['staticdocumentname'].value;
    var filtered = this.staticdocList.filter(function(e){ 
      return docid == e.id;
  });
    var docname = filtered[0]['templatename'];
    this.api.downloadStaticDocument(docid, docname, this.satellite_id)
      .subscribe(response => {
        let file = new Blob([response], { type: 'application/pdf'})
        FileSaver.saveAs(file, docname+'-' + moment().format('D-M-YYYY H_m') + '.pdf');
        //this.buttondisabled = false;
       // this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, error => this.toasterservice.showError(error));
  }

  openDialog(docname, docid) {
   // obj.action = action;
    var locationid = this.satellite_id;
    const dialogRef = this.dialog.open(LetteragreementformComponent, {
      width: '60%',
      data: {docname:docname, docid:docid, locationid:locationid}, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
    }, error => this.toasterservice.showError(error));
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.docselectform.controls[controlName].hasError(errorName);
  }

}
