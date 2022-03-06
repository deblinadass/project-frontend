import { Component, OnInit, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { LocationAudit, Modification } from '../interface/interface';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LocationService } from '../_services/location.service';
import { ToasterService } from '../_services/toastr.service';
declare var $: any;

@Component({
  selector: 'app-auditlogchain',
  templateUrl: './auditlogchain.component.html',
  styleUrls: ['./auditlogchain.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AuditlogchainComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  auditData: LocationAudit[] = [];
  columnsToDisplay = ['action', 'update_date', 'location_type', 'updated_by', 'comment'];
  innerDisplayedColumns = ['field_name', 'old_value', 'new_value'];
  expandedElement: LocationAudit | null;
  id : String;
  obj:any;
  
  @ViewChild('outerSort', { static: true }) outerSort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  //@ViewChildren('innerTables') innerTables: QueryList<MatTable<Address>>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<Modification>>;
  @ViewChild('paginatorAudit', { static: true }) paginatorAudit: MatPaginator;
  
  /*@ViewChild('outerSort', {static: false}) set content(outerSort: MatSort) {
    this.dataSource.sort = outerSort;
  }*/
  
  isExpandable: boolean = false;

  constructor(
    public router: Router,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private _locationservice: LocationService,
    private toasterservice: ToasterService,
  ) { 
    

  }

   ngOnInit() {
    this.obj = {customerid: 'ID', customername:'Bedrijfsnaam', btwnumber:'BTW nummer', kvkname:'KvK Naam', kvknumber:'KvK Nummer',
    streetname:'Straatnaam',housenumber:'Huisnummer', housenumberaddition:'Huisnummer Toevoeging',postcode:'Postcode',city:'Woonplaats',
    country:'Land',chainid:'Chain',accountmanagerid:'Accountmanager',locationtypeid:'Locationtype',billingmodel:'Billing Model',
    onboardingcompleted:'Onboarding Afgerond', clientaccountnumber:'Klantdebiteurnummer',
    newsitenumber:'Nieuwe Site Nummer',ponumber: 'PO-nummer', parentcustomerid:'parentcustomerid', billingreferenecenumber:'Billing referentie',  
    customertype:'Locatie type',parentcustomername:'Hoofdlocatie',  status:'Status', regelreferentie: 'Regel Referentie', locationnote: 'Interne aantekening',
    chainname:'Keten Naam'}
    
  }

  toggleProdcutAuditLogTable()
  {
	  
	  this.isExpandable = !this.isExpandable;
	  
	  if(this.isExpandable == true)
	  {
		  $('#locationAuditLog').show();
		  this.getLocationAuditLog();
	  }else{
		 $('#locationAuditLog').hide(); 
	  }
  }
  
  
 getLocationAuditLog()
  {
		  this._locationservice.getChainAuditLog().subscribe(
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

			//this.dataSourceMulti = new MatTableDataSource<any>(this.locations_list);
		  }, error => this.toasterservice.showError(error));
	  //}
  } 




/*
  toggleRow(element: User) {
    element.addresses && (element.addresses as MatTableDataSource<Address>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Address>).sort = this.innerSort.toArray()[index]);
  }

  applyFilter(filterValue: string) {
    this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Address>).filter = filterValue.trim().toLowerCase());
  }*/
  /***** Nested Table *******/
 
  toggleRow(element: LocationAudit) {
    element.locationauditlog  ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
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
