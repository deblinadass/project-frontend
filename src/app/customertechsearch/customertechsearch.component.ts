import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../_services/customersearch.service';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { HttpClient } from "@angular/common/http";
import { LocationService } from '../_services/location.service';
import { ToasterService } from '../_services/toastr.service';
declare var $: any;

@Component({
  selector: 'app-customertechsearch',
  templateUrl: './customertechsearch.component.html',
  styleUrls: ['./customertechsearch.component.scss'],
  animations: [routerTransition()]
})

export class CustomertechsearchComponent implements OnInit {
  @ViewChild('customerSearchInput', { static: true }) customerSearchInput: ElementRef;
  displayedMultiServiceColumns: string[] = ['customername', 'chain', 'accountmanager', 'streetname', 'postcode', 'city'];
  customer_details_table: Array<object> = [];
  dataSource = new MatTableDataSource<any>();

  exceedThreshold: boolean;
  noRecords: boolean;
  inputcheck: boolean;
  customer_details: any;
  searchVal: any;
  loading = true;
  isShow = true;
  indeterminate: String;
  techSearchTypeList;
  customerSearchType;
  constructor(public router: Router,
    private _Activatedroute: ActivatedRoute,
    private _customerService: CustomerService,
    private api: LocationService,
    private toasterservice: ToasterService,
    private httpClient: HttpClient) {
    this.exceedThreshold = false;
    this.noRecords = false;
    this.inputcheck = false;
    sessionStorage.removeItem('sessionMainID');
    sessionStorage.removeItem('sessionSatelliteID');
  }

  ngOnInit(): void {
    $('#progress-spinner-tech').hide();

    /*this.customertechsearch = this.formBuilder.group({

      customerid: this.locationid,
      description: [''],
      facturatie_status: [''],
    });*/

    this.api.getLocationProperty('TechSearchType').subscribe(data => {
      this.techSearchTypeList = data;
    }, error => this.toasterservice.showError(error));
  }

  ngAfterViewInit() {
    this.customerSearchInput.nativeElement.focus();
  };

  btnClick = function () {
    this.router.navigateByUrl('/createlocation');
  };
  search(customerVal: string, customerSearchType: string) {
    this.exceedThreshold = false;
    this.searchVal = customerVal;
    this.customerSearchType = customerSearchType;

    if (this.searchVal != '') {
      this.getCustomerDetails();
      this.isShow = false;
    }
    else
      this.inputcheck = true;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  icon = '';
  linkPath: string;
  getCustomerDetails() {
    $('#progress-spinner-tech').show();
    this.customer_details_table = [];
    this.dataSource = new MatTableDataSource<any>(this.customer_details_table);

    this._customerService.customerTechSearch_details(this.searchVal, this.customerSearchType).subscribe(

      data => {

        this.customer_details = data;

        this.loading = false;
        this.customer_details_table = [];
        if (this.customer_details.exceedThreshold == 1) {
          this.exceedThreshold = true;
        }
        for (let customers of this.customer_details.result) {
          if (customers.customertypeid == 1) {
            this.icon = 'fa fa-fw fa-building';

            this.linkPath = '../locationview/';

          } else {
            this.icon = '';
            this.linkPath = '../satellite/';

          }

          this.customer_details_table.push(
            {
              "customername": customers.customername,
              "id": customers.customerid,
              "cusomertypeid": customers.customertypeid,
              "icon": this.icon,
              "linkPath": this.linkPath,
              "streetname": customers.streetname + ' ' + customers.housenumber + ' ' + customers.housenumberaddition,
              "postcode": customers.postcode,
              "city": customers.city,
              "chain": customers.chainname,
              "accountmanager": customers.accountmanagername,
            }
          );
        }

        this.dataSource = new MatTableDataSource<any>(this.customer_details_table);
        this.noRecords = false;
        this.inputcheck = false;
        $('#progress-spinner-tech').hide();

      },
      (err) => {
        this.customer_details_table = [];
        this.dataSource = new MatTableDataSource<any>(this.customer_details_table);
        this.noRecords = true;
        this.exceedThreshold = false;
        this.inputcheck = false;
        $('#progress-spinner-tech').hide();
        this.toasterservice.showError(err);
      });
  }
}

