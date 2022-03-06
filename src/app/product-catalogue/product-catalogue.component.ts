import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CataloguedialogBoxComponent } from '../cataloguedialog-box/cataloguedialog-box.component';
import { DatePipe } from '@angular/common';
import { routerTransition } from '../router.animations';
import { ProductService } from '../_services/product.service';
import { formatDate } from '@angular/common';
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
  selector: 'app-product-catalogue',
  templateUrl: './product-catalogue.component.html',
  styleUrls: ['./product-catalogue.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    routerTransition()
  ],
})

export class ProductCatalogueComponent implements OnInit, AfterViewInit {
  locations_list_table: any[] = [];
  satellite_id;
  location_details: any;
  locations_list: any;
  product_list: any;
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

  oneTimeCostProduct: any[] = [];
  invoiceOneTimeCostProduct: any[] = [];
  expandedElement: any[] = [];
  otcsecondlevel: any[] = [];
  invoiceotcsecondlevel: any[] = [];
  ordertypeList: any[];
  productmainList: any[];
  productnameList: any[];
  billingmonthList: any[];
  catalogueproperty: any;
  tabSectionList: any[] = [];

  displayedonetimecostColumns: string[] = ['catrefid', 'productgroup', 'producttype', 'productname', 'startdate', 'enddate', 'productprice', 'locationids', 'productstatus', 'action', 'overlayrow'];
  dataSourceOneTimeCost = new MatTableDataSource<OneTimeCostListModel>();

  @ViewChild('onetimecostSort', { static: true }) onetimecostSort: MatSort;
  @ViewChild('paginatorOneTimeCost', { static: true }) paginatorOneTimeCost: MatPaginator;

  routerCurrentURL;

  constructor(
    public router: Router,
    private productcatalogueservice: ProductService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private api: ProductService,
    public _commonService: CommonService,
    private toasterservice: ToasterService,
  ) {
    this.tabSectionList = this._commonService.getSectionList('CatalogueTab');

  }

  ngOnInit(): void {
    this.dataSourceOneTimeCost.paginator = this.paginatorOneTimeCost;
    this.dataSourceOneTimeCost.sort = this.onetimecostSort;
    this.getProductCatalogueList();

  }
  ngAfterViewInit(): void {

  }

