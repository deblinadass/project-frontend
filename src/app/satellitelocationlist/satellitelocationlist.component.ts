import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { LocationService } from '../_services/location.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MainlocationModel } from '../_models/mainlocation.model';
import moment from "moment";
import 'moment-timezone';
import { CommonService } from '../_services/common.service';
import { ToasterService } from '../_services/toastr.service';

moment.tz.setDefault('Europe/Amsterdam');

declare var jQuery: any;
declare const editClick: any;
declare var $: any;

@Component({
  selector: 'app-satellitelocationlist',
  templateUrl: './satellitelocationlist.component.html',
  styleUrls: ['./satellitelocationlist.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class SatelliteLocationListComponent implements OnInit, AfterViewInit {
  id;
  locations_list: any;
  displayedColumns2: string[] = ['customerid','customername', 'streetname', 'postcode', 'city'];
  dataSource2 = new MatTableDataSource<MainlocationModel>();
  tabSectionList: any[] = [];

  @ViewChild('paginator2', { static: true }) paginator2: MatPaginator;
  @ViewChild('outerSort2', { static: true }) outerSort2: MatSort;

  constructor(
    public router: Router,
    private _locationService: LocationService,
    public _commonService: CommonService,
    private toasterservice: ToasterService,

  ) {
    sessionStorage.removeItem('sessionSatelliteID');
    if (sessionStorage.getItem('sessionMainID')) {
      this.id = sessionStorage.getItem('sessionMainID');
    } else {
      sessionStorage.setItem('sessionMainID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionMainID');
    }
    this.tabSectionList = this._commonService.getSectionList('MainLocationView');
  }

  ngOnInit() {
    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.sort = this.outerSort2;
  }

  ngAfterViewInit(): void {
    this.getSubLocationList();
  }

  getSubLocationList() {
    this._locationService.sublocation_list(this.id).subscribe(
      data => {
        this.locations_list = data;
        this.dataSource2 = new MatTableDataSource<MainlocationModel>(this.locations_list);
        this.dataSource2.sort = this.outerSort2;
        this.dataSource2.paginator = this.paginator2;
      },
      err => this.toasterservice.showError(err)
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
}
