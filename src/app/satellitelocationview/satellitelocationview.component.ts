import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, RouterLinkActive, Routes } from '@angular/router';
import { FormBuilder, Validators, FormArray, ValidatorFn, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { LocationService } from '../_services/location.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { routerTransition } from '../router.animations';

import { ReplaySubject, Subject } from 'rxjs';
import { VERSION } from '@angular/material/core';
import { MatSelectSearchVersion } from 'ngx-mat-select-search';
import { AuthenticationService } from '../_services/authentication.service';

import { SatelliteDialogBoxComponent } from '../satellite-dialog-box/satellite-dialog-box.component';
import { CommonService } from '../_services/common.service';
import { ToasterService } from '../_services/toastr.service';

declare var $: any;


export interface ProductData {
  productid: number;
  cas_number: string;
  product_status: string;
  hardware: string;
  channel_package: string;
  hardware_partner: string;
  price: number;
  channel_package_id: string;
  action: string;
}

export class ProductInstallbaseListModel {
  id: number;
  productattributevaluesi: ProductAttributeModel[] = [];
}

export class ProductAttributeModel {
  productattribute: number;
  productattributevalue: string;
}

export interface ProductDataList {
  cas_number: string;
  hardware: string;
  channel_package: string;
  hardware_partner: string;
  price: number;
  channel_package_id: string;
}

export class ProductAttr {
  prodarr: string;
}

export interface PeriodicElement1 {
  position: number;

  names: { name: String }[]
}

export interface PeriodicElement {
  id: number;
  productattributevaluesi: { productattribute: Number, productattributevalue: String }[]
}

@Component({
  selector: 'app-satellitelocationview',
  templateUrl: './satellitelocationview.component.html',
  styleUrls: ['./satellitelocationview.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    routerTransition()
  ],
})

export class SatellitelocationviewComponent implements OnInit, AfterViewInit {

  locations_list_table: any[] = [];
  id;
  locationchain: any;
  locationcountry: any;
  locationproperty: any[];
  location_details: any;
  locations_list: any;
  product_list: any;
  attribute_value_list: any;
  loading = true;
  navLinks: any;
  activeLinkIndex = -1;
  dataAdd;
  change_status_value: any;
  hardwareList: any;
  channelPackageList: any;
  routerCurrentURL;
  satelliteID;
  indeterminate: String;
  superuser: boolean;
  dialogValue;
  noteicon: boolean = false;
  customertypeid = '2'

  @ViewChild('digitenneSort', { static: true }) digitenneSort: MatSort;
  @ViewChild('paginatorDigitenne', { static: true }) paginatorDigitenne: MatPaginator;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  displayedDigitenneColumns: string[] = ['cas_number', 'hardware', 'channel_package', 'hardware_partner', 'price', 'status', 'action'];

  dataSourceDigitenne = new MatTableDataSource<ProductInstallbaseListModel>();

  displayedColumns: string[] = ['cas_number', 'status', 'hardware', 'hardware_partner', 'channel_package', 'price', 'action'];
  dataSource = new MatTableDataSource<ProductInstallbaseListModel>();

  /********************** Auto Search For Satellite Move *************************/
  version = VERSION;
  matSelectSearchVersion = MatSelectSearchVersion;
  satelliteRelocateForm: FormGroup;
  productsatelliteRelocateForm: FormGroup;
  locationNoteForm: FormGroup;

  fetchedProductID;
  currentUrl;
  tabSectionList: any[] = [];
  /** list of locations */

  protected locationsSatellite;
  protected productsSatellite;
  /** control for the selected bank for server side filtering */

  public locationServerSideSatelliteCtrl: FormControl = new FormControl();
  public productServerSideSatelliteCtrl: FormControl = new FormControl();



  /** control for filter for server side. */

  public locationServerSideSatelliteFilteringCtrl: FormControl = new FormControl();
  public productServerSideSatelliteFilteringCtrl: FormControl = new FormControl();
  /** indicate search operation is in progress */
  public searchingSatellite: boolean = false;
  public searchingSatelliteProduct: boolean = false;

  /** list of banks filtered after simulating server side search */


  /** Subject that emits when the component has been destroyed. */
  protected _onDestroySatellite = new Subject<void>();
  protected _onDestroySatelliteProduct = new Subject<void>();
  /********************** Auto Search For Satellite Move *************************/

  constructor(
    public router: Router,
    private _locationService: LocationService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private authenticationservice: AuthenticationService,
    public _commonService: CommonService,
    private toasterservice: ToasterService,
  ) {

    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.id = sessionStorage.getItem('sessionSatelliteID');
      sessionStorage.setItem('ComarchLocationID', sessionStorage.getItem('sessionSatelliteID'));
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionSatelliteID');
      sessionStorage.setItem('ComarchLocationID', sessionStorage.getItem('sessionSatelliteID'));
    }

    this._locationService.getTabList('2').subscribe(data => {
      this.navLinks = data;
    }, err => this.toasterservice.showError(err));
    this.tabSectionList = this._commonService.getSectionList('SatelliteLocationView');
  }

  ngOnInit() {
    this.getPropertyAll();
    this.currentUrl = this.router.url;

    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    }, err => this.toasterservice.showError(err));

    this.superuser = this.authenticationservice.isSuperUser();


    /********************* Auto Search Satellite Move ***************************/
    this.satelliteRelocateForm = this.formBuilder.group({
      parentcustomerid: ['', Validators.required]
    });

    this.productsatelliteRelocateForm = this.formBuilder.group({
      location_id: ['', Validators.required],
      product_id: ['']
    });

    this.dataSource.paginator = this.paginatorDigitenne;
    this.dataSource.sort = this.digitenneSort;

    this.dataSourceDigitenne.paginator = this.paginatorDigitenne;
    this.dataSourceDigitenne.sort = this.digitenneSort;

    this._locationService.location_details(this.id).subscribe(
      data => {
        this.location_details = data;
        this.loading = false;
        this.locationNoteForm = this.formBuilder.group({
          locationnote: [this.location_details.locationnote],
          customertypeid: [this.location_details.customertypeid],
          parentcustomerid: [this.location_details.parentcustomerid],
          customername: [this.location_details.customername],
        });
        this._locationService.getLocationChainId(data.chainid).subscribe(datachain => {
          this.locationchain = datachain['result'][0]['chainname'];
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
            this.location_details.kvknumber = (data.kvknumber) ? data.kvknumber : 'No KvK nummer vermeld';
            this.location_details.contactpersonname = (data.contactpersonname) ? data.contactpersonname : 'No contactpersonname vermeld';
            this.location_details.contactpersontelephone = (data.contactpersontelephone) ? data.contactpersontelephone : 'No Telefoonnummer vermeld';
            this.location_details.billingreferenecenumber = (data.billingreferenecenumber) ? data.billingreferenecenumber : 'No Billing referentie vermeld';
            this.location_details.contactpersonemail = (data.contactpersonemail) ? data.contactpersonemail : 'No E-mail Adres vermeld';
            this.location_details.parentcustomerid = data.parentcustomerid;
            this.location_details.locationnote = data.locationnote;
            this.location_details.customertypeid = data.customertypeid;
            this.location_details.customername = data.customername;
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

            //Setting Contract Inheritance
            sessionStorage.setItem('SatContractInheritance', this.location_details.contractinheritance);


          }, err => this.toasterservice.showError(err));
        }, err => this.toasterservice.showError(err));
      }, err => this.toasterservice.showError(err));

  }
  ngAfterViewInit(): void {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public hasErrorSatelliteRelocate = (controlName: string, errorName: string) => {
    return this.satelliteRelocateForm.controls[controlName].hasError(errorName);
  }

  public hasErrorProductRelocate = (controlName: string, errorName: string) => {
    return this.productsatelliteRelocateForm.controls[controlName].hasError(errorName);
  }


  getPropertyAll() {
    this._locationService.getAllLocationProperty().subscribe(data => {
      this.locationproperty = data;

    }, err => this.toasterservice.showError(err));
  }

  openDialog(action, parentcustomerid) {

    const dialogRef = this.dialog.open(SatelliteDialogBoxComponent, {
      width: '60%',
      data: { locationid: this.id, action: 'Relocate', parentcustomerid: parentcustomerid }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Relocate') {
        this.dialogValue = result.data;
        this.router.navigateByUrl('/locationview', { state: { id: this.dialogValue } });
      }
    }, err => this.toasterservice.showError(err));
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