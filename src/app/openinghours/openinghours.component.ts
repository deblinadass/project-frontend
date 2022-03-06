import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe, formatDate } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn, NgForm, FormControlDirective } from '@angular/forms';

import { LocationService } from '../_services/location.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { CommonService } from '../_services/common.service';
import { ToasterService } from '../_services/toastr.service';

declare var jQuery: any;
declare const editClick: any;
declare var $: any;

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'HH:mm',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-openinghours',
  templateUrl: './openinghours.component.html',
  styleUrls: ['./openinghours.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class OpeninghoursComponent {

  locations_list_table: any[] = [];
  satellite_id;
  location_details: any;
  locations_list: any;
  product_list: any;
  attribute_value_list: any;
  loading = false;
  loadinginvoiced = false;
  times: any[] = [];
  activeLinkIndex = -1;
  openinghoursFormData = [];

  openinghoursform: FormGroup;
  exceptiondaysform: FormGroup;
  openingHoursJson: any[];
  exceptionDaysJson: any[];
  buttondisabled;
  buttondisabledexcp;
  daysofweek;
  formLoaded = false;
  loadingOpenHour = false;
  loadException = false;
  tabSectionList: any[] = [];

  displayedopeninghoursColumns: string[] = ['exceptiondate', 'opening', 'closing', 'isclosed', 'recurring', 'action'];
  dataSourceOpeningHours = new MatTableDataSource<any>();

  @ViewChild('openinghoursSort', { static: true }) openinghoursSort: MatSort;
  @ViewChild('paginatorOpeningHours', { static: true }) paginatorOpeningHours: MatPaginator;
  routerCurrentURL;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private api: LocationService,
    private datePipe: DatePipe,
    private toasterservice: ToasterService,
    public _commonService: CommonService,

  ) {
    $('.mat-tab-link').removeClass('mat-tab-label-active');
    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.satellite_id = sessionStorage.getItem('sessionSatelliteID');
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.satellite_id = sessionStorage.getItem('sessionSatelliteID');
    }
    this.tabSectionList = this._commonService.getSectionList('OpenninghoursTab');
  }

  ngAfterViewInit(): void {
    //this.updateOpenhours();

  }

  ngOnInit(): void {
    this.daysofweek = {
      1: 'Maandag', 2: 'Dinsdag', 3: 'Woensdag', 4: 'Donderdag', 5: 'Vrijdag',
      6: 'Zaterdag', 7: 'Zondag'
    };
    this.getTimeInterval();
    this.buttondisabled = false;
    this.loadingOpenHour = true;
    this.api.getOpeningHours(this.satellite_id).subscribe(data => {
      this.openingHoursJson = data;
      this.updateOpenhours();
      this.exceptionDays();
      this.getExceptionDays();
      this.formLoaded = true;
      this.loadingOpenHour = false;
    }, error => this.toasterservice.showError(error));
  }

  getExceptionDays() {
    this.loadException = true;
    this.api.getExceptionDays(this.satellite_id).subscribe(data => {
      this.exceptionDaysJson = data;
      this.loadException = false;
      this.dataSourceOpeningHours = new MatTableDataSource<any>(this.exceptionDaysJson);
      this.dataSourceOpeningHours.sort = this.openinghoursSort;
      this.dataSourceOpeningHours.paginator = this.paginatorOpeningHours;
    }, error => this.toasterservice.showError(error));
  }

  deleteException(element) {
    this.loading = true;
    this.api.deleteException(element.id).subscribe(data => {
      this.loading = false;
      this.getExceptionDays();
    }, error => this.toasterservice.showError(error));
  }

  updateOpenhours() {
    let openhourarr = [];
    //if (this.openingHoursJson) {
    for (let i = 0; i < this.openingHoursJson.length; i++) {
      //this.openingHoursJson[i]['dayofweek'] = this.getDayName(this.openingHoursJson[i]['dayofweek'])
      openhourarr.push(this.BuildFormDynamic(this.openingHoursJson[i]))
    }
    // }

    this.openinghoursform = this.formBuilder.group({

      OpeningHours: this.formBuilder.array(openhourarr),
    });
  }
  exceptionDays() {
    this.exceptiondaysform = this.formBuilder.group({
      customerid: [this.satellite_id],
      exceptiondate: [null, [this.dateRangeValidator(), Validators.required]],
      isclosed: [''],
      opening: [''],
      closing: [''],
      recurring: [''],
    });
    this.formLoaded = true
    this.exceptiondaysform.get('opening').enable();
    this.exceptiondaysform.get('closing').enable();
  }

  dateRangeValidator(): ValidatorFn {
    return control => {
      if (!control.value) return null;
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const dateValue = new Date(control.value);
      if (dateValue < firstDay) {
        return { message: 'Invalid date' };
      }
      null;
    }
  }


  BuildFormDynamic(addon): FormGroup {
    return this.formBuilder.group({
      customerid: this.satellite_id,
      exceptiondate: [addon.exceptiondate],
      dayofweek: [addon.dayofweek],
      isclosed: [addon.isclosed],
      opening: [addon.opening],
      closing: [addon.closing],
      recurring: [addon.recurring],
    })
  }

  getControls() {
    return (this.openinghoursform.get('controlName') as FormArray).controls;
  }

  setOpeninHourStatus(i: number) {
    const control = <FormArray>this.openinghoursform.controls['OpeningHours'];
    var isClosed = control.at(+i).get('isclosed').value;
    if (isClosed == true) {
      control.at(+i).get('opening').setValue('');
      control.at(+i).get('closing').setValue('');
      control.at(+i).get('opening').disable();
      control.at(+i).get('closing').disable();
    }
    else {
      control.at(+i).get('opening').enable();
      control.at(+i).get('closing').enable();
    }

  }

  setOpeninHourExceptionStatus() {
    var isClosed = this.exceptiondaysform.get('isclosed').value;
    if (isClosed == true) {
      this.exceptiondaysform.get('opening').setValue('');
      this.exceptiondaysform.get('closing').setValue('');
      this.exceptiondaysform.get('opening').disable();
      this.exceptiondaysform.get('closing').disable();
    }
    else {
      this.exceptiondaysform.get('opening').enable();
      this.exceptiondaysform.get('closing').enable();
    }
  }

  addOpeningHours(form: NgForm) {
    if (this.openinghoursform.invalid) {
      this.buttondisabled = false;
      // return;
    }
    this.loadingOpenHour = true;
    this.buttondisabled = true;

    var control = <FormArray>this.openinghoursform.controls['OpeningHours'];
    for (let i in control.value) {
      this.openinghoursFormData.push(
        {
          "customerid": this.satellite_id,
          "exceptiondate": "",
          "dayofweek": control.at(+i).get('dayofweek').value,
          "isclosed": (control.at(+i).get('isclosed').value == true) ? 1 : 0,
          "opening": control.at(+i).get('opening').value,
          "closing": control.at(+i).get('closing').value,
          "recurring": ""
        }
      )
    }

    this.api.updateOpeningHours(JSON.stringify(this.openinghoursFormData))
      .subscribe(res => {
        this.buttondisabled = false;
        this.loadingOpenHour = false;
        this.openinghoursFormData = [];
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }

  addException(form: NgForm) {
    if (this.exceptiondaysform.invalid) {
      this.buttondisabledexcp = false;
      return;
    }
    var exceptionDaysFormData = [];
    this.buttondisabledexcp = true;
    if (this.exceptiondaysform.get('exceptiondate').value == '') { this.exceptiondaysform.get('exceptiondate').setValue(null); } else {
      this.exceptiondaysform.get('exceptiondate').setValue(this.transformDate(this.exceptiondaysform.get('exceptiondate').value));
    }
    var isclosed = (this.exceptiondaysform.get('isclosed').value == true) ? 1 : 0;
    var recurring = (this.exceptiondaysform.get('recurring').value == true) ? 1 : 0;
    this.exceptiondaysform.get('isclosed').setValue(isclosed);
    exceptionDaysFormData.push(
      {
        "customerid": this.satellite_id,
        "exceptiondate": this.exceptiondaysform.get('exceptiondate').value,
        "isclosed": (this.exceptiondaysform.get('isclosed').value == true) ? 1 : 0,
        "opening": this.exceptiondaysform.get('opening').value,
        "closing": this.exceptiondaysform.get('closing').value,
        "recurring": recurring,
      }
    )

    this.api.addExceptionDays(exceptionDaysFormData[0])
      .subscribe(res => {
        this.buttondisabledexcp = false;
        this.exceptiondaysform.get('opening').enable();
        this.exceptiondaysform.get('closing').enable();
        this.exceptionDays();
        this.getExceptionDays();
      }, (err) => {
        this.buttondisabledexcp = false;
        this.toasterservice.showError(err);
      });
  }

  getDayName(dayParam) {
    switch (dayParam) {
      case 1: {
        return 'Maandag';
      }
      case 2: {
        return 'Dinsdag';
      }
      case 3: {
        return 'Woensdag';
      }
      case 4: {
        return 'Donderdag';
      }
      case 5: {
        return 'Vrijdag';
      }
      case 6: {
        return 'Zaterdag';
      }
      case 7: {
        return 'Zondag';
      }
    }
  }

  getDayNumber(day) {
    switch (day) {
      case 'Maandag': {
        return 1;
      }
      case 'Dinsdag': {
        return 2;
      }
      case 'Woensdag': {
        return 3;
      }
      case 'Donderdag': {
        return 4;
      }
      case 'Vrijdag': {
        return 5;
      }
      case 'Zaterdag': {
        return 6;
      }
      case 'Zondag': {
        return 7;
      }
    }
  }

  applyFilterOpeningHours(filterValue) {
    this.dataSourceOpeningHours.filter = filterValue.target.value.trim().toLowerCase();
    if (this.dataSourceOpeningHours.paginator) {
      this.dataSourceOpeningHours.paginator.firstPage();
    }
  }

  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  getTimeInterval() {
    var x = 15; //minutes interval
    var times = []; // time array
    var tt = 0; // start time
    var ap = ['AM', 'PM']; // AM-PM

    //loop to increment the time and push results in array
    for (var i = 0; tt < 24 * 60; i++) {
      var hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
      var mm = (tt % 60); // getting minutes of the hour in 0-55 format
      times[i] = ("0" + (hh % 24)).slice(-2) + ':' + ("0" + mm).slice(-2); // pushing data in array in [00:00 - 12:00 AM/PM format]
      tt = tt + x;
    }
    this.times = times;
  }


}
