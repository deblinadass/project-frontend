import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { OneTimeCostdialogBoxComponent } from '../onetimecostdialog-box/onetimecostdialog-box.component';
import { OneTimeCostService } from '../_services/onetimecost.service';
import { DatePipe } from '@angular/common';
import { OnetimecostsequencedialogBoxComponent } from '../onetimecostsequencedialog-box/onetimecostsequencedialog-box.component';
import { BillingSettingdialogBoxComponent } from '../billingsettingdialog-box/billingsettingdialog-box.component';
import { LocationService } from '../_services/location.service';
import { CommonService } from '../_services/common.service';
import { ToasterService } from '../_services/toastr.service';
declare var jQuery: any;
declare const editClick: any;
declare var $: any;

export class OneTimeCostListModel {
  id: number;
  ordernumber: string;
  description: string;
  registrationdate: string;
  billingdate: string;
  price: string;
  invoicedate: string;
  productcatalogueid: string;
}

export class Custom {
  name: string;
  id: number;
}

@Component({
  selector: 'app-onetimecost',
  templateUrl: './onetimecost.component.html',
  styleUrls: ['./onetimecost.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class OneTimeCostComponent implements OnInit, AfterViewInit {
  locations_list_table: any[] = [];
  satellite_id;
  location_details: any;
  locations_list: any;
  product_list: any;
  billingSettingProduct_list: any;
  invoicedonetimecost_list: any;
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
  locationparentcustomerid;
  oneTimeCostProduct: any[] = [];
  invoiceOneTimeCostProduct: any[] = [];
  billingSettingProduct: any[] = [];
  expandedElement: any[] = [];
  otcsecondlevel: any[] = [];
  invoiceotcsecondlevel: any[] = [];
  ordertypeList: any[];
  productmainList: any[];
  productnameList: any[];
  billingmonthList: any[];
  locationcountry: any;
  locationproperty: any[];
  displayedonetimecostColumns: string[] = ['hstorderid', 'hstbillingsettingid', 'deliverydate', 'quantity', 'price', 'amount', 'description', 'billingmonth', 'action', 'overlayrow'];
  displayedinvoicedonetimecostColumns: string[] = ['hstorderid', 'hstbillingsettingid', 'deliverydate', 'quantity', 'price', 'amount', 'description', 'billingmonth', 'billingdate', 'action'];
  displayedbillingsettingColumns: string[] = ['hstorderid', 'startdate', 'enddate', 'amount', 'term', 'productname', 'description', 'status', 'action', 'overlayrow'];
  dataSourceOneTimeCost = new MatTableDataSource<OneTimeCostListModel>();
  dataSourceInvoicedOneTimeCost = new MatTableDataSource<OneTimeCostListModel>();
  dataSourceBillingSetting = new MatTableDataSource<OneTimeCostListModel>();

  @ViewChild('onetimecostSort', { static: true }) onetimecostSort: MatSort;
  @ViewChild('paginatorOneTimeCost', { static: true }) paginatorOneTimeCost: MatPaginator;

  @ViewChild('invoiceonetimecostSort', { static: true }) invoiceonetimecostSort: MatSort;
  @ViewChild('paginatorInvoiceOneTimeCost', { static: true }) paginatorInvoiceOneTimeCost: MatPaginator;

  @ViewChild('billingsettingSort', { static: true }) billingsettingSort: MatSort;
  @ViewChild('paginatorBillingSetting', { static: true }) paginatorBillingSetting: MatPaginator;

  routerCurrentURL;
  termList: any;
  location_name: any;
  location_parentcustomerid: any;
  tabSectionList: any[] = [];

  constructor(
    public router: Router,
    private onetimecostService: OneTimeCostService,
    private _locationService: LocationService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private api: OneTimeCostService,
    private datePipe: DatePipe,
    public _commonService: CommonService,
    private toasterservice: ToasterService,

  ) {
    $('.mat-tab-link').removeClass('mat-tab-label-active');
    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.satellite_id = sessionStorage.getItem('sessionSatelliteID');
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.satellite_id = sessionStorage.getItem('sessionSatelliteID');
    }

    this._locationService.getAllLocationProperty().subscribe(data => {
      this.locationproperty = data;

    }, error => this.toasterservice.showError(error));
    /*this._locationService.location_details(this.satellite_id).subscribe(
      data => {
        this.location_name = data.customername;
        this.location_parentcustomerid = data.parentcustomerid;


      }, error => this.toasterservice.showError(error));*/
      

    this.tabSectionList = this._commonService.getSectionList('FacturatieTab');

  }


  ngOnInit(): void {

    this._locationService.location_details(this.satellite_id).subscribe(
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


    this.dataSourceOneTimeCost.paginator = this.paginatorOneTimeCost;
    this.dataSourceOneTimeCost.sort = this.onetimecostSort;

    this.api.getBillingProperty('ordertype').subscribe(data => {
      this.ordertypeList = data;
      this.api.getBillingProperty('periodic').subscribe(data => {
        this.termList = data;
        this.api.getBillingProperty('productmain').subscribe(data => {
          this.productmainList = data;
          this.api.getBillingProperty('productname').subscribe(data => {
            this.productnameList = data;
            this.api.getBillingProperty('billingmonth').subscribe(data => {
              this.billingmonthList = data;
              this.product_list = this.getOnetimeCostList();
              this.invoicedonetimecost_list = this.getInvoicedOnetimeCostList();
              this.billingSettingProduct_list = this.getBillingSettingList();
            }, error => this.toasterservice.showError(error));
          }, error => this.toasterservice.showError(error));
        }, error => this.toasterservice.showError(error));
      }, error => this.toasterservice.showError(error));
    }, error => this.toasterservice.showError(error));
  }
  ngAfterViewInit(): void {

  }

  applyFilterOneTimeCost(filterValue) {
    this.dataSourceOneTimeCost.filter = filterValue.target.value.trim().toLowerCase();
    if (this.dataSourceOneTimeCost.paginator) {
      this.dataSourceOneTimeCost.paginator.firstPage();
    }
  }

  applyFilterInvoiceOneTimeCost(filterValue) {
    this.dataSourceInvoicedOneTimeCost.filter = filterValue.target.value.trim().toLowerCase();
    if (this.dataSourceInvoicedOneTimeCost.paginator) {
      this.dataSourceInvoicedOneTimeCost.paginator.firstPage();
    }
  }

  applyFilterBillingSetting(filterValue) {
    this.dataSourceBillingSetting.filter = filterValue.target.value.trim().toLowerCase();
    if (this.dataSourceBillingSetting.paginator) {
      this.dataSourceBillingSetting.paginator.firstPage();
    }
  }


  getOnetimeCostList() {
    this.loading = true;
    this.onetimecostService.getOneTimeCostList(this.satellite_id).subscribe(
      data => {

        this.oneTimeCostProduct = [];
        this.product_list = data;

        for (let product of this.product_list) {
          this.otcsecondlevel = [];
          var ordertype_name: '';
          var productmain_name: '';
          var productname_name: '';
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

          this.otcsecondlevel.push(
            {
              name: 'Hoofdproduct',
              value: productmain_name
            },
            {
              name: 'PO-nummer',
              value: product.ponumber
            },
            {
              name: 'Memoline',
              value: productname_name
            },
            {
              name: 'Order type',
              value: ordertype_name
            },
          );

          this.oneTimeCostProduct.push(
            {
              id: product.id,
              hstorderid: product.hstorderid,
              hstbillingsettingid: product.hstbillingsettingid,
              sourcesystemorder: product.sourcesystemorder,
              orderidexternal: product.orderidexternal,
              deliverydate: product.deliverydate,
              deliverydate_formated: product.deliverydate != null ? this.formatdatehst(product.deliverydate) : null,
              ordertype: product.ordertype,
              productmain: product.productmain,
              productname: product.productname,
              description: product.description,
              ponumber: product.ponumber,
              serviceid: product.serviceid,
              quantity: product.quantity,
              price: product.price,
              amount: product.amount,
              billingmonth: product.billingmonth,
              secondlevel: this.otcsecondlevel
            }
          );
        }
        this.loading = false;
        this.dataSourceOneTimeCost = new MatTableDataSource<any>(this.oneTimeCostProduct);
        this.dataSourceOneTimeCost.sort = this.onetimecostSort;
        this.dataSourceOneTimeCost.paginator = this.paginatorOneTimeCost;



      }, error => this.toasterservice.showError(error));
  }

  getInvoicedOnetimeCostList() {
    this.loadinginvoiced = true;
    this.onetimecostService.getInvoicedOneTimeCostList(this.satellite_id).subscribe(
      data => {
        this.invoiceOneTimeCostProduct = [];
        this.invoicedonetimecost_list = data;

        for (let product of this.invoicedonetimecost_list) {
          this.invoiceotcsecondlevel = [];
          var ordertype_name: '';
          var productmain_name: '';
          var productname_name: '';
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


          this.invoiceotcsecondlevel.push(
            {
              name: 'Hoofdproduct',
              value: productmain_name
            },
            {
              name: 'PO-nummer',
              value: product.ponumber
            },
            {
              name: 'Memoline',
              value: productname_name
            },
            {
              name: 'Order type',
              value: ordertype_name
            }
          );

          this.invoiceOneTimeCostProduct.push(
            {
              id: product.id,
              hstorderid: product.hstorderid,
              hstbillingsettingid: product.hstbillingsettingid,
              sourcesystemorder: product.sourcesystemorder,
              orderidexternal: product.orderidexternal,
              deliverydate: product.deliverydate,
              deliverydate_formated: product.deliverydate != null ? this.formatdatehst(product.deliverydate) : null,
              ordertype: product.ordertype,
              productmain: product.productmain,
              productname: product.productname,
              description: product.description,
              ponumber: product.ponumber,
              serviceid: product.serviceid,
              quantity: product.quantity,
              price: product.price,
              amount: product.amount,
              billingmonth: product.billingmonth,
              billingdate: product.billingdate,
              secondlevel: this.invoiceotcsecondlevel
            }
          );
        }
        this.loadinginvoiced = false;
        this.dataSourceInvoicedOneTimeCost = new MatTableDataSource<any>(this.invoiceOneTimeCostProduct);
        this.dataSourceInvoicedOneTimeCost.sort = this.invoiceonetimecostSort;
        this.dataSourceInvoicedOneTimeCost.paginator = this.paginatorInvoiceOneTimeCost;
        // });

      }, error => this.toasterservice.showError(error));
  }

  getBillingSettingList() {
    this.loading = true;
    this.onetimecostService.getBillingSettingList(this.satellite_id).subscribe(
      data => {

        this.billingSettingProduct = [];
        this.billingSettingProduct_list = data;

        for (let product of this.billingSettingProduct_list) {
          var term_name: '';
          var productmain_name: '';
          var productname_name: '';
          for (let term of this.termList) {
            if (product.term == term.id)
              term_name = term.name;
          }
          for (let productmain of this.productmainList) {
            if (product.productmain == productmain.id)
              productmain_name = productmain.name;
          }
          for (let productname of this.productnameList) {
            if (product.productname == productname.id)
              productname_name = productname.name;
          }


          this.billingSettingProduct.push(
            {
              id: product.id,
              hstorderid: product.hstorderid1,
              startdate: product.startdate,
              startdate_formated: product.startdate != null ? this.formatdatehst(product.startdate) : null,
              enddate: product.enddate,
              enddate_formated: product.enddate != null ? this.formatdatehst(product.enddate) : 'Doorlopend',
              productmain: product.productmain,
              productname: product.productname,
              amount: product.amount,
              term: product.term,
              description: product.description,
              status: product.status,
              billingmonth: product.billingmonth,
              settlement: product.settlement,
              calculationrule: product.calculationrule,
              regelreference: product.regelreference,
              invoicereference: product.invoicereference,
              price: product.price,
              quantity: product.quantity,
              ponumber: product.ponumber,
              term_name: term_name,
              productname_name: productname_name,
              productmain_name: productmain_name

            }
          );
        }
        this.loading = false;
        this.dataSourceBillingSetting = new MatTableDataSource<any>(this.billingSettingProduct);
        this.dataSourceBillingSetting.sort = this.billingsettingSort;
        this.dataSourceBillingSetting.paginator = this.paginatorBillingSetting;



      }, error => this.toasterservice.showError(error));
  }

  openDialogAdd(action) {

    const dialogRef = this.dialog.open(OneTimeCostdialogBoxComponent, {
      width: '60%',
      data: { locationid: this.satellite_id, location_name: this.location_name, locationdata: this.location_details, action: 'Add' }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getOnetimeCostList();
        this.getInvoicedOnetimeCostList();
      }
    }, error => this.toasterservice.showError(error));
  }

  openDialogAddBillingSetting(action) {
    const dialogRef = this.dialog.open(BillingSettingdialogBoxComponent, {
      width: '60%',
      data: { locationid: this.satellite_id, location_name: this.location_name, locationdata: this.location_details, action: 'Add' }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getBillingSettingList();
        this.getOnetimeCostList();
        //this.getInvoicedOnetimeCostList();
      }
    }, error => this.toasterservice.showError(error));
  }

  openDialogAddSequence(action) {

    const dialogRef = this.dialog.open(OnetimecostsequencedialogBoxComponent, {
      width: '60%',
      data: { locationid: this.satellite_id, location_name: this.location_name, locationdata: this.location_details, action: 'Add' }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getOnetimeCostList();
        this.getInvoicedOnetimeCostList();
      }
    }, error => this.toasterservice.showError(error));
  }
  openDialog(action, obj) {
    obj.action = action;
    obj.locationid = this.satellite_id;
    obj.location_name = this.location_name; 
    obj.locationdata = this.location_details;
    const dialogRef = this.dialog.open(OneTimeCostdialogBoxComponent, {
      width: '60%',
      data: obj, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {
        this.getOnetimeCostList();
        this.getInvoicedOnetimeCostList();
      }
    }, error => this.toasterservice.showError(error));
  }

  openDialogBillingSetting(action, obj) {
    obj.action = action;
    obj.locationid = this.satellite_id;
    obj.location_name = this.location_name;
    const dialogRef = this.dialog.open(BillingSettingdialogBoxComponent, {
      width: '60%',
      data: obj, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {
        this.getBillingSettingList();
      }
      //this.getOnetimeCostList();
      //this.getInvoicedOnetimeCostList();
    }, error => this.toasterservice.showError(error));
  }


  openDialogEdit(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.satellite_id;
    const dialogRef = this.dialog.open(OneTimeCostdialogBoxComponent, {
      width: '60%',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {

        var ordertype_name: '';
        var productmain_name: '';
        var productname_name: '';

        for (let ordertype of this.ordertypeList) {
          if (result.data[0].ordertype == ordertype.id)
            ordertype_name = ordertype.name;
        }
        for (let productmain of this.productmainList) {
          if (result.data[0].productmain == productmain.id)
            productmain_name = productmain.name;
        }
        for (let productname of this.productnameList) {
          if (result.data[0].productname == productname.id)
            productname_name = productname.name;
        }

        //element.sourcesystemorder = result.data[0].sourcesystemorder;
        //element.orderidexternal = result.data[0].orderidexternal;
        element.deliverydate = result.data[0].deliverydate;
        element.deliverydate_formated = result.data[0].deliverydate != null ? this.formatdatehst(result.data[0].deliverydate) : null,
          element.ordertype = result.data[0].ordertype;
        element.productmain = result.data[0].productmain;
        element.productname = result.data[0].productname;
        element.description = result.data[0].description;
        element.ponumber = result.data[0].ponumber;
        //element.serviceid = result.data[0].serviceid;
        element.quantity = result.data[0].quantity;
        element.price = result.data[0].price;
        element.amount = result.data[0].amount;
        element.billingmonth = result.data[0].billingmonth;

        // element.secondlevel[0].value = result.data[0].sourcesystemorder;
        element.secondlevel[0].value = productmain_name;
        element.secondlevel[1].value = result.data[0].ponumber;
        //element.secondlevel[3].value = result.data[0].orderidexternal;
        element.secondlevel[2].value = productname_name;
        //element.secondlevel[5].value = result.data[0].serviceid;
        element.secondlevel[3].value = ordertype_name;
      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }

  openDialogEditBillingSetting(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.satellite_id;
    element.location_name = this.location_name;
    element.status;
    const dialogRef = this.dialog.open(BillingSettingdialogBoxComponent, {
      width: '60%',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {

        var term_name: '';
        var productmain_name: '';
        var productname_name: '';

        for (let term of this.termList) {
          if (result.data[0].term == term.id)
            term_name = term.name;
        }
        for (let productmain of this.productmainList) {
          if (result.data[0].productmain == productmain.id)
            productmain_name = productmain.name;
        }
        for (let productname of this.productnameList) {
          if (result.data[0].productname == productname.id)
            productname_name = productname.name;
        }

        element.startdate = result.data[0].startdate;
        element.startdate_formated = result.data[0].startdate != null ? this.formatdatehst(result.data[0].startdate) : null,
          element.enddate = result.data[0].enddate;
        element.enddate_formated = result.data[0].enddate != null ? this.formatdatehst(result.data[0].enddate) : 'Doorlopend',
          element.term = result.data[0].term;
        element.billingmonth = result.data[0].billingmonth;
        element.quantity = result.data[0].quantity;
        element.price = result.data[0].price;
        element.amount = result.data[0].amount;
        element.productmain = result.data[0].productmain;
        element.productname = result.data[0].productname;
        element.description = result.data[0].description;
        element.ponumber = result.data[0].ponumber;
        element.invoicereference = result.data[0].invoicereference;
        element.regelreference = result.data[0].regelreference;
        element.calculationrule = result.data[0].calculationrule;
        element.settlement = result.data[0].settlement;
        element.term_name = term_name;
        element.productmain_name = productmain_name;
        element.productname_name = productname_name;
        element.status = result.data[0].status;
        //element.hstbillingsettingid = result.data[0].hstbillingsettingid;

        this.getOnetimeCostList();

      }
      $('#rowoverlay' + element.id).hide();
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
    return this.datePipe.transform(new Date(deliverydate), 'dd-MM-yyyy');
  }

  change_status(action, element) {
    $('#rowoverlay' + element.id).show();
    const billingsetting_id = element.id;
    (document.getElementById('statusID' + billingsetting_id + '') as any).disabled = true;
    var newstatus = 0;
    var change_status_value: any;
    if (action == 'Active') {

      newstatus = 1;
      change_status_value = {
        status: 1,

      };
    } else {
      newstatus = 0;
      change_status_value = {
        status: 0,

      };
    }

    this.onetimecostService.changeStatus(billingsetting_id, JSON.stringify(change_status_value))
      .subscribe(res => {

        (document.getElementById('statusID' + billingsetting_id + '') as any).disabled = false;

        if ((res != undefined)) {
          if (res['error'] != undefined) {
            $('#statusID' + element.id).prop('checked', (!(1 == newstatus)));
          } else {
            element.status = newstatus;

          }
        } else {
          $('#statusID' + element.id).prop('checked', (!(1 == newstatus)));
        }
        $('#rowoverlay' + element.id).hide();
        this.getOnetimeCostList();

      }, (err) => {
        $('#statusID' + element.id).prop('checked', (!(1 == newstatus)));
        (document.getElementById('statusID' + billingsetting_id + '') as any).disabled = false;
        $('#rowoverlay' + element.id).hide();
        this.toasterservice.showError(err);
      }
      );
  }

}
