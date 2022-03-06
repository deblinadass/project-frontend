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
import { CustomerContactdialogBoxComponent } from '../customercontactdialog-box/customercontactdialog-box.component';
import moment from "moment";
import 'moment-timezone';
import { ToasterService } from '../_services/toastr.service';
moment.tz.setDefault('Europe/Amsterdam');

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-customercontact',
  templateUrl: './customercontact.component.html',
  styleUrls: ['./customercontact.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class CustomerContactComponent implements OnInit, AfterViewInit {
  contacts: any[] = [];
  secondlevel;
  id;
  location_id;
  contact_list: any;
  attribute_value_list: any;
  loading = true;
  rowoverlay = false;

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

  displayedContactColumns: string[] = ['contactpersonname', 'gender', 'contactpersonemail', 'contactpersontelephone', 'contactpersonfunction', 'newsletter', 'nps', 'report', 'mijn', 'inheritance', 'action', 'overlayrow'];
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
    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.location_id = sessionStorage.getItem('sessionSatelliteID');
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.location_id = sessionStorage.getItem('sessionSatelliteID');
    }
    // this.tabSectionList = this._commonService.getSectionList('Contacten');
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
    this._locationService.getCustomerContactListSat(this.location_id).subscribe(
      data => {
        this.contact_list = data;

        this.contacts = [];
        for (let contact of this.contact_list) {
          this.additionalContactInfo.push();
          this.secondlevel = [];
          var mijn, mijn1, mijn2, mijn3, mijn4, mijn5;
          for (let contactsetting of contact.contactsettings) {
            if (contactsetting['customerid'] == this.location_id) {
              mijn = contactsetting['mijn'];
              mijn1 = contactsetting['mijn1'];
              mijn2 = contactsetting['mijn2'];
              mijn3 = contactsetting['mijn3'];
              mijn4 = contactsetting['mijn4'];
              mijn5 = contactsetting['mijn5'];

            }
          }

          this.secondlevel.push(

            {
              name: 'Opmerking',
              value: contact.contactpersondescription,
            },

            {
              name: 'Mijn Role 1',
              value: (mijn1 == 1) ? 'Ja' : 'Nee',
            },
            {
              name: 'Mijn Role 2',
              value: (mijn2 == 1) ? 'Ja' : 'Nee',
            },
            {
              name: 'Mijn Role 3',
              value: (mijn3 == 1) ? 'Ja' : 'Nee',
            },
            {
              name: 'Mijn Role 4',
              value: (mijn4 == 1) ? 'Ja' : 'Nee',
            },
            {
              name: 'Mijn Role 5',
              value: (mijn5 == 1) ? 'Ja' : 'Nee',
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
              additionalContactInfo: this.additionalContactInfo,
              genderview: (contact.gender == 1) ? 'M' : 'V',
              gender: contact.gender,
              nps: (contact.contactsettings[0]['nps'] == 1) ? true : false,
              newsletter: (contact.contactsettings[0]['newsletter'] == 1) ? true : false,
              report: (contact.contactsettings[0]['report'] == 1) ? true : false,
              inheritance: (contact.contactsettings[0]['inheritance'] == 1) ? true : false,
              mijn: (mijn == 1) ? true : false,
              mijn1: (mijn1 == 1) ? true : false,
              mijn2: (mijn2 == 1) ? true : false,
              mijn3: (mijn3 == 1) ? true : false,
              mijn4: (mijn4 == 1) ? true : false,
              mijn5: (mijn5 == 1) ? true : false,
              secondlevel: this.secondlevel,
              satlocationid: this.location_id,
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
    const dialogRef = this.dialog.open(CustomerContactdialogBoxComponent, {
      width: '960px',
      data: { locationid: this.location_id, action: action }, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getCustomerContactList();
      }
    }, error => this.toasterservice.showError(error));

  }
  openDialog(action, obj) {
    obj.action = action;
    obj.locationid = this.location_id;
    const dialogRef = this.dialog.open(CustomerContactdialogBoxComponent, {
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
    element.locationid = this.location_id;
    const dialogRef = this.dialog.open(CustomerContactdialogBoxComponent, {
      width: '960px',
      data: element, disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {


      if (result.event != 'Cancel') {
        element.contactpersonname = result.data[0].contactpersonlastname + '(' + result.data[0].contactpersonfirstname + ')';
        element.contactpersonemail = result.data[0].contactpersonemail;
        element.contactpersontelephone = result.data[0].contactpersontelephone;
        element.contactpersonfunction = result.data[0].contactpersonfunction;
        element.secondlevel[0].value = result.data[0].contactpersondescription;
        element.contactpersondescription = result.data[0].contactpersondescription;
        element.gender = result.data[0].gender;
        element.nps = result.data[0].nps;
        element.newsletter = result.data[0].newsletter;
        element.report = result.data[0].report;
        element.mijn = result.data[0].mijn;
        if (result.data[0].mijn == false) { //setting all mijn checkbox to false
          result.data[0].mijn1 = false; result.data[0].mijn2 = false; result.data[0].mijn3 = false; result.data[0].mijn4 = false; result.data[0].mijn5 = false;
        }
        element.mijn1 = result.data[0].mijn1;
        element.mijn2 = result.data[0].mijn2;
        element.mijn3 = result.data[0].mijn3;
        element.mijn4 = result.data[0].mijn4;
        element.mijn5 = result.data[0].mijn5;
        element.secondlevel[1].value = (result.data[0].mijn1 == true) ? 'Ja' : 'Nee';
        element.secondlevel[2].value = (result.data[0].mijn2 == true) ? 'Ja' : 'Nee';
        element.secondlevel[3].value = (result.data[0].mijn3 == true) ? 'Ja' : 'Nee';
        element.secondlevel[4].value = (result.data[0].mijn4 == true) ? 'Ja' : 'Nee';
        element.secondlevel[5].value = (result.data[0].mijn5 == true) ? 'Ja' : 'Nee';
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
