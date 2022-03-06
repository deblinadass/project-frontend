import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Audit, Modification, AuditDataSource, TicketAudit, MKTorderAudit } from '../interface/interface';
import { OneTimeCostService } from '../_services/onetimecost.service';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../_services/location.service';
//import { TicketService } from '../_services/ticket.service';
//import { TicketdialogmailComponent } from '../ticketdialogmail/ticketdialogmail.component';
import { OrderService } from '../_services/order.service';
import { ToasterService } from '../_services/toastr.service';


declare var $: any;
/**
 * @title Table with expandable rows
 */

@Component({
  selector: 'app-mktorderauditlog',
  templateUrl: './mktorderauditlog.component.html',
  styleUrls: ['./mktorderauditlog.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MKTorderauditlogComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  auditData: MKTorderAudit[] = [];
  columnsToDisplay = ['action', 'update_date', 'product_type', 'updated_by', 'comment', 'popup_action'];
  innerDisplayedColumns = ['field_name', 'old_value', 'new_value'];
  expandedElement: MKTorderAudit | null;
  mySubscription: any;
  auditlog_data: any;
  auditdata: any;
  dataRemoved: any;
  status: boolean;
  locationauditlog: any;
  isExpandable: boolean = false;
  id: String;
  obj: any;
  attributevalue: any;
  addons: any;
  addonname: any;
  productnameList: any;

  @ViewChild('outerSort', { static: true }) outerSort: MatSort;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort>;
  @ViewChildren('innerTables') innerTables: QueryList<MatTable<Modification>>;
  @ViewChild('paginatorAudit', { static: true }) paginatorAudit: MatPaginator;
  @Input() catid: String;
  @Input() hstorderid: number;



  constructor(
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private billingservice: OneTimeCostService,
    public router: Router,
    private _locationservice: LocationService,
    //private ticketservice: TicketService,
    private activatedRoute: ActivatedRoute,
    private orderservice: OrderService,
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


    if (sessionStorage.getItem('type') == '') {
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
      kvknumber: 'KvK Nummer', kvkname: 'KvK Naam', streetname: 'Straatnaam', housenumberaddition: 'Huisnummer Toevoeging',
      postcode: 'Postcode', city: 'Woonplaats', contactpersonname: 'Contactpersoon Naam', contactpersontelephone: 'Contactpersoon Telefoonnumer',
      contactpersonemail: 'Contactpersoon E-mail', contactpersonfunction: 'Contactpersoon Functie', billingmodel: 'Billing Model',
      netcode: 'Netcode', onboardingcompleted: 'Onboarding Afgerond', customertype: 'Locatie type', parentcustomername: 'Hoofdlocatie',
      country: 'Land', status: 'Status', Sublocatie: 'Sublocatie',
      hstorderid: 'HST BillingID', sourcesystemorder: 'Bronsysteem', orderidexternal: 'OrderID external', deliverydate: 'Opleverdatum', ordertype: 'Order type',
      productmain: 'Hoofdproduct', productname: 'Productnaam', description: 'Omschrijving', ponumber: 'PO nummer', serviceid: 'ServiceID',
      quantity: 'Aantal', price: 'Prijs', amount: 'Bedrag', billingmonth: 'Bill maand', id: 'ID', regelreferentie: 'Regel Referentie',
      locationnote: 'Interne aantekening', otcseqid: 'Sequence',
      shortdescription: 'Korte omschrijving', issuetype: 'Incident type', urgency: 'Prioriteit',
      installprovider: 'Oplosgroep', channel: 'Kanaal', ticketno: 'Ticketnr', solution: 'Oplossing',
      issuestatus: 'Status', issuestate: 'Issue state', plandate: 'Plan datum', communicationgroup: 'Communicationgroep',
      billingname: 'Naam Rekeninghouder', billingaccountownerplace: 'Woonplaats rekeninghouder',
      billingaccountnumber: '(Bank-)Rekeningnummer', billingaccountownerfirstname: 'Initialen',
      billingaccountownermiddlename: 'Tussenvoegsel', billingaccountownerlastname: 'Achternaam',
      description_billing: 'Reden van terugboeking',
      MKTOrderType: 'Order Type', MKTOrderQantity: 'Aantal',
      MktOrderShipmentTAV: 'TAV', MktOrderShipmentStreet: 'Street',
      MktOrderShipmentHouseNo: 'House nummer', MktOrderShipmentHouseNoExt: 'House Ext', MktOrderShipmentPostalCode: 'Postal code',
      MktOrderShipmentCity: 'City', MktOrderShipmentCountry: 'Country', MktOrderUserConfirmationEmail: 'E-mail',
      OrderShipmentMode: 'Per Post/ Per Mail', MktProductNaam: 'Product', MKTAddOnName: 'Add-on',
      MKTAddOnInhoudVerpakking: 'Inhoud verpakking', MKTAddOnMaxBestelbaar: 'Max bestelbaar', MKTAddOnAantal: 'Aantal'
    }

    this.getMktProductNameList();


  }

  getMktProductNameList() {
    this.orderservice.cataloguepropertybygroup('2').subscribe(data3 => {
      this.productnameList = data3;

    }, error => this.toasterservice.showError(error));
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  toggleProdcutAuditLogTable(hstorderid) {

    this.isExpandable = !this.isExpandable;

    if (this.isExpandable == true) {
      $('#locationauditlog').show();
      this.getlocationauditlog(hstorderid);
    } else {
      $('#locationauditlog').hide();
    }
  }






  getlocationauditlog(hstorderid: any) {
    var string = window.location.pathname;
    var segments = string.split("/");
    var last = segments[segments.length - 1];


    this._locationservice.getMKTorderAuditLog(hstorderid).subscribe(
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
  toggleRow(element: MKTorderAudit, event) {
    if (event.target.innerText == 'contact_mail') {
      return false;
    }
    let data: any[];
    var addon_json;
    var addonname;
    this.status = false;
    this.auditlog_data = JSON.parse(JSON.stringify(element.locationauditlog));
    this.dataRemoved = element.locationauditlog;
    var index = this.auditlog_data.findIndex(e => e.field_name === 'MktOrderAddon');
    //var catalogueaddonvalue = this.auditlog_data.findIndex(e => e.field_name === 'MKTAddOnName'); 

    var addon_array = [];
    var mktdata;
    var locationauditlog = [];

    if (index != -1) {

      this.addons = JSON.parse(JSON.stringify(this.auditlog_data[index]['new_value']));
      addon_json = element.locationauditlog[index]['new_value'];
      mktdata = element.locationauditlog[index]['new_value']


      data = JSON.parse(mktdata);


      data.forEach(obj => {


        this.addonname = this.productnameList.find(r => r.cataloguepropertytype == '2'
          && r.cataloguepropertyvalue == obj.MKTAddOnName
        ).cataloguepropertyname;


        if (obj.MKTAddOnInhoudVerpakking != '' || obj.MKTAddOnMaxBestelbaar != '' || obj.MKTAddOnAantal != '') {
          if (addonname != '') {
            addon_array.push({ 'name': 'Add-on', 'value': this.addonname });
            addon_array.push({ 'name': 'Inhoud verpakking', 'value': obj.MKTAddOnInhoudVerpakking });
            addon_array.push({ 'name': 'Max bestelbaar', 'value': obj.MKTAddOnMaxBestelbaar });
            addon_array.push({ 'name': 'Aantal', 'value': obj.MKTAddOnAantal });
          }



        }


      });


      for (var arrval of this.auditlog_data) {
        if (arrval.field_name != 'MktOrderAddon' && arrval.field_name != 'MktOrderAmount')
          locationauditlog.push({ field_name: arrval.field_name, old_value: arrval.old_value, new_value: arrval.new_value, productauditlog: arrval.productauditlog });
      }
      this.locationauditlog = locationauditlog;
      this.addons = JSON.parse(JSON.stringify(addon_array));
      this.locationauditlog ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
      this.cd.detectChanges();
      this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Modification>).sort = this.innerSort.toArray()[index]);

    } else {
      for (var arrval of this.auditlog_data) {
        locationauditlog.push({ field_name: arrval.field_name, old_value: arrval.old_value, new_value: arrval.new_value, productauditlog: arrval.productauditlog });
      }
      this.addons = '';
      this.locationauditlog = locationauditlog;
      this.locationauditlog ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
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
}







