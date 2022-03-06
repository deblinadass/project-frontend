import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { routerTransition } from '../router.animations';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { LocationService } from '../_services/location.service';
import { MainlocationModel } from '../_models/mainlocation.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { ToasterService } from '../_services/toastr.service';
//import {Md5} from 'ts-md5/dist/md5';
declare var $: any;

@Component({
  selector: 'app-mainlocationview',
  templateUrl: './mainlocationview.component.html',
  styleUrls: ['./mainlocationview.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    routerTransition()
  ],
})

export class MainlocationviewComponent implements OnInit, AfterViewInit {
  id;
  location_details: any;
  locationchain: any;
  locationcountry: any;
  locations_list: any;
  locationproperty: any[];
  loading = true;
  displayedMultiServiceColumns: string[] = ['customername', 'streetname', 'housenumber', 'housenumberaddition', 'postcode', 'city', 'action'];
  dataSourceMulti = new MatTableDataSource<any>();
  locationNoteForm: FormGroup;
  noteicon;
  chainlist = new Map<number, string>();
  tabSectionList: any[] = [];

  @ViewChild('paginatorMulti', { static: true }) paginatorMulti: MatPaginator;
  @ViewChild('mainsort', { static: true }) mainsort: MatSort;

  displayedColumns2: string[] = ['customername', 'streetname', 'postcode', 'city'];
  dataSource2 = new MatTableDataSource<MainlocationModel>();

  navLinks: any;
  currentUrl;
  activeLinkIndex = -1;

  @ViewChild('paginator2', { static: true }) paginator2: MatPaginator;
  @ViewChild('outerSort2', { static: true }) outerSort2: MatSort;

  constructor(
    public router: Router,
    private _Activatedroute: ActivatedRoute,
    private _locationService: LocationService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    public _commonService: CommonService,
    private toasterservice: ToasterService,
  ) {
    sessionStorage.removeItem('sessionSatelliteID');
    if (sessionStorage.getItem('sessionMainID')) {
      this.id = sessionStorage.getItem('sessionMainID');
      sessionStorage.setItem('ComarchLocationID', sessionStorage.getItem('sessionMainID'));
    } else {
      sessionStorage.setItem('sessionMainID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionMainID');
      sessionStorage.setItem('ComarchLocationID', sessionStorage.getItem('sessionMainID'));
    }
    this.tabSectionList = this._commonService.getSectionList('MainLocationView');
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;

    this._locationService.getTabList('5').subscribe(data => {
      this.navLinks = data;
      this.activeLinkIndex = this.navLinks.find(tab => tab.link == this.router.url).link;
    },err => this.toasterservice.showError(err));

    $('.progress-spinner').show();
    this.dataSourceMulti.paginator = this.paginatorMulti;
    this.dataSourceMulti.sort = this.mainsort;
    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.sort = this.outerSort2;
    this.getPropertyAll();
    this.location_details = this.getLocationDetails();
  }

  ngAfterViewInit(): void {
    //this.getSubLocationList();
  }

  applyFilter(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  getLocationDetails() {
    this._locationService.location_details(this.id).subscribe(
      data => {
        this.location_details = data;
        this.locationNoteForm = this.formBuilder.group({
          locationnote: [this.location_details.locationnote],
          customertypeid: [this.location_details.customertypeid],
          parentcustomerid: [this.location_details.parentcustomerid],
          customername: [this.location_details.customername],
        });
        this.loading = false;
        this._locationService.getLocationChainId(data.chainid).subscribe(datachain => {
          this.locationchain = datachain['result'][0]['chainname'];
          this._locationService.getLocationCountryId(data.country).subscribe(datacountry => {
            this.locationcountry = datacountry['result'][0]['countryname'];
            this.location_details.customerid = (data.customerid) ? data.customerid + ',' : '';
            this.location_details.city = (data.city) ? ' ' + data.city : '';
            this.location_details.postcode = (data.postcode) ? ', ' + data.postcode : '';
            this.location_details.locationtypeid = this.locationproperty.find(r => r.customerattribute == 'locationtype' && r.customerpropertyvalue == this.location_details.locationtypeid
            ).customerpropertyname;
            this.location_details.accountmanagerid = this.locationproperty.find(r => r.customerattribute == 'accountmanager' && r.customerpropertyvalue == this.location_details.accountmanagerid
            ).customerpropertyname;
            this.location_details.streetname = (data.streetname) ? ' ' + data.streetname : '';
            this.location_details.housenumber = (data.housenumber) ? ' ' + data.housenumber : '';
            this.location_details.housenumberaddition = (data.housenumberaddition) ? ' ' + data.housenumberaddition : '';

            this.location_details.fulladdress = (this.locationcountry + this.location_details.streetname + this.location_details.housenumber + this.location_details.housenumberaddition + this.location_details.postcode + this.location_details.city) ? this.locationcountry + this.location_details.streetname + this.location_details.housenumber + this.location_details.housenumberaddition + this.location_details.postcode + this.location_details.city : 'No Adres vermeld';
            this.location_details.kvknumber = (data.kvknumber) ? data.kvknumber : 'No KvK nummer vermeld';
            this.location_details.contactpersonname = (data.contactpersonname) ? data.contactpersonname : 'No contactpersonname vermeld';
            this.location_details.contactpersontelephone = (data.contactpersontelephone) ? data.contactpersontelephone : 'No Telefoonnummer vermeld';
            this.location_details.billingreferenecenumber = (data.billingreferenecenumber) ? data.billingreferenecenumber : 'No Billing referentie vermeld';
            this.location_details.contactpersonemail = (data.contactpersonemail) ? data.contactpersonemail : 'No E-mail Adres vermeld';
            this.location_details.status = this.locationproperty.find(r => r.customerattribute == 'status' && r.customerpropertyvalue == this.location_details.status
            ).customerpropertyname;
            this.location_details.monitoring = this.locationproperty.find(r => r.customerattribute == 'monitoring' && r.customerpropertyvalue == this.location_details.monitoring
            ).customerpropertyname;
            this.location_details.locationopen = this.locationproperty.find(r => r.customerattribute == 'locationopen' && r.customerpropertyvalue == this.location_details.locationopen
            ).customerpropertyname;
            this.location_details.sla = this.locationproperty.find(r => r.customerattribute == 'sla' && r.customerpropertyvalue == this.location_details.sla
            ).customerpropertyname;
            this.location_details.istestlocation = this.locationproperty.find(r => r.customerattribute == 'istestlocation' && r.customerpropertyvalue == this.location_details.istestlocation
            ).customerpropertyname;



          },err => this.toasterservice.showError(err));
        },err => this.toasterservice.showError(err));
      },
      err => this.toasterservice.showError(err)
    );
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
  getPropertyAll() {
    this._locationService.getAllLocationProperty().subscribe(data => {
      this.locationproperty = data;
    },
      err => this.toasterservice.showError(err));
  }

  saveNotes(form: NgForm) {
    $('.overlayNotes').show();
    this.noteicon = false;
    this._locationService.updateLocationNotes(this.id, JSON.stringify(form.value))
      .subscribe(res => {
        this.location_details.locationnote = this.locationNoteForm.get('locationnote').value;
        $('.overlayNotes').hide();
      }, (err) => {this.toasterservice.showError(err);
        $('.overlayNotes').hide();
      });
  }
  cancelNotes() {
    this.locationNoteForm.get('locationnote').setValue(this.location_details.locationnote)
    this.noteicon = false;
  }
}