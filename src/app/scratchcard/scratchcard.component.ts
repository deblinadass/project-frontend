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
import { ScratchdialogBoxComponent } from '../scratchdialog-box/scratchdialog-box.component';
import { OnlineScratchcardComponent } from '../online-scratchcard/online-scratchcard.component';
import { DatePipe } from '@angular/common';
import { ScratchService } from '../_services/scratch.service';
import { AuthenticationService } from '../_services/authentication.service';
import moment from "moment";
import 'moment-timezone';
moment.tz.setDefault('Europe/Amsterdam');
import { ToasterService } from '../_services/toastr.service';
import { formatDate } from '@angular/common';
import { CommonService } from '../_services/common.service';

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
  selector: 'app-scratchcard',
  templateUrl: './scratchcard.component.html',
  styleUrls: ['./scratchcard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ScratchcardComponent implements OnInit, AfterViewInit {
  order_list: any;
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
  scratchOrder: any[] = [];
  scratchSecondlevel: any[] = [];
  statusVal;

  location_name;
  locationparentcustomerid;

  issueAllState: any[] = [];

  issuestatelist: any;
  urgency;
  issuetype;
  channel;
  installprovider;
  nocuser;
  tabSectionList: any[] = [];
  locationdata_dict = {};
  ordertypeList: any;
  orderstateList: any;
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
  locationproperty: any[];
  displayedOrderColumns: string[] = ['orderid', 'orderstatusname', 'orderstatename', 'kraskaarttype', 'antal', 'SCardOrderPrice', 'SCardOrderTotalPrice', 'opmerking', 'ordertrackcode', 'action', 'overlayrow'];
  dataSourceOrder = new MatTableDataSource<any[]>();
  locationcountry: any;
  @ViewChild('orderSort', { static: true }) orderSort: MatSort;
  @ViewChild('paginatorOrder', { static: true }) paginatorOrder: MatPaginator;


  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    public router: Router,
    private _Activatedroute: ActivatedRoute,
    private _locationService: LocationService,
    private cd: ChangeDetectorRef,
    private modalService: ModalService,
    public dialog: MatDialog,
    private http: HttpClient,
    private authenticationservice: AuthenticationService,
    public _commonService: CommonService,
    private _scratchservice: ScratchService,
    private datePipe: DatePipe,
    private toasterservice: ToasterService,
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

    this.tabSectionList = this._commonService.getSectionList('Tickets');
  }

  ngOnInit() {
    this.nocuser = this.authenticationservice.isNOCUser();
    this.superuser = this.authenticationservice.isSuperUser();
    this.getOrderList();

    /*this._locationService.location_details(this.id).subscribe(
      data => {
        this.location_details = data;
        this.location_name = data.customername;
        this.locationparentcustomerid = data.parentcustomerid;

        this.locationdata_dict = {
          streetname: data.streetname, postcode: data.postcode,
          city: data.city, housenumber: data.housenumber, housenumberaddition: data.housenumberaddition,
          country: data.country
        };

      }, error => this.toasterservice.showError(error));*/

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

  ngAfterViewInit(): void {

  }


  toggleRow(element) {
    element.Extra ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    //element.Extra ? this.expandedElement : null;
    this.cd.detectChanges();
    //this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Modification>).sort = this.innerSort.toArray()[index]);
  }

  applyFilterOrder(filterValue: string) {
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

  getOrderList() {
    this.loading = true;
    this._scratchservice.getOrderList(1, this.id).subscribe(
      data => {
        this.scratchOrder = [];
        this.order_list = data;

        this._locationService.getAllChain().subscribe(reschain => {
          this.orderChainList = reschain;

          this._locationService.getAllCountry().subscribe(rescountry => {
            this.orderCountryList = rescountry;

            this._scratchservice.getOrderPropertyByCatalogue(1).subscribe(res => {
              this.ordertypeList = res;
              this._scratchservice.getOrderStateForScratchCard().subscribe(res_state => {
                this.orderstateList = res_state;

                this._scratchservice.cataloguepropertybygroup('1').subscribe(data3 => {
                  this.productnameList = data3;
                  this.order_list.sort(this.GetSortOrder("orderattributevaluesi"));


                  for (let product of this.order_list) {
                    this.productname_name = '';
                    this.ordertype_name = '';
                    this.orderstatus_name = '';
                    this.ordershipment_name = ''
                    let chain_name = '';
                    let productcataloguename = '';
                    let country_name = ''

                    if (product.orderattributevaluesi[16].orderattributevalue != '') {
                      country_name = this.orderCountryList.result.find(r =>
                        r.countryid == product.orderattributevaluesi[16].orderattributevalue
                      ).countryname;
                    }

                    productcataloguename = this.productnameList.find((r: { catalogueproperty: string; cataloguepropertygroup: string; cataloguepropertytype: string; cataloguepropertyvalue: string; }) =>
                      r.catalogueproperty == 'productname' && r.cataloguepropertygroup == '1' && r.cataloguepropertytype == '1' &&
                      r.cataloguepropertyvalue == product.orderattributevaluesi[0].orderattributevalue
                    ).cataloguepropertyname;

                    /*var orderstatusname =  this.issueAllState.find(r =>
                      r.value == product.orderstatus
                   ).name;*/
                   var orderstatename = this.orderstateList.find(r => r.value == product.orderstate).name;
                   
                    var orderstatusname = this.ordertypeList.find(r =>
                      r.attrname == 'SCardOrderStatus' && r.id == product.orderstatus
                    ).name;

                    var retrictionCheckedOrnot = this.ordertypeList.find(r =>
                      r.attrname == 'SCardOrderRestrictionOnLocation' && r.id == product.orderattributevaluesi[5].orderattributevalue
                    ).name;

                    this.ordertype_name = this.ordertypeList.find(r =>
                      r.attrname == 'SCardOrderType' && r.id == product.ordertype
                    ).name;

                    this.ordershipment_name = this.ordertypeList.find(r =>
                      r.attrname == 'SCardOrderShipmentMode' && r.id == product.orderattributevaluesi[9].orderattributevalue
                    ).name;

                    if (product.orderattributevaluesi[5].orderattributevalue != '') {
                      chain_name = this.orderChainList.result.find(r =>
                        r.chainid == product.orderattributevaluesi[5].orderattributevalue
                      ).chainname;
                    }

                    var activationonshipment = this.ordertypeList.find(r =>
                      r.attrname == 'SCardOrderActivateOnShipment' && r.id == product.orderattributevaluesi[6].orderattributevalue
                    ).name;

                    let VerzendadresStreet = (product.orderattributevaluesi[11].orderattributevalue) ?
                      product.orderattributevaluesi[11].orderattributevalue + ',' : '';
                    let VerzendadresCity = (product.orderattributevaluesi[15].orderattributevalue) ?
                      product.orderattributevaluesi[15].orderattributevalue + ',' : '';
                    let VerzendadresPostcode = (product.orderattributevaluesi[14].orderattributevalue) ?
                      product.orderattributevaluesi[14].orderattributevalue : '';
                    let VerzendadresHouseNumber = (product.orderattributevaluesi[12].orderattributevalue) ?
                      product.orderattributevaluesi[12].orderattributevalue + ',' : '';
                    let VerzendadresHouseNumberExt = (product.orderattributevaluesi[13].orderattributevalue) ?
                      product.orderattributevaluesi[13].orderattributevalue + ',' : '';
                    let Verzendadres = VerzendadresHouseNumber + VerzendadresHouseNumberExt + VerzendadresStreet + VerzendadresCity + VerzendadresPostcode;

                    this.scratchSecondlevel = [];
                    this.scratchSecondlevel.push(

                      {
                        name: 'Datum aangemaakt',
                        value: product.creationdate ? formatDate(product.creationdate, 'dd-MM-yyyy', 'en-US') : '',
                      },
                      {
                        name: 'Verzendwijze',
                        value: this.ordershipment_name
                      },
                      {
                        name: 'Bevestiging verzonden naar',
                        value: product.orderattributevaluesi[17].orderattributevalue
                      },
                      {
                        name: 'Mutatiedatum',
                        value: product.updationdate ? formatDate(product.updationdate, 'dd-MM-yyyy', 'en-US') : '',
                      },
                      {
                        name: 'Verzendadres',
                        value: Verzendadres
                      },
                      {
                        name: 'Elgen referntie klant',
                        value: product.customerremarks
                      },
                      {
                        name: 'Restrictie op locatie',
                        value: retrictionCheckedOrnot
                      },
                      {
                        name: 'TAV',
                        value: product.orderattributevaluesi[10].orderattributevalue,
                      },
                      {
                        name: 'Activatie bij uitlevering',
                        value: activationonshipment
                      },
                      {
                        name: 'Geldig op locatie',
                        value: chain_name
                      },
                      {
                        name: 'Activatiedatum',
                        value: product.orderattributevaluesi[7].orderattributevalue ? formatDate(product.orderattributevaluesi[7].orderattributevalue, 'dd-MM-yyyy', 'en-US') : '',
                      }

                    );

                    this.scratchOrder.push(
                      {
                        id: product.id,
                        productcatalogue: product.productcatalogueid,
                        orderid: product.hstorderid,
                        ordertype: product.ordertype,
                        ordertypename: this.ordertype_name,
                        orderstatus: product.orderstatus,
                        orderstatusname: orderstatusname,
                        orderstatename: orderstatename,
                        kraskaarttype: productcataloguename,
                        orderstate: product.orderstate,
                        chain_name: chain_name,
                        productname: this.productname_name,
                        antal: product.orderattributevaluesi[1].orderattributevalue,
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
                        secondlevel: this.scratchSecondlevel,

                        SCardOrderShipmentModeName: this.ordershipment_name,
                        SCardOrderActivationDateShow: product.orderattributevaluesi[7].orderattributevalue ? formatDate(product.orderattributevaluesi[7].orderattributevalue, 'dd-MM-yyyy', 'en-US') : '',
                        SCardOrderQuantity: product.orderattributevaluesi[1].orderattributevalue,
                        SCardOrderCardType: product.orderattributevaluesi[18].orderattributevalue,
                        SCardOrderRestrictionOnLocation: product.orderattributevaluesi[5].orderattributevalue,
                        SCardOrderActivateOnShipment: product.orderattributevaluesi[6].orderattributevalue,
                        SCardOrderActivationDate: product.orderattributevaluesi[7].orderattributevalue,
                        SCardOrderValidForLocation: product.orderattributevaluesi[8].orderattributevalue,
                        SCardOrderShipmentMode: product.orderattributevaluesi[9].orderattributevalue,
                        SCardOrderShipmentTAV: product.orderattributevaluesi[10].orderattributevalue,
                        SCardOrderShipmentStreet: product.orderattributevaluesi[11].orderattributevalue,
                        SCardOrderShipmentHouseNo: product.orderattributevaluesi[12].orderattributevalue,
                        SCardOrderShipmentHouseNoExt: product.orderattributevaluesi[13].orderattributevalue,
                        SCardOrderShipmentPostalCode: product.orderattributevaluesi[14].orderattributevalue,
                        SCardOrderShipmentCity: product.orderattributevaluesi[15].orderattributevalue,
                        SCardOrderShipmentCountry: product.orderattributevaluesi[16].orderattributevalue,
                        SCardOrderShipmentEmail: product.orderattributevaluesi[17].orderattributevalue,
                        SCardOrderTypeKraskaartID: product.orderattributevaluesi[0].orderattributevalue,
                        SCardOrderPrice: product.orderattributevaluesi.hasOwnProperty(2) ? product.orderattributevaluesi[2].orderattributevalue : '',
                        SCardOrderTotalPrice: product.orderattributevaluesi.hasOwnProperty(3) ? product.orderattributevaluesi[3].orderattributevalue : '',
                        SCardOrderRTLMemoline: product.orderattributevaluesi.hasOwnProperty(4) ? product.orderattributevaluesi[4].orderattributevalue : '',
                        SCardStartNumber: product.orderattributevaluesi[19].orderattributevalue,
                        SCardEndNumber: product.orderattributevaluesi[20].orderattributevalue,
                        SCardContactid: product.orderattributevaluesi.hasOwnProperty(21) ? product.orderattributevaluesi[21].orderattributevalue : '',
                        SCardContactPersonTelephone: product.orderattributevaluesi.hasOwnProperty(22) ? product.orderattributevaluesi[22].orderattributevalue : '',
                        SCardContactPersonEmail: product.orderattributevaluesi.hasOwnProperty(23) ? product.orderattributevaluesi[23].orderattributevalue : '',
                        SCardContactPersonFunction: product.orderattributevaluesi.hasOwnProperty(24) ? product.orderattributevaluesi[24].orderattributevalue : '',
                      }
                    );
                  }
                  this.loading = false;

                  this.dataSourceOrder = new MatTableDataSource<any>(this.scratchOrder);
                  this.dataSourceOrder.sort = this.orderSort;
                  this.dataSourceOrder.paginator = this.paginatorOrder;
                }, error => this.toasterservice.showError(error));
              }, error => this.toasterservice.showError(error));
            }, error => this.toasterservice.showError(error));
          }, error => this.toasterservice.showError(error));
        }, error => this.toasterservice.showError(error));
        //});
      }, error => this.toasterservice.showError(error));
  }

  openDialogAdd(action) {
    const dialogRef = this.dialog.open(ScratchdialogBoxComponent, {
      width: '60%',
      data: {
        locationid: this.id, location_name: this.location_name,
        locationparentcustomerid: this.locationparentcustomerid,
        locationdata_dict: this.locationdata_dict,
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
    element.locationdata_dict = this.locationdata_dict;
    element.location_name = this.location_name;
    element.locationdata= this.location_details;
    element.locationparentcustomerid = this.locationparentcustomerid;
    const dialogRef = this.dialog.open(ScratchdialogBoxComponent, {
      width: '70%',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {
        element.antal = result.data[0].antal;
        element.opmerking = result.data[0].opmerking;
        element.updationdate = result.data[0].updationdate;
        element.billingstartdate = result.data[0].billingstartdate;
        element.billingstartdateEdit = result.data[0].billingstartdateEdit;
        element.creationdate = result.data[0].creationdate;
        element.creationdateEdit = result.data[0].creationdateEdit;
        element.billingstatus = result.data[0].billingstatus;
        element.customerremarks = result.data[0].customerremarks;
        element.productcatalogue = result.data[0].productcatalogue;
        element.orderid = result.data[0].orderid;
        element.ordertype = result.data[0].ordertype;
        element.ordertypename = result.data[0].ordertypename;
        element.orderstatus = result.data[0].orderstatus;


        element.ordertrackcode = result.data[0].ordertrackcode;
        element.kraskaarttype = result.data[0].kraskaarttype;

        element.SCardOrderRestrictionOnLocationName = result.data[0].SCardOrderRestrictionOnLocationName;
        element.SCardOrderActivationDateShow = result.data[0].SCardOrderActivationDateShow;
        element.SCardOrderQuantity = result.data[0].SCardOrderQuantity;
        element.SCardOrderCardType = result.data[0].SCardOrderCardType;
        element.SCardOrderRestrictionOnLocation = result.data[0].SCardOrderRestrictionOnLocation;
        element.SCardOrderActivateOnShipment = result.data[0].SCardOrderActivateOnShipment;
        element.SCardOrderActivationDate = result.data[0].SCardOrderActivationDate;
        element.SCardOrderValidForLocation = result.data[0].SCardOrderValidForLocation;
        element.SCardOrderShipmentMode = result.data[0].SCardOrderShipmentMode;
        element.SCardOrderShipmentTAV = result.data[0].SCardOrderShipmentTAV;
        element.SCardOrderShipmentStreet = result.data[0].SCardOrderShipmentStreet;
        element.SCardOrderShipmentHouseNo = result.data[0].SCardOrderShipmentHouseNo;
        element.SCardOrderShipmentHouseNoExt = result.data[0].SCardOrderShipmentHouseNoExt;
        element.SCardOrderShipmentPostalCode = result.data[0].SCardOrderShipmentPostalCode;
        element.SCardOrderShipmentCity = result.data[0].SCardOrderShipmentCity;
        element.SCardOrderShipmentCountry = result.data[0].SCardOrderShipmentCountry;
        element.SCardOrderShipmentEmail = result.data[0].SCardOrderShipmentEmail;
        element.SCardOrderTypeKraskaartID = result.data[0].SCardOrderTypeKraskaartID;
        element.SCardOrderRTLMemoline = result.data[0].SCardOrderRTLMemoline;
        element.SCardOrderPrice = result.data[0].SCardOrderPrice;
        element.SCardOrderTotalPrice = result.data[0].SCardOrderTotalPrice;

        //element.secondlevel[0].value = result.data[0].SCardOrderRestrictionOnLocationName;
        element.secondlevel[1].value = result.data[0].SCardOrderShipmentModeName;
        element.secondlevel[2].value = result.data[0].SCardOrderShipmentEmail;
        element.secondlevel[3].value = result.data[0].updationdate;

        let VerzendadresStreet = (result.data[0].SCardOrderShipmentStreet) ?
          result.data[0].SCardOrderShipmentStreet + ',' : '';
        let VerzendadresCity = (result.data[0].SCardOrderShipmentCity) ?
          result.data[0].SCardOrderShipmentCity + ',' : '';
        let VerzendadresPostcode = (result.data[0].SCardOrderShipmentPostalCode) ?
          result.data[0].SCardOrderShipmentPostalCode : '';
        let VerzendadresHouseNumber = (result.data[0].SCardOrderShipmentHouseNo) ?
          result.data[0].SCardOrderShipmentHouseNo + ',' : '';
        let VerzendadresHouseNumberExt = (result.data[0].SCardOrderShipmentHouseNoExt) ?
          result.data[0].SCardOrderShipmentHouseNoExt + ',' : '';


        let Verzendadres = VerzendadresHouseNumber + VerzendadresHouseNumberExt + VerzendadresStreet + VerzendadresCity + VerzendadresPostcode;

        element.secondlevel[4].value = Verzendadres;

        element.secondlevel[5].value = result.data[0].customerremarks;
        element.secondlevel[6].value = result.data[0].SCardOrderRestrictionOnLocationName;
        element.secondlevel[7].value = result.data[0].SCardOrderShipmentTAV;
        element.secondlevel[8].value = result.data[0].SCardOrderActivateOnShipmentName;

        element.secondlevel[9].value = result.data[0].SCardOrderValidForLocationName;
        element.secondlevel[10].value = result.data[0].SCardOrderActivationDateShow;
        this.getOrderList();
      }
      $('#rowoverlay' + element.id).hide();
      
    }, error => this.toasterservice.showError(error));
  }

  openDialogOrderStatus(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    element.locationparentcustomerid = this.locationparentcustomerid;
    element.location_name = this.location_name;
    const dialogRef = this.dialog.open(ScratchdialogBoxComponent, {
      width: '60%',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {

        //element.orderstate = result.data[0].orderstate;
        element.orderstatus = result.data[0].orderstatus;
        element.orderstatusname = result.data[0].orderstatusname;
      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }

  getOrderListScard() {
    this.loading = true;
    this._scratchservice.getBackofficeScaratchOrderList(8).subscribe(
      data => {
        this.scratchOrder = [];
        this.order_list = data;
       
        /*this._ticketservice.getStateList().subscribe(data => {
          this.issueAllState = data;*/
          
          this._locationService.getAllChain().subscribe(reschain => {
            this.orderChainList = reschain;

            this._locationService.getAllCountry().subscribe(rescountry => {
              this.orderCountryList = rescountry;
            
            this._scratchservice.getOrderPropertyByCatalogue(8).subscribe(res => {
              this.ordertypeList = res;

                this._scratchservice.cataloguepropertybygroup('1').subscribe(data3 => {
                  this.productnameList = data3;
                  this.order_list.sort(this.GetSortOrder("orderattributevaluesi"));
                  
                 
                  for (let product of this.order_list) {
                    this.productname_name = '';
                    this.ordertype_name = '';
                    this.orderstatus_name = '';
                    this.ordershipment_name = ''
                    let chain_name = '';
                    let productcataloguename = '';
                    let country_name = ''

                   /* if (product.orderattributevaluesi[16].orderattributevalue!=''){
                      country_name = this.orderCountryList.result.find(r =>
                        r.countryid == product.orderattributevaluesi[16].orderattributevalue
                      ).countryname ;
                    }*/

                   productcataloguename = this.productnameList.find((r: {catalogueproperty:string; cataloguepropertygroup: string; cataloguepropertytype: string; cataloguepropertyvalue:string; }) => 
                      r.catalogueproperty == 'productname' && r.cataloguepropertygroup == '1' && r.cataloguepropertytype == '1' && 
                      r.cataloguepropertyvalue == product.orderattributevaluesi[0].orderattributevalue
                    ).cataloguepropertyname;

                    /*var orderstatusname =  this.issueAllState.find(r =>
                      r.value == product.orderstatus
                   ).name;*/
                   var orderstatusname =  this.ordertypeList.find(r =>
                    r.attrname == 'OnlineSCardOrderStatus' && r.id == product.orderstatus
                  ).name;

                      var retrictionCheckedOrnot = this.ordertypeList.find(r =>
                        r.attrname == 'OnlineSCardOrderRestrictionOnLocation' && r.id == product.orderattributevaluesi[7].orderattributevalue
                      ).name;

                      this.ordertype_name = this.ordertypeList.find(r =>
                        r.attrname == 'OnlineSCardOrderType' &&  r.id == product.ordertype
                      ).name;

                      
                      
                      if (product.orderattributevaluesi[8].orderattributevalue!=''){
                        chain_name = this.orderChainList.result.find(r =>
                          r.chainid == product.orderattributevaluesi[8].orderattributevalue
                        ).chainname ;
                      }

                      var activationonshipment =  this.ordertypeList.find(r =>
                      r.attrname == 'OnlineSCardOrderActivate' && r.id == product.orderattributevaluesi[2].orderattributevalue
                    ).name;


                    this.scratchSecondlevel = [];
                    this.scratchSecondlevel.push(
                      
                      {
                        name: 'Datum aangemaakt',
                        value: product.creationdate ? formatDate(product.creationdate, 'dd-MM-yyyy', 'en-US') : '',
                      },
                      {
                        name: 'Verzendwijze',
                        value: this.ordershipment_name
                      },
                      {
                        name: 'Bevestiging verzonden naar',
                        value: ''
                      },
                      {
                        name: 'Mutatiedatum',
                        value: '',
                      },
                      {
                        name: 'Verzendadres',
                        value: ''
                      },
                      {
                        name: 'Elgen referntie klant',
                        value: product.customerremarks
                      },
                      {
                        name: 'Restrictie op locatie',
                        value: retrictionCheckedOrnot
                      },
                      {
                        name: 'TAV',
                        value: '',
                      },
                      {
                        name: 'Activatie bij uitlevering',
                        value: activationonshipment
                      },
                      {
                        name: 'Geldig op locatie',
                        value: chain_name
                      },
                      {
                        name: 'Activatiedatum',
                        value: '',
                      }
                      
                    );
                    
                    this.scratchOrder.push(
                      {
                        id: product.id,
                        productcatalogue: product.productcatalogueid,
                        orderid: product.hstorderid,
                        ordertype: product.ordertype,
                        ordertypename: this.ordertype_name,
                        orderstatus: product.orderstatus,
                        orderstatusname: orderstatusname,
                        kraskaarttype: productcataloguename,
                        orderstate: product.orderstate,
                        chain_name: chain_name,
                        productname: this.productname_name,
                        antal: product.orderattributevaluesi[3].orderattributevalue,
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
                        secondlevel: this.scratchSecondlevel,

                        OnlineSCardOrderPrice: product.orderattributevaluesi.hasOwnProperty(4) ? product.orderattributevaluesi[4].orderattributevalue : '',
                        OnlineSCardOrderTotalPrice: product.orderattributevaluesi.hasOwnProperty(5) ? product.orderattributevaluesi[5].orderattributevalue : '',
                        OnlineSCardOrderRTLMemoline: product.orderattributevaluesi.hasOwnProperty(6) ? product.orderattributevaluesi[6].orderattributevalue : ''

                        /*OnlineSCardOrderShipmentModeName: this.ordershipment_name,
                        OnlineSCardOrderActivationDateShow: product.orderattributevaluesi[7].orderattributevalue ? formatDate(product.orderattributevaluesi[7].orderattributevalue, 'dd-MM-yyyy', 'en-US') : '',
                        OnlineSCardOrderQuantity : product.orderattributevaluesi[1].orderattributevalue,
                        OnlineSCardOrderCardType: product.orderattributevaluesi[18].orderattributevalue,
                        OnlineSCardOrderRestrictionOnLocation: product.orderattributevaluesi[5].orderattributevalue,
                        OnlineSCardOrderActivateOnShipment: product.orderattributevaluesi[6].orderattributevalue,
                        OnlineSCardOrderActivationDate: product.orderattributevaluesi[7].orderattributevalue,
                        OnlineSCardOrderValidForLocation: product.orderattributevaluesi[8].orderattributevalue,
                        OnlineSCardOrderShipmentMode: product.orderattributevaluesi[9].orderattributevalue,
                        OnlineSCardOrderShipmentTAV: product.orderattributevaluesi[10].orderattributevalue,
                        OnlineSCardOrderShipmentStreet: product.orderattributevaluesi[11].orderattributevalue,
                        OnlineSCardOrderShipmentHouseNo: product.orderattributevaluesi[12].orderattributevalue,
                        OnlineSCardOrderShipmentHouseNoExt: product.orderattributevaluesi[13].orderattributevalue,
                        OnlineSCardOrderShipmentPostalCode: product.orderattributevaluesi[14].orderattributevalue,
                        OnlineSCardOrderShipmentCity: product.orderattributevaluesi[15].orderattributevalue,
                        OnlineSCardOrderShipmentCountry: product.orderattributevaluesi[16].orderattributevalue,
                        OnlineSCardOrderShipmentEmail:product.orderattributevaluesi[17].orderattributevalue,
                        OnlineSCardOrderTypeKraskaartID:product.orderattributevaluesi[0].orderattributevalue,
                        OnlineSCardOrderPrice: product.orderattributevaluesi.hasOwnProperty(2) ? product.orderattributevaluesi[2].orderattributevalue : '',
                        OnlineSCardOrderTotalPrice: product.orderattributevaluesi.hasOwnProperty(3) ? product.orderattributevaluesi[3].orderattributevalue : '',
                        OnlineSCardOrderRTLMemoline: product.orderattributevaluesi.hasOwnProperty(4) ? product.orderattributevaluesi[4].orderattributevalue : '',*/
                      }
                    );
                  }
                  this.loading = false;
                  
                  /*this.dataSourceScardOrder = new MatTableDataSource<any>(this.scratchOrder);
                  this.dataSourceScardOrder.sort = this.orderSort;
                  this.dataSourceScardOrder.paginator = this.paginatorOrder;*/
              }, error => this.toasterservice.showError(error));
            }, error => this.toasterservice.showError(error));
          }, error => this.toasterservice.showError(error));
        }, error => this.toasterservice.showError(error));
      //});
      }, error => this.toasterservice.showError(error));
  }

  openDialogAddOnline(action) {

    
    const dialogRef = this.dialog.open(OnlineScratchcardComponent, {
      width: '60%',
      data: { locationid: this.id, location_name: this.location_name,
        locationparentcustomerid: this.locationparentcustomerid,
        locationdata_dict: this.locationdata_dict,
        locationdata: this.location_details,
        action: action }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        //this.getOrderListScard();
      }
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
