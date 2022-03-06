import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { LocationService } from '../_services/location.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountdialogBoxComponent } from '../accountdialog-box/accountdialog-box.component';
import { CommonService } from '../_services/common.service';
import { ToasterService } from '../_services/toastr.service';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AccountComponent implements OnInit, AfterViewInit {
  accounts: any[] = [];
  id;
  account_list: any;
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
  additionalAccountInfo: any[] = [];
  tabSectionList: any[] = [];

  displayedAccountColumns: string[] = ['accountname', 'accountfunction', 'accountemail', 'accounttelephone', 'accountdescription', 'action'];
  dataSourceAccount = new MatTableDataSource<any>();
  @ViewChild('accountSort', { static: true }) accountSort: MatSort;
  @ViewChild('paginatorAccount', { static: true }) paginatorAccount: MatPaginator;
  constructor(
    public router: Router,
    private _locationService: LocationService,
    public dialog: MatDialog,
    public _commonService: CommonService,
    private toasterservice: ToasterService,

  ) {
    this.tabSectionList = this._commonService.getSectionList('CatalogueTab');
    
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.account_list = this.getAccountList();
  }

  applyFilterAccount(filterValue: string) {
    this.dataSourceAccount.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceAccount.paginator) {
      this.dataSourceAccount.paginator.firstPage();
    }
  }

  getAccountList() {
    this.loading = true;
    //this.additionalAccountInfo = [];
    this._locationService.getAccountList().subscribe(
      data => {
        this.account_list = data;
        this.accounts = [];
        for (let account of this.account_list) {
          //this.additionalaccountInfo.push();
          this.accounts.push(
            {
              id: account.id,
              accountfirstname: account.accountfirstname,
              accountlastname: account.accountlastname,
              accountname: account.accountlastname + '(' + account.accountfirstname + ')',
              accountemail: account.accountemail,
              accounttelephone: account.accounttelephone,
              accountfunction: account.accountfunction,
              accountdescription: account.accountdescription,
              //additionalAccountInfo: this.additionalAccountInfo,
            }
          );
        }
        this.loading = false;
        this.dataSourceAccount = new MatTableDataSource<any>(this.accounts);
        this.dataSourceAccount.sort = this.accountSort;
        this.dataSourceAccount.paginator = this.paginatorAccount;
      }, error => this.toasterservice.showError(error));
  }

  openDialogAdd(action) {
    const dialogRef = this.dialog.open(AccountdialogBoxComponent, {
      width: '860px',
      data: { locationid: this.id, action: action}, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getAccountList();
      }
    }, error => this.toasterservice.showError(error));

  }
  openDialog(action, obj) {
    obj.action = action;
    obj.locationid = this.id;
    const dialogRef = this.dialog.open(AccountdialogBoxComponent, {
      width: '60%',
      data: obj, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {
        this.getAccountList();
      }
    }, error => this.toasterservice.showError(error));
  }
  openDialogEdit(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    element.locationid = this.id;
    const dialogRef = this.dialog.open(AccountdialogBoxComponent, {
      width: '860px',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {
        element.accountname = result.data[0].accountlastname + '(' + result.data[0].accountfirstname + ')';
        element.accountemail = result.data[0].accountemail;
        element.accounttelephone = result.data[0].accounttelephone;
        element.accountfunction = result.data[0].accountfunction;
        element.accountdescription = result.data[0].accountdescription;
      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }

  showExpand(elementid) {
    $('#info_icon' + elementid).hide();
    $('#arrow_icon' + elementid).show();
    $('#expand_id' + elementid).show();

    $('#info_icon_addon' + elementid).show();
    $('#arrow_icon_addon' + elementid).hide();
    $('#expand_id_addon' + elementid).hide();
  }

  hideExpand(elementid) {
    $('#info_icon' + elementid).show();
    $('#arrow_icon' + elementid).hide();
    $('#expand_id' + elementid).hide();
  }

}
