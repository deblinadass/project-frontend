import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator} from '@angular/material/paginator';
import { MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Audit, Modification, AuditDataSource } from '../interface/interface';
import { LocationService } from '../_services/location.service';
import { NavigationEnd, Router } from '@angular/router';
import { ProductService } from '../_services/product.service';
import { ToasterService } from '../_services/toastr.service';
declare var $: any;

@Component({
  selector: 'app-auditlogcatalogue',
  templateUrl: './auditlogcatalogue.component.html',
  styleUrls: ['./auditlogcatalogue.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AuditlogcatalogueComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  auditData: Audit[] = [];
  columnsToDisplay = ['action', 'update_date', 'product_type', 'product_name', 'updated_by', 'comment'];
  innerDisplayedColumns = ['field_name', 'old_value', 'new_value'];
  innerDisplayedAddonsColumns = ['name', 'value'];
  excluded_fields = ['ZTVProductID', 'AccessAmountConnection', 'AccessProductID', 'AccessTotalAmount'];
  expandedElement: Audit | null;
  mySubscription: any;
  addons: any;
  ztv_addon_data: any;
  access_addon_data: any;
  access_addon_accesscosevc: any;
  auditlog_data: any;
  auditdata: any;
  dataRemoved:any;
  status:boolean;
  productauditlog:any;

  isExpandable: boolean = false;
  id: String;
  obj: any;
  attributevalue: any;

  @ViewChild('outerSort', { static: true }) outerSort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  //@ViewChildren('innerTables') innerTables: QueryList<MatTable<Address>>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<Modification>>;
  @ViewChild('paginatorAudit', { static: true }) paginatorAudit: MatPaginator;


  @Input() catid: String;

  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private _digitenneservice: ProductService,
    public router: Router,
    private toasterservice: ToasterService,
  ) {

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    }, error => this.toasterservice.showError(error));
      this.id = '0';
  }

  ngOnInit() {
    this.obj = {
      catrefid:'Catalogus ID' ,productgroup:'Groep',producttype:'Type',
      productname: 'Product',
      startdate:'Startdatum',
      enddate:'Einddatum',
      productprice:'Prijs',
      startstaffel:'Startstaffel',
      endstaffel:'Eindstaffel',
      category:'Categorie',
      subcategory:'Subcategorie',
      rtlmemoline:'Rtl Memoline',
      wsmemoline:'Ws Memoline',
      productstatus:'Status'
    }
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  toggleProdcutAuditLogTable() {

    this.isExpandable = !this.isExpandable;

    if (this.isExpandable == true) {
      $('#productAuditLog').show();
      this.getProductAuditLog();
    } else {
      $('#productAuditLog').hide();
    }
  }

  getProductAuditLog() {
    var string = window.location.pathname;
    var segments = string.split("/");
    var last = segments[segments.length - 1];
    if (last == 'access') {
      this.catid = '2'
    } else if (last == 'ztvclassic') {
      this.catid = '3';
    } else if (last == 'internet') {
      this.catid = '4'
    } else if (last == 'eenmaligekosten') {
      this.catid = '5'
    } else {
      this.catid = '1'
    }
    //$('.overlay').show();
    this._digitenneservice.getProductAuditLog(this.id, this.catid).subscribe(
      data => {
        this.auditData = data;
        //$('.overlay').hide();
        this.dataSource = new MatTableDataSource<any>(this.auditData);
        this.dataSource.sort = this.outerSort;
        this.dataSource.paginator = this.paginatorAudit;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'update_date': return new Date(item.update_date);
            default: return item[property];
          }
        };
      }, error => this.toasterservice.showError(error));
  }

  toggleRow(element: Audit) {
      //if(!this.excluded_fields.includes(arrval.field_name))
      element.productauditlog? (this.expandedElement = this.expandedElement === element ? null : element) : null;
      this.cd.detectChanges();
      this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Modification>).sort = this.innerSort.toArray()[index]);
    

  }

  applyFilterAuditLog(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
