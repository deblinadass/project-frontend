import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EnduserService } from '../_services/EnduserService.service';
import { DatePipe } from '@angular/common';
import { ToasterService } from '../_services/toastr.service';

declare var $: any;
export class paymentModel {
  status: string;
}
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class PaymentComponent implements OnInit {
  id;
  paymentList: any;
  displayedPayment: string[] = ['Datum', 'Omschrijving', 'Betaalwijze', 'Betaalin informatie', 'OrderID', 'Status', 'Factuur', 'Refund'];
  dataSourcePayment = new MatTableDataSource<paymentModel>();
  expandedElement: any[] = [];
  payment: any[] = [];
  loading = false;
  factuur_link = 'index.php?page=InvoicePDF&invoiceid=';
  refund_link = 'index.php?page=Account.Refund&bibitid=';


  @ViewChild('paymentsort', { static: true }) paymentsort: MatSort;
  @ViewChild('paginatorPayment', { static: true }) paginatorPayment: MatPaginator;
  constructor(
    public router: Router,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private _enduserService: EnduserService,
    private toasterservice: ToasterService,
  ) {
    $('.mat-tab-link').removeClass('mat-tab-label-active');
    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.id = sessionStorage.getItem('sessionSatelliteID');
    } else {
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
        for (let paymentrecord of this.paymentList['result']) {
          this.payment.push(
            {
              date: this.formatdatehst(paymentrecord['createdate']),
              description: paymentrecord['payId'],
              paymentprovider: paymentrecord['PaymentProvider_id'],
              paymentmethod: paymentrecord['paymentMethod'] + '(' + paymentrecord['cardNo'] + ')',
              orderid: paymentrecord['orderid'],
              status: paymentrecord['status_code'],
              invoiceid: paymentrecord['Invoice_id'],

            }
          );
        }
        this.dataSourcePayment = new MatTableDataSource<any>(this.payment);
        this.dataSourcePayment.sort = this.paymentsort;
        this.dataSourcePayment.paginator = this.paginatorPayment;
        this.loading = false;
      }, error => this.toasterservice.showError(error));
  }
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