import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ProductService } from '../_services/product.service';
import { HttpClient } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ModalService } from '../modal/modal.service';
import { TicketdialogBoxComponent } from '../ticketdialog-box/ticketdialog-box.component';

import { BillingTicketdialogBoxComponent } from '../billing-ticketdialog-box/billing-ticketdialog-box.component';
import { AdministrativeTicketdialogBoxComponent } from '../administrative-ticketdialog-box/administrative-ticketdialog-box.component';
import { MonitoringTicketdialogBoxComponent } from '../monitoringticketdialog-box/monitoringticketdialog-box.component';

import { TicketService } from '../_services/ticket.service';
import { AuthenticationService } from '../_services/authentication.service';
import moment from "moment";
import 'moment-timezone';
moment.tz.setDefault('Europe/Amsterdam');
import { ToasterService } from '../_services/toastr.service';
import { formatDate } from '@angular/common';
import { CommonService } from '../_services/common.service';
import { LocationService } from '../_services/location.service';

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
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class TicketsComponent implements OnInit, AfterViewInit {
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
  statusVal;

  location_name;
  locationparentcustomerid;
  displayedticketColumns: string[] = ['incidentid', 'creationdate', 'closeddate', 'currentstatename', 'installprovider', 'issuetype', 'urgency', 'shortdescription', 'action'];
  dataSourceTicket = new MatTableDataSource<any[]>();

  ticketList: any[] = [];
  ticketsecondlevel: any[] = [];
  ticketproperty: any;
  issuestatelist: any;
  urgency;
  issuetype;
  channel;
  installprovider;
  nocuser;
  tabSectionList: any[] = [];
  locationcountry: any;
  locationproperty: any[];
  @ViewChild('ticketSort', { static: true }) ticketSort: MatSort;
  @ViewChild('paginatorTicket', { static: true }) paginatorTicket: MatPaginator;

  constructor(
    public router: Router,
    private _Activatedroute: ActivatedRoute,
    private _locationService: LocationService,
    private _productService: ProductService,
    private cd: ChangeDetectorRef,
    private modalService: ModalService,
    public dialog: MatDialog,
    private api: TicketService, private http: HttpClient,
    private authenticationservice: AuthenticationService,
    private toasterservice: ToasterService,
    public _commonService: CommonService
  ) {

    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.id = sessionStorage.getItem('sessionSatelliteID');
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionSatelliteID');
    }

    this.tabSectionList = this._commonService.getSectionList('TicketTab');
  }

  ngOnInit() {
    this.nocuser = this.authenticationservice.isNOCUser();
    this.superuser = this.authenticationservice.isSuperUser();
    this.getPropertyAll();
    this.getTicketList();

    this._locationService.location_details(this.id).subscribe(
      data => {
        this.location_details = data;
        this.location_name = data.customername;
        this.locationparentcustomerid = data.parentcustomerid;
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

  applyFilterTicket(filterValue: string) {
    this.dataSourceTicket.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceTicket.paginator) {
      this.dataSourceTicket.paginator.firstPage();
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

  getTicketList() {
    this.loading = true;
    this.api.getLocationTicketList(this.id).subscribe(
      data => {
        this.ticketList = [];
        this.ticket_list = data;
        this.api.getTicketProperty().subscribe(data => {
          this.ticketproperty = data;
          this.api.getStateList().subscribe(data1 => {
            this.issuestatelist = data1;

            for (let ticket of this.ticket_list) {
              this.ticketsecondlevel = [];

              this.urgency = this.ticketproperty.find(r =>
                r.issueattribute == 'urgency' && r.issuepropertyvalue == ticket.urgency
              ).issuepropertyname;

              this.issuetype = this.ticketproperty.find(r =>
                r.issueattribute == 'issuetype' && r.issuepropertyvalue == ticket.issuetype
              ).issuepropertyname;
              if (ticket.issuetype != '70') {
                this.channel = this.ticketproperty.find(r =>
                  r.issueattribute == 'channel' && r.issuepropertyvalue == ticket.channel
                ).issuepropertyname;

                this.installprovider = this.ticketproperty.find(r =>
                  r.issueattribute == 'installprovider' && r.issuepropertyvalue == ticket.installprovider
                ).issuepropertyname;
              }

              /*let issuestatusname = this.ticketproperty.find(r =>
                r.issueattribute == 'issuestatus' && r.issuepropertyvalue == ticket.issuestatus
              ).issuepropertyname;*/

              let issuestatename = this.issuestatelist.find(r =>
                r.value == Number(ticket.issuestate)
              ).name

              this.ticketList.push(
                {
                  id: ticket.id,
                  issuetypeid: ticket.issuetype,
                  issuetype: this.issuetype,
                  //issuestatus: issuestatusname,
                  ticketno: ticket.ticketno,
                  channel: this.channel,
                  channelid: ticket.channel,
                  urgency: this.urgency,
                  urgencyid: ticket.urgency,
                  installprovider: this.installprovider,
                  installproviderid: ticket.installprovider,
                  locationid: ticket.locationid,
                  shortdescription: ticket.shortdescription,
                  description: ticket.description,
                  solution: ticket.solution,
                  creationdate: ticket.creationdate ? formatDate(ticket.creationdate, 'dd-MM-yyyy', 'en-US') : '',
                  closeddate: ticket.closeddate ? formatDate(ticket.closeddate, 'dd-MM-yyyy', 'en-US') : '',
                  closeddateEdit: ticket.closeddate ? ticket.closeddate : '',
                  incidentid: ticket.incidentid,
                  updationdate: ticket.updationdate,
                  currentstate_id: ticket.issuestate,
                  currentstatename: issuestatename,
                  plandate: (ticket.plandate) ? formatDate(ticket.plandate, 'dd-MM-yyyy', 'en-US') : null,
                  plandateEdit: ticket.plandate,
                  communicationgroup: ticket.communicationgroup,
                  tickettype: ticket.tickettype,
                  billingname: ticket.billingname,
                  billingaccountownerplace: ticket.billingaccountownerplace,
                  billingaccountnumber: ticket.billingaccountnumber,
                  billingaccountownerfirstname: ticket.billingaccountownerfirstname,
                  billingaccountownermiddlename: ticket.billingaccountownermiddlename,
                  billingaccountownerlastname: ticket.billingaccountownerlastname,
                  TicketContactid: ticket.TicketContactid,
                  TicketContactPersonTelephone: ticket.TicketContactPersonTelephone,
                  TicketContactPersonEmail: ticket.TicketContactPersonEmail,
                  TicketContactPersonFunction: ticket.TicketContactPersonFunction,
                  //Monitoring
                  contactpersonid: ticket.contactpersonid,
                  astridticketno: ticket.astridticketno,
                  contractor: ticket.contractor,
                  postponeddate: (ticket.postponeddate) ? formatDate(ticket.postponeddate, 'dd-MM-yyyy', 'en-US') : null,
                  postponeddateEdit: ticket.postponeddate,
                }
              );
            }

            this.loading = false;
            this.dataSourceTicket = new MatTableDataSource<any>(this.ticketList);
            this.dataSourceTicket.sort = this.ticketSort;
            this.dataSourceTicket.paginator = this.paginatorTicket;

          }, error => this.toasterservice.showError(error));
        }, error => this.toasterservice.showError(error));
      }, error => this.toasterservice.showError(error));
  }

  openModal(id: string, prodid: number) {

    jQuery('#product_id').val(jQuery('#prod_id' + prodid).val());
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }


  openDialogAdd(action, type) {

    if (type === 'NOC') {
      const dialogRef = this.dialog.open(TicketdialogBoxComponent, {
        width: '60%',
        data: {
          locationid: this.id, location_name: this.location_name,
          locationparentcustomerid: this.locationparentcustomerid, locationdata: this.location_details,
          action: action
        }, disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.event == 'Add') {
          this.getTicketList();
        }
      }, error => this.toasterservice.showError(error));
    } else if (type === 'Billing') {
      const dialogRef = this.dialog.open(BillingTicketdialogBoxComponent, {
        width: '60%',
        data: {
          locationid: this.id, location_name: this.location_name,
          locationparentcustomerid: this.locationparentcustomerid, locationdata: this.location_details,
          action: action
        }, disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.event == 'Add') {
          this.getTicketList();
        }
      }, error => this.toasterservice.showError(error));
    } else if (type === 'Administrative') {
      const dialogRef = this.dialog.open(AdministrativeTicketdialogBoxComponent, {
        width: '60%',
        data: {
          locationid: this.id, location_name: this.location_name,
          locationparentcustomerid: this.locationparentcustomerid, locationdata: this.location_details,
          action: action
        }, disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.event == 'Add') {
          this.getTicketList();
        }
      }, error => this.toasterservice.showError(error));
    }


  }
  openDialog(action, obj) {
    obj.action = action;
    obj.locationid = this.id;
    const dialogRef = this.dialog.open(TicketdialogBoxComponent, {
      width: '60%',
      data: obj, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {
        //this.getProductList();
      }
    }, error => this.toasterservice.showError(error));
  }
  openDialogEditNOC(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    element.locationparentcustomerid = this.locationparentcustomerid;
    element.locationdata = this.location_details;
    element.location_name = this.location_name;
    element.backoffice = false;
    const dialogRef = this.dialog.open(TicketdialogBoxComponent, {
      width: '70%',
      data: element, disableClose: true

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {


        element.id = result.data[0].id;
        element.issuetypeid = result.data[0].issuetypeid;
        element.issuetype = result.data[0].issuetype;
        //element.issuestatus = result.data[0].issuestatus;
        element.ticketno = result.data[0].ticketno;
        element.channel = result.data[0].channel;
        element.channelid = result.data[0].channelid;
        element.urgency = result.data[0].urgency;
        element.urgencyid = result.data[0].urgencyid;
        element.installprovider = result.data[0].installprovider;
        element.installproviderid = result.data[0].installproviderid;
        element.locationid = result.data[0].locationid;
        element.shortdescription = result.data[0].shortdescription;
        element.description = result.data[0].description;
        element.solution = result.data[0].solution;
        element.incidentid = result.data[0].incidentid;
        element.updationdate = result.data[0].updationdate;
        element.plandate = result.data[0].plandate;
        element.plandateEdit = result.data[0].plandateEdit;
        element.currentstate_id = result.data[0].currentstate_id;
        element.currentstatename = result.data[0].currentstatename;
        element.communicationgroup = result.data[0].communicationgroup;
        element.closeddate = result.data[0].closeddate;
        element.closeddateEdit = result.data[0].closeddateEdit;

      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }

  openDialogEditBilling(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    element.locationparentcustomerid = this.locationparentcustomerid;
    element.locationdata = this.location_details;
    element.location_name = this.location_name;
    element.backoffice = false;
    const dialogRef = this.dialog.open(BillingTicketdialogBoxComponent, {
      width: '70%',
      data: element, disableClose: true,

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {


        element.id = result.data[0].id;
        element.issuetypeid = result.data[0].issuetypeid;
        element.issuetype = result.data[0].issuetype;
        //element.issuestatus = result.data[0].issuestatus;
        element.ticketno = result.data[0].ticketno;
        element.channel = result.data[0].channel;
        element.channelid = result.data[0].channelid;
        element.urgency = result.data[0].urgency;
        element.urgencyid = result.data[0].urgencyid;
        element.installprovider = result.data[0].installprovider;
        element.installproviderid = result.data[0].installproviderid;
        element.locationid = result.data[0].locationid;
        element.shortdescription = result.data[0].shortdescription;
        element.description = result.data[0].description;
        element.solution = result.data[0].solution;
        element.incidentid = result.data[0].incidentid;
        element.updationdate = result.data[0].updationdate;
        element.plandate = result.data[0].plandate;
        element.plandateEdit = result.data[0].plandateEdit;
        element.currentstate_id = result.data[0].currentstate_id;
        element.currentstatename = result.data[0].currentstatename;
        element.communicationgroup = result.data[0].communicationgroup;

        element.billingname = result.data[0].billingname;
        element.billingaccountownerplace = result.data[0].billingaccountownerplace;
        element.billingaccountnumber = result.data[0].billingaccountnumber;
        element.billingaccountownerfirstname = result.data[0].billingaccountownerfirstname;
        element.billingaccountownermiddlename = result.data[0].billingaccountownermiddlename;
        element.billingaccountownerlastname = result.data[0].billingaccountownerlastname;
        element.closeddate = result.data[0].closeddate;
        element.closeddateEdit = result.data[0].closeddateEdit;
      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }

  openDialogEditAdmin(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    element.locationparentcustomerid = this.locationparentcustomerid;
    element.location_name = this.location_name;
    element.locationdata = this.location_details;
    element.backoffice = false;
    const dialogRef = this.dialog.open(AdministrativeTicketdialogBoxComponent, {
      width: '70%',
      data: element, disableClose: true,

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {


        element.id = result.data[0].id;
        element.issuetypeid = result.data[0].issuetypeid;
        element.issuetype = result.data[0].issuetype;
        //element.issuestatus = result.data[0].issuestatus;
        element.ticketno = result.data[0].ticketno;
        element.channel = result.data[0].channel;
        element.channelid = result.data[0].channelid;
        element.urgency = result.data[0].urgency;
        element.urgencyid = result.data[0].urgencyid;
        element.installprovider = result.data[0].installprovider;
        element.installproviderid = result.data[0].installproviderid;
        element.locationid = result.data[0].locationid;
        element.shortdescription = result.data[0].shortdescription;
        element.description = result.data[0].description;
        element.solution = result.data[0].solution;
        element.incidentid = result.data[0].incidentid;
        element.updationdate = result.data[0].updationdate;
        element.plandate = result.data[0].plandate;
        element.plandateEdit = result.data[0].plandateEdit;
        element.currentstate_id = result.data[0].currentstate_id;
        element.currentstatename = result.data[0].currentstatename;
        element.communicationgroup = result.data[0].communicationgroup;
        element.closeddate = result.data[0].closeddate;
        element.closeddateEdit = result.data[0].closeddateEdit;

      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }


  openDialogTT(action, element) {
    element.action = action;
    element.locationid = this.id;
    element.locationparentcustomerid = this.locationparentcustomerid;
    const dialogRef = this.dialog.open(TicketdialogBoxComponent, {
      width: '700px',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {
        element.installprovider = result.data[0].installprovider;
        element.installproviderid = result.data[0].installproviderid;
        element.updationdate = result.data[0].updationdate;
      }
    }, error => this.toasterservice.showError(error));
  }

  change_status(action, element) {
    $('#rowoverlay' + element.id).show();
    const productinstallbase_id = element.id;
    (document.getElementById('statusID' + productinstallbase_id + '') as any).disabled = true;
    const basic_cas_service = (element.basic_cas_service == true ? 1 : 0);
    const fox_cas_service = (element.fox_cas_service == true ? 1 : 0);
    const mvh_cas_service = (element.mvh_cas_service == true ? 1 : 0);
    var newstatus = 0;
    var change_status_value: any;
    if (action == 'Active') {

      newstatus = 1;
      change_status_value = {
        status: 1,
        basic_cas_service: basic_cas_service,
        fox_cas_service: fox_cas_service,
        mvh_cas_service: mvh_cas_service
      };
    } else {
      newstatus = 0;
      change_status_value = {
        status: 0,
        basic_cas_service: basic_cas_service,
        fox_cas_service: fox_cas_service,
        mvh_cas_service: mvh_cas_service
      };
    }

    /*this.api.changeStatus(productinstallbase_id, JSON.stringify(change_status_value))
      .subscribe(res => {

        (document.getElementById('statusID' + productinstallbase_id + '') as any).disabled = false;

        if ((res != undefined)) {
          if (res['error'] != undefined && res['error'] != '1028') {
            this.toasterservice.showError(res['casnumber'], res['error'], res['message']);
            $('#statusID' + element.id).prop('checked', (!(1 == newstatus)));
          } else {
            element.status = newstatus;
            if (action == 'Active') {
              element.productactivationdate = moment();
            } else {
              element.productdeactivationdate = moment();
            }
          }
        } else {
          $('#statusID' + element.id).prop('checked', (!(1 == newstatus)));
        }
        $('#rowoverlay' + element.id).hide();
        //this.getProductList();
      }, (err) => {
        (document.getElementById('statusID' + productinstallbase_id + '') as any).disabled = false;
        $('#rowoverlay' + element.id).hide();
      }
      );*/
  }

  openDialogEditMonitoring(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    element.locationparentcustomerid = this.locationparentcustomerid;
    element.location_name = this.location_name;
    element.locationdata = this.location_details;
    const dialogRef = this.dialog.open(MonitoringTicketdialogBoxComponent, {
      width: '70%',
      data: element, disableClose: true,

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {
        element.id = result.data[0].id;
        element.issuetypeid = result.data[0].issuetypeid;
        element.issuetype = result.data[0].issuetype;
        //element.issuestatus = result.data[0].issuestatus;
        element.ticketno = result.data[0].ticketno;
        element.urgency = result.data[0].urgency;
        element.urgencyid = result.data[0].urgencyid;
        element.locationid = result.data[0].locationid;
        element.shortdescription = result.data[0].shortdescription;
        element.description = result.data[0].description;
        element.updationdate = result.data[0].updationdate;
        element.currentstate_id = result.data[0].currentstate_id;
        element.currentstatename = result.data[0].currentstatename;
        element.contractor = result.data[0].contractor;
        element.contactpersonid = result.data[0].contactpersonid;
        element.astridticketno = result.data[0].astridticketno;
        element.postponeddate = result.data[0].postponeddate;
        element.postponeddateEdit = result.data[0].postponeddateEdit;

      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }

  getPropertyAll() {
    this._locationService.getAllLocationProperty().subscribe(data => {
      this.locationproperty = data;

    }, error => this.toasterservice.showError(error));
  }
}
