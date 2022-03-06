import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { LocationService } from '../_services/location.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ChaindialogBoxComponent } from '../chaindialog-box/chaindialog-box.component';
import { CommonService } from '../_services/common.service';
import { ToasterService } from '../_services/toastr.service';
declare var jQuery: any;
declare const editClick: any;
declare var $: any;

@Component({
  selector: 'app-chain',
  templateUrl: './chain.component.html',
  styleUrls: ['./chain.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ChainComponent implements OnInit {
  chains: any[] = [];
  id;
  chain_list: any;
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
  additionalChainInfo: any[] = [];
  tabSectionList: any[] = [];

  displayedChainColumns: string[] = ['chainname', 'action'];
  dataSourceChain = new MatTableDataSource<any>();
  @ViewChild('chainSort', { static: true }) chainSort: MatSort;
  @ViewChild('paginatorChain', { static: true }) paginatorChain: MatPaginator;

  constructor(
    public router: Router,
    private _locationService: LocationService,
    public dialog: MatDialog,
    public _commonService: CommonService,
    private toasterservice: ToasterService,
  ) {
    this.tabSectionList = this._commonService.getSectionList('CatalogueTab');
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.chain_list = this.getChainList();
  }

  applyFilterChain(filterValue: string) {
    this.dataSourceChain.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceChain.paginator) {
      this.dataSourceChain.paginator.firstPage();
    }
  }

  getChainList() {
    this.loading = true;
    this.additionalChainInfo = [];
    this._locationService.getChainList().subscribe(
      data => {
        this.chain_list = data;
        this.chains = [];
        for (let chain of this.chain_list) {
         // this.additionalChainInfo.push();
          this.chains.push(
            {
              id: chain.chainid,
              chainname: chain.chainname,
            }
          );
        }
        this.loading = false;
        this.dataSourceChain = new MatTableDataSource<any>(this.chains);
        this.dataSourceChain.sort = this.chainSort;
        this.dataSourceChain.paginator = this.paginatorChain;
      }, error => this.toasterservice.showError(error));
  }

  openDialogAdd(action) {
    const dialogRef = this.dialog.open(ChaindialogBoxComponent, {
      width: '860px',
      data: { action: action}, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getChainList();
      }
    }, error => this.toasterservice.showError(error));

  }
  openDialog(action, obj) {
    obj.action = action;
    obj.locationid = this.id;
    const dialogRef = this.dialog.open(ChaindialogBoxComponent, {
      width: '60%',
      data: obj, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {
       // this.getChainList();
      }
    }, error => this.toasterservice.showError(error));
  }
  openDialogEdit(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    //element.locationid = this.id;
    const dialogRef = this.dialog.open(ChaindialogBoxComponent, {
      width: '860px',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event == 'Update') {
        this.getChainList();
      }
      $('#rowoverlay' + element.id).hide();
    }, error => this.toasterservice.showError(error));
  }
}
