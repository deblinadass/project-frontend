import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../../../_services/authentication.service';
import { CommonService } from 'src/app/_services/common.service';

declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    isActive: boolean;
    collapsed: boolean=false;
    showMenu: string;
    pushRightClass: string;
    superuser: boolean;
    cstabSectionList: any[] = [];
    eutabSectionList: any[] = [];
    catalogueMenuList: any[] = [];
    exportMenuList: any[] = [];
    backofficeNavList: any[] = [];
    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(private authenticationservice : AuthenticationService, public router: Router, public _commonService: CommonService) {
        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });

        this.cstabSectionList = this._commonService.getSectionList('CustomerSearch');
        this.eutabSectionList = this._commonService.getSectionList('EnduserSearch');
        this.catalogueMenuList = this._commonService.getSectionList('CatalogueMenu');
        this.exportMenuList = this._commonService.getSectionList('ExportMenu');
        this.backofficeNavList = this._commonService.getSectionList('BackofficeNav');
        
    }

    ngOnInit() {
        if(!this.authenticationservice.isLoggedIn())
        {
            this.authenticationservice.clearSessionData();
            this.router.navigate(['/login']);
        }
        
        
        this.isActive = false;
        this.collapsed = false;
        this.showMenu = '';
        this.pushRightClass = 'push-right';
        this.superuser = this.authenticationservice.isSuperUser();
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
        const dom: any = document.querySelector('#toggleId');
        if(this.collapsed){            
            dom.setclass="fa fa-fw fa-angle-double-right";
        }
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

}
