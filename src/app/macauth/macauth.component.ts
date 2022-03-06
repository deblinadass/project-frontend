import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { IMultiservice, Audit, Modification, AuditDataSource } from '../interface/interface';
import { LocationService } from '../_services/location.service';
import { ProductService } from '../_services/product.service';
import { MainlocationModel } from '../_models/mainlocation.model';
import { HttpClient } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ModalService } from '../modal/modal.service';
import { MacauthdialogBoxComponent } from '../macauthdialog-box/macauthdialog-box.component';
import { DatePipe } from '@angular/common';
import { ScratchService } from '../_services/scratch.service';
import { TicketService } from '../_services/ticket.service';
import { MacauthService } from '../_services/macauth.service';
import { InfraService } from '../_services/infra.service';
import { AuthenticationService } from '../_services/authentication.service';
import moment from "moment";
import 'moment-timezone';
moment.tz.setDefault('Europe/Amsterdam');
import { ToasterService } from '../_services/toastr.service';
import { formatDate } from '@angular/common';
import { CommonService } from '../_services/common.service';
import { MultiserviceSsidComponent } from '../multiservice-ssid/multiservice-ssid.component';
import { OrderService } from '../_services/order.service';
import { MultiservicewlanComponent } from '../multiservicewlan/multiservicewlan.component';
import { MultiserviceroutedComponent } from '../multiservicerouted/multiservicerouted.component';
import { MultiservicemacComponent } from '../multiservicemac/multiservicemac.component';

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
  selector: 'app-macauth',
  templateUrl: './macauth.component.html',
  styleUrls: ['./macauth.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class MacauthComponent implements OnInit, AfterViewInit {
  mac_list: any;
  digiProduct: any[] = [];
  digiExtraProduct: any[] = [];
  locations_list_table: any[] = [];
  id;
  location_details: any;
  locations_list: any;
  ticket_list: any;
  attribute_value_list: any;
  loading = false;
  rowoverlay = false;
  navLinks: any[] = [];
  activeLinkIndex = -1;
  dataAdd;
  hardwareList: any;
  channelPackageList: any;
  apiUrl: any;
  hardwareName;
  channelPackageName;
  statusCheck: boolean = false;
  superuser: boolean;
  isAdminUser: boolean;
  expandedElement: any[] = [];
  statusDateTime: any;
  macauthProduct: any[] = [];
  scratchSecondlevel: any[] = [];
  macPropertyList: any[];
  statusVal;
  MultiServiceOrder;
  order_list;
  communicationgroup;
  dataSourceOrder = new MatTableDataSource<any[]>();

  location_name;
  locationparentcustomerid;
  chainid;
  ordertype;

  userbandwidthList: any;

  issuestatelist: any;
  urgency;
  issuetype;
  channel;
  installprovider;
  nocuser;
  tabSectionList: any[] = [];
  locationdata_dict = {};
  ordertypeList: any;
  orderChainList: any;
  orderCountryList: any;
  ordershipmentMode: any;
  orderstatusList: any;
  activationList: any;
  productnameList: any;
  restrictiontypeList: any;
  productname_name;
  ordertype_name;
  orderstatus_name;
  orderaddon_name;
  ordershipment_name;
  locationproperty;
  locationcountry;
  bouwAllState: any[];
  orders: any[];

  displayedOrderColumns: string[] = ['orderid', 'parentorderid', 'MultiServiceOrderPlanneddate', 'bouwtype', 'orderstatusname', 'MultiServiceContractorName', 'action'];
  displayedMacauthColumns: string[] = ['macaddress', 'startdate', 'enddate', 'ubprofilename', 'ubprofiledownloadname', 'ubprofileuploadname', 'remark', 'action', 'overlayrow'];
  dataSourceMacauth = new MatTableDataSource<any[]>();
  displayedSSIDColumns: string[] = ['ssid', 'linegroupid', 'startdate', 'remark', 'action', 'overlayrow'];
  dataSourceSSID = new MatTableDataSource<any[]>();


  @ViewChild('orderSort', { static: true }) orderSort: MatSort;
  @ViewChild('paginatorOrder', { static: true }) paginatorOrder: MatPaginator;
  @ViewChild('paginatorMultiserviceOrder', { static: true }) paginatorMultiserviceOrder: MatPaginator;


  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  userbandwidthdata: any;
  linegroupData: any[];
  linegrouplistData: unknown;
  lgSecondlevel: any[];
  multiservicessidlistData: any;
  ssid: any;
  linegroupid: any;
  startdate: any;
  remark: any;
  multiserviceSSIDData: any[] = [];
  description: any;

  constructor(
    public router: Router,
    private _Activatedroute: ActivatedRoute,
    private _locationService: LocationService,
    private _productService: ProductService,
    private cd: ChangeDetectorRef,
    private modalService: ModalService,
    public dialog: MatDialog,
    private _ticketservice: TicketService, private http: HttpClient,
    private authenticationservice: AuthenticationService,
    private toasterservice: ToasterService,
    public _commonService: CommonService,
    private _scratchservice: ScratchService,
    private _macauthservice: MacauthService,
    private InfraService: InfraService,
    private datePipe: DatePipe,
    private orderService: OrderService,
  ) {

    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.id = sessionStorage.getItem('sessionSatelliteID');
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionSatelliteID');
    }

    this.tabSectionList = this._commonService.getSectionList('MultiserviceTab');
  }

  ngOnInit() {
    this.nocuser = this.authenticationservice.isNOCUser();
    this.superuser = this.authenticationservice.isSuperUser();
    this.getMacList();
    this.getOrderList();
    this.getSSIDList();
    this._locationService.getAllLocationProperty().subscribe(data => {
      this.locationproperty = data;
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
    }, error => this.toasterservice.showError(error));

  }

  ngAfterViewInit(): void {

  }


  toggleRow(element) {
    element.Extra ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    //this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Modification>).sort = this.innerSort.toArray()[index]);
  }

  applyFilterOrder(filterValue: string) {
    this.dataSourceMacauth.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceMacauth.paginator) {
      this.dataSourceMacauth.paginator.firstPage();
    }
  }

  applyFilterSSID(filterValue: string) {
    this.dataSourceSSID.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceSSID.paginator) {
      this.dataSourceSSID.paginator.firstPage();
    }
  }


  applyFilterMultiservice(filterValue: string) {
    this.dataSourceOrder.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceOrder.paginator) {
      this.dataSourceOrder.paginator.firstPage();
    }
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


  getMacList() {
    this.loading = true;
    this._macauthservice.getLocationMacList(this.id).subscribe(
      data => {
        this.macauthProduct = [];
        this.mac_list = data;
        this.InfraService.getLineGroupUserBandwidth().subscribe(data2 => {
          this.userbandwidthList = data2;

          for (let mac of this.mac_list['result']) {

            for (let userbandwidth of this.userbandwidthList['result']) {
              if (mac.userbandwidth_id == userbandwidth.id)
                this.userbandwidthdata = userbandwidth.profile;
              this.description = userbandwidth.description;
            }


            this.macauthProduct.push(
              {
                id: mac.id,
                macaddress: mac.macaddress,
                //userbandwidth: userbandwidthdata,
                //userbandwidth_id: mac.userbandwidth_id,
                remark: mac.remark,
                enddate: (mac.enddate || mac.enddate != null) ? formatDate(mac.enddate, 'dd-MM-yyyy', 'en-US') : '',
                enddateEdit: mac.enddate,
                startdate: (mac.startdate || mac.startdate != null) ? formatDate(mac.startdate, 'dd-MM-yyyy', 'en-US') : '',
                startdateEdit: mac.startdate,
                //ubprofile: mac.ubprofile,
                //ubprofiletype: mac.ubprofiletype,
                ubprofileupload: this.userbandwidthdata,
                ubprofiledownload: this.userbandwidthdata,

                ubprofilename: (this.userbandwidthdata == null) ? 'Dynamisch' : this.userbandwidthdata,
                //ubprofiletype: mac.ubprofiletype,
                ubprofileuploadname: (this.description != 'Unlimited') ? this.description.substring(0, 5) : this.description,
                ubprofiledownloadname: (this.description != 'Unlimited') ? this.description.substring(6, 11) : this.description,
              }
            );
          }
          this.loading = false;
          this.dataSourceMacauth = new MatTableDataSource<any>(this.macauthProduct);
          this.dataSourceMacauth.sort = this.orderSort;
          this.dataSourceMacauth.paginator = this.paginatorOrder;

        }, error => this.toasterservice.showError(error));

      }, error => this.toasterservice.showError(error));
  }


  getSSIDList() {


    this.InfraService.getLineGroup(this.id).subscribe(
      data => {
        this.multiserviceSSIDData = [];
        this.linegrouplistData = data;

        for (let linegroupVal of this.linegrouplistData['result']) {
          this._macauthservice.getMultiserviceSSID(linegroupVal.id).subscribe(
            data2 => {
              this.multiservicessidlistData = data2;

              for (let multiservicessidval of this.multiservicessidlistData['result']) {
                if (linegroupVal.id == multiservicessidval.linegroup_id)
                  this.ssid = multiservicessidval.ssid;
                //this.linegroupid = multiservicessidval.lingroup_id;
                this.startdate = multiservicessidval.createddate;
                this.remark = multiservicessidval.description
              }



              this.multiserviceSSIDData.push(
                {
                  ssid: this.ssid,
                  linegroupid: linegroupVal.id,
                  startdate: this.startdate,
                  remark: this.remark,
                }
              );

              this.loading = false;
              this.dataSourceSSID = new MatTableDataSource<any>(this.multiserviceSSIDData);
              this.dataSourceSSID.sort = this.orderSort;
              this.dataSourceSSID.paginator = this.paginatorOrder;


            }, error => this.toasterservice.showError(error));
        }
      }, error => this.toasterservice.showError(error));

  }


  getOrderList() {
    this.loading = true;
    this.orderService.getMultiServiceOrderList(4, this.id).subscribe(
      data => {
        this.MultiServiceOrder = [];
        this.order_list = data;
        this.orderService.getBouwStateList().subscribe(data => {
          this.bouwAllState = data;
          this.orderService.cataloguepropertybygroup('3').subscribe(data3 => {
            this.productnameList = data3;
            this._ticketservice.getCommunicationgroup().subscribe(comdata => {
              this.communicationgroup = comdata;
              this.orderService.getOrderProperty('BouwType').subscribe(data2 => {
                this.ordertype = data2;
                this.orders = this.order_list

                //this.order_list.sort(this.GetSortOrder("orderattributevaluesi"));
                for (let product of this.orders) {

                  this.productname_name = '';
                  //this.ordertype_name = '';
                  this.orderstatus_name = '';
                  this.orderaddon_name = '';

                  var comgroupname = '';

                  var orderstatusname = '';
                  var bouwtype;

                  var parentorderid = '';
                  for (let ordertype of this.ordertype) {
                    if (product.bouwtype == ordertype.id)
                      bouwtype = ordertype.name;
                  }

                  var contractor = '0';
                  if (product.bouwtype == 5)
                    contractor = product.orderattributevaluesi[2].orderattributevalue;

                  if (product.bouwtype == 6)
                    contractor = product.orderattributevaluesi[2].orderattributevalue;
                  if (product.bouwtype == 8)
                    contractor = product.orderattributevaluesi[0].orderattributevalue;
                  if (product.bouwtype == 7)
                    contractor = product.orderattributevaluesi[2].orderattributevalue;

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

                  // var productid = product.orderattributevaluesi[10].orderattributevalue;
                  var productcataloguegroup = product.productcataloguegroup;
                  // var orderstatusname = '';
                  if (productcataloguegroup == 4) {
                    this.MultiServiceOrder.push(
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
                        opmerking: product.remarks,
                        customerremarks: product.customerremarks,
                        billingstartdate: (product.billingstartdate || product.billingstartdate != null) ? formatDate(product.billingstartdate, 'dd-MM-yyyy', 'en-US') : '',
                        billingstartdateEdit: product.billingstartdate,
                        creationdate: (product.creationdate || product.creationdate != null) ? formatDate(product.creationdate, 'dd-MM-yyyy', 'en-US') : '',
                        creationdateEdit: product.creationdate,
                        updationdate: product.updationdate,
                        ponumber: product.ponumber,
                        billingstatus: product.billingstatus,

                        MultiServiceContactid: product.orderattributevaluesi[0].orderattributevalue,
                        MultiServiceWishdate: product.orderattributevaluesi[1].orderattributevalue ? formatDate(product.orderattributevaluesi[1].orderattributevalue, 'dd-MM-yyyy', 'en-US') : '',
                        MultiServiceWishdateEdit: product.orderattributevaluesi[1].orderattributevalue,
                        MultiServiceContractor: product.orderattributevaluesi[2].orderattributevalue,
                        SSIDname: product.orderattributevaluesi[4].orderattributevalue,
                        MultiServiceSSIDDescription: product.orderattributevaluesi[5].orderattributevalue,
                        MultiServiceChainid: product.orderattributevaluesi[3].orderattributevalue,

                        MultiServiceContractorName: comgroupname,
                        MultiServiceProgressNotification: product.orderattributevaluesi[6].orderattributevalue,
                      }
                    );
                  }
                  if (productcataloguegroup == 5) {
                    this.MultiServiceOrder.push(
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
                        opmerking: product.remarks,
                        customerremarks: product.customerremarks,
                        billingstartdate: (product.billingstartdate || product.billingstartdate != null) ? formatDate(product.billingstartdate, 'dd-MM-yyyy', 'en-US') : '',
                        billingstartdateEdit: product.billingstartdate,
                        creationdate: (product.creationdate || product.creationdate != null) ? formatDate(product.creationdate, 'dd-MM-yyyy', 'en-US') : '',
                        creationdateEdit: product.creationdate,
                        updationdate: product.updationdate,
                        ponumber: product.ponumber,
                        billingstatus: product.billingstatus,

                        MultiserviceWlanContactid: product.orderattributevaluesi[10].orderattributevalue,
                        MultiserviceWlanContractor: product.orderattributevaluesi[2].orderattributevalue,
                        description: product.description,
                        MultiserviceContractorname: '',
                        MultiserviceWlanWishdate: product.orderattributevaluesi[11].orderattributevalue ? formatDate(product.orderattributevaluesi[11].orderattributevalue, 'dd-MM-yyyy', 'en-US') : '',
                        MultiserviceWlanWishdateEdit: product.orderattributevaluesi[11].orderattributevalue,
                        BOUWTypeName: bouwtype,
                        MultiserviceWlanSSIDDescription: product.orderattributevaluesi[12].orderattributevalue,
                        MultiserviceWlanHighPriority: product.orderattributevaluesi[8].orderattributevalue,
                        MultiserviceWlanEncryptionType: product.orderattributevaluesi[6].orderattributevalue,
                        MultiserviceWlanInstallContractor: product.orderattributevaluesi[1].orderattributevalue,
                        MultiserviceWlanPassphrase: product.orderattributevaluesi[7].orderattributevalue,
                        MultiserviceWlanBroadcastSSID: product.orderattributevaluesi[5].orderattributevalue,
                        MultiserviceWlanSwitchPresent: product.orderattributevaluesi[0].orderattributevalue,
                        MultiserviceWlanUserProfile: product.orderattributevaluesi[3].orderattributevalue,
                        MultiserviceWlanSSID: product.orderattributevaluesi[4].orderattributevalue,
                        MultiserviceWlanPlanneddate: product.orderattributevaluesi[9].orderattributevalue,
                        MultiservicePlanneddate: product.orderattributevaluesi[9].orderattributevalue,
                        MultiServiceContractorName: comgroupname,
                        MultiserviceWlanProgressNotification: product.orderattributevaluesi[13].orderattributevalue,
                      }
                    );
                  }
                  if (productcataloguegroup == 6) {
                    this.MultiServiceOrder.push(
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
                        opmerking: product.remarks,
                        customerremarks: product.customerremarks,
                        billingstartdate: (product.billingstartdate || product.billingstartdate != null) ? formatDate(product.billingstartdate, 'dd-MM-yyyy', 'en-US') : '',
                        billingstartdateEdit: product.billingstartdate,
                        creationdate: (product.creationdate || product.creationdate != null) ? formatDate(product.creationdate, 'dd-MM-yyyy', 'en-US') : '',
                        creationdateEdit: product.creationdate,
                        updationdate: product.updationdate,
                        ponumber: product.ponumber,
                        billingstatus: product.billingstatus,

                        MultiserviceRoutedContactid: product.orderattributevaluesi[6].orderattributevalue,
                        MultiserviceRoutedContractor: product.orderattributevaluesi[2].orderattributevalue,
                        description: product.description,
                        MultiserviceContractorname: '',
                        MultiserviceRoutedWishdate: product.orderattributevaluesi[7].orderattributevalue ? formatDate(product.orderattributevaluesi[7].orderattributevalue, 'dd-MM-yyyy', 'en-US') : '',
                        MultiserviceRoutedWishdateEdit: product.orderattributevaluesi[7].orderattributevalue,
                        BOUWTypeName: bouwtype,
                        MultiserviceRoutedInstallContractor: product.orderattributevaluesi[1].orderattributevalue,
                        MultiserviceRoutedSwitchPresent: product.orderattributevaluesi[0].orderattributevalue,
                        MultiserviceRoutedPlanneddate: product.orderattributevaluesi[3].orderattributevalue,
                        MultiserviceRoutedIPaddress: product.orderattributevaluesi[4].orderattributevalue,
                        MultiserviceRoutedSubnetMask: product.orderattributevaluesi[5].orderattributevalue,
                        MultiserviceRoutedDescription: product.orderattributevaluesi[8].orderattributevalue,
                        MultiservicePlanneddate: product.orderattributevaluesi[3].orderattributevalue,
                        MultiServiceContractorName: comgroupname,
                        MultiserviceRoutedProgressNotification: product.orderattributevaluesi[9].orderattributevalue,
                      }
                    );
                  }
                  if (productcataloguegroup == 7) {
                    this.MultiServiceOrder.push(
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
                        opmerking: product.remarks,
                        customerremarks: product.customerremarks,
                        billingstartdate: (product.billingstartdate || product.billingstartdate != null) ? formatDate(product.billingstartdate, 'dd-MM-yyyy', 'en-US') : '',
                        billingstartdateEdit: product.billingstartdate,
                        creationdate: (product.creationdate || product.creationdate != null) ? formatDate(product.creationdate, 'dd-MM-yyyy', 'en-US') : '',
                        creationdateEdit: product.creationdate,
                        updationdate: product.updationdate,
                        ponumber: product.ponumber,
                        billingstatus: product.billingstatus,

                        MultiserviceMacContactid: product.orderattributevaluesi[2].orderattributevalue,
                        MultiserviceMacContractor: product.orderattributevaluesi[0].orderattributevalue,
                        description: product.description,
                        MultiserviceContractorname: '',
                        MultiserviceMacWishdate: product.orderattributevaluesi[3].orderattributevalue ? formatDate(product.orderattributevaluesi[3].orderattributevalue, 'dd-MM-yyyy', 'en-US') : '',
                        MultiserviceMacWishdateEdit: product.orderattributevaluesi[3].orderattributevalue,
                        BOUWTypeName: bouwtype,
                        MultiserviceMacPlanneddate: product.orderattributevaluesi[1].orderattributevalue,
                        MultiservicePlanneddate: product.orderattributevaluesi[1].orderattributevalue,
                        MultiServiceContractorName: comgroupname,
                        MultiserviceMacRequestType: product.orderattributevaluesi[4].orderattributevalue,
                        /*macaddress: product.orderattributevaluesi[5].orderattributevalue,
                        ubprofileupload: product.orderattributevaluesi[7].orderattributevalue,
                        ubprofiledownload: product.orderattributevaluesi[6].orderattributevalue,
                        enddate: product.orderattributevaluesi[8].orderattributevalue ? formatDate(product.orderattributevaluesi[8].orderattributevalue, 'dd-MM-yyyy', 'en-US') : '',
                        enddateEdit : product.orderattributevaluesi[8].orderattributevalue,*/
                        MacAddOns: product.orderattributevaluesi[5].orderattributevalue,

                      }
                    );
                  }
                }


                this.loading = false;

                this.dataSourceOrder = new MatTableDataSource<any>(this.MultiServiceOrder);
                this.dataSourceOrder.sort = this.orderSort;
                this.dataSourceOrder.paginator = this.paginatorMultiserviceOrder;
                //});
                //});
                //});
              });

            }, error => this.toasterservice.showError(error));
          });
        }, error => this.toasterservice.showError(error));
      }, error => this.toasterservice.showError(error));
  }

  getPropertyAll() {
    this._locationService.getAllLocationProperty().subscribe(data => {
      this.locationproperty = data;

    }, error => this.toasterservice.showError(error));
  }

  openDialogAdd(action) {


    const dialogRef = this.dialog.open(MacauthdialogBoxComponent, {
      width: '60%',
      data: {
        locationid: this.id, location_name: this.location_name,
        locationparentcustomerid: this.locationparentcustomerid,
        chainid: this.chainid,
        action: action
      }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getMacList();
      }
    }, error => this.toasterservice.showError(error));

  }

  openDialogOrderEdit(action, element) {

    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    element.chainid = this.chainid;
    element.locationparentcustomerid = this.locationparentcustomerid;
    element.location_name = this.location_name;
    const dialogRef = this.dialog.open(MacauthdialogBoxComponent, {
      width: '60%',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {
        element.macaddress = result.data[0].macaddress;
        element.remark = result.data[0].remark;
        element.enddate = result.data[0].enddate;
        //element.userbandwidth_id = result.data[0].userbandwidth_id;
        element.enddateEdit = result.data[0].enddateEdit;
        //element.startdate = result.data[0].startdate;
        //element.startdateEdit = result.data[0].startdateEdit;
        //element.userbandwidth = result.data[0].userbandwidthname;
        element.ubprofile = result.data[0].ubprofile;
        //element.ubprofiletype = result.data[0].ubprofiletype;
        element.ubprofileupload = result.data[0].ubprofileupload;
        element.ubprofiledownload = result.data[0].ubprofiledownload;

        element.ubprofilename = result.data[0].ubprofilename;
        //element.ubprofiletype = result.data[0].ubprofiletype;
        element.ubprofileuploadname = result.data[0].ubprofileuploadname;
        element.ubprofiledownloadname = result.data[0].ubprofiledownloadname;

      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));

  }


  openDialog(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    element.locationparentcustomerid = this.locationparentcustomerid;
    element.location_name = this.location_name;
    const dialogRef = this.dialog.open(MacauthdialogBoxComponent, {
      width: '60%',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {
        this.getMacList();
      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }

  openDialogAddSSID(action) {
    const dialogRef = this.dialog.open(MultiserviceSsidComponent, {
      width: '60%',
      data: {
        locationid: this.id, location_name: this.location_name,
        locationparentcustomerid: this.locationparentcustomerid,
        chainid: this.chainid, locationdata: this.location_details,
        action: action
      }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getOrderList();
      }
    }, error => this.toasterservice.showError(error));

  }

  openDialogAddWLAN(action) {
    const dialogRef = this.dialog.open(MultiservicewlanComponent, {
      width: '60%',
      data: {
        locationid: this.id, location_name: this.location_name,
        locationparentcustomerid: this.locationparentcustomerid,
        chainid: this.chainid, locationdata: this.location_details,
        action: action
      }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getOrderList();
      }
    }, error => this.toasterservice.showError(error));

  }
  openDialogAddRouted(action) {
    const dialogRef = this.dialog.open(MultiserviceroutedComponent, {
      width: '60%',
      data: {
        locationid: this.id, location_name: this.location_name,
        locationparentcustomerid: this.locationparentcustomerid,
        chainid: this.chainid, locationdata: this.location_details,
        action: action
      }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getOrderList();
      }
    }, error => this.toasterservice.showError(error));

  }

  openDialogAddMAC(action) {
    const dialogRef = this.dialog.open(MultiservicemacComponent, {
      width: '60%',
      data: {
        locationid: this.id, location_name: this.location_name,
        locationparentcustomerid: this.locationparentcustomerid,
        chainid: this.chainid, locationdata: this.location_details,
        action: action
      }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getOrderList();
      }
    }, error => this.toasterservice.showError(error));

  }

  openDialogMACEdit(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    element.location_name = this.location_name;
    element.locationparentcustomerid = this.locationparentcustomerid;
    element.locationdata = this.location_details;
    const dialogRef = this.dialog.open(MultiservicemacComponent, {
      width: '70%',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {

        element.updationdate = result.data[0].updationdate;

        element.MultiServiceContactid = result.data[0].MultiServiceContactid;
        element.MultiServiceWishdate = result.data[0].MultiserviceMacWishdate;
        element.MultiserviceMacWishdate = result.data[0].MultiserviceMacWishdate;
        element.MultiserviceMacWishdateEdit = result.data[0].MultiserviceMacWishdateEdit;
        element.MultiServiceContractorName = result.data[0].MultiserviceContractorname;
        element.MultiserviceMacContractor = result.data[0].MultiserviceMacContractor;
        /*element.macaddress = result.data[0].macaddress;
        element.ubprofiledownload = result.data[0].ubprofiledownload;
        element.ubprofiledownloadname = result.data[0].ubprofiledownloadname;
        element.ubprofileupload = result.data[0].ubprofileupload;
        element.ubprofileuploadname = result.data[0].ubprofileuploadname;
        element.enddate = result.data[0].enddate;
        element.enddateEdit = result.data[0].enddateEdit;*/
        element.MacAddOns = result.data[0].MacAddOns;
        element.opmerking = result.data[0].description;
        element.bouwtype = result.data[0].BOUWTypeName;
        element.orderstatusname = result.data[0].orderstatename;
        element.orderstate = result.data[0].orderstate;

      }

      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }

  openDialogSISDEdit(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    element.locationdata_dict = this.locationdata_dict;
    element.location_name = this.location_name;
    element.locationparentcustomerid = this.locationparentcustomerid;
    element.locationdata = this.location_details;
    const dialogRef = this.dialog.open(MultiserviceSsidComponent, {
      width: '70%',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {

        element.updationdate = result.data[0].updationdate;

        element.MultiServiceContactid = result.data[0].MultiServiceContactid;
        element.MultiServiceWishdate = result.data[0].MultiServiceWishdate;
        element.MultiServiceWishdateEdit = result.data[0].MultiServiceWishdateEdit;
        element.MultiServiceContractor = result.data[0].MultiServiceContractor;
        element.opmerking = result.data[0].description;
        element.MultiServiceContractorName = result.data[0].MultiServiceContractorName;
        element.MultiServiceChainid = result.data[0].MultiServiceChainid;
        element.bouwtype = result.data[0].BOUWTypeName;
        element.SSIDname = result.data[0].SSIDname;
        element.MultiServiceSSIDDescription = result.data[0].MultiServiceSSIDDescription;
        element.MultiServiceProgressNotification = result.data[0].MultiServiceProgressNotification;
        element.orderstatusname = result.data[0].orderstatename;
        element.orderstate = result.data[0].orderstate;

      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }
  openDialogWLANEdit(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    element.location_name = this.location_name;
    element.locationparentcustomerid = this.locationparentcustomerid;
    element.locationdata = this.location_details;
    const dialogRef = this.dialog.open(MultiservicewlanComponent, {
      width: '70%',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {

        element.updationdate = result.data[0].updationdate;

        element.MultiServiceContactid = result.data[0].MultiServiceContactid;
        element.MultiServiceWishdate = result.data[0].MultiserviceWlanWishdate;
        element.MultiserviceWlanWishdate = result.data[0].MultiserviceWlanWishdate;
        element.MultiserviceWlanWishdateEdit = result.data[0].MultiserviceWlanWishdateEdit;
        element.MultiServiceContractorName = result.data[0].MultiserviceContractorname;
        element.MultiserviceWlanContractor = result.data[0].MultiserviceWlanContractor;
        element.opmerking = result.data[0].description;
        element.bouwtype = result.data[0].BOUWTypeName;
        element.MultiserviceWlanSSIDDescription = result.data[0].MultiserviceWlanSSIDDescription;
        element.MultiserviceWlanHighPriorityname = result.data[0].MultiserviceWlanHighPriorityname;
        element.MultiserviceWlanHighPriority = result.data[0].MultiserviceWlanHighPriority;
        element.MultiserviceWlanEncryptionType = result.data[0].MultiserviceWlanEncryptionType;
        element.MultiserviceWlanEncryptionTypename = result.data[0].MultiserviceWlanEncryptionTypename;
        element.MultiserviceWlanSwitchPresent = result.data[0].MultiserviceWlanSwitchPresent;
        element.MultiserviceWlanSwitchPresentname = result.data[0].MultiserviceWlanSwitchPresentname;
        element.MultiserviceWlanInstallContractor = result.data[0].MultiserviceWlanInstallContractor;
        element.MultiserviceWlanInstallContractorname = result.data[0].MultiserviceWlanInstallContractorname;
        element.MultiserviceWlanWishdate = result.data[0].MultiserviceWlanWishdate;
        element.MultiserviceWlanSwitchPresent = result.data[0].MultiserviceWlanSwitchPresent;
        element.MultiserviceWlanSwitchPresentname = result.data[0].MultiserviceWlanSwitchPresentname;
        element.MultiserviceWlanPassphrase = result.data[0].MultiserviceWlanPassphrase;
        element.MultiserviceWlanBroadcastSSID = result.data[0].MultiserviceWlanBroadcastSSID;
        element.MultiserviceWlanUserProfile = result.data[0].MultiserviceWlanUserProfile;
        element.MultiserviceWlanSSID = result.data[0].MultiserviceWlanSSID
        element.MultiserviceWlanProgressNotification = result.data[0].MultiserviceWlanProgressNotification;
        element.orderstatusname = result.data[0].orderstatename;
        element.orderstate = result.data[0].orderstate;

      }

      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }
  openDialogRoutedEdit(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    element.location_name = this.location_name;
    element.locationparentcustomerid = this.locationparentcustomerid;
    element.locationdata = this.location_details;
    const dialogRef = this.dialog.open(MultiserviceroutedComponent, {
      width: '70%',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {

        element.updationdate = result.data[0].updationdate;

        element.MultiServiceContactid = result.data[0].MultiServiceContactid;
        element.MultiServiceWishdate = result.data[0].MultiserviceRoutedWishdate;
        element.MultiserviceRoutedWishdate = result.data[0].MultiserviceRoutedWishdate;
        element.MultiserviceRoutedWishdateEdit = result.data[0].MultiserviceRoutedWishdateEdit;
        element.MultiServiceContractorName = result.data[0].MultiserviceContractorname;
        element.MultiserviceRoutedContractor = result.data[0].MultiserviceRoutedContractor;
        element.opmerking = result.data[0].description;
        element.bouwtype = result.data[0].BOUWTypeName;
        element.MultiserviceRoutedDescription = result.data[0].MultiserviceRoutedDescription;
        element.MultiserviceRoutedSwitchPresent = result.data[0].MultiserviceRoutedSwitchPresent;
        element.MultiserviceRoutedSwitchPresentname = result.data[0].MultiserviceRoutedSwitchPresentname;
        element.MultiserviceRoutedInstallContractor = result.data[0].MultiserviceRoutedInstallContractor;
        element.MultiserviceRoutedInstallContractorname = result.data[0].MultiserviceRoutedInstallContractorname;
        element.MultiserviceRoutedWishdate = result.data[0].MultiserviceRoutedWishdate;
        element.MultiserviceRoutedSwitchPresent = result.data[0].MultiserviceRoutedSwitchPresent;
        element.MultiserviceRoutedIPaddress = result.data[0].MultiserviceRoutedIPaddress;
        element.MultiserviceRoutedSubnetMask = result.data[0].MultiserviceRoutedSubnetMask;
        element.orderstatusname = result.data[0].orderstatename;
        element.orderstate = result.data[0].orderstate;
        element.MultiserviceRoutedProgressNotification = result.data[0].MultiserviceRoutedProgressNotification;

      }

      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
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


  transformDate(date: any) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
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
}
