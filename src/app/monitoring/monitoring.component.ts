import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';

import { LocationService } from '../_services/location.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ModalService } from '../modal/modal.service';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { of as observableOf } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, NgForm, Validators } from '@angular/forms';
import { InfraService } from '../_services/infra.service';


import moment from "moment";
import 'moment-timezone';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MonitoringTicketdialogBoxComponent } from '../monitoringticketdialog-box/monitoringticketdialog-box.component';
import { CommonService } from '../_services/common.service';
import { TicketService } from '../_services/ticket.service';
import { formatDate } from '@angular/common';
import { ToasterService } from '../_services/toastr.service';

/** File node data with nested structure. */
export interface FileNode {
  name: string;
  type: string;
  children?: FileNode[];
  tooltipData: string;
}

/** Flat node with expandable and level information */
export interface TreeNode {
  name: string;
  type: string;
  level: number;
  expandable: boolean;
}
export class MonitoringModel {
  customerid: number;
  customername: string;
  place: string;
  incident: string;
  service: string;
  createddate: string;
  details: string;

}

moment.tz.setDefault('Europe/Amsterdam');

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent {
  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<TreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileNode, TreeNode>;


  id;

  loading = false;
  rowoverlay = false;
  navLinks: any;
  navLinksTab: any;
  tabsubsections: any;

  apiUrl: any;
  statusCheck: boolean = false;
  superuser: boolean;

  statusVal;
  additionalContactInfo: any[] = [];
  isExpand: boolean = false;
  isExpandCrit: boolean = false;
  isExpandWarn: boolean = false;
  monitoringData: any[] = [];
  monitoringlistData: any;
  sessionactual: any;
  totalalarm_warn;
  totalalarm_crit;
  totalalarm_ok;
  totalalarm_perc;
  linkPath;

  usercountlist: any;
  totaluserloogged;
  activeLinkIndex = -1;

  locationCount;
  alarmlistData: any;
  location_name;
  location_details: any;
  locationchain: any;
  locationcountry: any;
  locationproperty: any[];
  tabSectionList: any[] = [];
  locationparentcustomerid;
  monticket_details: any;
  monticketdetails;
  activemonticket_details;
  bigErrorMessageValid;

  displayedMonitoringColumns: string[] = ['customerid', 'customername', 'city', 'button', 'service', 'incident', 'createddate'];

  dataSourceMonitoring = new MatTableDataSource<MonitoringModel>();
  @ViewChild('monitoringsort', { static: true }) monitoringsort: MatSort;
  @ViewChild('paginatorMonitoring', { static: true }) paginatorMonitoring: MatPaginator;
  @ViewChild('tree') tree;
  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private InfraService: InfraService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private _locationService: LocationService,
    public _commonService: CommonService,
    public ticketservice: TicketService,
    private toasterservice: ToasterService,
  ) {
    this._locationService.getTabList('12').subscribe(data => {
      this.navLinks = data;
      console.log(this.navLinks);

    });
    this._locationService.locations_details().subscribe(
      data => {
        this.location_details = data;
        console.log(this.location_details);
      });
  }

  async ngOnInit() {
    this.checkBigErrorMessage();
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    }, error => this.toasterservice.showError(error));
    await this.fetchMonitoringlist();
    this.dataSourceMonitoring.sort = this.monitoringsort;
  }
  ngAfterViewInit() {
  }

  async fetchMonitoringlist() {
    this.loading = true;

    this.InfraService.getMonitoringListAll().subscribe(
      data => {
        this.monitoringData = [];
        this.locationCount = 0;
        this.monitoringlistData = data;
        this.totalalarm_crit = 0;
        this.totalalarm_ok = 0;
        this.totalalarm_warn = 0;
        this.linkPath = '../../../satellite/';

        this.InfraService.getUserCount().subscribe(
          usercountdata => {
            this.totaluserloogged = usercountdata[0]['ucount'];
          }, error => this.toasterservice.showError(error));
        this.ticketservice.getActiveTickets().subscribe(
          data => {
            this.activemonticket_details = data;
            this.InfraService.getAlarmsAll().subscribe(
              data1 => {

                this.alarmlistData = data1;
                this.InfraService.getSessionActual().subscribe(
                  async data2 => {
                    this.sessionactual = data2;

                    for (let monitoringVal of this.monitoringlistData) {
                      //this.locationCount++;
                      let alarmData = this.alarmlistData.filter(function (e) {
                        return e.location_id == monitoringVal.location_id;
                      });
                      if (alarmData.length > 0) {
                        this.totalalarm_warn += Number(alarmData[0]['state_WARN']);
                        this.totalalarm_crit += Number(alarmData[0]['state_CRIT']);
                        this.totalalarm_ok += Number(alarmData[0]['state_OK']);
                        this.locationCount++;
                        let sessionActualData = this.sessionactual.filter(function (e) {
                          return e.location_id == monitoringVal.location_id;
                        });
                        var users = sessionActualData[0]['sessions'];
                        var alarm_warn = Number(alarmData[0]['state_WARN']);
                        var alarm_crit = Number(alarmData[0]['state_CRIT']);
                        var alarm_ok = Number(alarmData[0]['state_OK']);
                        var down_perc = ((alarm_crit + alarm_warn) / (alarm_ok + alarm_warn + alarm_crit)) * 100;
                        var round_down_perc = Math.round(down_perc);
                        if (round_down_perc == 0)
                          round_down_perc = parseFloat(down_perc.toFixed(1));
                        //monitoringVal.location_id=2;

                        this.monticketdetails = await this.getMonTicket(monitoringVal.location_id);
                        console.log('ticket setails---', this.monticketdetails);

                        //incident based on value
                        /*
                        if(monitoringVal.ticket == 0)
                          monitoringVal.ticket = 'Nee';
                        else if(monitoringVal.ticket == 1)
                          monitoringVal.ticket = 'Ja';
                        else if (monitoringVal.ticket == 2)
                          monitoringVal.ticket = 'Deels';
                          */
                        if (this.monticketdetails)
                          monitoringVal.ticket = 'Ja';
                        else
                          monitoringVal.ticket = 'Nee';

                        var nocMessage;
                        nocMessage = monitoringVal.noc_message;

                        if (!monitoringVal.noc_message) {
                          nocMessage = '';
                        } else if (nocMessage.trim() == 'NULL') {
                          nocMessage = '';
                        }
                        if (this.monticketdetails) {
                          this.monitoringData.push(
                            {
                              ok: alarmData[0]['state_OK'],
                              warn: alarmData[0]['state_WARN'],
                              critical: alarmData[0]['state_CRIT'],
                              down: round_down_perc + '%',
                              downpercent: round_down_perc,
                              users: users,
                              comment: nocMessage,
                              customerid: monitoringVal.location_id,
                              customername: monitoringVal.location_name,
                              city: monitoringVal.city,
                              service: monitoringVal.serviceprovider,
                              incident: monitoringVal.ticket,
                              createddate: monitoringVal.first_last_time_ok != null ? this.formatdatehst(monitoringVal.first_last_time_ok) : null,
                              details: '[+Klik voor details]',
                              ticketid: this.monticketdetails['id'],

                              id: this.monticketdetails['id'],
                              issuetypeid: this.monticketdetails['issuetype'],
                              issuetype: this.monticketdetails['issuetype'],
                              //issuestatus: issuestatusname,
                              ticketno: this.monticketdetails.ticketno,
                              //channel: this.monticketdetails['channel'],
                              //channelid: this.monticketdetails['channel'],
                              urgency: this.monticketdetails['urgency'],
                              urgencyid: this.monticketdetails['urgency'],
                              // installprovider: this.installprovider,
                              //installproviderid: this.monticketdetails.installprovider,
                              locationid: this.monticketdetails['locationid'],
                              shortdescription: this.monticketdetails['shortdescription'],
                              description: this.monticketdetails['description'],
                              // solution: this.monticketdetails.solution,
                              creationdate: this.monticketdetails['creationdate'] ? formatDate(this.monticketdetails['creationdate'], 'dd-MM-yyyy', 'en-US') : '',
                              //closeddate: this.monticketdetails.closeddate ? formatDate(this.monticketdetails['closeddate'], 'dd-MM-yyyy', 'en-US') : '',
                              //closeddateEdit: this.monticketdetails['closeddate'] ? this.monticketdetails['closeddate'] : '',
                              incidentid: this.monticketdetails['incidentid'],
                              updationdate: this.monticketdetails['updationdate'],
                              currentstate_id: this.monticketdetails['issuestate'],
                              // currentstatename: issuestatename,
                              // plandate: (this.monticketdetails.plandate) ? formatDate(this.monticketdetails.plandate, 'dd-MM-yyyy', 'en-US') : null,
                              // plandateEdit: this.monticketdetails.plandate,
                              communicationgroup: this.monticketdetails['communicationgroup'],
                              tickettype: this.monticketdetails['tickettype'],
                              //Monitoring
                              contactpersonid: this.monticketdetails['contactpersonid'],
                              astridticketno: this.monticketdetails.astridticketno,
                              contractor: this.monticketdetails['contractor'],
                              postponeddate: (this.monticketdetails['postponeddate']) ? formatDate(this.monticketdetails['postponeddate'], 'dd-MM-yyyy', 'en-US') : null,
                              postponeddateEdit: this.monticketdetails['postponeddate'],

                            }
                          );
                        } else {
                          this.monitoringData.push(
                            {
                              ok: alarmData[0]['state_OK'],
                              warn: alarmData[0]['state_WARN'],
                              critical: alarmData[0]['state_CRIT'],
                              down: round_down_perc + '%',
                              downpercent: round_down_perc,
                              users: users,
                              comment: nocMessage,
                              customerid: monitoringVal.location_id,
                              customername: monitoringVal.location_name,
                              city: monitoringVal.city,
                              service: monitoringVal.serviceprovider,
                              incident: monitoringVal.ticket,
                              createddate: monitoringVal.first_last_time_ok != null ? this.formatdatehst(monitoringVal.first_last_time_ok) : null,
                              details: '[+Klik voor details]',
                            });
                        }
                      }
                    }
                    this.totalalarm_perc = ((this.totalalarm_warn + this.totalalarm_crit) / (this.totalalarm_crit + this.totalalarm_ok + this.totalalarm_warn)) * 100;
                    this.totalalarm_perc = Math.round(this.totalalarm_perc);

                    this.loading = false;
                    this.monitoringData.sort(this.GetSortOrder());
                    var sorto = {
                      service: "desc", incident: "asc", downpercent: "asc"
                    };

                    this.monitoringData.sort((a, b) => a.service.localeCompare(b.service) || (a.incident.localeCompare(b.incident) * -1) || b.downpercent - a.downpercent);
                    //this.monitoringData.sort(this.GetSortOrder("incident"));
                    //this.monitoringData.sort(this.GetSortOrder("downpercent"));
                    //this.monitoringData = this.GetSortOrder(this.monitoringData);
                    this.dataSourceMonitoring = new MatTableDataSource<any>(this.monitoringData);
                    this.dataSourceMonitoring.sort = this.monitoringsort;
                    this.dataSourceMonitoring.paginator = this.paginatorMonitoring;
                  }, error => this.toasterservice.showError(error));
              }, error => this.toasterservice.showError(error));
          }, error => this.toasterservice.showError(error));
      }, error => this.toasterservice.showError(error));
  }

  getLocationDetails(locationid) {
    var filterdata = this.location_details.filter(function (e) {
      return locationid == e.customerid;
    });
    console.log('location detatils', filterdata);
    var data = filterdata[0];
    console.log('dfgh', data)
    if (data != undefined) {
      this.locationparentcustomerid = data.parentcustomerid;
      this.location_name = data.customername;
      this.location_details.customerid = locationid
      this.location_details.locationchain = data.chainname;
      this.locationcountry = data.countryname;
      this.location_details.locationtypeid = data.locationtypename
      this.location_details.accountmanagerid = data.accountmanagername

      this.location_details.city = (data.city) ? ' ' + data.city : '';
      this.location_details.postcode = (data.postcode) ? ', ' + data.postcode : '';

      this.location_details.streetname = (data.streetname) ? ' ' + data.streetname : '';
      this.location_details.housenumber = (data.housenumber) ? ' ' + data.housenumber : '';
      this.location_details.housenumberaddition = (data.housenumberaddition) ? ' ' + data.housenumberaddition : '';
      this.location_details.fulladdress = (this.locationcountry + this.location_details.streetname + this.location_details.housenumber + this.location_details.housenumberaddition + this.location_details.postcode + this.location_details.city) ? this.locationcountry + this.location_details.streetname + this.location_details.housenumber + this.location_details.housenumberaddition + this.location_details.postcode + this.location_details.city : 'No Adres vermeld';
      this.location_details.customername = data.customername;
    }


  }

  async getMonTicket(customerid) {
    //let data = await this.ticketservice.getMonTicketByCustomerid(customerid);
    // this.monticket_details = data;
    // console.log('ticket details---', this.activemonticket_details);
    // console.log('ticket id---', this.monticket_details[0]['id']);
    var filterdata = this.activemonticket_details.filter(function (e) {
      return Number(customerid) == Number(e.locationid);
    });
    console.log('filter data--', filterdata);
    // var data = filterdata[0];

    // if(this.monticket_details['ticketExist'])
    if (filterdata.length > 0) {
      console.log('ticket exist--', filterdata);
      return filterdata[0];
    }
    else {
      //console.log('fi no ticket----', filterdata);
      return false;
    }
  }

  GetSortOrder() {
    var prop = 'service'
    if (prop == 'service') {
      return function (a, b) {
        if (a['service'] > b['service']) {
          if (a['incident'] < b['incident']) {
            if (a['downpercent'] < b['downpercent']) {
              return 1;
            }
            return 1;
          }
          return 1;
        } else if (a[prop] < b[prop]) {
          return -1;
        }
        return 0;
      }
    }
    /*
    if (prop == 'incident') {
      return function (a, b) {
        if (a[prop] < b[prop]) {
          return 1;
        } else if (a[prop] > b[prop]) {
          return -1;
        }
        return 0;
      }
    }
    if (prop == 'downpercent') {
      return function (a, b) {
        if (a[prop] > b[prop]) {
          return 1;
        } else if (a[prop] > b[prop]) {
          return -1;
        }
        return 0;
      }
    }
    */
  }

  applyFilterMonitoring(filterValue: string) {
    this.dataSourceMonitoring.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceMonitoring.paginator) {
      this.dataSourceMonitoring.paginator.firstPage();
    }
  }

  formatdatehst(createddate) {
    return this.datePipe.transform(new Date(createddate), 'dd-MM-yyyy hh:mm');
  }
  getPropertyAll() {
    this._locationService.getAllLocationProperty().subscribe(data => {
      this.locationproperty = data;

    }, error => this.toasterservice.showError(error));
  }

  openDialogAddMonTicket(action, element) {
    this.getLocationDetails(element.customerid);
    element.location_name = this.location_name;
    element.locationdata = this.location_details;
    console.log('customerid--', element.customerid);
    console.log('location details--', this.location_details);
    element.locationparentcustomerid = this.locationparentcustomerid;
    const dialogRef = this.dialog.open(MonitoringTicketdialogBoxComponent, {
      width: '60%',
      data: {
        locationid: element.customerid, location_name: this.location_name,
        locationdata: this.location_details,
        action: action
      }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        console.log('mon ticket added')
        this.fetchMonitoringlist();
      }
    }, error => this.toasterservice.showError(error));
  }

  openDialogEditMonitoring(action, element) {
    this.getLocationDetails(element.customerid);
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = element.customerid;
    element.locationparentcustomerid = this.locationparentcustomerid;
    element.location_name = this.location_name;
    element.locationdata = this.location_details;
    element.id = element.ticketid;
    const dialogRef = this.dialog.open(MonitoringTicketdialogBoxComponent, {
      width: '70%',
      data: element, disableClose: true,

    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {
        console.log('mon ticket updated');
        this.fetchMonitoringlist();
      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }
  checkBigErrorMessage() {
    this.bigErrorMessageValid = false;
    this.InfraService.checkBigErrorMessage().subscribe(
      data => {
        var bigMessageErrorData = data;
        console.log('error message', bigMessageErrorData);
        this.bigErrorMessageValid = bigMessageErrorData['bigErrorMessage'];
      }, error => this.toasterservice.showError(error));
  }
}