  applyFilterOneTimeCost(filterValue: string) {
    this.dataSourceOneTimeCost.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceOneTimeCost.paginator) {
      this.dataSourceOneTimeCost.paginator.firstPage();
    }
  }

  getProductCatalogueList() {
    this.loading = true;
    this.api.getProductCatalogueList().subscribe(
      data => {
        this.oneTimeCostProduct = [];
        this.product_list = data;
        this.api.getProductCatalogueProperty().subscribe(data => {
          this.catalogueproperty = data;
          for (let product of this.product_list) {
            this.otcsecondlevel = [];
            var productgroupvalue: '';
            var producttypevalue: '';
            var productnamevalue: '';
            for (let cataloguepropertysingle of this.catalogueproperty) {
              if (product.productgroup == cataloguepropertysingle.cataloguepropertyvalue && cataloguepropertysingle.catalogueproperty == 'productgroup')
                productgroupvalue = cataloguepropertysingle.cataloguepropertyname;

              if (product.producttype == cataloguepropertysingle.cataloguepropertyvalue && cataloguepropertysingle.catalogueproperty == 'producttype')
                producttypevalue = cataloguepropertysingle.cataloguepropertyname;

              if (product.productname == cataloguepropertysingle.cataloguepropertyvalue && cataloguepropertysingle.catalogueproperty == 'productname'
                && cataloguepropertysingle.cataloguepropertygroup == product.productgroup && cataloguepropertysingle.cataloguepropertytype == product.producttype)
                productnamevalue = cataloguepropertysingle.cataloguepropertyname;
            }

            var rtlmemolinename = (product.productgroup == '1') ? this.catalogueproperty.find(r =>
              r.catalogueproperty == 'productmemoline' && r.cataloguepropertyvalue == product.rtlmemoline
            ).cataloguepropertyname : product.rtlmemoline;

            this.otcsecondlevel.push(
              {
                name: 'RTL Memoline',
                value: rtlmemolinename
              },
              {
                name: 'Opmerking',
                value: product.productdescription
              },
            );

            this.oneTimeCostProduct.push(
              {
                id: product.id,
                catrefid: product.catrefid,
                productgroup: productgroupvalue,
                producttype: producttypevalue,
                productname: productnamevalue,
                productgroupid: product.productgroup,
                producttypeid: product.producttype,
                productnameid: product.productname,
                rtlmemoline: product.rtlmemoline,
                rtlmemolinename: rtlmemolinename,
                wsmemoline: product.wsmemoline,
                startdate: product.startdate ? formatDate(product.startdate, 'dd-MM-yyyy', 'en-US') : '',
                enddate: (product.enddate == null || product.enddate == '2099-12-31') ? '' : formatDate(product.enddate, 'dd-MM-yyyy', 'en-US'),
                startdateEdit: product.startdate,
                enddateEdit: (product.enddate == null || product.enddate == '2099-12-31') ? null : formatDate(product.enddate, 'yyyy-MM-dd', 'en-US'),
                productstatus: product.productstatus,
                productstatusvalue: product.productstatus,
                productprice: product.productprice,
                productdescription: product.productdescription,
                locationids: product.locationids,
                secondlevel: this.otcsecondlevel
              }
            );
          }

          this.loading = false;
          this.dataSourceOneTimeCost = new MatTableDataSource<any>(this.oneTimeCostProduct);
          this.dataSourceOneTimeCost.sort = this.onetimecostSort;
          this.dataSourceOneTimeCost.paginator = this.paginatorOneTimeCost;

        }, error => this.toasterservice.showError(error));

      }, error => this.toasterservice.showError(error));
  }

  openDialogAdd(action) {
    const dialogRef = this.dialog.open(CataloguedialogBoxComponent, {
      width: '60%',
      data: { locationid: this.satellite_id, action: 'Add' }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getProductCatalogueList();
      }
    }, error => this.toasterservice.showError(error));
  }
  openDialog(action, obj) {
    obj.action = action;

    const dialogRef = this.dialog.open(CataloguedialogBoxComponent, {
      width: '60%',
      data: obj, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {
        this.getProductCatalogueList();
      }
    }, error => this.toasterservice.showError(error));
  }

  openDialogEdit(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    const dialogRef = this.dialog.open(CataloguedialogBoxComponent, {
      width: '60%',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {

        element.id = result.data[0].id;
        element.locationids = result.data[0].locationids;
        element.catrefid = result.data[0].catrefid;
        element.productgroup = result.data[0].productgroup;
        element.producttype = result.data[0].producttype;
        element.productname = result.data[0].productname;
        element.productgroupid = result.data[0].productgroupid;
        element.producttypeid = result.data[0].producttypeid;
        element.productnameid = result.data[0].productnameid;
        element.startdate = result.data[0].startdate;
        element.enddate = result.data[0].enddate;
        element.startdateEdit = result.data[0].startdateEdit;
        element.enddateEdit = result.data[0].enddateEdit;
        element.rtlmemoline = result.data[0].rtlmemoline;
        element.rtlmemolinename = result.data[0].rtlmemolinename;
        element.wsmemoline = result.data[0].wsmemoline;
        element.productstatus = result.data[0].productstatus;
        element.productstatusvalue = result.data[0].productstatusvalue;
        element.productprice = result.data[0].productprice;
        element.secondlevel[0].value = result.data[0].rtlmemolinename;
        element.secondlevel[1].value = result.data[0].productdescription;
        //element.secondlevel[2].value = result.data[0].wsmemoline;

      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }

  change_status(action, element) {
    $('#rowoverlay' + element.id).show();
    const productinstallbase_id = element.id;
    (document.getElementById('statusID' + productinstallbase_id + '') as any).disabled = true;
    var newstatus = 0;
    var change_status_value: any;
    if (action == 'Active') {

      newstatus = 1;
      change_status_value = {
        productstatus: 1
      };
    } else {
      newstatus = 0;
      change_status_value = {
        productstatus: 0
      };
    }

    this.api.changeCatalogueStatus(productinstallbase_id, JSON.stringify(change_status_value))
      .subscribe(res => {

        (document.getElementById('statusID' + productinstallbase_id + '') as any).disabled = false;

        if ((res != undefined)) {
          if (res['error'] != undefined && res['error'] != '1028') {
            $('#statusID' + element.id).prop('checked', (!(1 == newstatus)));
          } else {
            element.productstatus = newstatus;
          }
        } else {
          $('#statusID' + element.id).prop('checked', (!(1 == newstatus)));
        }
        $('#rowoverlay' + element.id).hide();
      }, (err) => {
        (document.getElementById('statusID' + productinstallbase_id + '') as any).disabled = false;
        $('#rowoverlay' + element.id).hide();
        this.toasterservice.showError(err);
      }
      );
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

  formatdatemst(deliverydate) {
  }
}