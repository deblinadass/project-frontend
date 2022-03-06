import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { LocationService } from '../_services/location.service';
import { CommonService } from '../_services/common.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ModalService } from '../modal/modal.service';
import { CustomerContactMainComponent } from '../customercontactmain/customercontactmain.component';
import moment from "moment";
import 'moment-timezone';
import { ToasterService } from '../_services/toastr.service';
moment.tz.setDefault('Europe/Amsterdam');

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-customercontactviewmain',
  templateUrl: './customercontactviewmain.component.html',
  styleUrls: ['./customercontactviewmain.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class CustomerContactViewMainComponent implements OnInit, AfterViewInit {
  contacts: any[] = [];
  id;
  contact_list: any;
  attribute_value_list: any;
  loading = true;
  rowoverlay = false;
  secondlevel;
  
  activeLinkIndex = -1;
  apiUrl: any;
  statusCheck: boolean = false;
  superuser: boolean;
  expandedElement: any[] = [];
  statusDateTime: any;
  statusVal;
  additionalContactInfo: any[] = [];
  tabsubsections: any[] = [];
  tabSectionList: any[] = [];
  
  
  displayedContactColumns: string[] = ['contactpersonname','gender', 'contactpersonemail', 'contactpersontelephone', 'contactpersonfunction', 'newsletter','nps','report','inheritance', 'action','overlayrow'];
  dataSourceContact = new MatTableDataSource<any>();
  @ViewChild('contactSort', { static: true }) contactSort: MatSort;
  @ViewChild('paginatorContact', { static: true }) paginatorContact: MatPaginator;

  constructor(
    public router: Router,
    private _locationService: LocationService,
    public _commonService: CommonService,
    public dialog: MatDialog,
    private toasterservice: ToasterService,
  ) {
    if (sessionStorage.getItem('sessionMainID')) {
      this.id = sessionStorage.getItem('sessionMainID');
    } else {
      sessionStorage.setItem('sessionMainID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionMainID');
    }
   this.tabSectionList = this._commonService.getSectionList('Contact');
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.contact_list = this.getCustomerContactList();
  }

  applyFilterContact(filterValue: string) {
    this.dataSourceContact.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceContact.paginator) {
      this.dataSourceContact.paginator.firstPage();
    }
  }

  getCustomerContactList() {
    this.additionalContactInfo = [];
    this._locationService.getCustomerContactList(this.id).subscribe(
      data => {
        this.contact_list = data;    
       
        this.contacts = [];   
        
        for (let contact of this.contact_list) {
          this.additionalContactInfo.push();         
        
          this.secondlevel = [];

                  this.secondlevel.push(
                   
                    {
                      name: 'Opmerking',
                      value:contact.contactpersondescription,
                    },
                    
                    {
                      name: ' Automatisch overerven naar sublocaties',
                      value: (contact.contactsettings[0]['inheritance'] == 1)? 'Ja':'Nee',
                    },
                     
                  );
                
          this.contacts.push(
            {
              id: contact.id,
              contactpersonfirstname: contact.contactpersonfirstname,
              contactpersonlastname: contact.contactpersonlastname,
              contactpersonname: contact.contactpersonlastname + '(' + contact.contactpersonfirstname + ')',
              contactpersonemail: contact.contactpersonemail,
              contactpersontelephone: contact.contactpersontelephone,
              contactpersonfunction: contact.contactpersonfunction,
              contactpersondescription: contact.contactpersondescription,
              genderview : (contact.gender == 1)?'M':'V',
              gender : contact.gender,
              nps:(contact.contactsettings[0]['nps'] == 1)? true:false,
              newsletter:(contact.contactsettings[0]['newsletter'] == 1)? true:false,
              report:(contact.contactsettings[0]['report'] == 1)? true:false,
              inheritance:(contact.contactsettings[0]['inheritance'] == 1)? true:false,
              secondlevel: this.secondlevel,

            }
          );
        }
       
        this.loading = false;
        this.dataSourceContact = new MatTableDataSource<any>(this.contacts);
        this.dataSourceContact.sort = this.contactSort;
        this.dataSourceContact.paginator = this.paginatorContact;
      }, error => this.toasterservice.showError(error));
  }

  openDialogAdd(action) {
    const dialogRef = this.dialog.open(CustomerContactMainComponent, {
      width: '860px',
      data: { locationid: this.id, action: action }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getCustomerContactList();
      }
    }, error => this.toasterservice.showError(error));

  }
  openDialog(action, obj) {
    obj.action = action;
    obj.locationid = this.id;
    const dialogRef = this.dialog.open(CustomerContactMainComponent, {
      width: '60%',
      data: obj, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event != 'Cancel') {
        this.getCustomerContactList();
      }
    }, error => this.toasterservice.showError(error));
  }
  openDialogEdit(action, element) {
    $('#rowoverlay' + element.id).show();
    element.action = action;
    
    element.locationid = this.id;
    const dialogRef = this.dialog.open(CustomerContactMainComponent, {
      width: '860px',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.event != 'Cancel') {
        element.contactpersonname = result.data[0].contactpersonlastname + '(' + result.data[0].contactpersonfirstname + ')';
        element.contactpersonemail = result.data[0].contactpersonemail;
        element.contactpersontelephone = result.data[0].contactpersontelephone;
        element.contactpersonfunction = result.data[0].contactpersonfunction;
        element.secondlevel[0].value = result.data[0].contactpersondescription;
        element.contactpersondescription  =  result.data[0].contactpersondescription;
        element.inheritance  =  result.data[0].inheritance;
        element.gender = result.data[0].gender;
        element.nps = result.data[0].nps;
        element.newsletter = result.data[0].newsletter;
        element.report = result.data[0].report;
        element.secondlevel[1].value = result.data[0].inheritance;
        //this.getCustomerContactList();

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
  showExpandOrder(elementid) {
    $('#info_icon_order' + elementid).hide();
    $('#arrow_icon_order' + elementid).show();
    $('#expand_id_order' + elementid).show();

    $('#info_icon_addon' + elementid).show();
    $('#arrow_icon_addon' + elementid).hide();
    $('#expand_id_addon' + elementid).hide();
  }

  hideExpandOrder(elementid) {
    $('#info_icon_order' + elementid).show();
    $('#arrow_icon_order' + elementid).hide();
    $('#expand_id_order' + elementid).hide();
  }
}
