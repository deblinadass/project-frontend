import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EnduserService } from '../_services/EnduserService.service';
import { DatePipe } from '@angular/common';
import moment from "moment";
import 'moment-timezone';
import { FormGroup, FormBuilder, NgForm, Validators } from '@angular/forms';
import { InfraService } from '../_services/infra.service';
import { ToasterService } from '../_services/toastr.service';

declare var $: any;
export class paymentModel {
  status: string;
}
@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class SessionComponent implements OnInit {
  id;
  paymentList: any;
  displayedPayment: string[] = ['Datum', 'Omschrijving', 'Betaalwijze', 'Betaalin informatie', 'OrderID', 'Status', 'Factuur', 'Refund'];
  dataSourcePayment = new MatTableDataSource<paymentModel>();
  expandedElement: any[] = [];
  payment: any[] = [];
  loading = false;
  displayedSessionColumns: string[] = ['Start', 'Stop', 'Sessieduur', 'Stopreason', 'Macadres', 'Gebruikersnaam', 'Ip'];
  startdate: any;
  stopdate: any;
  datefiltersessionForm: FormGroup;
  data;
  sessionData: Array<any> = [];
  sessionlistData: any;
  session_details_table: Array<object> = [];

  dataSourceSession = new MatTableDataSource<any>();
  exceedThreshold: boolean;
  noRecords: boolean;
  inputcheck: boolean;
  session_details: any;
  @ViewChild('sessionsort', { static: true }) sessionsort: MatSort;
  @ViewChild('paginatorSession', { static: true }) paginatorSession: MatPaginator;

  @ViewChild('paymentsort', { static: true }) paymentsort: MatSort;
  @ViewChild('paginatorPayment', { static: true }) paginatorPayment: MatPaginator;
  constructor(
    public router: Router,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private _enduserService: EnduserService,
    private InfraService: InfraService,
    private formBuilder: FormBuilder,
    private toasterservice: ToasterService,
  ) {
    $('.mat-tab-link').removeClass('mat-tab-label-active');
    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.id = sessionStorage.getItem('sessionSatelliteID');
      //this.id = '1';
    } else {
      //sessionStorage.setItem('sessionSatelliteID', '1');
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionSatelliteID');
    }
  }

  ngOnInit(): void {
    this.dataSourcePayment.paginator = this.paginatorPayment;
    this.dataSourcePayment.sort = this.paymentsort;


    this._enduserService.fetchPayment(this.id).subscribe(
      data1 => {

        this.payment = [];
        this.paymentList = data1;


        if (this.paymentList['0']['payment_provider'] == 'OGONE')
          this.paymentList['0']['payment_provider'] = 'Online(Ogone)';
        if (this.paymentList['0']['payment_method'] == 'iDEAL')
          this.paymentList['0']['payment_method'] = 'iDEAL';
        if (this.paymentList['0']['status'] == ['AUTHORISED'])
          this.paymentList['0']['status'] = "Succesvol ";
        this.payment.push(
          {
            date: this.formatdatehst(this.paymentList['0']['date']),
            description: this.paymentList['0']['description'],
            paymentmethod: this.paymentList['0']['payment_provider'],
            paymentprovider: this.paymentList['0']['payment_method'] + '(****' + this.paymentList['0']['ccnr'] + ')',
            orderid: this.paymentList['0']['orderid'],
            status: this.paymentList['0']['status'],

          }
        );
        this.dataSourcePayment = new MatTableDataSource<any>(this.payment);
        this.dataSourcePayment.sort = this.paymentsort;
        this.dataSourcePayment.paginator = this.paginatorPayment;
        this.loading = false;

      }, error => this.toasterservice.showError(error));
    this.datefiltersessionForm = this.formBuilder.group({
      startdate: [''],
      stopdate: ['']
    });


  }
  applyFilterSession(filterValue: string) {
    this.dataSourceSession.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceSession.paginator) {
      this.dataSourceSession.paginator.firstPage();
    }
  }
  onSubmit(form: NgForm) {

    this.data = JSON.stringify(form.value);

    const formData = new FormData();
    JSON.parse(this.data, (key, value) => {

      if (key == 'startdate') {
        this.startdate = moment(value).format('YYYY-MM-DD');
      }
      else if (key == 'stopdate') {
        this.stopdate = moment(value).format('YYYY-MM-DD');
      }
    });

    formData.append('startdate', this.startdate);
    formData.append('stopdate', this.stopdate);
    formData.append('accountid', this.id);

    this.InfraService.getSessionByAccountId(formData).subscribe(
      data => {
        this.sessionData = [];
        this.sessionlistData = data;


        for (let sessionVal of this.sessionlistData['result']) {

          this.sessionData.push(
            {
              start: (sessionVal.start && sessionVal.start != null) ? moment(sessionVal.start).format('MMM D YYYY HH:mm:ss A') : '',
              stop: (sessionVal.stop && sessionVal.stop != null) ? moment(sessionVal.stop).format('MMM D YYYY HH:mm:ss A') : '',
              sessionduration: sessionVal.sessionduration,
              stopreason: sessionVal.StopReason,
              mac: sessionVal.macaddress,
              username: sessionVal.username,
              userip: sessionVal.clientip,
            }
          );

        }

        $("#sessiontable").show();
        this.loading = false;
        this.dataSourceSession = new MatTableDataSource<any>(this.sessionData);
        this.dataSourceSession.sort = this.sessionsort;
        this.dataSourceSession.paginator = this.paginatorSession;
      }, error => this.toasterservice.showError(error));
  }


  /*getScardDetails() {
    $('.progress-spinner').show();
    this.session_details_table = [];
    this.dataSourceSession = new MatTableDataSource<any>(this.session_details_table);
 
    this.InfraService.getSessionByAccountId(this.id).subscribe(
 
      data => {
       
        this.session_details = data;
        console.log(this.session_details);
        
        if (this.session_details.exceedThreshold == 1) {
          this.exceedThreshold = true;
        }
        for (let session of this.session_details.result) {
          
          this.session_details_table.push(
            {
              "id": session.customerid,
              "start": session.start ?  moment(session.start).format('D-M-YYYY H:m') : '',
              "stop": session.stop ?  moment(session.stop).format('D-M-YYYY H:m') : '',
              "location": session.location_name,    
              "stopreason": session.StopReason,    
              "useragentdetails": session.UserAganetDetails,
              "macaddress": session.macaddress,
              "download":session.download + ' MB',
              "upload": session.upload + ' MB',
              "lengthoftime":session.seconds,
              "resume": (session.resume && session.resume > 0) ? 'Ja' : 'Nee',
            }
          );
        }
 
        this.dataSourceSession = new MatTableDataSource<any>(this.session_details_table);
        
        if(this.dataSourceSession.data.length == 0)
        {
          this.noRecords = true;
        }else{
          this.noRecords = false;
        }
        
        this.inputcheck = false;
        $('.progress-spinner').hide();
 
      },
      (err) => {
        console.log('err')
        this.session_details_table = [];
        this.dataSourceSession = new MatTableDataSource<any>(this.session_details_table);
      
 
        this.noRecords = true;
        this.exceedThreshold = false;
        this.inputcheck = false;
        $('.progress-spinner').hide();
      });
  }*/


  showExpand(elementid) {
    $('#info_icon' + elementid).hide();
    $('#arrow_icon' + elementid).show();
    $('#expand_id' + elementid).show();
  }

  hideExpand(elementid) {
    $('#info_icon' + elementid).show();
    $('#arrow_icon' + elementid).hide();
    $('#expand_id' + elementid).hide();
  }
  toggleRow(element) {
    element.Extra ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
  }
  checkExpanded(element): boolean {
    let flag = false;
    this.expandedElement.forEach(e => {
      if (e === element) {
        flag = true;
      }
    });
    return flag;
  }
  pushPopElement(element) {
    const index = this.expandedElement.indexOf(element);
    if (index === -1) {
      this.expandedElement.push(element);
    } else {
      this.expandedElement.splice(index, 1);
    }
  }

  formatdatehst(deliverydate) {
    return this.datePipe.transform(new Date(deliverydate), 'dd-MM-yyyy hh:mm');
  }
}
