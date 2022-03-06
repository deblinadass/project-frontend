import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ComarchViewService } from '../_services/comarchview.service';
import { ToasterService } from '../_services/toastr.service';

declare var jQuery: any;
declare const editClick: any;
declare var $: any;

@Component({
  selector: 'app-comarchview',
  templateUrl: './comarchview.component.html',
  styleUrls: ['./comarchview.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ComarchViewComponent implements OnInit, AfterViewInit {
  satellite_id;
  loading = false;
  comarchcustomerdetails: any;
  comarchinvoicedetails: any;
  comarchcontractdetails: any;

  routerCurrentURL;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private api: ComarchViewService,
    private toasterservice: ToasterService,
  ) {
    $('.mat-tab-link').removeClass('mat-tab-label-active');
    if (sessionStorage.getItem('ComarchLocationID')) {
      this.satellite_id = sessionStorage.getItem('ComarchLocationID');
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.api.getComarchCustomerDetails(this.satellite_id).subscribe(data => {
      this.comarchcustomerdetails = data;
      this.api.getComarchInvoiceDetails(this.satellite_id).subscribe(data1 => {
        this.comarchinvoicedetails = data1;
        this.api.getComarchContractDetails(this.satellite_id).subscribe(data2 => {
          this.comarchcontractdetails = data2;
          this.loading = false;
        }, error => this.toasterservice.showError(error));
      }, error => this.toasterservice.showError(error));
    }, error => this.toasterservice.showError(error));



  }
  ngAfterViewInit(): void {
  }
}
