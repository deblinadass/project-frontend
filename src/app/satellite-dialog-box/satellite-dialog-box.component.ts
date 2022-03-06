import { Component, Inject, Optional, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ValidatorFn, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, delay, tap, filter, map, takeUntil } from 'rxjs/operators';
import { LocationService } from '../_services/location.service';
import { VERSION } from '@angular/material/core';
import { MatSelectSearchVersion } from 'ngx-mat-select-search';
import { AuthenticationService } from '../_services/authentication.service';
import { ToasterService } from '../_services/toastr.service';

declare var jQuery: any;
declare const editClick: any;
declare var $: any;
export interface Customer {
  customerid: number;
  customername: string;
  housenumber: string;
  housenumberaddition: string;
  streetname: string;
  city: string;
  country: string;
}

@Component({
  selector: 'app-dialog-box',
  templateUrl: './satellite-dialog-box.component.html',
  styleUrls: ['./satellite-dialog-box.component.scss']
})
export class SatelliteDialogBoxComponent implements OnInit, OnDestroy {
  action: string;
  local_data: any;
  _id: string;
  loading = true;
  mainLocationID: number;
  satelliteLocationID: number;
  noMainLocationList;
  buttondisabled = false;
  isMainLocationListBlank;
  noRecordFound;

  /********************** Auto Search For Satellite Move *************************/
  version = VERSION;
  matSelectSearchVersion = MatSelectSearchVersion;
  satelliteRelocateForm: FormGroup;
  productsatelliteRelocateForm: FormGroup;
  fetchedProductID;
  currentUrl;
  protected locationsSatellite;

  /** control for filter for server side. */

  public locationServerSideSatelliteFilteringCtrl: FormControl = new FormControl();
  /** indicate search operation is in progress */
  public searchingSatellite: boolean = false;

  /** list of banks filtered after simulating server side search */

  public filteredServerSideSatelliteLocations: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroySatellite = new Subject<void>();
  /********************** Auto Search For Satellite Move *************************/
  constructor(

    private formBuilder: FormBuilder,
    private _locationService: LocationService,
    public router: Router,
    public dialogRef: MatDialogRef<SatelliteDialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _Activatedroute: ActivatedRoute,
    private route: ActivatedRoute,
    private authenticationservice: AuthenticationService,
    private toasterservice: ToasterService,
  ) {


    this.local_data = { ...data };
    this.action = this.local_data.action;

    this.mainLocationID = this.local_data.parentcustomerid;
    this.satelliteLocationID = this.local_data.locationid;

  }

  ngOnInit() {


    /********************* Auto Search Satellite Move ***************************/
    this.satelliteRelocateForm = this.formBuilder.group({
      parentcustomerid: ['', Validators.required]
    });


    /********************* Auto Search Satellite Move ***************************/



    $('.overlay').show();
    this._locationService.mainLocationSearch(this.mainLocationID).subscribe(
      data => {
        //this.locationsSatellite = data;
        if (data == null || data === 0 || data.length === 0) {

          this.isMainLocationListBlank = 0;

        } else {

          this.locationsSatellite = data;
          this.isMainLocationListBlank = 1;

        }
        $('.overlay').hide();
      },err => this.toasterservice.showError(err));



  }


  ngAfterViewInit(): void {

    /********************* Auto Search Satellite Move ***************************/

    // listen for search field value changes
    this.locationServerSideSatelliteFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searchingSatellite = true),
        takeUntil(this._onDestroySatellite),
        debounceTime(200),
        map(search => {
          if (!this.locationsSatellite) {
            return [];
          }

          // simulate server fetching and filtering data
          return this.locationsSatellite.filter(location => location.customername.toLowerCase().indexOf(search) > -1);


        }),
        delay(500)
      )
      .subscribe(filteredLocations => {
        if (filteredLocations == null || filteredLocations === 0 || filteredLocations.length === 0) {


          this.noRecordFound = 0;
          this.filteredServerSideSatelliteLocations.next(filteredLocations);
        } else {

          this.noRecordFound = 1;
          this.searchingSatellite = false;
          this.filteredServerSideSatelliteLocations.next(filteredLocations);
        }

      },
        error => {
          this.toasterservice.showError(error);
          this.searchingSatellite = false;
          // handle error...
        });

    /********************* Auto Search Satellite Move ***************************/


  }

  public hasErrorSatelliteRelocate = (controlName: string, errorName: string) => {
    return this.satelliteRelocateForm.controls[controlName].hasError(errorName);
  }

  doAction() {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onSatelliteRelocate(form: NgForm) {

    if (this.satelliteRelocateForm.invalid) {
      return;
    }
    this.buttondisabled = true;
    let formParentCustomerID = JSON.stringify(form.value);
    $('.overlay').show();
    this._locationService.relocateSatelliteLocation(this.local_data.locationid, JSON.stringify(form.value))
      .subscribe(res => {
        this.buttondisabled = false;
        sessionStorage.removeItem('sessionMainID');
        this.dialogRef.close({ event: 'Relocate', data: this.satelliteRelocateForm.controls['parentcustomerid'].value.toString() });
      }, (err) => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      }
      );
  }


  ngOnDestroy() {
    this._onDestroySatellite.next();
    this._onDestroySatellite.complete();
  }
}
