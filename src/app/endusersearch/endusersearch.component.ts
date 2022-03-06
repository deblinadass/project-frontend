import { Component, OnInit, ElementRef, AfterViewInit, ViewChild, Inject, Optional, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EnduserService } from '../_services/EnduserService.service';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { HttpClient} from "@angular/common/http";
import { EndusercreateComponent } from '../endusercreate/endusercreate.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToasterService } from '../_services/toastr.service';
declare var $: any;

@Component({
  selector: 'app-endusersearch',
  templateUrl: './endusersearch.component.html',
  styleUrls: ['./endusersearch.component.scss'],
  animations: [routerTransition()]
})

export class EndusersearchComponent implements OnInit {
  @ViewChild('customerSearchInput', { static: true }) customerSearchInput: ElementRef;
  displayedColumns: string[] = ['AccountID', 'Gebruikersnaam', 'E-mailadres', 'createdate'];
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

  constructor(public router: Router,
    private _Activatedroute: ActivatedRoute,
    private _enduserService: EnduserService,
    private httpClient: HttpClient,
    private toasterservice: ToasterService,
    public dialog: MatDialog,) {
    this.exceedThreshold = false;
    this.noRecords = false;
    this.inputcheck = false;
	sessionStorage.removeItem('sessionMainID');
	sessionStorage.removeItem('sessionSatelliteID');
  }

  ngOnInit(): void {
    $('.progress-spinner').hide();
    
  }

  ngAfterViewInit() {
    this.customerSearchInput.nativeElement.focus();
 };

  btnClick = function () {
    this.router.navigateByUrl('/createlocation');
  };
  search(customerVal: string) {
    this.exceedThreshold = false;
    this.searchVal = customerVal;
    
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
    $('.progress-spinner').show();
    this.customer_details_table = [];
    this.dataSource = new MatTableDataSource<any>(this.customer_details_table);
    this.linkPath = "../enduser/";
    this._enduserService.enduserSearch_details(this.searchVal).subscribe(

      data => {
        this.customer_details = data;        
        this.loading = false;
        this.customer_details_table = [];        
       
        for (let customers of this.customer_details['result']) {          
          this.customer_details_table.push(
            {
              "id":customers.id,
              "name":customers.firstName,
              "accountid": customers.id,
              "username": customers.username,  
              "emailaddress":customers.email,
              "createdate":customers.createdate,            
              "linkPath": this.linkPath,          
              
            }
          );        
           }
           

        this.dataSource = new MatTableDataSource<any>(this.customer_details_table);
        this.noRecords = false;
        this.inputcheck = false;
        $('.progress-spinner').hide();

      },
      (err) => {
        this.customer_details_table = [];
        this.dataSource = new MatTableDataSource<any>(this.customer_details_table);
      

        this.noRecords = true;
        this.exceedThreshold = false;
        this.inputcheck = false;
        $('.progress-spinner').hide();
        this.toasterservice.showError(err);
      });
  }
  openDialogAdd(action) {
    const dialogRef = this.dialog.open(EndusercreateComponent, {
      width: '60%',
      data: {
        action: action
      }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
      }
    }, error => this.toasterservice.showError(error));

  }
}
 
