import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator} from '@angular/material/paginator';
import { MatDialog} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Audit, Modification, AuditDataSource } from '../interface/interface';
import { OneTimeCostService } from '../_services/onetimecost.service';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../_services/location.service';
import { TicketdialogmailComponent } from '../ticketdialogmail/ticketdialogmail.component';
import { OrderService } from '../_services/order.service';
import { DocumentService } from '../_services/document.service';
import moment from "moment";
import 'moment-timezone';
import FileSaver from 'file-saver';
import { formatDate } from '@angular/common';
import { ToasterService } from '../_services/toastr.service';


declare var $: any;
/**
 * @title Table with expandable rows
 */

@Component({
  selector: 'app-auditlog',
  templateUrl: './auditlog.component.html',
  styleUrls: ['./auditlog.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AuditlogComponent implements OnInit {  
  dataSource: MatTableDataSource<any>;
  auditData: Audit[] = [];
  columnsToDisplay = ['action', 'update_date', 'type', 'product_type', 'updated_by', 'comment', 'popup_action'];
  innerDisplayedColumns = ['field_name', 'old_value', 'new_value'];  
  innerDisplayedAddonsColumns = ['name', 'value'];
  expandedElement: Audit | null;
  mySubscription: any;  
  auditlog_data: any;
  auditdata: any;
  dataRemoved:any;
  status:boolean;
  productauditlog:any;
  isExpandable: boolean = false;
  id: String;
  obj: any;
  attributevalue: any;
  addons: any;
  addonname: any;
  ubprofiledownloadname:any;
  ubprofileuploadname:any;
  productnameList: any;
  MktProductNaam: any;
  macUBDownloadList;
  macUBUploadList;
  

  @ViewChild('outerSort', { static: true }) outerSort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;  
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<Modification>>;
  @ViewChild('paginatorAudit', { static: true }) paginatorAudit: MatPaginator;
  @Input() catid: String;

  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private billingservice: OneTimeCostService,  
    private orderservice: OrderService,  
    public router: Router,
    private _locationservice: LocationService,
    private activatedRoute: ActivatedRoute,
    private api: DocumentService,
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
    
    
    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.id = sessionStorage.getItem('sessionSatelliteID');
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionSatelliteID');
    }
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
      country: 'Land', status: 'Status', Sublocatie: 'Sublocatie', istestlocation: 'Test/demo locatie', sla:'SLA', locationopen:'Locatie open', monitoring:'Monitoring',
      hstorderid: 'HST Billing ID',hstorderid1: 'HST Billing Setting ID', hstbillingsettingid: 'HST Billing Setting ID', sourcesystemorder: 'Bronsysteem', orderidexternal: 'OrderID external', deliverydate: 'Opleverdatum', ordertype: 'Order type',
      productmain: 'Hoofdproduct', productname: 'Productnaam', description: 'Omschrijving', ponumber: 'PO nummer', serviceid: 'ServiceID',
      quantity: 'Aantal', price: 'Prijs', amount: 'Bedrag', billingmonth: 'Bill maand', id: 'ID', regelreferentie: 'Regel Referentie',
	    locationnote: 'Interne aantekening', otcseqid: 'Sequence',
      shortdescription: 'Korte omschrijving', issuetype: 'Incident type', urgency: 'Prioriteit', 
      installprovider: 'Oplosgroep', channel: 'Kanaal', ticketno: 'Ticketnr', solution: 'Oplossing',
      issuestatus: 'Status', issuestate: 'Issue state', plandate:'Plan datum', communicationgroup: 'Communicationgroep',
      billingname: 'Naam Rekeninghouder',  billingaccountownerplace: 'Woonplaats rekeninghouder',
      billingaccountnumber: '(Bank-)Rekeningnummer', billingaccountownerfirstname:'Initialen',
      billingaccountownermiddlename:'Tussenvoegsel', billingaccountownerlastname: 'Achternaam', closeddate: 'Ticket Closeddatum',
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
      orderstate: 'Opdracht status',
	  signdate:'Tekendatum',lastcontactmoment:'Laatste contactmoment',locationinvestigation:'Locatie onderzoek',duration:'Looptijd',purchasedsubscriptions:'Afgenomen abonnementen',initialenddate:'Initiele einddatum'
      ,ponumberrequired:'PO Nummer verplicht bij online bestellen',extensionperiod:'Stilzwijgende verlengings periode',customerservicei:'Klantbediening I',
      enddateextensions:'Einddatum inclusief eventuele verlengingen',customerserviceii:'Klantbediening II',noticeperiod:'Opzegtermijn',segmentationbasedrevenue:'Segmentatie op basis van omzet',cancelbefore:'Opzeggen voor',ebitda:'Ebitda',
      enddatefixed:'Einddatum fixed',strategicvaluehs:'Strategische waarde HS',notescontract:'Opmerkingen contract',paymentbehaviornotes:'Opmerkingen betalingsgedrag',othercomments:'Opmerkingen overig',
      conclusioncustomer:'Conclusie Klantwaarde',changedate:'Datum wijziging',businessmodel:'Business model',hybridsetting:'Hybride instelling',
      scratchcard:'Kraskaarten',onlinemaps:'Online kaarten',creditcard:'Creditcard',payout:'Uitbetalingsfrequentie',blocksize:'Blokgrootte',blockprice:'Blokprijs',discountpercentage:'Kortingpercentage',numberofblocks:'Aantal blokken waarop korting geldt',total:'Totaal',
      revenue:'Omzet',usage:'Gebruik',pos:'POS',positionwebsite:'Positie op website',positionfolder:'Positie in folder',positionmailing:'Positie in mailing',
      MultiServiceContactid: 'Contactpersoon', MultiServiceWishdate: 'Wensdatum',
      MultiServiceContractor: 'Aannemer', MultiServiceChainid: 'Keten',  SSIDname: 'SSID naam',
      MultiServiceSSIDDescription: 'SSID omschrijving',
      MultiserviceWlanSwitchPresent: 'MER Switch aanwezig', MultiserviceWlanInstallContractor: 'Aannemer plaatsen MER Switch', MultiserviceWlanContractor: 'Aannemer',
      MultiserviceWlanUserProfile: 'WLAN gebruikers profiel', MultiserviceWlanSSID: 'SSID naam', MultiserviceWlanSSIDDescription: 'SSID Beschrijving', MultiserviceWlanBroadcastSSID: 'Broadcast SSID',
      MultiserviceWlanEncryptionType: 'Encryptietype', MultiserviceWlanPassphrase: 'Passphrase', MultiserviceWlanHighPriority: 'Hoge prioriteit', MultiserviceWlanContactid: 'Contactpersoon',
      MultiserviceWlanWishdate: 'Wensdatum', MultiserviceWlanDescription: 'Beschrijving',MultiserviceMacWishdate: 'Wensdatum',MultiserviceMacContractor: 'Aannemer', MultiserviceMacRequestType: 'Request Type',MultiserviceMacContactid: 'Contactpersoon',
      MultiserviceRoutedSwitchPresent: 'MER Switch aanwezig', MultiserviceRoutedInstallContractor: 'Aannemer plaatsen MER Switch', MultiserviceRoutedContractor: 'Aannemer', 
      MultiserviceRoutedPlanneddate: 'Geplande datum', MultiserviceRoutedIPaddress: 'IP-adres',MultiserviceRoutedSubnetMask: 'Subnetmask', 
      MultiserviceRoutedContactid: 'Contactpersoon', MultiserviceRoutedWishdate: 'Wensdatum', MultiserviceRoutedDescription	: 'Beschrijving',
      servicenotesinheritance: 'ServiceNotes overnemen',
      contractinheritance: 'Contract overnemen',
      contactinheritance: 'Contact overnemen',
      MKTContactid:'Contactpersoon Naam', MKTContactPersonTelephone:'Contactpersoon Telefoonnumer', 
MKTContactPersonEmail: 'Contactpersoon E-mail', MKTContactPersonFunction: 'Contactpersoon Functie',
SCardContactid:'Contactpersoon Naam', SCardContactPersonTelephone:'Contactpersoon Telefoonnumer', 
SCardContactPersonEmail: 'Contactpersoon E-mail', SCardContactPersonFunction: 'Contactpersoon Functie',
TicketContactid:'Contactpersoon Naam', TicketContactPersonTelephone:'Contactpersoon Telefoonnumer', 
      TicketContactPersonEmail: 'Contactpersoon E-mail', TicketContactPersonFunction: 'Contactpersoon Functie',
      contactperson: 'Contactpersoon Naam', postponeddate:'Monitoring uitgesteld tot', astridticketno:'Astrid ticket nr', contractor: 'Aannemer'
    
    }
    this.getMktProductNameList();
    this.getDownloadName('ubprofiledownload', '7');
    this.ubprofileupload('ubprofiledownload', '7');
    
    

    

   
  }

  getMktProductNameList(){
    this.orderservice.cataloguepropertybygroup('2').subscribe(data3 => {
      this.productnameList = data3;
      
      
    }, error => this.toasterservice.showError(error));
  }

  getDownloadName(ubprofiledownload, catalogueid) {
    this.orderservice.getOrderProperty(ubprofiledownload).subscribe(
      data => {
        this.macUBDownloadList = data;
      }, error => this.toasterservice.showError(error));
  }

  ubprofileupload(ubprofileupload, catalogueid) {
    this.orderservice.getOrderProperty(ubprofileupload).subscribe(
      data => {
        this.macUBUploadList = data;
      }, error => this.toasterservice.showError(error));
  }


  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
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
    if (last == 'eenmaligekosten') {
      this.catid = '5'
    } else if (last == 'mktorder'){
      this.catid = '2'
    }  else{
      this.catid = '7'
    }  
    this.billingservice.getProductAuditLog(this.id, this.catid).subscribe(
      data => {
        this.auditData = data;     
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

  toggleRow(element: Audit, event) {  
    if(event.target.innerText == 'contact_mail'){
      return false;
    }
    let data: any[];
    var addon_json;
    var addonname;
    var ubprofiledownloadname;
    var ubprofileuploadname;
    this.status=false;    
    this.auditlog_data = JSON.parse(JSON.stringify(element.productauditlog));    
    this.dataRemoved = element.productauditlog;
    var index = this.auditlog_data.findIndex(e => e.field_name === 'MktOrderAddon'); 
    var indexMac = this.auditlog_data.findIndex(e => e.field_name === 'MacOrderAddon');
    //var catalogueaddonvalue = this.auditlog_data.findIndex(e => e.field_name === 'MKTAddOnName');
     
    var addon_array = [];
    var mktdata;
    var macdata;
    var productauditlog = [];
    
    if (index != -1) {

      this.addons = JSON.parse(JSON.stringify(this.auditlog_data[index]['new_value']));
      addon_json = element.productauditlog[index]['new_value'];
      mktdata = element.productauditlog[index]['new_value']


      data = JSON.parse(mktdata);


      data.forEach(obj => {

        
      this.addonname = this.productnameList.find(r => r.cataloguepropertytype == '2'
       && r.cataloguepropertyvalue == obj.MKTAddOnName
      ).cataloguepropertyname;
    

        if (obj.MKTAddOnInhoudVerpakking != '' || obj.MKTAddOnMaxBestelbaar != ''|| obj.MKTAddOnAantal !='') {
          if (addonname != '') {
            addon_array.push({ 'name': 'Item', 'value': this.addonname });
            addon_array.push({ 'name': 'Inhoud verpakking', 'value': obj.MKTAddOnInhoudVerpakking });
            addon_array.push({ 'name': 'Max bestelbaar', 'value': obj.MKTAddOnMaxBestelbaar });
            addon_array.push({ 'name': 'Aantal', 'value': obj.MKTAddOnAantal });
          }
          
        }

      });
      
      
      for (var arrval of this.auditlog_data)
      {
         if (arrval.field_name != 'MktOrderAddon' && arrval.field_name != 'MktOrderAmount')
           productauditlog.push({field_name: arrval.field_name, old_value:arrval.old_value, new_value: arrval.new_value, productauditlog: arrval.productauditlog});
      }
      this.productauditlog = productauditlog;
      this.addons = JSON.parse(JSON.stringify(addon_array));
      this.productauditlog ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
      this.cd.detectChanges();
      this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Modification>).sort = this.innerSort.toArray()[index]);
      
    } else if (indexMac != -1) {

      this.addons = JSON.parse(JSON.stringify(this.auditlog_data[indexMac]['new_value']));
      addon_json = element.productauditlog[indexMac]['new_value'];
      macdata = element.productauditlog[indexMac]['new_value']


      data = JSON.parse(macdata);
      console.log(data)


      data.forEach(obj => {

        
        for (let addon of this.macUBDownloadList) {
          if (obj.ubprofiledownload == addon.id) {
            ubprofiledownloadname = addon.name;
          }
        }
        for (let addon of this.macUBUploadList) {
          if (obj.ubprofileupload == addon.id) {
            ubprofileuploadname = addon.name;
          }
        }

        if (obj.macaddress != '' || obj.ubprofiledownload != ''|| obj.ubprofileupload !=''|| obj.enddate !='') {
          if (obj.macaddress !='') {
            addon_array.push({ 'name': 'Mac adres', 'value': obj.macaddress });
            addon_array.push({ 'name': 'Download', 'value': ubprofiledownloadname });
            addon_array.push({ 'name': 'Upload', 'value': ubprofileuploadname });
            addon_array.push({ 'name': 'Einddatum', 'value': (obj.enddate || obj.enddate != null) ? formatDate(obj.enddate, 'dd-MM-yyyy', 'en-US') : '' });
          }
          
        }


      });
      
      
      for (var arrval of this.auditlog_data)
      {
         if (arrval.field_name != 'MacOrderAddon' && arrval.field_name != 'MacOrderAmount')
           productauditlog.push({field_name: arrval.field_name, old_value:arrval.old_value, new_value: arrval.new_value, productauditlog: arrval.productauditlog});
      }
      this.productauditlog = productauditlog;
      this.addons = JSON.parse(JSON.stringify(addon_array));
      this.productauditlog ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
      this.cd.detectChanges();
      this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Modification>).sort = this.innerSort.toArray()[index]);
      
    }else {
      for (var arrval of this.auditlog_data) {
        productauditlog.push({ field_name: arrval.field_name, old_value: arrval.old_value, new_value: arrval.new_value, productauditlog: arrval.productauditlog });
      }
      this.addons = '';
      this.productauditlog = productauditlog;
      this.productauditlog ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
      this.cd.detectChanges();
      this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Modification>).sort = this.innerSort.toArray()[index]);
    }

  }

  applyFilterAuditLog(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  downloadDocument(element){
    var docid=element.documentid;
    var docname = element.comment;
    this.api.downloadDocument(docid)
      .subscribe(response => {
        let file = new Blob([response])
        FileSaver.saveAs(file, docname);
        //this.buttondisabled = false;
       // this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, error => this.toasterservice.showError(error));
  }
}







