import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ProductService } from '../_services/product.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ModalService } from '../modal/modal.service';
//import { AccessService } from '../_services/access.service';
import { OrderService } from '../_services/order.service';
import { MKTorderdialogBoxComponent } from '../mktorderdialog-box/mktorderdialog-box.component';
import { AuthenticationService } from '../_services/authentication.service';
import moment from "moment";
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';

import { LocationService } from '../_services/location.service';

import 'moment-timezone';
import { ToasterService } from '../_services/toastr.service';
moment.tz.setDefault('Europe/Amsterdam');


declare var jQuery: any;
declare const editClick: any;
declare var $: any;

export class ProductInstallbaseListModel {
  id: number;
  productattributevaluesi: ProductAttributeModel[] = [];
}

export class ProductAttributeModel {
  productattribute: number;
  productattributevalue: string;
}

@Component({
  selector: 'app-backofficemktorder',
  templateUrl: './backofficemktorder.component.html',
  styleUrls: ['./backofficemktorder.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BackofficeMKTorderComponent implements OnInit, AfterViewInit {
  accessExtraProduct: any[] = [];
  locations_list_table: any[] = [];
  id;
  location_details: any;
  locations_list: any;
  product_list: any;
  attribute_value_list: any;
  loading = false;
  loadingproduct = false;
  navLinks: any[] = [];
  activeLinkIndex = -1;
  dataAdd;
  change_status_value: any;
  Access_provided_by: any;
  Product_naam: any;
  COS_EVC: any;
  satelliteID;
  superuser: boolean;
  accessProduct: any[] = [];
  COS_EVC_name;
  Product_naam_name;
  Access_provided_by_name;
  accesscosevc_name;
  expandedElement: any[] = [];
  ponumber;
  accessOrder: any[] = [];
  mktOrder: any[] = [];
  order_list: any;
  ordertypeList: any;
  orderstatusList: any;
  productnameList: any;
  addonslaList: any;
  accesscosevcList: any;
  accesscontractbreukboeteList: any;
  orderaddonlist: any;
  ordertype_name: any;
  orderstatus_name: any;
  orderaddon_name: any;
  orderaddonsla_name: any;
  productaddon_name: any;
  productname_name: any;
  accesscontractbreukboetesys_name: any;
  accesscontractbreukboeteuser_name: any;
  productstatus;
  mktSecondlevel: any[] = [];
  orderAddOnLevel: any[] = [];
  productAddOnLevel: any[] = [];
  cosevcvalue = new Map<string, string>();
  orderaddonMap = new Map<string, string>();
  addonId;
  cosevcArr;
  nameVal;
  ProductStatusList: any;
  productlistmap = new Map<string, string>();
  locationdata_dict = {};

  displayedOrderColumns: string[] = ['orderid', 'locatienaam', 'orderstatusname', 'productname', 'aantalproducten', 'opmerking', 'Track&Trace', 'action', 'overlayrow'];
  displayedAccessColumns: string[] = ['mstproductid', 'productnaam', 'price', 'status', 'startdate', 'enddate', 'remarks', 'action', 'overlayrow'];
  dataSourceAccess = new MatTableDataSource<ProductInstallbaseListModel>();
  dataSourceOrder = new MatTableDataSource<any[]>();
  location_name;
  @ViewChild('accessSort', { static: true }) accessSort: MatSort;
  @ViewChild('orderSort', { static: true }) orderSort: MatSort;
  @ViewChild('paginatorAccess', { static: true }) paginatorAccess: MatPaginator;
  @ViewChild('paginatorOrder', { static: true }) paginatorOrder: MatPaginator;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  routerCurrentURL;
  location_parentcustomerid;
  displayedAccessColumnsInner: string[] = ['name', 'value'];
  dataSourceAccessInner = new MatTableDataSource<ProductInstallbaseListModel>();
  @ViewChild('accessSortInner', { static: true }) accessSortInner: MatSort;
  @ViewChild('paginatorAccessInner', { static: true }) paginatorAccessInner: MatPaginator;
  locationid: any;
  customerid: any;

  constructor(
    public router: Router,
    private _productService: ProductService,
    private _locationService: LocationService,
    private cd: ChangeDetectorRef,
    private modalService: ModalService,
    public dialog: MatDialog,
    //private accessService: AccessService,
    private orderService: OrderService,
    private authenticationservice: AuthenticationService,
    private datePipe: DatePipe,
    private toasterservice: ToasterService,
  ) {

  }

  ngOnInit() {
    this.dataSourceAccess.paginator = this.paginatorAccess;
    this.dataSourceAccess.sort = this.accessSort;
    this.dataSourceOrder.paginator = this.paginatorAccess;
    this.dataSourceOrder.sort = this.orderSort;

    this.superuser = this.authenticationservice.isSuperUser();
    /*this.accessService.getproductstatus(2).subscribe(datastatus => {
      this.ProductStatusList = datastatus;
      for (let prodstatus of this.ProductStatusList) {
        this.productlistmap.set(prodstatus.status, prodstatus.statustext)
      }
    });*/
  }

  ngAfterViewInit(): void {
    //this.product_list = this.getProductList();
    this.order_list = this.getOrderList();
  }

  applyFilterAccess(filterValue: string) {
    this.dataSourceAccess.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceAccess.paginator) {
      this.dataSourceAccess.paginator.firstPage();
    }
  }

  applyFilterOrder(filterValue: string) {
    this.dataSourceOrder.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceOrder.paginator) {
      this.dataSourceOrder.paginator.firstPage();
    }
  }

  toggleRow(element) {
    element.Extra ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
  }

  showExpand(elementid) {
    $('#info_icon' + elementid).hide();
    $('#arrow_icon' + elementid).show();
    $('#expand_id' + elementid).show();

    $('#info_icon_addon' + elementid).show();
    $('#arrow_icon_addon' + elementid).hide();
    $('#expand_id_addon' + elementid).hide();
  }

  hideExpand(elementid) {
    $('#info_icon' + elementid).show();
    $('#arrow_icon' + elementid).hide();
    $('#expand_id' + elementid).hide();
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

  formatdatemst(dateval) {
    return this.datePipe.transform(new Date(dateval), 'dd-MM-yyyy');
  }

  /*getProductList() {
    this.loadingproduct = true;
    this._productService.getAccessProductList(this.id, 2).subscribe(
      data => {
        this.accessProduct = [];
        this.product_list = data;
        this.accessService.getcosevc().subscribe(data => {
          this.COS_EVC = data;
          for (let item in data) {
            this.cosevcvalue.set(data[item]['id'], data[item]['name']);

          }
          this.accessService.cataloguepropertybygroup('2').subscribe(data1 => {
            this.Product_naam = data1;
            this.accessService.getOrderProperty('AccessAddOnName').subscribe(data4 => {
              this.orderaddonlist = data4;

              let selectedproduct = '';
              for (let product of this.product_list) {
                this.accessExtraProduct = [];
                this.Product_naam_name = this.Product_naam.find(r => r.cataloguepropertytype == '1'
                  && r.cataloguepropertyvalue == product.productattributevaluesi[0].productattributevalue
                ).cataloguepropertyname;

                this.COS_EVC_name = '';
                for (let cosevcname of this.COS_EVC) {
                  if (product.productattributevaluesi[7].productattributevalue == cosevcname.id)
                    this.COS_EVC_name = cosevcname.name;
                }
                this.accessExtraProduct.push(
                  {
                    name: 'Eerste contract startdatum',
                    value: product.productattributevaluesi[12].productattributevalue ? formatDate(product.productattributevaluesi[12].productattributevalue, 'dd-MM-yyyy', 'en-US') : ''
                  },
                  {
                    name: 'Startdatum facturatie',
                    value: product.billingstartdate ? formatDate(product.billingstartdate, 'dd-MM-yyyy', 'en-US') : ''
                  },
                  {
                    name: 'EVC ID',
                    value: product.productattributevaluesi[5].productattributevalue
                  },
                  {
                    name: 'Huidige contract startdatum',
                    value: product.productattributevaluesi[13].productattributevalue ? formatDate(product.productattributevaluesi[13].productattributevalue, 'dd-MM-yyyy', 'en-US') : ''
                  },
                  {
                    name: 'PO nummer',
                    value: product.ponumber
                  },
                  {
                    name: 'BW EVC',
                    value: product.productattributevaluesi[6].productattributevalue
                  },
                  {
                    name: 'Minimale contract einddatum',
                    value: product.productattributevaluesi[14].productattributevalue ? formatDate(product.productattributevaluesi[14].productattributevalue, 'dd-MM-yyyy', 'en-US') : ''
                  },
                  {
                    name: 'Aangemaakt',
                    value: product.productcreationdate
                  },
                  {
                    name: 'COS EVC',
                    value: this.COS_EVC_name
                  },
                  {
                    name: 'MST facturatie',
                    value: (product.productattributevaluesi[9].productattributevalue == '1') ? 'Ja' :
                      (product.productattributevaluesi[9].productattributevalue == '0') ? 'Nee' : ''
                  },
                  {
                    name: 'Access geleverd door',
                    value: product.productattributevaluesi[8].productattributevalue
                  },
                  {
                    name: 'Catalogus ID',
                    value: product.catalogueref
                  },
                  {
                    name: 'Regel referentie',
                    value: product.regelreferentie
                  }
                );
                this.productstatus = this.productlistmap.get(product.status);
                let accessstatus = this.productstatus
                this.productAddOnLevel = []
                var arrAddOn = (product.addon) ? (product.addon) : '';
                this.orderAddOnLevel = [];

                if (arrAddOn) {
                  for (let addSingle of arrAddOn) {
                    this.productaddon_name = this.Product_naam.find(r => r.cataloguepropertytype == '2'
                      && r.cataloguepropertyvalue == addSingle.productattributevaluesi[3].productattributevalue
                    ).cataloguepropertyname;
                    this.addonId = addSingle.productattributevaluesi[3].productattributevalue;
                    this.nameVal = this.cosevcvalue.get(addSingle.productattributevaluesi[5].productattributevalue);
                    this.COS_EVC_name = '';
                    for (let cosevcname of this.COS_EVC) {
                      if (addSingle.productattributevaluesi[6].productattributevalue == cosevcname.id)
                        this.COS_EVC_name = cosevcname.name;
                    }

                    this.productAddOnLevel.push(
                      {
                        accessaddonname: this.productaddon_name,
                        accessaddonstartdate: '',
                        accessaddonenddate: '',
                        AccessAddOnPrice: addSingle.productattributevaluesi[8].productattributevalue,
                        AccessAddOnEvcID: addSingle.productattributevaluesi[4].productattributevalue,
                        AccessAddOnBwEVC: addSingle.productattributevaluesi[5].productattributevalue,
                        AccessAddOnCosEVC: addSingle.productattributevaluesi[6].productattributevalue, // using it in modify, change of key name will cause issue
                        AccessAddOnCosEVCName: this.COS_EVC_name,
                        AccessAddOnSLA: addSingle.productattributevaluesi[7].productattributevalue,
                        accessaddonstatus: accessstatus,
                        AccessAddOnName: this.addonId,
                        AccessAddOnid: addSingle.id,
                        AccessAddOnCatRefID: addSingle.productcatalogue_id,
                        AccessAddOnCatRef: addSingle.catalogueref,
                        AccessAddonvalue: this.nameVal,
                        accessregelreferentie: addSingle.regelreferentie
                      }

                    )
                  }
                }

                selectedproduct = (selectedproduct == '' && product.status == '210') ? (product.id).toString() :
                  (selectedproduct == '' && product.status != '210') ? '' : '0';
                this.accessProduct.push(
                  {
                    id: product.id,
                    orderid: product.orderid,
                    mstproductid: product.productid,
                    productnaam_id: product.productattributevaluesi[0].productattributevalue,
                    productnaam: this.Product_naam_name,
                    startdate: product.productattributevaluesi[10].productattributevalue ? this.formatdatemst(product.productattributevaluesi[10].productattributevalue) : '',
                    startdateRFSEdit: product.productattributevaluesi[10].productattributevalue,
                    enddate: product.productattributevaluesi[11].productattributevalue ? this.formatdatemst(product.productattributevaluesi[11].productattributevalue) : '',
                    enddateEdit: product.productattributevaluesi[11].productattributevalue,
                    price: product.productattributevaluesi[2].productattributevalue,
                    status: this.productstatus,
                    statuscheck: product.status,
                    remarks: product.productremarks,
                    ponumber: product.ponumber,
                    billingstartdate: product.billingstartdate,
                    productid: product.productid,
                    accessExtraProduct: this.accessExtraProduct,
                    AccessAddOnsView: this.productAddOnLevel,
                    AccessAddOns: this.productAddOnLevel,
                    selectedproduct: selectedproduct,
                    AccessMCEndDate: product.productattributevaluesi[14].productattributevalue,
                    AccessICStartDate: product.productattributevaluesi[12].productattributevalue,
                    AccessCCStartDate: product.productattributevaluesi[13].productattributevalue,
                    access_ID: product.productattributevaluesi[4].productattributevalue,
                    bw_EVCID: product.productattributevaluesi[6].productattributevalue,
                    cos_evc_id: product.productattributevaluesi[7].productattributevalue,
                    evc_ID: product.productattributevaluesi[5].productattributevalue,
                    AccessProvidedBy: product.productattributevaluesi[8].productattributevalue,
                    AccessBilledByMST: product.productattributevaluesi[9].productattributevalue,
                    AccessCatRefID: product.productcatalogue_id,
                    regelreferentie: product.regelreferentie

                  }
                );
              }

              this.loadingproduct = false;
              this.dataSourceAccess = new MatTableDataSource<any>(this.accessProduct);
              this.dataSourceAccess.sort = this.accessSort;
              this.dataSourceAccess.paginator = this.paginatorAccess;
            });

          });
        });
      },
      err => console.error(err),
      () => console.log('')
    );
  }*/

  //get order list start


  getOrderList() {
    this.loading = true;
    this.orderService.getOrderListAll(2).subscribe(
      data => {
        this.mktOrder = [];
        this.order_list = data;

        // this.accessService.getOrderProperty('AccessOrderType').subscribe(data1 => {
        // this.ordertypeList = data1;

        this.orderService.getOrderProperty('MKTOrderStatus').subscribe(data2 => {
          this.orderstatusList = data2;

          this.orderService.cataloguepropertybygroup('2').subscribe(data3 => {
            this.productnameList = data3;


            //this.accessService.getOrderProperty('AccessAddOnSLA').subscribe(data5 => {
            //this.addonslaList = data5;
            //this.accessService.getOrderProperty('AccessCosEVC').subscribe(data7 => {
            // this.accesscosevcList = data7;
            //this.accessService.getOrderProperty('AccessContractbreukboete').subscribe(data6 => {
            //this.accesscontractbreukboeteList = data6;
            this.order_list.sort(this.GetSortOrder("orderattributevaluesi"));
            for (let product of this.order_list) {

              this.productname_name = '';
              //this.ordertype_name = '';
              this.orderstatus_name = '';
              this.orderaddon_name = '';
              //this.accesscontractbreukboetesys_name = '';
              //this.accesscontractbreukboeteuser_name = '';
              //this.accesscosevc_name = '';

              /*for (let ordertype of this.ordertypeList) {
                if (product.ordertype == ordertype.id)
                  this.ordertype_name = ordertype.name;
              }*/
              for (let orderstatus of this.orderstatusList) {
                if (product.orderstatus == orderstatus.id)
                  this.orderstatus_name = orderstatus.name;
              }
              this.productname_name = this.productnameList.find(r => r.cataloguepropertytype == '1'
                && r.cataloguepropertyvalue == product.orderattributevaluesi[10].orderattributevalue
              ).cataloguepropertyname;

              /*for (let accesscontractbreukboete of this.accesscontractbreukboeteList) {
                if (product.orderattributevaluesi[18].orderattributevalue == accesscontractbreukboete.id)
                  this.accesscontractbreukboetesys_name = accesscontractbreukboete.name;
              }
              for (let accesscontractbreukboete of this.accesscontractbreukboeteList) {
                if (product.orderattributevaluesi[19].orderattributevalue == accesscontractbreukboete.id)
                  this.accesscontractbreukboeteuser_name = accesscontractbreukboete.name;
              }
              for (let accesscosevc of this.accesscosevcList) {
                if (product.orderattributevaluesi[7].orderattributevalue == accesscosevc.id)
                  this.accesscosevc_name = accesscosevc.name;
              }
              var rfsdate = product.orderattributevaluesi[10].orderattributevalue ? formatDate(product.orderattributevaluesi[10].orderattributevalue, 'dd-MM-yyyy', 'en-US') : '';
              var enddate = product.orderattributevaluesi[11].orderattributevalue ? formatDate(product.orderattributevaluesi[11].orderattributevalue, 'dd-MM-yyyy', 'en-US') : '';*/
              var productid = product.orderattributevaluesi[10].orderattributevalue;

              /*var productonholdtot = '';
              if (product.ordertype == '1') {
                if (product.orderattributevaluesi[10].orderattributevalue != null && product.orderattributevaluesi[10].orderattributevalue != '' && moment().format('YYYY-MM-DD') < formatDate(product.orderattributevaluesi[10].orderattributevalue, 'yyyy-MM-dd', 'en-US')) {
                  productonholdtot = formatDate(product.orderattributevaluesi[10].orderattributevalue, 'dd-MM-yyyy', 'en-US');
                }
              } else if (product.ordertype == '2') {
                if (product.billingstartdate != null && product.billingstartdate != '' && moment().format('YYYY-MM-DD') < formatDate(product.billingstartdate, 'yyyy-MM-dd', 'en-US')) {
                  productonholdtot = formatDate(product.billingstartdate, 'dd-MM-yyyy', 'en-US');
                }
              } else if (product.ordertype == '3') {
                if (product.orderattributevaluesi[11].orderattributevalue != null && product.orderattributevaluesi[11].orderattributevalue != '' && moment().format('YYYY-MM-DD') < formatDate(product.orderattributevaluesi[11].orderattributevalue, 'yyyy-MM-dd', 'en-US')) {
                  productonholdtot = formatDate(product.orderattributevaluesi[11].orderattributevalue, 'dd-MM-yyyy', 'en-US');
                }
              }*/
              this._locationService.location_details(product.locationid).subscribe(
                data => {
                  this.location_name = data.customername;
                  this.location_parentcustomerid = data.parentcustomerid;
                  this.locationdata_dict = {
                    streetname: data.streetname, postcode: data.postcode,
                    city: data.city, housenumber: data.housenumber, housenumberaddition: data.housenumberaddition,
                    country: data.country
                  };
                }, error => this.toasterservice.showError(error));



              this.mktSecondlevel = [];
              this.mktSecondlevel.push(
                {
                  name: 'Datum aangemaakt',
                  value: (product.creationdate || product.creationdate != null) ? formatDate(product.creationdate, 'dd-MM-yyyy', 'en-US') : '',
                },
                {
                  name: 'Mutatiedatum',
                  value: product.updationdate,
                },
                {
                  name: 'TAV',
                  value: product.orderattributevaluesi[3].orderattributevalue
                },
                {
                  name: 'Verzendadres',
                  value: product.orderattributevaluesi[4].orderattributevalue + ',' + product.orderattributevaluesi[5].orderattributevalue + ',' + product.orderattributevaluesi[6].orderattributevalue + ',' + product.orderattributevaluesi[7].orderattributevalue + ',' + product.orderattributevaluesi[8].orderattributevalue + ',' + product.orderattributevaluesi[9].orderattributevalue
                },
                {
                  name: 'Bevestiging verzonden naar',
                  value: product.orderattributevaluesi[0].orderattributevalue
                },
                {
                  name: 'Eigen referentie klant',
                  value: product.customerremarks
                },

              );
              // if (product.ordertype == 2 || product.ordertype == 3) {

              var arrAddOn = (product.orderattributevaluesi[1].orderattributevalue) ? JSON.parse(product.orderattributevaluesi[1].orderattributevalue) : '';
              this.orderAddOnLevel = [];
              if (arrAddOn) {
                for (let addSingle of arrAddOn) {
                  this.orderaddon_name = this.productnameList.find(r => r.cataloguepropertytype == '2'
                    && r.cataloguepropertyvalue == addSingle.MKTAddOnName
                  ).cataloguepropertyname;

                  /*for (let orderaddonslaname of this.addonslaList) {
                    if (addSingle.AccessAddOnSLA == orderaddonslaname.id)
                      this.orderaddonsla_name = orderaddonslaname.name;
                  }*/
                  this.orderAddOnLevel.push(
                    {

                      mktaddon: addSingle.MKTAddOnName,
                      MKTAddOnCatRefID: addSingle.MKTAddOnCatRefID,
                      mktaddonname: this.orderaddon_name,
                      MKTAddOnInhoudVerpakking: addSingle.MKTAddOnInhoudVerpakking,
                      MKTAddOnMaxBestelbaar: addSingle.MKTAddOnMaxBestelbaar,
                      MKTAddOnAantal: addSingle.MKTAddOnAantal,


                      MKTAddOnName: addSingle.MKTAddOnName,
                      //AccessAddOnid: addSingle.AccessAddOnid,
                      MKTAddonvalue: this.nameVal,
                    }
                  )
                }
              }
              /*} else {


                var arrAddOn = (product.orderattributevaluesi[20].orderattributevalue) ? JSON.parse(product.orderattributevaluesi[20].orderattributevalue) : '';
                this.orderAddOnLevel = [];

                if (arrAddOn) {
                  for (let addSingle of arrAddOn) {
                    this.orderaddon_name = this.productnameList.find(r => r.cataloguepropertytype == '2'
                      && r.cataloguepropertyvalue == addSingle.AccessAddOnName
                    ).cataloguepropertyname;
                    for (let orderaddonslaname of this.addonslaList) {
                      if (addSingle.AccessAddOnSLA == orderaddonslaname.id)
                        this.orderaddonsla_name = orderaddonslaname.name;
                    }


                    this.orderAddOnLevel.push(
                      {
                        AccessAddOnCatRefID: addSingle.AccessAddOnCatRefID,
                        accessaddon: addSingle.AccessAddOnName,
                        accessaddonname: this.orderaddon_name,
                        AccessAddOnPrice: addSingle.AccessAddOnPrice,
                        AccessAddOnEvcID: addSingle.AccessAddOnEvcID,
                        AccessAddOnBwEVC: addSingle.AccessAddOnBwEVC,
                        AccessAddOnCosEVC: addSingle.AccessAddOnCosEVC,
                        AccessAddOnSLA: this.orderaddonsla_name,
                        AccessAddOnid: this.orderaddonMap.get(this.orderaddon_name), //added


                      }

                    )
                  }
                }
              }*/
              this.mktOrder.push(
                {
                  id: product.id,
                  productcatalogue: product.productcatalogueid,
                  orderid: product.hstorderid,
                  ordertype: product.ordertype,
                  //ordertypename: this.ordertype_name,
                  orderstatus: product.orderstatus,
                  orderstatusname: this.orderstatus_name,
                  locationid: product.locationid,
                  location_name: product.location_name,
                  //productid: productid,
                  productname: this.productname_name,
                  opmerking: product.remarks,
                  customerremarks: product.customerremarks,
                  billingstartdate: (product.billingstartdate || product.billingstartdate != null) ? formatDate(product.billingstartdate, 'dd-MM-yyyy', 'en-US') : '',
                  billingstartdateEdit: product.billingstartdate,
                  creationdate: (product.creationdate || product.creationdate != null) ? formatDate(product.creationdate, 'dd-MM-yyyy', 'en-US') : '',
                  creationdateEdit: product.creationdate,
                  updationdate: (product.updationdate || product.updationdate != null) ? formatDate(product.updationdate, 'dd-MM-yyyy', 'en-US') : '',
                  ponumber: product.ponumber,
                  billingstatus: product.billingstatus,
                  ordertrackcode: product.ordertrackcode,
                  addons: this.orderAddOnLevel,
                  MKTAddOns: product.orderattributevaluesi[1].orderattributevalue,
                  //AccessAddOnsView: (product.orderattributevaluesi[1].orderattributevalue) ? this.orderAddOnLevel : '',
                  secondlevel: this.mktSecondlevel,
                  //AccessProductID: product.orderattributevaluesi[21].orderattributevalue,
                  prodnameid: product.orderattributevaluesi[10].orderattributevalue,
                  MKTCatRefID: product.productcatalogueid,

                  MktOrderUserConfirmationEmail: product.orderattributevaluesi[0].orderattributevalue,
                  OrderShipmentMode: product.orderattributevaluesi[2].orderattributevalue,
                  MktOrderShipmentTAV: product.orderattributevaluesi[3].orderattributevalue,
                  MktOrderShipmentStreet: product.orderattributevaluesi[4].orderattributevalue,
                  MktOrderShipmentHouseNo: product.orderattributevaluesi[5].orderattributevalue,
                  MktOrderShipmentHouseNoExt: product.orderattributevaluesi[6].orderattributevalue,
                  MktOrderShipmentPostalCode: product.orderattributevaluesi[7].orderattributevalue,
                  MktOrderShipmentCity: product.orderattributevaluesi[8].orderattributevalue,
                  MktOrderShipmentCountry: product.orderattributevaluesi[9].orderattributevalue,
                  MktProductNaam: product.orderattributevaluesi[10].orderattributevalue,
                  MktOrderAmount: product.orderattributevaluesi[11].orderattributevalue
                }
              );
            }
            this.loading = false;

            this.dataSourceOrder = new MatTableDataSource<any>(this.mktOrder);
            this.dataSourceOrder.sort = this.orderSort;
            this.dataSourceOrder.paginator = this.paginatorOrder;
            //});
            //});
            //});
          }, error => this.toasterservice.showError(error));
          //});
        }, error => this.toasterservice.showError(error));
        //});
      }, error => this.toasterservice.showError(error));
  }
  /* openDialogUpdateOrder(action) {
     var dialogRef = this.dialog.open(AccessnewmodifyorderComponent, {
       width: '70%',
       data: { locationid: this.id, location_parentcustomerid:this.location_parentcustomerid, productlist: this.accessProduct, action: action }, disableClose: true
     });
 
     dialogRef.afterClosed().subscribe(result => {
       if (result.event == 'SecondPhase') {
         this.onSecondPhaseDialog(result.event, result.data, result.newdata);
 
       }
     })
   }*/


  openDialogOrderAdd(action) {
    const dialogRef = this.dialog.open(MKTorderdialogBoxComponent, {
      width: '60%',
      data: { locationid: this.id, action: 'Add', location_parentcustomerid: this.location_parentcustomerid, location_name: this.location_name, locationdata_dict: this.locationdata_dict }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getOrderList();
      }
    }, error => this.toasterservice.showError(error));
  }

  //Added 

  openDialogOrderEdit(action, element) {


    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.location_parentcustomerid = this.location_parentcustomerid;
    element.location_name = this.location_name
    this._locationService.location_details(element.locationid).subscribe(
      data => {
        element.location_name = data.customername;
        //element.customerid = data.customerid;
        element.location_parentcustomerid = data.parentcustomerid;

      }, error => this.toasterservice.showError(error));


    //element.locationid = this.customerid;
    // element.location_parentcustomerid = this.location_parentcustomerid;

    sessionStorage.setItem('type', 'backoffice');
    const dialogRef = this.dialog.open(MKTorderdialogBoxComponent, {
      width: '60%',
      data: element, disableClose: true
    });


    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {
        element.id = result.data[0].id;
        element.orderid = result.data[0].orderid;
        element.orderstatus = result.data[0].orderstatus;
        element.orderstatusname = result.data[0].orderstatusname;
        element.ordertype = result.data[0].ordertype;
        element.ordertypename = result.data[0].ordertypename;
        element.locationid = result.data[0].locationid;
        //element.productid = result.data[0].productid;
        element.productname = result.data[0].productname;
        element.opmerking = result.data[0].opmerking;
        element.MktOrderUserConfirmationEmail = result.data[0].MktOrderUserConfirmationEmail;
        element.OrderShipmentMode = result.data[0].OrderShipmentMode;
        element.MktOrderShipmentTAV = result.data[0].MktOrderShipmentTAV;
        element.MktOrderShipmentStreet = result.data[0].MktOrderShipmentStreet;
        element.MktOrderShipmentHouseNo = result.data[0].MktOrderShipmentHouseNo;
        element.MktOrderShipmentHouseNoExt = result.data[0].MktOrderShipmentHouseNoExt;
        element.MktOrderShipmentPostalCode = result.data[0].MktOrderShipmentPostalCode;
        element.MktOrderShipmentCity = result.data[0].MktOrderShipmentCity;
        element.MktOrderShipmentCountry = result.data[0].MktOrderShipmentCountry;
        element.productcatalogue = result.data[0].productcatalogue;

        element.updationdate = result.data[0].updationdate;
        element.billingstartdate = result.data[0].billingstartdate;
        element.billingstartdateEdit = result.data[0].billingstartdateEdit;


        element.creationdate = result.data[0].creationdate;
        element.creationdateEdit = result.data[0].creationdateEdit;
        element.MKTAddOns = result.data[0].MKTAddOns;
        //element.AccessAddOnsView = result.data[0].AccessAddOnsView;
        element.addons = result.data[0].addons;

        element.ponumber = result.data[0].ponumber;

        element.billingstatus = result.data[0].billingstatus;
        element.secondlevel[0].value = result.data[0].secondlevel_Creation_Datum;
        element.secondlevel[1].value = result.data[0].secondlevel_Laatste_mutatie;
        element.secondlevel[2].value = result.data[0].secondlevel_TAV;
        element.secondlevel[3].value = result.data[0].secondlevel_Verzendadres;
        element.secondlevel[4].value = result.data[0].secondlevel_Email;
        element.secondlevel[5].value = result.data[0].secondlevel_customerremarks;


      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));


  }



  openDialog(action, obj) {
    obj.action = action;
    obj.locationid = this.satelliteID;
    obj.location_parentcustomerid = this.location_parentcustomerid;
    const dialogRef = this.dialog.open(MKTorderdialogBoxComponent, {
      width: '60%',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {
        this.getOrderList();
      }
    }, error => this.toasterservice.showError(error));
  }


  GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    }
  }

  openDialogOrderStatus(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    element.location_parentcustomerid = this.location_parentcustomerid;
    const dialogRef = this.dialog.open(MKTorderdialogBoxComponent, {
      width: '60%',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {
        //this.getProductList();
        for (let orderstatusentry of this.orderstatusList) {
          if (result.data[0].orderstatus == orderstatusentry.id) {
            element.orderstatusname = orderstatusentry.name;
          }
          element.orderstatus = result.data[0].orderstatus;
          element.secondlevel[23].value = result.data[0].productonholdtot;
        }
        element.orderstatus = result.data[0].orderstatus;
        //if (result.data[0].orderstatus >= 8) { this.getProductList(); }
      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }



  showExpandProduct(elementid) {
    $('#info_icon_product' + elementid).hide();
    $('#arrow_icon_product' + elementid).show();
    $('#expand_id_product' + elementid).show();
    $('#info_icon_addon_product' + elementid).show();
    $('#arrow_icon_addon_product' + elementid).hide();
    $('#expand_id_addon_product' + elementid).hide();
  }

  hideExpandProduct(elementid) {
    $('#info_icon_product' + elementid).show();
    $('#arrow_icon_product' + elementid).hide();
    $('#expand_id_product' + elementid).hide();
  }

  showExpandProductAddon(productname, elementid) {
    $('#info_icon_product_addon' + productname + elementid).hide();
    $('#arrow_icon_product_addon' + productname + elementid).show();
    $('#expand_id_product_addon' + productname + elementid).show();
  }

  hideExpandProductAddon(productname, elementid) {
    $('#info_icon_product_addon' + productname + elementid).show();
    $('#arrow_icon_product_addon' + productname + elementid).hide();
    $('#expand_id_product_addon' + productname + elementid).hide();
  }

  showExpandAddonProduct(elementid) {
    $('#info_icon_addon_product' + elementid).hide();
    $('#arrow_icon_addon_product' + elementid).show();
    $('#expand_id_addon_product' + elementid).show();

    $('#info_icon_product' + elementid).show();
    $('#arrow_icon_product' + elementid).hide();
    $('#expand_id_product' + elementid).hide();
  }

  hideExpandAddonProduct(elementid) {
    $('#info_icon_addon_product' + elementid).show();
    $('#arrow_icon_addon_product' + elementid).hide();
    $('#expand_id_addon_product' + elementid).hide();
  }

  showExpandAddon(elementid) {
    $('#info_icon_addon' + elementid).hide();
    $('#arrow_icon_addon' + elementid).show();
    $('#expand_id_addon' + elementid).show();

    $('#info_icon' + elementid).show();
    $('#arrow_icon' + elementid).hide();
    $('#expand_id' + elementid).hide();
  }

  hideExpandAddon(elementid) {
    $('#info_icon_addon' + elementid).show();
    $('#arrow_icon_addon' + elementid).hide();
    $('#expand_id_addon' + elementid).hide();
  }




}
