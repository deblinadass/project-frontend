import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { InfraService } from '../_services/infra.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ToasterService } from '../_services/toastr.service';
declare var jQuery: any;
declare const editClick: any;
declare var $: any;

@Component({
  selector: 'app-hardwarecritical',
  templateUrl: './hardwarecritical.component.html',
  styleUrls: ['./hardwarecritical.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HardwarecriticalComponent implements OnInit {
  devices: any[] = [];
  devices_u: any[] = [];
  id;
  device_list: any;
  device_list_u: any;
  attribute_value_list: any;
  loading = false;
  rowoverlay = false;
  navLinks: any[] = [];
  activeLinkIndex = -1;
  apiUrl: any;
  statusCheck: boolean = false;
  superuser: boolean;
  expandedElement: any[] = [];
  statusDateTime: any;
  statusVal;
  additionalDeviceInfo: any[] = [];

  displayedDeviceColumns: string[] = ['devicename', 'action'];
  dataSourceDevice = new MatTableDataSource<any>();
  dataSourceDevice_u = new MatTableDataSource<any>();
  @ViewChild('deviceSort', { static: true }) deviceSort: MatSort;
  @ViewChild('paginatorDevice', { static: true }) paginatorDevice: MatPaginator;

  constructor(
    public router: Router,
    private _infraService: InfraService,
    public dialog: MatDialog,
    private toasterservice: ToasterService,
  ) {
   
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.device_list = this.getHardwareCriticalM();
    this.device_list_u = this.getHardwareCriticalU();
  }

  applyFilterDevice(filterValue: string) {
    this.dataSourceDevice.filter = filterValue.trim().toLowerCase();
    this.dataSourceDevice_u.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceDevice.paginator) {
      this.dataSourceDevice.paginator.firstPage();
    }
  }

  getHardwareCriticalM() {
    this.loading = true;
    this.additionalDeviceInfo = [];
    this._infraService.getHardwareCriticalM().subscribe(
      data => {
        this.device_list = data;
        this.devices = [];
        for (let device of this.device_list['result']) {
         // this.additionalChainInfo.push();
          this.devices.push(
            {
              id: device.id,
              devicename: device.name,
              status : device.output,
              type1: device.hardwarecategory,
              type2: device.hardwaremanufacturer,
              type3: device.hardwaredevice,
              type4: device.hardwaretype,
              linegroup: device.linegroup_id,
              placement: device.placement,
              maceth: device.maceth,
            }
          );
        }
        this.loading = false;
        this.dataSourceDevice = new MatTableDataSource<any>(this.devices);
        this.dataSourceDevice.sort = this.deviceSort;
        this.dataSourceDevice.paginator = this.paginatorDevice;
      }, error => this.toasterservice.showError(error));
  }
  getHardwareCriticalU() {
    this.loading = true;
    this.additionalDeviceInfo = [];
    this._infraService.getHardwareCriticalU().subscribe(
      data => {
        this.device_list_u = data;
        this.devices_u = [];
        for (let device of this.device_list_u['result']) {
         // this.additionalChainInfo.push();
          this.devices_u.push(
            {
              id: device.id,
              devicename: device.name,
              status : device.output,
              type1: device.hardwarecategory,
              type2: device.hardwaremanufacturer,
              type3: device.hardwaredevice,
              type4: device.hardwaretype,
              linegroup: device.linegroup_id,
              placement: device.placement,
              maceth: device.maceth,

            }
          );
        }
        this.loading = false;
        this.dataSourceDevice_u = new MatTableDataSource<any>(this.devices_u);
        this.dataSourceDevice.sort = this.deviceSort;
        this.dataSourceDevice_u.paginator = this.paginatorDevice;
      }, error => this.toasterservice.showError(error));
  }

  
}
