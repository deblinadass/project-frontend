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

import { NewhotspotsdialogBoxComponent } from '../newhotspotsdialog-box/newhotspotsdialog-box.component';
import { NewhotspotsconnectiondialogBoxComponent } from '../newhotspotsconnectiondialog-box/newhotspotsconnectiondialog-box.component';
import { ModifyhotspotsdialogBoxComponent } from '../modifyhotspotsdialog-box/modifyhotspotsdialog-box.component';
import { DisconnecthotspotsdialogBoxComponent } from '../disconnecthotspotsdialog-box/disconnecthotspotsdialog-box.component';
import { AuthenticationService } from '../_services/authentication.service';
import moment from "moment";
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';

import { LocationService } from '../_services/location.service';

import 'moment-timezone';
import { TicketService } from '../_services/ticket.service';
import { AddsitesurveyDialougeboxComponent } from '../addsitesurvey-dialougebox/addsitesurvey-dialougebox.component';
import { CommonService } from '../_services/common.service';
import { ToasterService } from '../_services/toastr.service';
moment.tz.setDefault('Europe/Amsterdam');


declare var jQuery: any;
declare const editClick: any;
declare var $: any;

export class OrderListModel {
  id: number;
  orderattributevalues: OrderAttributeModel[] = [];
}

export class OrderAttributeModel {
  orderattribute: number;
  orderattributevalue: string;
}

@Component({
  selector: 'app-bouwfunnel',
  templateUrl: './bouwfunnel.component.html',
  styleUrls: ['./bouwfunnel.component.scss']
})
export class BouwfunnelComponent implements OnInit {
  chainid;
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

  satelliteID;
  superuser: boolean;
  locationchain: any;
  locationcountry: any;
  locationproperty: any[];
  expandedElement: any[] = [];
  ponumber;
  accessOrder: any[] = [];
  bouwOrder: any[] = [];
  order_list: any;
  ordertypeList: any;
  orderstatusList: any;
  productnameList: any;
  addonslaList: any;
  orderaddonlist: any;
  ordertype_name: any;
  orderstatus_name: any;
  orderaddon_name: any;
  orderaddonsla_name: any;
  productaddon_name: any;
  productname_name: any;
  productstatus;
  nameVal;
  ProductStatusList: any;
  productlistmap = new Map<string, string>();
  locationdata_dict = {};
  ordertype;
  BOUWOrderSelectedType;
  BOUWOrderType;
  communicationgroup;
  locationparentcustomerid;
  bouwAllState;
  displayedOrderColumns: string[] = ['orderid', 'parentorderid', 'BOUWOrderPlanneddate', 'bouwtype', 'BOUWOrderSelectedTypeName', 'orderstatusname', 'BOUWOrderContractorName', 'action'];
  dataSourceAccess = new MatTableDataSource<OrderListModel>();
  dataSourceOrder = new MatTableDataSource<any[]>();
  location_name;
  @ViewChild('accessSort', { static: true }) accessSort: MatSort;
  @ViewChild('orderSort', { static: true }) orderSort: MatSort;
  @ViewChild('paginatorAccess', { static: true }) paginatorAccess: MatPaginator;
  @ViewChild('paginatorOrder', { static: true }) paginatorOrder: MatPaginator;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  routerCurrentURL;
  location_parentcustomerid;
  tabSectionList: any[] = [];

