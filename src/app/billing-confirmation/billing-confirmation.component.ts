import { Component, OnInit, ViewChild } from '@angular/core';
import { ExportService } from '../_services/export.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { routerTransition } from '../router.animations';
import * as FileSaver from 'file-saver';
import moment from "moment";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OneTimeCostService } from '../_services/onetimecost.service';
import 'moment-timezone';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ToasterService } from '../_services/toastr.service';
moment.tz.setDefault('Europe/Amsterdam');

declare var $: any;

export class Custom {
  name: string;
  id: number;
}

@Component({
  selector: 'app-billing-confirmation',
  templateUrl: './billing-confirmation.component.html',
  styleUrls: ['./billing-confirmation.component.scss'],
  animations: [
    routerTransition()
  ]
})

export class BillingConfirmationComponent implements OnInit {

  exportData: any;
  exportForm: FormGroup;
  loading = false;

  exportList: any[] = [];
  buttondisabled: boolean = false;
  date: any;
  dateInFormat: any;
  displayedonetimecostColumns: string[] = ['mstorderid', 'customername', 'mainproductname', 'quantity', 'price', 'amount', 'description', 'billingmonth', 'action'];
  dataSourceOneTimeCost = new MatTableDataSource<any[]>();
  @ViewChild('onetimecostSort', { static: true }) onetimecostSort: MatSort;
  @ViewChild('paginatorOneTimeCost', { static: true }) paginatorOneTimeCost: MatPaginator;

  oneTimeCostProduct: any[] = [];
  expandedElement: any[] = [];
  otcsecondlevel: any[] = [];
  sourcesystemorderList: any[];
  ordertypeList: any[];
  productmainList: any[];
  productnameList: any[];
  billingmonthList: any[];
  onetimecost_list: any;
  billperiod: string;
  otc_billmonth: string;
  productcatalogue: string;
  mainproduct: string;
  isAdminUser: boolean;
  showconfirmationbutton: boolean;

  constructor(
    private onetimecostService: OneTimeCostService,
    private formBuilder: FormBuilder,
    private authenticationservice: AuthenticationService,
    private datePipe: DatePipe,
    public router: Router,
    private toasterservice: ToasterService,
  ) {
    this.billperiod = this.router.getCurrentNavigation().extras.state.billperiod;
    this.productcatalogue = this.router.getCurrentNavigation().extras.state.productcatalogue;
    this.mainproduct = this.router.getCurrentNavigation().extras.state.mainproduct;
  }

  ngOnInit() {
    this.showconfirmationbutton = false;
    this.dataSourceOneTimeCost.paginator = this.paginatorOneTimeCost;
    this.dataSourceOneTimeCost.sort = this.onetimecostSort;
    this.isAdminUser = this.authenticationservice.isAdminUser();

    var month = moment().format("MMM");
    var year = new Date().getFullYear().toString();
    var otc_month = this.billperiod.substring(0, 3);
    var otc_year = this.billperiod.substring(3);
    var current_billperiod = month + year;
    this.otc_billmonth = otc_month + "-" + otc_year;
    if (this.billperiod == current_billperiod) {
      $("#cnfrm_btn").hide();
      $("#back_btn").show();
    }
    if (this.mainproduct == '0' || this.isAdminUser) {
      this.showconfirmationbutton = true;
    }
  }

  ngAfterViewInit(): void {
    this.onetimecostService.getBillingProperty('ordertype').subscribe(data => {
      this.ordertypeList = data;
    }, error => this.toasterservice.showError(error));
    this.onetimecostService.getBillingProperty('productmain').subscribe(data => {
      this.productmainList = data;
    }, error => this.toasterservice.showError(error));
    this.onetimecostService.getBillingProperty('productname').subscribe(data => {
      this.productnameList = data;
    }, error => this.toasterservice.showError(error));
    this.onetimecostService.getBillingProperty('billingmonth').subscribe(data => {
      this.billingmonthList = data;
      //this.onetimecost_list = this.getOnetimeCostList(this.otc_billmonth, this.mainproduct);
    }, error => this.toasterservice.showError(error));


  }

