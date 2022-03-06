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
import { CommonService } from '../_services/common.service';
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
  selector: 'app-mktorder',
  templateUrl: './mktorder.component.html',
  styleUrls: ['./mktorder.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MKTorderComponent implements OnInit, AfterViewInit {
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
  tabSectionList: any[] = [];
  locationproperty: any[];

  displayedOrderColumns: string[] = ['orderid', 'orderstatusname', 'productname', 'aantalproducten', 'opmerking', 'Track&Trace', 'action', 'overlayrow'];
  displayedAccessColumns: string[] = ['mstproductid', 'productnaam', 'price', 'status', 'startdate', 'enddate', 'remarks', 'action', 'overlayrow'];
  dataSourceAccess = new MatTableDataSource<ProductInstallbaseListModel>();
  dataSourceOrder = new MatTableDataSource<any[]>();
  location_name;
  locationcountry: any;
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

  constructor(
    public router: Router,
    private _productService: ProductService,
    private _locationService: LocationService,
    private cd: ChangeDetectorRef,
    private modalService: ModalService,
    public dialog: MatDialog,
    private toasterservice: ToasterService,
    //private accessService: AccessService,
    private orderService: OrderService,
    private authenticationservice: AuthenticationService,
    private datePipe: DatePipe,
    public _commonService: CommonService,
  ) {

    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.id = sessionStorage.getItem('sessionSatelliteID');
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionSatelliteID');
    }

    this._locationService.getAllLocationProperty().subscribe(data => {
      this.locationproperty = data;

    }, error => this.toasterservice.showError(error));

    /*this._locationService.location_details(this.id).subscribe(
      data => {
        this.location_name = data.customername;
        this.location_parentcustomerid = data.parentcustomerid;

        this.locationdata_dict = {
          streetname: data.streetname, postcode: data.postcode,
          city: data.city, housenumber: data.housenumber, housenumberaddition: data.housenumberaddition,
          country: data.country
        };
      }, error => this.toasterservice.showError(error));*/
      this._locationService.location_details(this.id).subscribe(
        data => {
          this.location_details = data;
          this.location_parentcustomerid = data.parentcustomerid;
          this.location_name = data.customername;
          this._locationService.getLocationChainId(data.chainid).subscribe(datachain => {
            this.location_details.locationchain = datachain['result'][0]['chainname'];
            this._locationService.getLocationCountryId(data.country).subscribe(datacountry => {
              this.locationcountry = datacountry['result'][0]['countryname'];
              this.location_details.locationtypeid = this.locationproperty.find(r => r.customerattribute == 'locationtype' && r.customerpropertyvalue == this.location_details.locationtypeid
              ).customerpropertyname;
              this.location_details.accountmanagerid = this.locationproperty.find(r => r.customerattribute == 'accountmanager' && r.customerpropertyvalue == this.location_details.accountmanagerid
              ).customerpropertyname;
  
              this.location_details.city = (data.city) ? ' ' + data.city : '';
              this.location_details.postcode = (data.postcode) ? ', ' + data.postcode : '';
  
              this.location_details.streetname = (data.streetname) ? ' ' + data.streetname : '';
              this.location_details.housenumber = (data.housenumber) ? ' ' + data.housenumber : '';
              this.location_details.housenumberaddition = (data.housenumberaddition) ? ' ' + data.housenumberaddition : '';
              this.location_details.fulladdress = (this.locationcountry + this.location_details.streetname + this.location_details.housenumber + this.location_details.housenumberaddition + this.location_details.postcode + this.location_details.city) ? this.locationcountry + this.location_details.streetname + this.location_details.housenumber + this.location_details.housenumberaddition + this.location_details.postcode + this.location_details.city : 'No Adres vermeld';
              this.location_details.customername = data.customername;

              this.locationdata_dict = {
                streetname: data.streetname, postcode: data.postcode,
                city: data.city, housenumber: data.housenumber, housenumberaddition: data.housenumberaddition,
                country: data.country
              };
  
            }, error => this.toasterservice.showError(error));
          }, error => this.toasterservice.showError(error));
        }, error => this.toasterservice.showError(error));

    this.tabSectionList = this._commonService.getSectionList('MKTTab');

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



  //get order list start


  getOrderList() {
    this.loading = true;
    this.orderService.getOrderList(2, this.id).subscribe(
      data => {
        this.mktOrder = [];
        this.order_list = data;

        // this.accessService.getOrderProperty('AccessOrderType').subscribe(data1 => {
        // this.ordertypeList = data1;

        this.orderService.getOrderProperty('MKTOrderStatus').subscribe(data2 => {
          this.orderstatusList = data2;

          this.orderService.cataloguepropertybygroup('2').subscribe(data3 => {
            this.productnameList = data3;


            this.order_list.sort(this.GetSortOrder("orderattributevaluesi"));
            for (let product of this.order_list) {

              this.productname_name = '';
              //this.ordertype_name = '';
              this.orderstatus_name = '';
              this.orderaddon_name = '';

              for (let orderstatus of this.orderstatusList) {
                if (product.orderstatus == orderstatus.id)
                  this.orderstatus_name = orderstatus.name;
              }
              this.productname_name = this.productnameList.find(r => r.cataloguepropertytype == '1'
                && r.cataloguepropertyvalue == product.orderattributevaluesi[10].orderattributevalue
              ).cataloguepropertyname;

              var productid = product.orderattributevaluesi[10].orderattributevalue;




              this.mktSecondlevel = [];
              this.mktSecondlevel.push(
                {
                  name: 'Datum aangemaakt',
                  value: (product.creationdate || product.creationdate != null) ? formatDate(product.creationdate, 'dd-MM-yyyy', 'en-US') : '',
                },
                {
                  name: 'Mutatiedatum',
                  value: (product.updationdate || product.updationdate != null) ? formatDate(product.updationdate, 'dd-MM-yyyy', 'en-US') : '',
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


              var arrAddOn = (product.orderattributevaluesi[1].orderattributevalue) ? JSON.parse(product.orderattributevaluesi[1].orderattributevalue) : '';
              this.orderAddOnLevel = [];
              if (arrAddOn) {
                for (let addSingle of arrAddOn) {
                  this.orderaddon_name = this.productnameList.find(r => r.cataloguepropertytype == '2'
                    && r.cataloguepropertyvalue == addSingle.MKTAddOnName
                  ).cataloguepropertyname;


                  this.orderAddOnLevel.push(
                    {

                      mktaddon: addSingle.MKTAddOnName,
                      MKTAddOnCatRefID: addSingle.MKTAddOnCatRefID,
                      mktaddonname: this.orderaddon_name,
                      MKTAddOnInhoudVerpakking: addSingle.MKTAddOnInhoudVerpakking,
                      MKTAddOnMaxBestelbaar: addSingle.MKTAddOnMaxBestelbaar,
                      MKTAddOnAantal: addSingle.MKTAddOnAantal,


                      MKTAddOnName: addSingle.MKTAddOnName,

                      MKTAddonvalue: this.nameVal,
                    }
                  )
                }
              }

              this.mktOrder.push(
                {
                  id: product.id,
                  productcatalogue: product.productcatalogueid,
                  orderid: product.hstorderid,
                  ordertype: product.ordertype,
                  //ordertypename: this.ordertype_name,
                  orderstatus: product.orderstatus,
                  orderstatusname: this.orderstatus_name,
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
                  MktOrderAmount: product.orderattributevaluesi[11].orderattributevalue,
                  MKTContactid: product.orderattributevaluesi.hasOwnProperty(12) ? product.orderattributevaluesi[12].orderattributevalue : '',
                  MKTContactPersonTelephone: product.orderattributevaluesi.hasOwnProperty(13) ? product.orderattributevaluesi[13].orderattributevalue : '',
                  MKTContactPersonEmail: product.orderattributevaluesi.hasOwnProperty(14) ? product.orderattributevaluesi[14].orderattributevalue : '',
                  MKTContactPersonFunction: product.orderattributevaluesi.hasOwnProperty(15) ? product.orderattributevaluesi[15].orderattributevalue : '',
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
      data: { locationid: this.id, action: 'Add', location_parentcustomerid: this.location_parentcustomerid, location_name: this.location_name, locationdata_dict: this.locationdata_dict,locationdata: this.location_details }, disableClose: true
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
    element.locationid = this.id;
    element.location_parentcustomerid = this.location_parentcustomerid;
    element.location_name = this.location_name;
    element.locationdata= this.location_details;
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
        //element.productid = result.data[0].productid;
        element.productname = result.data[0].productname;
        element.opmerking = result.data[0].opmerking;
        element.customerremarks = result.data[0].customerremarks;
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
        element.MktOrderAmount = result.data[0].MktOrderAmount;
        element.updationdate = result.data[0].updationdate;
        element.billingstartdate = result.data[0].billingstartdate;
        element.billingstartdateEdit = result.data[0].billingstartdateEdit;
        element.ordertrackcode = result.data[0].ordertrackcode;


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
        this.getOrderList();
        for (let orderstatusentry of this.orderstatusList) {
          if (result.data[0].orderstatus == orderstatusentry.id) {
            element.orderstatusname = orderstatusentry.name;
          }
          element.orderstatus = result.data[0].orderstatus;

        }
        element.orderstatus = result.data[0].orderstatus;


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
