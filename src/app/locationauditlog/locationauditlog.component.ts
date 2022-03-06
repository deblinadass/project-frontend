
import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator} from '@angular/material/paginator';
import { MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {  Audit, Modification, AuditDataSource,LocationAudit } from '../interface/interface';
import { LocationService } from '../_services/location.service';
//import { DigitenneService } from '../_services/digitenne.service';
import { Router } from '@angular/router';
import { ToasterService } from '../_services/toastr.service';
declare var $: any;

@Component({
  selector: 'app-locationauditlog',
  templateUrl: './locationauditlog.component.html',
  styleUrls: ['./locationauditlog.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LocationauditlogComponent implements OnInit {

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
    
    //this.id = this.router.getCurrentNavigation().extras.state.id;
	sessionStorage.removeItem('sessionSatelliteID')
	if(sessionStorage.getItem('sessionMainID')){
		this.id = sessionStorage.getItem('sessionMainID');
	}else{
		//this.id = this.router.getCurrentNavigation() ? this.router.getCurrentNavigation().extras.state.id : '';
		//sessionStorage.setItem(this.sessionID, this.router.getCurrentNavigation().extras.state.id);
		sessionStorage.setItem('sessionMainID', this.router.getCurrentNavigation().extras.state.id);
		this.id = sessionStorage.getItem('sessionMainID');
	}
  }

   ngOnInit() {
    this.obj = {customerid: 'ID', customername:'Bedrijfsnaam', btwnumber:'BTW nummer', kvkname:'KvK Naam', kvknumber:'KvK Nummer',
    filiaalnummer:'Filiaal Nummer',streetname:'Straatnaam',housenumber:'Huisnummer', housenumberaddition:'Huisnummer Toevoeging',postcode:'Postcode',city:'Woonplaats',
    country:'Land',chainid:'Chain',accountmanagerid:'Accountmanager',locationtypeid:'Locationtype',billingmodel:'Billing Model',
    onboardingcompleted:'Onboarding Afgerond', clientaccountnumber:'Klantdebiteurnummer',
    newsitenumber:'Nieuwe Site Nummer',billingid:'Billing ID',ponumber: 'PO-nummer', parentcustomerid:'parentcustomerid', billingreferenecenumber:'Billing referentie',  
    customertype:'Locatie type',parentcustomername:'Hoofdlocatie',  status:'Status', regelreferentie: 'Regel Referentie', locationnote: 'Interne aantekening',
    istestlocation: 'Test/demo locatie', sla:'SLA', locationopen:'Locatie open', monitoring:'Monitoring',
    servicenotesinheritance: 'ServiceNotes overnemen', contractinheritance: 'Contract overnemen', contactinheritance: 'Contact overnemen',
    shortdescription: 'Korte omschrijving', issuetype: 'Incident type', urgence: 'Prioriteit', 
    installprovider: 'Oplosgroep', channel: 'Kanaal', ticketno: 'Ticketnr', solution: 'Oplossing',
    issuestatus: 'Status', issuestate: 'Issue state', plandate:'Plan datum', communicationgroup: 'Communicationgroep',
    contactpersonname: 'Contactpersoon Naam', contactpersontelephone: 'Contactpersoon Telefoonnumer',
    contactpersonemail: 'Contactpersoon E-mail', contactpersonfunction: 'Contactpersoon Functie',gender: 'Geslacht',contactpersondescription:'Opmerking',newsletter:'Nieuwsbrief',nps:'Nps',
    report:'Rapportage',inheritance:'Automatisch overerven naar sublocaties',contactpersonlastname: 'Achternaam',contactpersonfirstname:'Voornaam',id: 'ID',
    comarchcustomerid:'Comarch Klantnummer',comarchinvoiceaccountid:'Comarch Factuur account',comarchcontract:'Comarch Contract',comarchkrn:'Comarch KRN'
	,signdate:'Tekendatum',lastcontactmoment:'Laatste contactmoment',locationinvestigation:'Locatie onderzoek',duration:'Looptijd',purchasedsubscriptions:'Afgenomen abonnementen',initialenddate:'Initiele einddatum'
    ,ponumberrequired:'PO Nummer verplicht bij online bestellen',extensionperiod:'Stilzwijgende verlengings periode',customerservicei:'Klantbediening I',
    enddateextensions:'Einddatum inclusief eventuele verlengingen',customerserviceii:'Klantbediening II',noticeperiod:'Opzegtermijn',segmentationbasedrevenue:'Segmentatie op basis van omzet',cancelbefore:'Opzeggen voor',ebitda:'Ebitda',
    enddatefixed:'Einddatum fixed',strategicvaluehs:'Strategische waarde HS',notescontract:'Opmerkingen contract',paymentbehaviornotes:'Opmerkingen betalingsgedrag',othercomments:'Opmerkingen overig',
    conclusioncustomer:'Conclusie Klantwaarde',changedate:'Datum wijziging',businessmodel:'Business model',hybridsetting:'Hybride instelling',
    scratchcard:'Kraskaarten',onlinemaps:'Online kaarten',creditcard:'Creditcard',payout:'Uitbetalingsfrequentie',blocksize:'Blokgrootte',blockprice:'Blokprijs',discountpercentage:'Kortingpercentage',numberofblocks:'Aantal blokken waarop korting geldt',total:'Totaal',
    revenue:'Omzet',usage:'Gebruik',pos:'POS',positionwebsite:'Positie op website',positionfolder:'Positie in folder',positionmailing:'Positie in mailing',startdate: 'Startdatum',
    MKTContactid:'Contactpersoon Naam', MKTContactPersonTelephone:'Contactpersoon Telefoonnumer', 
    MKTContactPersonEmail: 'Contactpersoon E-mail', MKTContactPersonFunction: 'Contactpersoon Functie',
    SCardContactid:'Contactpersoon Naam', SCardContactPersonTelephone:'Contactpersoon Telefoonnumer', 
    SCardContactPersonEmail: 'Contactpersoon E-mail', SCardContactPersonFunction: 'Contactpersoon Functie',
    TicketContactid:'Contactpersoon Naam', TicketContactPersonTelephone:'Contactpersoon Telefoonnumer', 
    TicketContactPersonEmail: 'Contactpersoon E-mail', TicketContactPersonFunction: 'Contactpersoon Functie',
    contactperson: 'Contactpersoon Naam', postponeddate:'Monitoring uitgesteld tot', astridticketno:'Astrid ticket nr', contractor: 'Aannemer'
  
  }
    
  }
  
  ngAfterViewInit() {
    //this.dataSource.sort = this.outerSort;
	//this.dataSource.paginator = this.paginatorAudit; 
	
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
    //$('.overlay').show();
	  
	  /*this.isExpandable = !this.isExpandable;
	  if(this.isExpandable){*/
		  //$('.overlay').show();
		  this._locationservice.getAuditLog(this.id).subscribe(
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