  applyFilterOneTimeCost(filterEvent: any) {
    this.dataSourceOneTimeCost.filter = filterEvent.target.value.toString().trim().toLowerCase();
    if (this.dataSourceOneTimeCost.paginator) {
      this.dataSourceOneTimeCost.paginator.firstPage();
    }
  }

  /*getOnetimeCostList(otc_billmonth, mainproduct) {
    this.loading = true;

    this.onetimecostService.getOneTimeCostBillingLine(otc_billmonth, mainproduct).subscribe(
      data => {
        this.oneTimeCostProduct = [];

        this.onetimecost_list = data;

        for (let product of this.onetimecost_list) {
          this.otcsecondlevel = [];
          var sourcesystemorder_name: '';
          var ordertype_name: '';
          var productmain_name: '';
          var productname_name: '';
          var billingmonth_name: '';
          var deliverydate = '';
          for (let ordertype of this.ordertypeList) {
            if (product.ordertype == ordertype.id)
              ordertype_name = ordertype.name;
          }
          for (let productmain of this.productmainList) {
            if (product.productmain == productmain.id)
              productmain_name = productmain.name;
          }
          for (let productname of this.productnameList) {
            if (product.productname == productname.id)
              productname_name = productname.name;
          }
          for (let billingmonth of this.billingmonthList) {
            if (product.billingmonth == billingmonth.id)
              billingmonth_name = billingmonth.name;
          }
          deliverydate = product.deliverydate != null ? this.formatdatemst(product.deliverydate) : null

          this.otcsecondlevel.push(
            {
              name: 'Bronsysteem',
              value: product.sourcesystemorder
            },
            {
              name: 'Hoofdproduct',
              value: productmain_name
            },
            {
              name: 'PO-nummer',
              value: product.ponumber
            },
            {
              name: 'OrderID external',
              value: product.orderidexternal
            },
            {
              name: 'Memoline',
              value: productname_name
            },
            {
              name: 'ServiceID',
              value: product.serviceid
            },
            {
              name: 'Order type',
              value: ordertype_name
            },
            {
              name: 'Opleverdatum',
              value: deliverydate
            },
            {
              name: 'Memoline code',
              value: product.memoline
            }
          );

          this.oneTimeCostProduct.push(
            {
              id: product.id,
              mstorderid: product.mstorderid,
              customername: product.customername,
              sourcesystemorder: product.sourcesystemorder,
              orderidexternal: product.orderidexternal,
              deliverydate: product.deliverydate,
              deliverydate_formated: product.deliverydate != null ? this.formatdatemst(product.deliverydate) : null,
              ordertype: product.ordertype,
              productmain: product.productmain,
              mainproductname: productmain_name,
              productname: product.productname,
              description: product.description,
              ponumber: product.ponumber,
              serviceid: product.serviceid,
              quantity: product.quantity,
              price: product.price,
              amount: product.amount,
              billingmonth: product.billingmonth,
              billingmonthname: billingmonth_name,
              billingdate: product.billingdate,
              secondlevel: this.otcsecondlevel
            }
          );
        }
        this.loading = false;
        this.dataSourceOneTimeCost = new MatTableDataSource<any>(this.oneTimeCostProduct);
        this.dataSourceOneTimeCost.sort = this.onetimecostSort;
        this.dataSourceOneTimeCost.paginator = this.paginatorOneTimeCost;

      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('')
    );
  }*/
  formatdatemst(deliverydate) {
    return this.datePipe.transform(new Date(deliverydate), 'dd-MM-yyyy');
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
    //this.cd.detectChanges();
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
  confirmation() {
    this.buttondisabled = true;
    this.loading=true;
    if (this.authenticationservice.isSuperUser()) {
      this.onetimecostService.confirmBilling(this.billperiod, this.productcatalogue).subscribe(response => {
        this.loading=false;
        this.buttondisabled = false;
        alert('Billing Confirmed');
        this.router.navigate(['/billingexport']);
      }, error => this.toasterservice.showError(error));
    }
  }
}