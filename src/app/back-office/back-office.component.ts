import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { routerTransition } from '../router.animations';
import { LocationService } from '../_services/location.service';
import { ToasterService } from '../_services/toastr.service';


declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-back-office',
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    routerTransition()
  ],
})

export class BackOfficeComponent implements OnInit, AfterViewInit {
  loading = false;
  navLinks: any;
  activeLinkIndex = -1;
 
 

  constructor(
    private router: Router,
    private _locationService: LocationService,
    private toasterservice: ToasterService,
    
  ) {
sessionStorage.removeItem('sessionSatelliteID');
    /*this._locationService.getTabList('1').subscribe(data => {
    this.navLinks = data;
    //console.log(this.navLinks);
  });*/
}

  ngOnInit(): void {
    /*this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });*/

    

  }
  ngAfterViewInit(): void {

  }

}