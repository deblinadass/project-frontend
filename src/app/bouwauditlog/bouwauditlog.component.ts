import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator} from '@angular/material/paginator';
import { MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Audit, Modification, AuditDataSource, BouwAudit } from '../interface/interface';
import { OneTimeCostService } from '../_services/onetimecost.service';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../_services/location.service';
import { TicketService } from '../_services/ticket.service';
import { OrderService } from '../_services/order.service';
import { TicketdialogmailComponent } from '../ticketdialogmail/ticketdialogmail.component';
import { ToasterService } from '../_services/toastr.service';

declare var $: any;
/**
 * @title Table with expandable rows
 */

@Component({
  selector: 'app-bouwauditlog',
  templateUrl: './bouwauditlog.component.html',
  styleUrls: ['./bouwauditlog.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BouwauditlogComponent implements OnInit {  
  dataSource: MatTableDataSource<any>;
  auditData: BouwAudit[] = [];
  columnsToDisplay = ['action', 'updatedate', 'producttype', 'updatedby', 'comment'];
  innerDisplayedColumns = ['fieldname', 'oldvalue', 'newvalue'];  
  expandedElement: BouwAudit | null;
  mySubscription: any;  
  auditlog_data: any;
  auditdata: any;
  dataRemoved:any;
  status:boolean;
  orderauditlog:any;
  isExpandable: boolean = false;
  id: String;
  obj: any;
  attributevalue: any;

  @ViewChild('outerSort', { static: true }) outerSort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;  
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<Modification>>;
  @ViewChild('paginatorAudit', { static: true }) paginatorAudit: MatPaginator;
  @Input() catid: String;
  @Input() ticketid: number;
  @Input() orderid: number;

  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
   private billingservice: OneTimeCostService,    
    public router: Router,
    private _locationservice: LocationService,
    private _orderservice: OrderService,
    private ticketservice: TicketService,
    private activatedRoute: ActivatedRoute,
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
    
    
    if (sessionStorage.getItem('type') == ''){
		if (sessionStorage.getItem('sessionSatelliteID')) {
		  this.id = sessionStorage.getItem('sessionSatelliteID');
		} else {
		  sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
		  this.id = sessionStorage.getItem('sessionSatelliteID');
		}
	}
	sessionStorage.removeItem('type');
    
  }

  ngOnInit() {    

    this.obj = {
      customerid: 'ID', customername: 'Bedrijfsnaam', housenumber: 'Huisnummer', customertypeid: 'customertypeid',
      btwnumber: 'BTW nummer', clientaccountnumber: 'Klantdebiteurnummer', parentcustomerid: 'parentcustomerid',
      newsitenumber: 'Nieuwe Site Nummer', billingreferenecenumber: 'Billing referentie', salescloudreferencenumber: 'Salescloud Referentienummer',
      kvknumber: 'KvK Nummer', kvkname: 'KvK Naam',filiaalnummer:'Filiaal Nummer', streetname: 'Straatnaam', housenumberaddition: 'Huisnummer Toevoeging',
      postcode: 'Postcode', city: 'Woonplaats', contactpersonname: 'Contactpersoon Naam', contactpersontelephone: 'Contactpersoon Telefoonnumer',
      contactpersonemail: 'Contactpersoon E-mail', contactpersonfunction: 'Contactpersoon Functie', billingmodel: 'Billing Model',
      netcode: 'Netcode', onboardingcompleted: 'Onboarding Afgerond', customertype: 'Locatie type', parentcustomername: 'Hoofdlocatie',
      country: 'Land', status: 'Status', Sublocatie: 'Sublocatie',
      hstorderid: 'HST Billing ID', sourcesystemorder: 'Bronsysteem', orderidexternal: 'OrderID external', deliverydate: 'Opleverdatum', ordertype: 'Order type',
      productmain: 'Hoofdproduct', productname: 'Productnaam', description: 'Omschrijving', ponumber: 'PO nummer', serviceid: 'ServiceID',
      quantity: 'Aantal', price: 'Prijs', amount: 'Bedrag', billingmonth: 'Bill maand', id: 'ID', regelreferentie: 'Regel Referentie',
	    locationnote: 'Interne aantekening', otcseqid: 'Sequence',
      shortdescription: 'Korte omschrijving', issuetype: 'Incident type', urgency: 'Prioriteit', 
      installprovider: 'Oplosgroep', channel: 'Kanaal', ticketno: 'Ticketnr', solution: 'Oplossing',
      issuestatus: 'Status', issuestate: 'Issue state', plandate:'Plan datum', communicationgroup: 'Communicationgroep',
      billingname: 'Naam Rekeninghouder',  billingaccountownerplace: 'Woonplaats rekeninghouder',
      billingaccountnumber: '(Bank-)Rekeningnummer', billingaccountownerfirstname:'Initialen',
      billingaccountownermiddlename:'Tussenvoegsel', billingaccountownerlastname: 'Achternaam',
      description_billing: 'Reden van terugboeking', SCardOrderStatus: 'Orderstatus', remarks: 'Omschrijving',
      SCardOrderType: 'Order Type', ordertrackcode: 'Track&Trace Link', SCardOrderQuantity: 'Aantal',
      SCardOrderRestrictionOnLocation: 'Restrictie op loctie', SCardOrderActivateOnShipment: 'Activatie bij uitlevering',
      SCardOrderValidForLocation: 'Geldig at locatie', SCardOrderShipmentTAV: 'TAV', SCardOrderShipmentStreet: 'Straatnaam',
      SCardOrderShipmentHouseNo: 'Huisnummer', SCardOrderShipmentHouseNoExt: 'Huisnummer toevoeging', SCardOrderShipmentPostalCode: 'Postcode',
      SCardOrderShipmentCity:'Plaatsnaam', SCardOrderShipmentCountry: 'Land', SCardOrderShipmentEmail: 'E-mail',
      SCardOrderActivationDate: 'Activatiedatum', SCardOrderShipmentMode: 'Per Post/ Per Mail', billingstatus: 'Billing status',
      SCardOrderCardType: 'Type Kaarskart', MKTOrderStatus: 'Orderstatus', customerremarks: 'Eigen referentie klant',
      MKTOrderQantity: 'Aantal', MKTOrderType: 'Ordertype',
      MktOrderShipmentTAV: 'Ter attentie van', MktOrderShipmentStreet: 'Straatnaam',
      MktOrderShipmentHouseNo: 'Huisnummer', MktOrderShipmentHouseNoExt: 'Huisnummer toevoeging', MktOrderShipmentPostalCode: 'Postcode',
      MktOrderShipmentCity:'Plaatsnaam', MktOrderShipmentCountry: 'Land', MktOrderUserConfirmationEmail: 'E-mail',
      OrderShipmentMode: 'Per Post/ Per Mail', MktProductNaam: 'Product', MKTAddOnName:'Item',
      MKTAddOnInhoudVerpakking:'Inhoud verpakking', MKTAddOnMaxBestelbaar:'Max bestelbaar',MKTAddOnAantal:'Aantal',
      macaddress: 'Mac adres', userbandwidth_id:'Gebruikersprofiel',  remark: 'Opmerking',gender: 'Geslacht',contactpersonlastname: 'Achternaam',contactpersonfirstname:'Voornaam',contactpersondescription:'Opmerking',newsletter:'Nieuwsbrief',nps:'NPS',
      report:'Rapportage',inheritance:'Automatisch overerven naar sublocaties',mijn:'Mijn',mijn1:'Mijn Role 1',mijn2:'Mijn Role 2',mijn3:'Mijn Role 3',mijn4:'Mijn Role 4',mijn5:'Mijn Role 5',
      exceptiondate: 'Uitzondering Datum', dayofweek: 'Dag', isclosed: 'Gesloten', opening: 'Opening', closing: 'Sluitend', recurring:'Elk jaar',comarchcustomerid:'Comarch Klantnummer',comarchinvoiceaccountid:'Comarch Factuur account',comarchcontract:'Comarch Contract',comarchkrn:'Comarch KRN',
      chainid:'Keten',accountmanagerid:'Accountmanager',locationtypeid:'locationtype', SCardOrderPrice: 'Prijs', SCardOrderTotalPrice: 'Bedrag',
      ubprofile: 'Gebruikersprofiel', ubprofiletype: 'Gebruikersprofiel Type', ubprofiledownload: 'Download', ubprofileupload: 'Upload',
      startdate: 'Startdatum', enddate:'Einddatum', periodic:'Termijn', invoicereference:'Factuur referentie', regelreference:'Regelreferentie',calculationrule:'Rekenregel', settlement:'Verrekening',
      BOUWOrderContactid: 'Contactpersoon',
      BOUWOrderWishdate:'Wensdatum',
      BOUWOrderContractor:'Aannemer',
      BOUWOrderPlanneddate:'Geplande datum',
      BOUWProgressNotification:'Voortgangsmelding',
      BOUWOrderCabling:'Bekabeling',
      BOUWSOStartpacket:'Startpakket',
      BOUWSOConnection:'Aansluiting',
      BOUWSOTelephonenumber:'Telefoonnummer',
      BOUWSOPlaceisrapoint:'Plaats ISRA punt',
      BOUWSOLinequantity:'Aantal lijnen',
      BOUWSOrderContractor:'Aannemer',
      BOUWSOrderWishdate:'Wensdatum',
      BOUWSODescription:'Omschrijving',
      BOUWOrderCoverage:'Dekking',
      BOUWOrderTerminationReason:'Reden van opheffing',
      orderstate: 'Opdracht status'
    }
   
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  toggleBouwAuditLogTable(orderid) {

    this.isExpandable = !this.isExpandable;

    if (this.isExpandable == true) {
      $('#orderauditlog').show();
      this.getbouwauditlog(orderid);
    } else {
      $('#orderauditlog').hide();
    }
  }  

  openDialogShow(action,mailid) {
    const dialogRef = this.dialog.open(TicketdialogmailComponent, {
      width: '300px',
      data: { locationid: this.id, mailid:mailid, action: action }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        //this.getProductList();
      }
    }, error => this.toasterservice.showError(error));

  }

  
 

  getbouwauditlog(orderid) {
    var string = window.location.pathname;
    var segments = string.split("/");
    var last = segments[segments.length - 1];
    
     
    this._orderservice.getBouwAuditLog(orderid).subscribe(
      data => {
        this.auditData = data; 
        this.dataSource = new MatTableDataSource<any>(this.auditData);
        this.dataSource.sort = this.outerSort;
        this.dataSource.paginator = this.paginatorAudit;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'updatedate': return new Date(item.updatedate);
            default: return item[property];
          }
        };
      }, error => this.toasterservice.showError(error));
  }

  toggleRow(element: BouwAudit, event) {    
    if(event.target.innerText == 'contact_mail'){
      return false;
    }
    this.status=false;    
    this.auditlog_data = JSON.parse(JSON.stringify(element.orderauditlog));    
    this.dataRemoved = element.orderauditlog;    
    var orderauditlog = [];
    for (var arrval of this.auditlog_data)
    {
      orderauditlog.push({fieldname: arrval.fieldname, oldvalue:arrval.oldvalue, newvalue: arrval.newvalue, orderauditlog: arrval.orderauditlog});
    } 
      this.orderauditlog = orderauditlog;
      this.orderauditlog? (this.expandedElement = this.expandedElement === element ? null : element) : null;
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







