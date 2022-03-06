import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { routerTransition } from '../router.animations';
import { CommonService } from 'src/app/_services/common.service';
import { ToasterService } from '../_services/toastr.service';

@Component({
  selector: 'app-catalogueview',
  templateUrl: './catalogueview.component.html',
  styleUrls: ['./catalogueview.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    routerTransition()
  ],
})
export class CatalogueviewComponent implements OnInit {

  navLinks: any;
  activeLinkIndex = -1;
  cataloguetabSectionList: any[] = [];

  constructor(
    public router: Router,
    public _commonService: CommonService,
    private toasterservice: ToasterService,
  ) {
    this.navLinks = [
      {
      icon: "access_time",
      id: 1,
      indexno: 1,
      label: "Product Catalogus",
      type: "ProductCatalogus",
      link: "/catalogueview/product-catalogue"
    },
    {
      icon: "access_time",
      id: 2,
      indexno: 2,
      label: "Keten",
      type: "Keten",
      link: "/catalogueview/chain"
    },
    {
      icon: "access_time",
      id: 3,
      indexno: 3,
      label: "Account Manager",
      type: "AccountManager",
      link: "/catalogueview/accounts"
    }
    ]
    /*this._locationService.getTabList('2').subscribe(data => {
      this.navLinks = data;
    });*/

    this.cataloguetabSectionList = this._commonService.getSectionList('CatalogueTab');
    console.log('catalogue tab',this.cataloguetabSectionList);
   }

  ngOnInit(): void {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    }, error => this.toasterservice.showError(error));
  }

}