  constructor(
    public router: Router,
    private _productService: ProductService,
    private _locationService: LocationService,
    private cd: ChangeDetectorRef,
    private modalService: ModalService,
    public dialog: MatDialog,
    private orderService: OrderService,
    private authenticationservice: AuthenticationService,
    private datePipe: DatePipe,
    private ticketservice: TicketService,
    public _commonService: CommonService,
    private toasterservice: ToasterService,

  ) {

    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.id = sessionStorage.getItem('sessionSatelliteID');
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionSatelliteID');
    }
    this.getPropertyAll();
    /*this._locationService.location_attr_details(this.id).subscribe(
      data => {
        this.location_details = data;
        this.location_name = data.customername;
        this.locationparentcustomerid = data.parentcustomerid;
        this.chainid = data.chainid;

        this.locationdata_dict = { customerid:data.customerid, streetname: data.streetname, postcode: data.postcode,
          city: data.city, housenumber: data.housenumber, housenumberaddition: data.housenumberaddition, 
          country: data.country, countryname: data.countryname, chainname: data.chainname, accountmanagername: data.accountmanagername  };
        
      });*/
      this.tabSectionList = this._commonService.getSectionList('HotspotTab');




  }

  ngOnInit() {

    this.dataSourceAccess.paginator = this.paginatorAccess;
    this.dataSourceAccess.sort = this.accessSort;
    this.dataSourceOrder.paginator = this.paginatorAccess;
    this.dataSourceOrder.sort = this.orderSort;

    this.superuser = this.authenticationservice.isSuperUser();

    this._locationService.location_details(this.id).subscribe(
      data => {
        this.location_details = data;
        this.locationparentcustomerid = data.parentcustomerid;
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

          }, error => this.toasterservice.showError(error));
        }, error => this.toasterservice.showError(error));
      }, error => this.toasterservice.showError(error));

  }

  getPropertyAll() {
    this._locationService.getAllLocationProperty().subscribe(data => {
      this.locationproperty = data;

    }, error => this.toasterservice.showError(error));
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
    this.orderService.getBouwOrderList(3, this.id).subscribe(
      data => {
        this.bouwOrder = [];
        this.order_list = data;

        // this.accessService.getOrderProperty('AccessOrderType').subscribe(data1 => {
        // this.ordertypeList = data1;
        this.orderService.getBouwStateList().subscribe(data => {
          this.bouwAllState = data;

          this.ticketservice.getCommunicationgroup().subscribe(comdata => {
            this.communicationgroup = comdata;
            this.orderService.getOrderProperty('BouwType').subscribe(data2 => {
              this.ordertype = data2;
              this.orderService.getOrderProperty('BOUWOrderSelectedType').subscribe(data3 => {
                this.BOUWOrderSelectedType = data3;
                this.orderService.getOrderProperty('BOUWOrderType').subscribe(data4 => {
                  this.BOUWOrderType = data4;

                  this.orderService.cataloguepropertybygroup('3').subscribe(data3 => {
                    this.productnameList = data3;

                    this.order_list.sort(this.GetSortOrder("orderattributevaluesi"));

                    for (let product of this.order_list) {

                      this.productname_name = '';
                      //this.ordertype_name = '';
                      this.orderstatus_name = '';
                      this.orderaddon_name = '';
                      var parentid = product.parentorderid;

                      var bouwtype = '';
                      var comgroupname = '';


                      for (let ordertype of this.ordertype) {
                        if (product.bouwtype == ordertype.id)
                          bouwtype = ordertype.name;
                      }

                      var contractor = '';
                      if (product.bouwtype == 1 || product.bouwtype == 2)
                        contractor = product.orderattributevaluesi[2].orderattributevalue;
                      else
                        contractor = product.orderattributevaluesi[11].orderattributevalue;

                      for (let comgroup of this.communicationgroup) {

                        if (Number(contractor) == Number(comgroup.communicationvalue)) {
                          comgroupname = comgroup.communicationname;
                        }
                      }
                      var state = product.orderstate;
                      var orderstatusname = '';

                      //get bouw state
                      for (let bouwstate of this.bouwAllState) {

                        if (Number(state) == Number(bouwstate.value)) {
                          orderstatusname = bouwstate.name;
                        }
                      }

                      var parentorderid = '';
                      if (Number(parentid) != 0 && parentid != '') {

                        parentorderid = this.order_list.find(r =>
                          r.id == parentid
                        ).hstorderid;
                      }


                      var productid = product.orderattributevaluesi[10].orderattributevalue;
                      var productcataloguegroup = product.productcataloguegroup;
                      // var orderstatusname = '';
                      if (productcataloguegroup == 3) {
                        var BOUWOrderSelectedTypeName = product.orderattributevaluesi[15].orderattributevalue && product.orderattributevaluesi[15].orderattributevalue != '' ? this.BOUWOrderSelectedType.find(r =>
                          r.id == product.orderattributevaluesi[15].orderattributevalue
                        ).name : product.ordertype ? this.BOUWOrderType.find(r =>
                          r.id == product.ordertype
                        ).name : '';



                        this.bouwOrder.push(
                          {
                            id: product.id,
                            productcatalogue: product.productcatalogueid,
                            orderid: product.hstorderid,
                            ordertype: product.ordertype,
                            ordertypename: this.ordertype_name,
                            orderstatus: product.orderstatus,
                            bouwtype: bouwtype,
                            bouwtypeid: product.bouwtype,
                            parentorderid: parentorderid,
                            orderstate: product.orderstate,
                            orderstatusname: orderstatusname,
                            productname: this.productname_name,
                            antal: product.orderattributevaluesi[10].orderattributevalue,
                            opmerking: product.remarks,
                            customerremarks: product.customerremarks,
                            billingstartdate: (product.billingstartdate || product.billingstartdate != null) ? formatDate(product.billingstartdate, 'dd-MM-yyyy', 'en-US') : '',
                            billingstartdateEdit: product.billingstartdate,
                            creationdate: (product.creationdate || product.creationdate != null) ? formatDate(product.creationdate, 'dd-MM-yyyy', 'en-US') : '',
                            creationdateEdit: product.creationdate,
                            updationdate: product.updationdate,
                            ponumber: product.ponumber,
                            billingstatus: product.billingstatus,
                            ordertrackcode: product.ordertrackcode,

                            BOUWOrderContactid: product.orderattributevaluesi[0].orderattributevalue,
                            BOUWOrderWishdate: product.orderattributevaluesi[1].orderattributevalue ? formatDate(product.orderattributevaluesi[1].orderattributevalue, 'dd-MM-yyyy', 'en-US') : '',
                            BOUWOrderWishdateEdit: product.orderattributevaluesi[1].orderattributevalue,
                            BOUWOrderContractor: product.orderattributevaluesi[2].orderattributevalue,
                            BOUWOrderPlanneddateEdit: product.orderattributevaluesi[3].orderattributevalue ? formatDate(product.orderattributevaluesi[3].orderattributevalue, 'yyyy-MM-dd', 'en-US') : '',
                            BOUWOrderPlanneddate: product.orderattributevaluesi[3].orderattributevalue ? formatDate(product.orderattributevaluesi[3].orderattributevalue, 'dd-MM-yyyy', 'en-US') : '',
                            BOUWProgressNotification: product.orderattributevaluesi.hasOwnProperty(4) ? product.orderattributevaluesi[4].orderattributevalue : '',
                            BOUWOrderCabling: product.orderattributevaluesi.hasOwnProperty(5) ? product.orderattributevaluesi[5].orderattributevalue : '',
                            BOUWSOStartpacket: product.orderattributevaluesi.hasOwnProperty(6) ? product.orderattributevaluesi[6].orderattributevalue : '',
                            BOUWSOConnection: product.orderattributevaluesi.hasOwnProperty(7) ? product.orderattributevaluesi[7].orderattributevalue : '',
                            BOUWSOTelephonenumber: product.orderattributevaluesi.hasOwnProperty(8) ? product.orderattributevaluesi[8].orderattributevalue : '',
                            BOUWSOPlaceisrapoint: product.orderattributevaluesi.hasOwnProperty(9) ? product.orderattributevaluesi[9].orderattributevalue : '',
                            BOUWSOLinequantity: product.orderattributevaluesi.hasOwnProperty(10) ? product.orderattributevaluesi[10].orderattributevalue : '',
                            BOUWSOrderContractor: product.orderattributevaluesi.hasOwnProperty(11) ? product.orderattributevaluesi[11].orderattributevalue : '',
                            BOUWSOrderWishdateEdit: product.orderattributevaluesi.hasOwnProperty(12) ? product.orderattributevaluesi[12].orderattributevalue : '',
                            BOUWSOrderWishdate: product.orderattributevaluesi[12].orderattributevalue != '' ? formatDate(product.orderattributevaluesi[12].orderattributevalue, 'dd-MM-yyyy', 'en-US') : '',
                            BOUWSODescription: product.orderattributevaluesi.hasOwnProperty(13) ? product.orderattributevaluesi[13].orderattributevalue : '',
                            BOUWOrderContractorName: comgroupname,
                            BOUWOrderCoverage: product.orderattributevaluesi.hasOwnProperty(14) ? product.orderattributevaluesi[14].orderattributevalue : '',
                            BOUWOrderSelectedType: product.orderattributevaluesi.hasOwnProperty(15) && product.orderattributevaluesi[15].orderattributevalue ? product.orderattributevaluesi[15].orderattributevalue : '',
                            BOUWOrderSelectedTypeName: BOUWOrderSelectedTypeName,
                            BOUWOrderTerminationReason: product.orderattributevaluesi.hasOwnProperty(16) && product.orderattributevaluesi[16].orderattributevalue ? product.orderattributevaluesi[16].orderattributevalue : '',
                          }
                        );
                      }
                      else {

                        var OrderTypeName = product.ordertype ? this.BOUWOrderType.find(r =>
                          r.id == product.ordertype
                        ).name : '';
                        this.bouwOrder.push(
                          {
                            id: product.id,
                            parentorderid: parentorderid,
                            productcatalogue: product.productcatalogueid,
                            orderid: product.hstorderid,
                            ordertype: product.ordertype,
                            ordertypename: this.ordertype_name,
                            orderstatus: product.orderstatus,
                            bouwtype: bouwtype,
                            //orderstatusname: orderstatusname,
                            productname: this.productname_name,
                            antal: product.orderattributevaluesi[10].orderattributevalue,
                            opmerking: product.remarks,
                            customerremarks: product.customerremarks,
                            billingstartdate: (product.billingstartdate || product.billingstartdate != null) ? formatDate(product.billingstartdate, 'dd-MM-yyyy', 'en-US') : '',
                            billingstartdateEdit: product.billingstartdate,
                            creationdate: (product.creationdate || product.creationdate != null) ? formatDate(product.creationdate, 'dd-MM-yyyy', 'en-US') : '',
                            creationdateEdit: product.creationdate,
                            updationdate: product.updationdate,
                            ponumber: product.ponumber,
                            billingstatus: product.billingstatus,
                            ordertrackcode: product.ordertrackcode,
                            BOUWOrderSelectedTypeName: OrderTypeName,
                            /*
                                                    BOUWOrderContactid : product.orderattributevaluesi[0].orderattributevalue,
                                                  // BOUWOrderWishdate: product.orderattributevaluesi[1].orderattributevalue ? formatDate(product.orderattributevaluesi[1].orderattributevalue, 'dd-MM-yyyy', 'en-US') : '',
                                                  
                                                    BOUWOrderContractor: product.orderattributevaluesi[2].orderattributevalue != undefined ? product.orderattributevaluesi[2].orderattributevalue:'',
                                                    BOUWOrderPlanneddate: product.orderattributevaluesi[3].orderattributevalue != undefined ? product.orderattributevaluesi[3].orderattributevalue:'',
                                                    BOUWProgressNotification: product.orderattributevaluesi[4].orderattributevalue != undefined ? product.orderattributevaluesi[4].orderattributevalue:'',
                                                    BOUWOrderCabling: product.orderattributevaluesi[5].orderattributevalue != undefined ? product.orderattributevaluesi[5].orderattributevalue:'',
                                                    BOUWSOStartpacket: product.orderattributevaluesi[6].orderattributevalue != undefined ? product.orderattributevaluesi[6].orderattributevalue:'',
                                                    BOUWSOConnection: product.orderattributevaluesi[7].orderattributevalue != undefined ? product.orderattributevaluesi[7].orderattributevalue:'',
                                                    BOUWSOTelephonenumber: product.orderattributevaluesi[8].orderattributevalue != undefined ? product.orderattributevaluesi[8].orderattributevalue:'',
                                                    BOUWSOPlaceisrapoint: product.orderattributevaluesi[9].orderattributevalue != undefined ? product.orderattributevaluesi[9].orderattributevalue:'',
                                                    BOUWSOLinequantity: product.orderattributevaluesi[10].orderattributevalue != undefined ? product.orderattributevaluesi[10].orderattributevalue:'',
                                                    BOUWSODescription: product.orderattributevaluesi[11].orderattributevalue != undefined ? product.orderattributevaluesi[11].orderattributevalue:'',
                                                    
                                                    */
                          }
                        );
                      }
                    }

                    this.bouwOrder.sort(this.GetSortOrderDesc("id"));
                    //this.bouwOrder = _.sortBy(this.bouwOrder,"id");
                    this.loading = false;

                    this.dataSourceOrder = new MatTableDataSource<any>(this.bouwOrder);
                    this.dataSourceOrder.sort = this.orderSort;
                    this.dataSourceOrder.paginator = this.paginatorOrder;
                    //});
                    //});
                    //});
                  }, error => this.toasterservice.showError(error));


                }, error => this.toasterservice.showError(error));
              }, error => this.toasterservice.showError(error));
            }, error => this.toasterservice.showError(error));
          }, error => this.toasterservice.showError(error));
        }, error => this.toasterservice.showError(error));
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


  GetSortOrderDesc(prop) {
    return function (a, b) {
      if (a[prop] < b[prop]) {
        return 1;
      } else if (a[prop] > b[prop]) {
        return -1;
      }
      return 0;
    }
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



  openDialogAdd(action) {


    const dialogRef = this.dialog.open(NewhotspotsdialogBoxComponent, {
      width: '60%',
      data: {
        locationid: this.id, location_name: this.location_name,
        locationparentcustomerid: this.locationparentcustomerid,
        locationdata: this.location_details,
        action: action
      }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getOrderList();
      }
    }, error => this.toasterservice.showError(error));

  }

  openDialogAddConnection(action) {


    const dialogRef = this.dialog.open(NewhotspotsconnectiondialogBoxComponent, {
      width: '60%',
      data: {
        locationid: this.id, location_name: this.location_name,
        locationparentcustomerid: this.locationparentcustomerid,
        locationdata: this.location_details,
        action: action
      }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getOrderList();
      }
    }, error => this.toasterservice.showError(error));

  }

  openDialogModifyAdd(action) {


    const dialogRef = this.dialog.open(ModifyhotspotsdialogBoxComponent, {
      width: '60%',
      data: {
        locationid: this.id, location_name: this.location_name,
        locationparentcustomerid: this.locationparentcustomerid,
        locationdata: this.location_details,
        action: action
      }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getOrderList();
      }
    }, error => this.toasterservice.showError(error));

  }


  openDialogDisconnectAdd(action) {


    const dialogRef = this.dialog.open(DisconnecthotspotsdialogBoxComponent, {
      width: '60%',
      data: {
        locationid: this.id, location_name: this.location_name,
        locationparentcustomerid: this.locationparentcustomerid,
        locationdata: this.location_details,
        action: action
      }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getOrderList();
      }
    }, error => this.toasterservice.showError(error));

  }

  openDialogOrderEdit(action, element) {

    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    //element.locationdata_dict =  this.locationdata_dict;
    element.location_name = this.location_name;
    element.locationparentcustomerid = this.locationparentcustomerid;
    element.locationdata = this.location_details;

    if (element.ordertype == '1') {
      const dialogRef = this.dialog.open(NewhotspotsdialogBoxComponent, {
        width: '70%',
        data: element, disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result.event != 'Cancel') {
          element.antal = result.data[0].antal;

          element.updationdate = result.data[0].updationdate;
          element.orderstate = result.data[0].orderstate;
          element.orderstatusname = result.data[0].orderstatename;
          element.BOUWOrderContactid = result.data[0].BOUWOrderContactid;
          element.BOUWOrderWishdate = result.data[0].BOUWOrderWishdate;
          element.BOUWOrderWishdateEdit = result.data[0].BOUWOrderWishdateEdit;
          element.BOUWOrderContractor = result.data[0].BOUWOrderContractor;
          element.BOUWOrderPlanneddate = result.data[0].BOUWOrderPlanneddate;
          element.BOUWOrderPlanneddateEdit = result.data[0].BOUWOrderPlanneddateEdit;
          element.BOUWProgressNotification = result.data[0].BOUWProgressNotification;
          element.BOUWOrderCabling = result.data[0].BOUWOrderCabling;
          element.opmerking = result.data[0].description;
          element.BOUWOrderContractorName = result.data[0].BOUWOrderContractorName;
          element.bouwtype = result.data[0].BOUWTypeName;
          element.BOUWOrderCoverage = result.data[0].BOUWOrderCoverage;



        }
        $('#rowoverlay' + element.id).hide();
      }, error => this.toasterservice.showError(error));
    } else if (element.ordertype == '2') {
      const dialogRef = this.dialog.open(ModifyhotspotsdialogBoxComponent, {
        width: '70%',
        data: element, disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result.event != 'Cancel') {
          element.antal = result.data[0].antal;

          element.updationdate = result.data[0].updationdate;
          element.orderstate = result.data[0].orderstate;
          element.orderstatusname = result.data[0].orderstatename;
          element.BOUWOrderContactid = result.data[0].BOUWOrderContactid;
          element.BOUWOrderWishdate = result.data[0].BOUWOrderWishdate;
          element.BOUWOrderWishdateEdit = result.data[0].BOUWOrderWishdateEdit;
          element.BOUWOrderContractor = result.data[0].BOUWOrderContractor;
          element.BOUWOrderPlanneddate = result.data[0].BOUWOrderPlanneddate;
          element.BOUWOrderPlanneddateEdit = result.data[0].BOUWOrderPlanneddateEdit;
          element.BOUWProgressNotification = result.data[0].BOUWProgressNotification;
          element.BOUWOrderCabling = result.data[0].BOUWOrderCabling;
          element.opmerking = result.data[0].description;
          element.BOUWOrderContractorName = result.data[0].BOUWOrderContractorName;
          element.bouwtype = result.data[0].BOUWTypeName;
          element.BOUWOrderSelectedType = result.data[0].BOUWOrderSelectedType;
          element.BOUWOrderSelectedTypeName = result.data[0].BOUWOrderSelectedTypeName;



        }
        $('#rowoverlay' + element.id).hide();
      }, error => this.toasterservice.showError(error));
    } else if (element.ordertype == '3') {
      const dialogRef = this.dialog.open(DisconnecthotspotsdialogBoxComponent, {
        width: '70%',
        data: element, disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result.event != 'Cancel') {
          element.antal = result.data[0].antal;

          element.updationdate = result.data[0].updationdate;
          element.orderstate = result.data[0].orderstate;
          element.orderstatusname = result.data[0].orderstatename;
          element.BOUWOrderContactid = result.data[0].BOUWOrderContactid;
          element.BOUWOrderWishdate = result.data[0].BOUWOrderWishdate;
          element.BOUWOrderWishdateEdit = result.data[0].BOUWOrderWishdateEdit;
          element.BOUWOrderContractor = result.data[0].BOUWOrderContractor;
          element.BOUWOrderPlanneddate = result.data[0].BOUWOrderPlanneddate;
          element.BOUWOrderPlanneddateEdit = result.data[0].BOUWOrderPlanneddateEdit;
          element.BOUWProgressNotification = result.data[0].BOUWProgressNotification;
          element.BOUWOrderCabling = result.data[0].BOUWOrderCabling;
          element.opmerking = result.data[0].description;
          element.BOUWOrderContractorName = result.data[0].BOUWOrderContractorName;
          element.bouwtype = result.data[0].BOUWTypeName;
          element.BOUWOrderTerminationReason = result.data[0].BOUWOrderTerminationReason;



        }
        $('#rowoverlay' + element.id).hide();
      }, error => this.toasterservice.showError(error));
    }

  }

  openDialogOrderConnectionEdit(action, element) {

    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    element.locationdata_dict = this.locationdata_dict;
    element.location_name = this.location_name;
    element.locationparentcustomerid = this.locationparentcustomerid;
    element.locationdata = this.location_details;
    const dialogRef = this.dialog.open(NewhotspotsconnectiondialogBoxComponent, {
      width: '70%',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {
        element.antal = result.data[0].antal;

        element.updationdate = result.data[0].updationdate;
        element.orderstate = result.data[0].orderstate;
        element.orderstatusname = result.data[0].orderstatename;
        element.BOUWOrderContactid = result.data[0].BOUWOrderContactid;
        element.BOUWSOrderWishdate = result.data[0].BOUWSOrderWishdate;
        element.BOUWSOrderWishdateEdit = result.data[0].BOUWSOrderWishdateEdit;
        element.BOUWSOrderContractor = result.data[0].BOUWSOrderContractor;
        element.BOUWOrderPlanneddate = result.data[0].BOUWOrderPlanneddate;
        element.BOUWOrderPlanneddateEdit = result.data[0].BOUWOrderPlanneddateEdit;
        element.BOUWProgressNotification = result.data[0].BOUWProgressNotification;

        element.BOUWSOConnection = result.data[0].BOUWSOConnection;
        element.BOUWSOTelephonenumber = result.data[0].BOUWSOTelephonenumber;
        element.BOUWSOPlaceisrapoint = result.data[0].BOUWSOPlaceisrapoint;
        element.BOUWSOLinequantity = result.data[0].BOUWSOLinequantity;
        element.BOUWSODescription = result.data[0].BOUWSODescription;
        element.opmerking = result.data[0].BOUWSODescription;
        element.BOUWOrderContractorName = result.data[0].BOUWOrderContractorName;
        element.bouwtype = result.data[0].BOUWTypeName;




      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));

  }

  openDialogSiteSurveyAdd(action) {


    const dialogRef = this.dialog.open(AddsitesurveyDialougeboxComponent, {
      width: '60%',
      data: {
        locationid: this.id, location_name: this.location_name,
        locationparentcustomerid: this.locationparentcustomerid,
        locationdata: this.location_details,
        action: action
      }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getOrderList();
      }
    }, error => this.toasterservice.showError(error));

  }

  openDialogSiteSurveyEdit(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    element.locationdata = this.location_details;
    element.location_name = this.location_name;
    element.locationparentcustomerid = this.locationparentcustomerid;
    const dialogRef = this.dialog.open(AddsitesurveyDialougeboxComponent, {
      width: '70%',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {
        element.antal = result.data[0].antal;

        element.updationdate = result.data[0].updationdate;

        element.BOUWOrderContactid = result.data[0].BOUWOrderContactid;
        element.BOUWOrderWishdate = result.data[0].BOUWOrderWishdate;
        element.BOUWOrderWishdateEdit = result.data[0].BOUWOrderWishdateEdit;
        element.BOUWOrderContractor = result.data[0].BOUWOrderContractor;
        element.BOUWOrderPlanneddate = result.data[0].BOUWOrderPlanneddate;
        element.BOUWOrderPlanneddateEdit = result.data[0].BOUWOrderPlanneddateEdit;
        element.BOUWProgressNotification = result.data[0].BOUWProgressNotification;
        element.BOUWOrderCabling = result.data[0].BOUWOrderCabling;
        element.opmerking = result.data[0].description;
        element.BOUWOrderContractorName = result.data[0].BOUWOrderContractorName;
        element.bouwtype = result.data[0].BOUWTypeName;
        element.orderstatusname = result.data[0].orderstatusname;



      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }

}
