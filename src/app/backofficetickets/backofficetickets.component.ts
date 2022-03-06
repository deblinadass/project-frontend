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
import { TicketdialogBoxComponent } from '../ticketdialog-box/ticketdialog-box.component';
import { TicketService } from '../_services/ticket.service';
import { AuthenticationService } from '../_services/authentication.service';
import { BillingTicketdialogBoxComponent } from '../billing-ticketdialog-box/billing-ticketdialog-box.component';
import { AdministrativeTicketdialogBoxComponent } from '../administrative-ticketdialog-box/administrative-ticketdialog-box.component';
import { MonitoringTicketdialogBoxComponent } from '../monitoringticketdialog-box/monitoringticketdialog-box.component';

import moment from "moment";
import 'moment-timezone';
moment.tz.setDefault('Europe/Amsterdam');
import { ToasterService } from '../_services/toastr.service';
import { formatDate } from '@angular/common';

declare var jQuery: any;
declare const editClick: any;
declare var $: any;



@Component({
  selector: 'app-backofficetickets',
  templateUrl: './backofficetickets.component.html',
  styleUrls: ['./backofficetickets.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class BackofficeticketsComponent implements OnInit, AfterViewInit {
  nocuser;
  issuestatelist: any;
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
  navLinks: any;
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
  displayedticketColumns: string[]; 
  //displayedticketColumns: string[] = ['incidentid','creationdate', 'currentstatename', 'installprovider', 'issuetype', 'urgency', 'shortdescription', 'action'];
  dataSourceTicket = new MatTableDataSource<any[]>();

  ticketList: any[] = [];
  ticketsecondlevel: any[] = [];
  ticketproperty: any;
  urgency;
  issuetype;
  channel;
  installprovider;
  communicationgroup: any;
  alarmdataperlocation: any;
  critical: any;

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
    private toasterservice: ToasterService
  ) {
    this._locationService.getTabList('11').subscribe(data => {
      this.navLinks = data;
     
  
    }, error => this.toasterservice.showError(error));
  }

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    }, error => this.toasterservice.showError(error));
   // this.nocuser = this.authenticationservice.isNOCUser();
    this.superuser = this.authenticationservice.isSuperUser();
    if(this.router.url == '/backoffice/noctickets')
    {
      this.displayedticketColumns = ['incidentid','creationdate', 'currentstatename', 'installprovider', 'issuetype', 'urgency', 'shortdescription', 'action'];
      this.getTicketListByType(1,'open');
    }else if(this.router.url == '/backoffice/billingtickets')
    {
      this.displayedticketColumns = ['incidentid','creationdate', 'currentstatename', 'installprovider', 'issuetype', 'urgency', 'shortdescription', 'action'];
      this.getTicketListByType(2,'open');
    }else if(this.router.url == '/backoffice/admintickets')
    {
      this.displayedticketColumns = ['incidentid','creationdate', 'currentstatename', 'installprovider', 'issuetype', 'urgency', 'shortdescription', 'action'];
      this.getTicketListByType(3,'open');
    }else if(this.router.url == '/backoffice/monitoringtickets')
    {
      this.displayedticketColumns = ['incidentid','creationdate', 'currentstatename', 'installprovider', 'issuetype', 'urgency', 'shortdescription','Hardware', 'action'];
      this.getTicketListByTypeMonitoring(4,'open');
    }else if(this.router.url == '/backoffice/nocticketsclosed')
    {
      this.displayedticketColumns = ['incidentid','creationdate', 'currentstatename', 'installprovider', 'issuetype', 'urgency', 'shortdescription', 'action'];
      this.getTicketListByType(1,'closed');
    }else if(this.router.url == '/backoffice/billingticketsclosed')
    {
      this.displayedticketColumns = ['incidentid','creationdate', 'currentstatename', 'installprovider', 'issuetype', 'urgency', 'shortdescription', 'action'];
      this.getTicketListByType(2,'closed');
    }else if(this.router.url == '/backoffice/adminticketsclosed')
    {
      this.displayedticketColumns = ['incidentid','creationdate', 'currentstatename', 'installprovider', 'issuetype', 'urgency', 'shortdescription', 'action'];
      this.getTicketListByType(3,'closed');
    }else if(this.router.url == '/backoffice/monitoringticketsclosed')
    {
      this.displayedticketColumns = ['incidentid','creationdate', 'currentstatename', 'installprovider', 'issuetype', 'urgency', 'shortdescription','Hardware', 'action'];
      this.getTicketListByTypeMonitoring(4,'closed');
    }else{
      this.displayedticketColumns = ['incidentid','creationdate', 'currentstatename', 'installprovider', 'issuetype', 'urgency', 'shortdescription', 'action'];
      this.getTicketList();
    }
    console.log(this.router.url);
    
  }

  ngAfterViewInit(): void {
    
  }

  
  toggleRow(element) {
    element.Extra ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    
    this.cd.detectChanges();
    
  }

  applyFilterBackofficeTicket(filterValue: string) {
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
    this.api.getTicketList().subscribe(
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

                this.channel = this.ticketproperty.find(r =>
                  r.issueattribute == 'channel' && r.issuepropertyvalue == ticket.channel
                ).issuepropertyname;

                this.installprovider = this.ticketproperty.find(r =>
                  r.issueattribute == 'installprovider' && r.issuepropertyvalue == ticket.installprovider
                ).issuepropertyname;

                /*let issuestatusname = this.ticketproperty.find(r =>
                  r.issueattribute == 'issuestatus' && r.issuepropertyvalue == ticket.issuestatus
                ).issuepropertyname;*/
                
                let issuestatename = this.issuestatelist.find(r =>
                  r.value == Number(ticket.issuestate)
                ).name
                this._locationService.location_details(ticket.locationid).subscribe(
                  data => {
                    this.location_details = data;
                    this.location_name = data.customername;
                    this.locationparentcustomerid = data.parentcustomerid;
                    
                  }); 
                this.ticketList.push(
                  {
                    id: ticket.id,
                    issuetypeid: ticket.issuetype,
                    issuetype: this.issuetype,
                    //issuestatus: issuestatusname,
                    ticketno: ticket.ticketno,
                    location_name: ticket.locationname,
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
                    incidentid: ticket.incidentid,
                    updationdate: ticket.updationdate,
                    currentstate_id: ticket.issuestate,
                    currentstatename : issuestatename,
                    plandate: (ticket.plandate) ? formatDate(ticket.plandate, 'dd-MM-yyyy', 'en-US') : null,
                    plandateEdit: ticket.plandate,
                    communicationgroup: ticket.communicationgroup,
                    tickettype: ticket.tickettype,
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

  getTicketListByType(tickettype,status) {
    this.loading = true;
    this.api.getTicketListByType(tickettype,status).subscribe(
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

                this.channel = this.ticketproperty.find(r =>
                  r.issueattribute == 'channel' && r.issuepropertyvalue == ticket.channel
                ).issuepropertyname;

                this.installprovider = this.ticketproperty.find(r =>
                  r.issueattribute == 'installprovider' && r.issuepropertyvalue == ticket.installprovider
                ).issuepropertyname;

                /*let issuestatusname = this.ticketproperty.find(r =>
                  r.issueattribute == 'issuestatus' && r.issuepropertyvalue == ticket.issuestatus
                ).issuepropertyname;*/
                
                let issuestatename = this.issuestatelist.find(r =>
                  r.value == Number(ticket.issuestate)
                ).name
                this._locationService.location_details(ticket.locationid).subscribe(
                  data => {
                    this.location_details = data;
                    this.location_name = data.customername;
                    this.locationparentcustomerid = data.parentcustomerid;
                    
                  }); 
                this.ticketList.push(
                  {
                    id: ticket.id,
                    issuetypeid: ticket.issuetype,
                    issuetype: this.issuetype,
                    //issuestatus: issuestatusname,
                    ticketno: ticket.ticketno,
                    location_name: ticket.locationname,
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
                    incidentid: ticket.incidentid,
                    updationdate: ticket.updationdate,
                    currentstate_id: ticket.issuestate,
                    currentstatename : issuestatename,
                    plandate: (ticket.plandate) ? formatDate(ticket.plandate, 'dd-MM-yyyy', 'en-US') : null,
                    plandateEdit: ticket.plandate,
                    communicationgroup: ticket.communicationgroup,
                    tickettype: ticket.tickettype,
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

  getTicketListByTypeMonitoring(tickettype,status) {
    this.loading = true;
    this.api.getTicketListByTypeMonitoring(tickettype,status).subscribe(
      data => {
        this.ticketList = [];
        this.ticket_list = data;
        
        this.api.getTicketProperty().subscribe(data => {
          this.ticketproperty = data;
          this.api.getStateList().subscribe(data1 => {
            this.issuestatelist = data1;
            this.api.getcommunicationgroupticket('4').subscribe(data2 => {
              this.communicationgroup = data2;
              this.api.getAlarmsAll().subscribe(data3 => {
                this.alarmdataperlocation = data3;
                
              for (let ticket of this.ticket_list) {
                  
                  this.ticketsecondlevel = [];

                  this.urgency = this.ticketproperty.find(r =>
                    r.issueattribute == 'urgency' && r.issuepropertyvalue == ticket.urgency
                  ).issuepropertyname;

                  this.issuetype = this.ticketproperty.find(r =>
                    r.issueattribute == 'issuetype' && r.issuepropertyvalue == ticket.issuetype
                  ).issuepropertyname;

                  this.installprovider = this.communicationgroup.find(r =>
                    r.communicationvalue == ticket.contractor
                  ).communicationname;

                  this.critical = this.alarmdataperlocation.find(r =>
                    r.location_id == ticket.locationid
                  ).state_CRIT;
                  
                  let issuestatename = this.issuestatelist.find(r =>
                    r.value == Number(ticket.issuestate)
                  ).name
                  this._locationService.location_details(ticket.locationid).subscribe(
                    data => {
                      this.location_details = data;
                      this.location_name = data.customername;
                      this.locationparentcustomerid = data.parentcustomerid;
                      
                    }); 
                  this.ticketList.push(
                    {
                      id: ticket.id,
                      issuetypeid: ticket.issuetype,
                      issuetype: this.issuetype,
                      location_name: ticket.locationname,
                      urgency: this.urgency,
                      urgencyid: ticket.urgency,
                      locationid: ticket.locationid,
                      shortdescription: ticket.shortdescription,
                      description: ticket.description,
                      creationdate: ticket.creationdate ? formatDate(ticket.creationdate, 'dd-MM-yyyy', 'en-US') : '',
                      incidentid: ticket.incidentid,
                      updationdate: ticket.updationdate,
                      currentstate_id: ticket.issuestate,
                      currentstatename : issuestatename,
                      tickettype: ticket.tickettype,
                      installprovider: this.installprovider ,
                      installproviderid: ticket.contractor,
                      critical: this.critical
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
          
            
            
            
        }, error => this.toasterservice.showError(error));
      }, error => this.toasterservice.showError(error));
    
  }


  openDialogEditNOC(action, element) {
    
    $('#rowoverlay' + element.id).show();
    element.action = action;
    
    this._locationService.location_details(element.locationid).subscribe(
      data => {
        this.location_details = data;
        element.location_name = data.customername;
        element.locationparentcustomerid = data.parentcustomerid;
        
      }, error => this.toasterservice.showError(error));
    
    element.locationparentcustomerid= this.locationparentcustomerid;
    element.backoffice = true;
   
    
    const dialogRef = this.dialog.open(TicketdialogBoxComponent, {
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

      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }
  openDialogEditBilling(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
  
    element.locationparentcustomerid= this.locationparentcustomerid;
    //element.location_name= this.location_name
    this._locationService.location_details(element.locationid).subscribe(
      data => {
        this.location_details = data;
        element.location_name = data.customername;
        element.locationparentcustomerid = data.parentcustomerid;
        
      }, error => this.toasterservice.showError(error));
      element.backoffice = true;
    
    const dialogRef = this.dialog.open(BillingTicketdialogBoxComponent, {
      width: '70%',
      data: element, disableClose: true,
      
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {

        
        element.id = result.data[0].id;
        element.issuetypeid = result.data[0].issuetypeid;
        element.issuetype = result.data[0].issuetype;
       
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

      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }



  openDialogEditAdmin(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
   
    element.locationparentcustomerid= this.locationparentcustomerid;
    //element.location_name= this.location_name
    this._locationService.location_details(element.locationid).subscribe(
      data => {
        this.location_details = data;
        element.location_name = data.customername;
        element.locationparentcustomerid = data.parentcustomerid;
        
      }, error => this.toasterservice.showError(error));
      element.backoffice = true;
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

      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
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

  openModal(id: string, prodid: number) {

    jQuery('#product_id').val(jQuery('#prod_id' + prodid).val());
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
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

   
  }
}
