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
import { MonitoringTicketdialogBoxComponent } from '../monitoringticketdialog-box/monitoringticketdialog-box.component';

import moment from "moment";
import 'moment-timezone';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CommonService } from '../_services/common.service';
import { ClipboardModule } from '@angular/cdk/clipboard';
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
  selector: 'app-infra',
  templateUrl: './infra.component.html',
  styleUrls: ['./infra.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class InfraComponent {

  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<TreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileNode, TreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<FileNode, TreeNode>;
  contacts: any[] = [];
  id;
  contact_list: any;
  attribute_value_list: any;
  noRecords: boolean = false;
  loading = false;
  rowoverlay = false;
  navLinks: any;
  navLinksTab: any;
  tabsubsections: any;
  activeLinkIndex = -1;
  apiUrl: any;
  statusCheck: boolean = false;
  superuser: boolean;
  expandedElement: any[] = [];
  statusDateTime: any;
  statusVal;
  additionalContactInfo: any[] = [];
  isExpand: boolean = false;
  isExpandCrit: boolean = false;
  isExpandWarn: boolean = false;
  monitoringData: any[] = [];
  monitoringlistData: any;
  hardwareData: any[] = [];
  hardwarelistData: any;
  alarmData: Array<any> = [{
    "ok": '', "warn": '', "critical": '', "down": '', "users": '',
    "comment": ''
  }];
  alarmlistData: any;
  sessionData: Array<any> = [];
  sessionlistData: any;
  linegroupData: Array<any> = [];
  linegrouplistData: any;
  data: any;
  startdate: any;
  stopdate: any;
  datefiltersessionForm: FormGroup;
  ok: any;
  device_list: any;
  device_list_u: any;
  additionalDeviceInfo: any[] = [];
  devices: any[] = [];
  devices_u: any[] = [];
  device_list_critical: any;
  device_list_u_critical: any;
  location_name;
  location_details: any;
  locationchain: any;
  locationcountry: any;
  locationproperty: any[];
  testclip = 'copied data'
  infraSessionButton: boolean = false;
  displayedMonitoringColumns: string[] = ['button', 'service', 'incident', 'createddate', 'details'];
  displayedSessionColumns: string[] = ['Start', 'Stop', 'Sessieduur', 'Stopreason', 'Macadres', 'Gebruikersnaam', 'Ip'];
  displayedDeviceColumns: string[] = ['devicename', 'action'];
  displayedLineGroupColumns: string[] = ['Linegroupid', 'Speed', 'Profile', 'QOS', 'MRTG', 'action', 'overlayrow'];
  dataSourceDevice = new MatTableDataSource<any>();
  dataSourceDevice_u = new MatTableDataSource<any>();
  dataSourceDeviceCritical = new MatTableDataSource<any>();
  dataSourceDevice_u_Critical = new MatTableDataSource<any>();
  //displayedDeviceCriticalColumns: string[] = ['devicename', 'action'];
  //dataSourceCritalDevice = new MatTableDataSource<any>();
  //dataSourceCriticalDevice_u = new MatTableDataSource<any>();
  @ViewChild('deviceSort', { static: true }) deviceSort: MatSort;
  @ViewChild('paginatorDevice', { static: true }) paginatorDevice: MatPaginator;
  @ViewChild('paginatorDeviceCritical', { static: true }) paginatorDeviceCritical: MatPaginator;
  @ViewChild('contactSort', { static: true }) contactSort: MatSort;
  @ViewChild('paginatorContact', { static: true }) paginatorContact: MatPaginator;
  dataSourceMonitoring = new MatTableDataSource<MonitoringModel>();
  @ViewChild('monitoringsort', { static: true }) monitoringsort: MatSort;
  @ViewChild('paginatorMonitoring', { static: true }) paginatorMonitoring: MatPaginator;
  dataSourceSession = new MatTableDataSource<any>();
  @ViewChild('sessionsort', { static: true }) sessionsort: MatSort;
  @ViewChild('paginatorSession', { static: true }) paginatorSession: MatPaginator;
  @ViewChild('tree') tree;
  dataSourceLineGroup = new MatTableDataSource<any>();
  @ViewChild('linegroupsort', { static: true }) linegroupsort: MatSort;
  @ViewChild('paginatorLineGroup', { static: true }) paginatorLineGroup: MatPaginator;

  lgSecondlevel: any[];
  linegroupspeedlistData: unknown;
  linegroupspeed: any;
  linegroupuserbandwidthlistData: any;
  linegroupuserbandwidth: number;
  linegroupsubnetlistData: unknown;
  hotspotsleasetijd: any;
  hotspotssubnet: any;
  leasetime: any;
  ipstart: any;
  range: any;
  linegroupsubnetservicelistData: any;
  mleasetime: any;
  mrange: string;
  mipstart: any;
  tabSectionList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private _locationService: LocationService,
    private InfraService: InfraService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    public _commonService: CommonService,
    private toasterservice: ToasterService,

  ) {

    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.id = sessionStorage.getItem('sessionSatelliteID');
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionSatelliteID');
    }
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);

    this.treeControl = new FlatTreeControl<TreeNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.fetchhardwarelist(this.id);
    this.tabSectionList = this._commonService.getSectionList('InfraTab');

  }

  /** Transform the data to something the tree can read. */
  transformer(node: FileNode, level: number) {
    return {
      name: node.name,
      type: node.type,
      tooltipData: node.tooltipData,
      level: level,
      expandable: !!node.children
    };
  }

  /** Get the level of the node */
  getLevel(node: TreeNode) {
    return node.level;
  }

  /** Return whether the node is expanded or not. */
  isExpandable(node: TreeNode) {
    return node.expandable;
  };

  /** Get the children for the node. */
  getChildren(node: FileNode) {
    return observableOf(node.children);
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: TreeNode) {
    return node.expandable;
  }

  ngOnInit() {
    this.getPropertyAll();

    this._locationService.getTabList('3').subscribe(data1 => {
      this.navLinksTab = data1;

    }, error => this.toasterservice.showError(error));
    this._locationService.getTabList('2').subscribe(data => {
      this.navLinks = data;

      for (let navlink of this.navLinks) {
        if (navlink.label == 'Infra') {
          this.tabsubsections = navlink.tabsubsections;
        }
      }
    }, error => this.toasterservice.showError(error));
    this.dataSourceSession.paginator = this.paginatorSession;
    this.dataSourceSession.sort = this.sessionsort;
    //this.fetchMonitoringlist();
    this.fetchAlarms();
    this.fetchTopFiveSession();
    this.fetchLineGroup();
    this.getSessionByLocation();
    this.datefiltersessionForm = this.formBuilder.group({
      startdate: [''],
      stopdate: ['']
    });
    this._locationService.location_details(this.id).subscribe(
      data => {
        this.location_details = data;
        this.location_name = data.customername;
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
  ngAfterViewInit() {

  }

  getSessionByLocation() {
    this.noRecords = false;
    const formLocData = new FormData();
    formLocData.append('locationid', this.id);
    this.InfraService.getSession(formLocData).subscribe(
      data => {
        this.sessionData = [];
        this.sessionlistData = data;

        for (let sessionVal of this.sessionlistData['result']) {

          this.sessionData.push(
            {
              start: (sessionVal.start && sessionVal.start != null) ? moment(sessionVal.start).format('MMM D YYYY HH:mm:ss A') : '',
              stop: (sessionVal.stop && sessionVal.stop != null) ? moment(sessionVal.stop).format('MMM D YYYY HH:mm:ss A') : '',
              sessionduration: sessionVal.sessionduration,
              stopreason: sessionVal.StopReason,
              mac: sessionVal.macaddress,
              username: sessionVal.username,
              userip: sessionVal.clientip,
            }
          );

        }

        $("#sessiontable").show();
        this.loading = false;
        this.dataSourceSession = new MatTableDataSource<any>(this.sessionData);
        this.dataSourceSession.sort = this.sessionsort;
        this.dataSourceSession.paginator = this.paginatorSession;
      }, error => this.toasterservice.showError(error));
  }

  onSubmit(form: NgForm) {
    this.noRecords = false;
    this.infraSessionButton = true;
    this.data = JSON.stringify(form.value);
    const formData = new FormData();
    JSON.parse(this.data, (key, value) => {

      if (key == 'startdate') {
        this.startdate = moment(value).format('YYYY-MM-DD');
      }
      else if (key == 'stopdate') {
        this.stopdate = moment(value).format('YYYY-MM-DD');
      }
    });
    formData.append('startdate', this.startdate);
    formData.append('stopdate', this.stopdate);
    formData.append('locationid', this.id);

    this.InfraService.getSession(formData).subscribe(
      data => {
        this.infraSessionButton = false;
        this.sessionData = [];
        this.sessionlistData = data;

        for (let sessionVal of this.sessionlistData['result']) {

          this.sessionData.push(
            {
              start: sessionVal.start != null ? moment(sessionVal.start).format('MMM D YYYY HH:mm:ss A') : null,
              stop: sessionVal.stop != null ? moment(sessionVal.stop).format('MMM D YYYY HH:mm:ss A') : null,
              sessionduration: sessionVal.sessionduration,
              stopreason: sessionVal.StopReason,
              mac: sessionVal.macaddress,
              username: sessionVal.username,
              userip: sessionVal.clientip,
            }
          );

        }

        $("#sessiontable").show();
        this.loading = false;
        this.dataSourceSession = new MatTableDataSource<any>(this.sessionData);
        this.dataSourceSession.sort = this.sessionsort;
        this.dataSourceSession.paginator = this.paginatorSession;
      },
      (err) => {
        this.toasterservice.showError(err);
        $("#sessiontable").hide();
        this.noRecords = true;
        this.sessionData = [];
        this.dataSourceSession = new MatTableDataSource<any>(this.sessionData);
        this.infraSessionButton = false;


      });
  }

  getHardwareCriticalM(devicelist: any) {
    this.loading = true;
    this.additionalDeviceInfo = [];
    this.devices = [];
    for (let device of devicelist) {
      // this.additionalChainInfo.push();
      this.devices.push(
        {
          id: device.id,
          devicename: 'ihw' + device.id + device.maceth + device.hardwarecategory + device.hardwaremanufacturer + device.hardwaredevice + '(' + device.hardwaretype + ')',
          status: device.output,
          type1: device.hardwarecategory,
          type2: device.hardwaremanufacturer,
          type3: device.hardwaredevice,
          type4: device.hardwaretype,
          linegroup: device.linegroup_id,
          placement: device.placement,
          maceth: device.maceth,
          lasttimecritical: device.lasttimecritical,
          duration: device.duration,
          coverage: device.coverage,
          description: device.description,
          ip: device.ip,
          macwifa: device.macwifa,
          macwifg: device.macwifg,
          kpnordernumber: device.kpnordernumber,
        }
      );
    }
    this.loading = false;
    this.dataSourceDeviceCritical = new MatTableDataSource<any>(this.devices);
    this.dataSourceDeviceCritical.sort = this.deviceSort;
    this.dataSourceDeviceCritical.paginator = this.paginatorDeviceCritical;

  }

  getHardwareCriticalU(devicelist: any) {
    this.loading = true;
    this.additionalDeviceInfo = [];
    this.devices_u = [];
    for (let device of devicelist) {
      this.devices_u.push(
        {
          id: device.id,
          devicename: 'ihw' + device.id + device.maceth + device.hardwarecategory + device.hardwaremanufacturer + device.hardwaredevice + '(' + device.hardwaretype + ')',
          status: device.output,
          type1: device.hardwarecategory,
          type2: device.hardwaremanufacturer,
          type3: device.hardwaredevice,
          type4: device.hardwaretype,
          linegroup: device.linegroup_id,
          placement: device.placement,
          maceth: device.maceth,
          lasttimecritical: device.lasttimecritical,
          duration: device.duration,
          coverage: device.coverage,
          description: device.description,
          ip: device.ip,
          macwifa: device.macwifa,
          macwifg: device.macwifg,
          kpnordernumber: device.kpnordernumber,

        }
      );
    }
    this.loading = false;
    this.dataSourceDevice_u_Critical = new MatTableDataSource<any>(this.devices_u);
    this.dataSourceDeviceCritical.sort = this.deviceSort;
    this.dataSourceDevice_u_Critical.paginator = this.paginatorDeviceCritical;

  }

  getHardwareWarningM(devicelist: any) {
    this.loading = true;
    this.additionalDeviceInfo = [];
    this.devices = [];
    for (let device of devicelist) {

      this.devices.push(
        {
          id: device.id,
          devicename: 'ihw' + device.id + device.maceth + device.hardwarecategory + device.hardwaremanufacturer + device.hardwaredevice + '(' + device.hardwaretype + ')',
          status: device.output,
          type1: device.hardwarecategory,
          type2: device.hardwaremanufacturer,
          type3: device.hardwaredevice,
          type4: device.hardwaretype,
          linegroup: device.linegroup_id,
          placement: device.placement,
          maceth: device.maceth,
          lasttimecritical: device.lasttimecritical,
          duration: device.duration,
          coverage: device.coverage,
          description: device.description,
          ip: device.ip,
          macwifa: device.macwifa,
          macwifg: device.macwifg,
          kpnordernumber: device.kpnordernumber,
        }
      );
    }
    this.loading = false;
    this.dataSourceDevice = new MatTableDataSource<any>(this.devices);
    this.dataSourceDevice.sort = this.deviceSort;
    this.dataSourceDevice.paginator = this.paginatorDevice;

  }

  getHardwareWarningU(devicelist: any) {
    this.loading = true;
    this.additionalDeviceInfo = [];
    this.devices_u = [];
    for (let device of devicelist) {

      this.devices_u.push(
        {
          id: device.id,
          devicename: 'ihw' + device.id + device.maceth + device.hardwarecategory + device.hardwaremanufacturer + device.hardwaredevice + '(' + device.hardwaretype + ')',
          status: device.output,
          type1: device.hardwarecategory,
          type2: device.hardwaremanufacturer,
          type3: device.hardwaredevice,
          type4: device.hardwaretype,
          linegroup: device.linegroup_id,
          placement: device.placement,
          maceth: device.maceth,
          lasttimecritical: device.lasttimecritical,
          duration: device.duration,
          coverage: device.coverage,
          description: device.description,
          ip: device.ip,
          macwifa: device.macwifa,
          macwifg: device.macwifg,
          kpnordernumber: device.kpnordernumber,

        }
      );
    }
    this.loading = false;
    this.dataSourceDevice_u = new MatTableDataSource<any>(this.devices_u);
    this.dataSourceDevice.sort = this.deviceSort;
    this.dataSourceDevice_u.paginator = this.paginatorDevice;

  }

  fetchhardwarelist(locationid: number) {

    this.InfraService.getHardwareList(locationid).subscribe(
      data => {
        this.hardwareData = [];
        this.hardwarelistData = data;
        this.dataSource.data = JSON.parse(this.hardwarelistData['result']);
        console.log('data', this.dataSource.data);
        this.treeControl.expandAll();
        this.device_list_critical = this.getHardwareCriticalM(JSON.parse(this.hardwarelistData['result_mc']));
        this.device_list_u_critical = this.getHardwareCriticalU(JSON.parse(this.hardwarelistData['result_uc']));
        this.device_list = this.getHardwareWarningM(JSON.parse(this.hardwarelistData['result_mw']));
        this.device_list_u = this.getHardwareWarningU(JSON.parse(this.hardwarelistData['result_uw']));

      }, error => this.toasterservice.showError(error));
  }
  /*fetchMonitoringlist(){
    
    this.InfraService.getMonitoringList(this.id).subscribe(
      data => {
        this.monitoringData = [];
        this.monitoringlistData = data;        
         
 this.InfraService.getAlarms(this.id).subscribe(
    data1 => {
     
      this.alarmlistData = data1;    
      for (let monitoringVal of this.monitoringlistData['result']) {
         
        this.monitoringData.push(
          {
            ok:this.alarmlistData['result']['0']['state_ok'],
            warn:this.alarmlistData['result']['0']['state_warn'],
            critical:this.alarmlistData['result']['0']['state_crit'],
            down:this.alarmlistData['result']['0']['state_down'],
            users:this.alarmlistData['result']['0']['users'],
            comment:this.alarmlistData['result']['0']['noc_message'],
            customerid: monitoringVal.customerid,
            customername: monitoringVal.customername,
            place: monitoringVal.place,
            service: monitoringVal.service,
            incident: monitoringVal.incident,           
            createddate: monitoringVal.createddate != null ? this.formatdatehst(monitoringVal.createddate) : null,
            details: monitoringVal.details,
           
          }
        );        
       
      }        
  
      this.loading = false;
      this.dataSourceMonitoring = new MatTableDataSource<any>(this.monitoringData);
      this.dataSourceMonitoring.sort = this.monitoringsort;
      this.dataSourceMonitoring.paginator = this.paginatorMonitoring;
    });
     });
  }*/

  fetchAlarms() {

    this.InfraService.getAlarms(this.id).subscribe(
      data => {
        this.alarmlistData = data;
        for (let alarmVal of this.alarmlistData['result']) {
          this.alarmData = [{
            "ok": alarmVal.state_ok, "warn": alarmVal.state_warn, "critical": alarmVal.state_crit, "down": alarmVal.state_down, "users": alarmVal.users,
            "comment": alarmVal.noc_message
          }];

        }

      }, error => this.toasterservice.showError(error));

  }

  fetchTopFiveSession() {

    this.InfraService.getTopFiveSession(this.id).subscribe(
      data => {
        this.sessionData = [];
        this.sessionlistData = data;

        for (let sessionVal of this.sessionlistData['result']) {

          this.sessionData.push(
            {
              start: sessionVal.startdate != null ? moment(sessionVal.startdate).format('MMM D YYYY HH:mm:ss A') : null,
              stop: sessionVal.stopdate != null ? moment(sessionVal.stopdate).format('MMM D YYYY HH:mm:ss A') : null,
              sessionduration: sessionVal.sessionduration,
              stopreason: sessionVal.stopreason,
              mac: sessionVal.mac,
              username: sessionVal.username,
              userip: sessionVal.userip,
            }
          );

        }

        $("#sessiontable").show();
        this.loading = false;
        this.dataSourceSession = new MatTableDataSource<any>(this.sessionData);
        this.dataSourceSession.sort = this.sessionsort;
        this.dataSourceSession.paginator = this.paginatorSession;
      }, error => this.toasterservice.showError(error));

  }

  fetchLineGroup() {


    this.InfraService.getLineGroup(this.id).subscribe(
      data => {
        this.linegroupData = [];
        this.linegrouplistData = data;
        this.lgSecondlevel = [];

        this.InfraService.getLineGroupSpeed().subscribe(
          data2 => {
            this.linegroupspeedlistData = data2;

            this.InfraService.getLineGroupUserBandwidth().subscribe(
              data3 => {
                this.linegroupuserbandwidthlistData = data3;

                this.InfraService.getLineGroupSubnet().subscribe(
                  data4 => {
                    this.linegroupsubnetlistData = data4;

                    this.InfraService.getLineGroupSubnetService().subscribe(
                      data5 => {
                        this.linegroupsubnetservicelistData = data5;


                        for (let linegroupVal of this.linegrouplistData['result']) {

                          for (let linegroupspeed of this.linegroupspeedlistData['result']) {
                            if (linegroupVal.id == linegroupspeed.linegroup_id)
                              this.linegroupspeed = linegroupspeed.speedDownstream + '/' + linegroupspeed.speedUpstream;
                          }

                          for (let linegroupuserbandwidth of this.linegroupuserbandwidthlistData['result']) {
                            if (linegroupVal.userBandWidth_id == linegroupuserbandwidth.id)
                              this.linegroupuserbandwidth = linegroupuserbandwidth.profile;
                          }

                          for (let linegroupsubnet of this.linegroupsubnetlistData['result']) {
                            if (linegroupVal.id == linegroupsubnet.linegroup_id)
                              for (let linegroupsubnetservice of this.linegroupsubnetservicelistData['result']) {

                                if (linegroupsubnet.service_id == linegroupsubnetservice.id)
                                  if (linegroupsubnetservice.id == '2') {
                                    this.leasetime = linegroupsubnet.leaseTime;
                                    this.ipstart = linegroupsubnet.ipStart;
                                    this.range = linegroupsubnet.ipStart + '-' + linegroupsubnet.ipEnd;
                                  } else if (linegroupsubnetservice.id == '3') {
                                    this.mleasetime = linegroupsubnet.leaseTime;
                                    this.mipstart = linegroupsubnet.ipStart;
                                    this.mrange = linegroupsubnet.ipStart + '-' + linegroupsubnet.ipEnd;
                                  }

                              }

                          }





                          this.lgSecondlevel.push(
                            {
                              name: 'Hotspots leasetijd ',
                              value: Math.floor(this.leasetime % 3600 / 60) + ' ' + 'min'

                            },
                            {
                              name: 'Hotspots subnet',
                              value: this.ipstart

                            },
                            {
                              name: 'Hotspots range',
                              value: this.range

                            },
                            {
                              name: 'Mgmt leasetijd',
                              value: ''
                            },
                            {
                              name: 'Mgmt subnet',
                              value: this.mipstart
                            },
                            {
                              name: 'Mgmt range',
                              value: this.mrange
                            },


                          );


                          this.linegroupData.push(
                            {
                              Linegroupid: linegroupVal.id,
                              Speed: this.linegroupspeed,
                              Profile: this.linegroupuserbandwidth,
                              QOS: '- / -',
                              MRTG: 'Open',
                              secondlevel: this.lgSecondlevel,
                            }
                          );

                        }


                        this.loading = false;
                        this.dataSourceLineGroup = new MatTableDataSource<any>(this.linegroupData);
                        this.dataSourceLineGroup.sort = this.linegroupsort;
                        this.dataSourceLineGroup.paginator = this.paginatorLineGroup;
                      }, error => this.toasterservice.showError(error));
                  }, error => this.toasterservice.showError(error));
              }, error => this.toasterservice.showError(error));
          }, error => this.toasterservice.showError(error));
      }, error => this.toasterservice.showError(error));

  }



  applyFilterContact(filterValue: string) {
    this.dataSourceMonitoring.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceMonitoring.paginator) {
      this.dataSourceMonitoring.paginator.firstPage();
    }
  }
  applyFilterSession(filterValue: string) {
    this.dataSourceSession.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceSession.paginator) {
      this.dataSourceSession.paginator.firstPage();
    }
  }
  applyFilterLineGroup(filterValue: string) {
    this.dataSourceLineGroup.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceLineGroup.paginator) {
      this.dataSourceLineGroup.paginator.firstPage();
    }
  }
  applyFilterDevice(filterValue: string) {
    this.dataSourceDevice.filter = filterValue.trim().toLowerCase();
    this.dataSourceDevice_u.filter = filterValue.trim().toLowerCase();
    this.dataSourceDeviceCritical.filter = filterValue.trim().toLowerCase();
    this.dataSourceDevice_u_Critical.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceDevice.paginator || this.dataSourceDeviceCritical.paginator) {
      this.dataSourceDevice.paginator.firstPage();
      this.dataSourceDeviceCritical.paginator.firstPage();
    }

  }

  toggleMonitoringTable() {

    this.isExpand = !this.isExpand;

    if (this.isExpand == true) {
      $('#monitoring').show();

    } else {
      $('#monitoring').hide();
    }
  }
  toggleHardwareTable() {
    this.isExpand = !this.isExpand;

    if (this.isExpand == true) {
      $('#hardware').show();
      $('#hardwareCritical').hide();
      $('#hardwareWarning').hide();


    } else {
      $('#hardware').hide();
    }
  }

  toggleAllTable() {
    this.isExpand = !this.isExpand;

    if (this.isExpand == true) {
      $('#hardware').show();

    } else {
      $('#hardware').hide();
      $('#hardwareCritical').hide();
      $('#hardwareWarning').hide();
    }
  }

  toggleHardwareTableCritical() {
    this.isExpandCrit = !this.isExpandCrit;

    if (this.isExpandCrit == true) {
      $('#hardwareCritical').show();
      $('#hardware').hide();
      $('#hardwareWarning').hide();

    } else {
      $('#hardwareCritical').hide();
    }
  }
  toggleHardwareTableWarning() {
    this.isExpandWarn = !this.isExpandWarn;

    if (this.isExpandWarn == true) {
      $('#hardwareWarning').show();
      $('#hardwareCritical').hide();
      $('#hardware').hide();

    } else {
      $('#hardwareWarning').hide();
    }
  }
  toggleSessionTable() {
    this.isExpand = !this.isExpand;

    if (this.isExpand == true) {
      $('#sessionFilter').show();

    } else {
      $('#sessionFilter').hide();
    }
  }

  showExpand(elementid) {
    $('#info_icon' + elementid).hide();
    $('#arrow_icon' + elementid).show();
    $('#expand_id' + elementid).show();

    //$('#info_icon_addon' + elementid).show();
    //$('#arrow_icon_addon' + elementid).hide();
    //$('#expand_id_addon' + elementid).hide();
  }

  hideExpand(elementid) {
    $('#info_icon' + elementid).show();
    $('#arrow_icon' + elementid).hide();
    $('#expand_id' + elementid).hide();
  }
  formatdatehst(createddate) {
    return this.datePipe.transform(new Date(createddate), 'dd-MM-yyyy');
  }

  openDialogAdd(action) {
    const dialogRef = this.dialog.open(MonitoringTicketdialogBoxComponent, {
      width: '60%',
      data: {
        locationid: this.id, location_name: this.location_name,
        locationdata: this.location_details,
        action: action
      }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        //this.getTicketList();
      }
    }, error => this.toasterservice.showError(error));
  }
  getPropertyAll() {
    this._locationService.getAllLocationProperty().subscribe(data => {
      this.locationproperty = data;

    }, error => this.toasterservice.showError(error));
  }
}