import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EnduserService } from '../_services/EnduserService.service';
import { DatePipe } from '@angular/common';
import { ToasterService } from '../_services/toastr.service';


declare var jQuery: any;
declare const editClick: any;
const SECOND = 6;
const MINUTE = 5;
const HOUR = 4;
const DAY = 3;
const MONTH = 2;
const YEAR = 1;
declare var $: any;
export class subscriptionModel {
  status: string;
}


@Component({
  selector: 'app-abonnement',
  templateUrl: './abonnement.component.html',
  styleUrls: ['./abonnement.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AbonnementComponent implements OnInit {
  id;
  subscriptionList: any;
  accountList: any;
  abonnemnent;
  soort;
  provider;
  seconds;
  eind;
  remaintime;
  eindSeconds;
  displayedAbonnement: string[] = ['Status', 'Abonnement', 'Soort', 'Provider', 'Resterende', 'Vervaldatum'];
  routerCurrentURL;
  accountProvider: Array<string> = ['2', '26', '27', '28'];
  dataSourceAbonnement = new MatTableDataSource<subscriptionModel>();
  expandedElement: any[] = [];
  subscription: any[] = [];
  loading = false;

  @ViewChild('abonnementsort', { static: true }) abonnementsort: MatSort;
  @ViewChild('paginatorAbonnement', { static: true }) paginatorAbonnement: MatPaginator;
  constructor(
    public router: Router,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private _enduserService: EnduserService,
    private toasterservice: ToasterService,

  ) {
    $('.mat-tab-link').removeClass('mat-tab-label-active');
    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.id = sessionStorage.getItem('sessionSatelliteID');
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionSatelliteID');
    }
  }

  ngOnInit(): void {
    this.dataSourceAbonnement.paginator = this.paginatorAbonnement;
    this.dataSourceAbonnement.sort = this.abonnementsort;
    this.subscriptionList = this.getsubscriptionlist();
  }
  getsubscriptionlist() {
    this.loading = true;
    this._enduserService.fetchAccount(this.id).subscribe(
      data => {
        this.accountList = data;
        this._enduserService.fetchSubscription(this.id).subscribe(
          data1 => {
            this.subscription = [];
            this.subscriptionList = data1;

            if (this.accountProvider.indexOf(this.accountList['result'][0]['provider_id']))
              this.abonnemnent = 'SMS';

            else if (this.accountList['result'][0]['status'] == 'ACTIVATED' && this.accountList['result'][0]['provider_id'] == 2)
              this.abonnemnent = 'Creditcard';

            else if (this.accountList['result'][0]['accountsubscriptiontype'] == 2 || this.accountList['result'][0]['accountsubscriptiontype'] == 3)
              this.abonnemnent = 'Automatische incasso';
            else
              this.abonnemnent = 'Geen';

            if (this.accountList['result'][0]['accountsubscriptiontype'] == 2)
              this.soort = "KPN HotSpots / T-Mobile";
            else if (this.accountList['result'][0]['accountsubscriptiontype'] == 3)
              this.soort = "KPN HotSpots";
            else
              this.soort = "Geen";

            if (this.accountList['result'][0]['provider_id'] == "")
              this.provider = "KPN HotSpots";
            else
              this.provider = this.accountList['result'][0]['provider_id'];

            this.seconds = this.subscriptionList['result'][0]['secondsleft'];
            this.eind = this.subscriptionList['result'][0]['expdate'];
            var timeInSeconds = new Date().getTime() / 1000;
            this.eindSeconds = new Date(this.eind);
            this.eindSeconds = this.eindSeconds / 1000;
            if (this.seconds > (this.eindSeconds - timeInSeconds)) this.seconds = this.eindSeconds - timeInSeconds;
            if (this.eind.length < 1 || this.seconds < 1) {
              this.remaintime = "Account is verlopen of nog niet actief";
            } else {
              this.remaintime = this.calculateTime(this.seconds, MINUTE)
            }

            this.subscription.push(
              {
                status: this.subscriptionList['result'][0]['status'],
                abonnemnent: this.abonnemnent,
                soort: this.soort,
                provider: this.provider,
                remaintime: this.remaintime,
                expdate: this.subscriptionList['result'][0]['expdate'],
              }
            );

            this.dataSourceAbonnement = new MatTableDataSource<any>(this.subscription);
            this.dataSourceAbonnement.sort = this.abonnementsort;
            this.dataSourceAbonnement.paginator = this.paginatorAbonnement;
            this.loading = false;

          }, error => this.toasterservice.showError(error));
      }, error => this.toasterservice.showError(error));

  }

  calculateTime($seconds, $detail = 6) {
    let $str = "";
    let $years = $seconds / 30660000;
    $seconds -= $years * 30660000;

    let $months = $seconds / 2678400;
    $seconds -= $months * 2678400;

    let $days = $seconds / 86400;
    $seconds -= $days * 86400;

    let $hours = $seconds / 3600;
    $seconds -= $hours * 3600;

    let $minutes = $seconds / 60;
    $seconds -= $minutes * 60;

    if ($years && $detail >= YEAR) $str = $str + $years + 'j ';
    if ($months && $detail >= MONTH) $str = $str + $months + 'm ';
    if ($days && $detail >= DAY) $str = $str + $days + 'd ';
    if ($hours && $detail >= HOUR) $str = $str + $hours + 'u ';
    if ($minutes && $detail >= MINUTE) $str = $str + $minutes + 'm ';
    if ($seconds && $detail >= SECOND) $str = $str + $seconds + 's';

    return $str;
  }



  showExpand(elementid) {
    $('#info_icon' + elementid).hide();
    $('#arrow_icon' + elementid).show();
    $('#expand_id' + elementid).show();
  }

  hideExpand(elementid) {
    $('#info_icon' + elementid).show();
    $('#arrow_icon' + elementid).hide();
    $('#expand_id' + elementid).hide();
  }
  toggleRow(element) {
    element.Extra ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
  }
  checkExpanded(element): boolean {
    let flag = false;
    this.expandedElement.forEach(e => {
      if (e === element) {
        flag = true;
      }
    });
    return flag;
  }
  pushPopElement(element) {
    const index = this.expandedElement.indexOf(element);
    if (index === -1) {
      this.expandedElement.push(element);
    } else {
      this.expandedElement.splice(index, 1);
    }
  }

  formatdatehst(deliverydate) {
    return this.datePipe.transform(new Date(deliverydate), 'dd-MM-yyyy');
  }
}
