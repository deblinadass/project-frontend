import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from '../_services/customersearch.service';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { HttpClient} from "@angular/common/http";
import { LocationService } from '../_services/location.service';
import { FormGroup, FormBuilder, NgForm, Validators,FormControl } from '@angular/forms';
import { VERSION } from '@angular/material/core';
import { MatSelectSearchVersion } from 'ngx-mat-select-search';
import { debounceTime, delay, tap, filter, map, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { Customer } from '../interface/interface';
import { ScratchService } from '../_services/scratch.service';
import { StatService } from '../_services/stat.service';
import * as FileSaver from 'file-saver';
import { ToasterService } from '../_services/toastr.service';
declare var $: any;
import moment from "moment";
import 'moment-timezone';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  animations: [routerTransition()]
})

export class StatisticsComponent implements OnInit {
  @ViewChild('customerSearchInput', { static: true }) customerSearchInput: ElementRef;
  displayedMultiServiceColumns: string[] = ['customername','chain','accountmanager', 'streetname', 'postcode', 'city'];
  customer_details_table: Array<object> = [];
  dataSource = new MatTableDataSource<any>();

  exceedThreshold: boolean;
  noRecords: boolean;
  inputcheck: boolean;
  customer_details: any;
  searchVal: any;
  loading = true;
  isShow = true;
  indeterminate: String;
  techSearchTypeList;
  customerSearchType;
  datefiltersessionForm: FormGroup;
  startdate:any;
  stopdate:any; 
  data;
  isSpinnerShow: boolean = false;
  /********************** Auto Search For Satellite Move *************************/
  isRestrictionOnChain: boolean = false;
  isActivation: boolean = false;
  shipmentpost: boolean = false;
  buttondisabled: boolean = false;
  chainlist = new Map<number, string>();
  chainid;
  chainVal;
  countryList = new Map<string, string>();
  countryid;
  countryVal;
  loggedinuserrole;
  version = VERSION;
  noRecordFound;
  matSelectSearchVersion = MatSelectSearchVersion;
  SCardOrderShipmentPostalCode;
  tabSectionList: any[] = [];
  ordertypeList: any[];
  StatsType;
  StatsWeergave;
  scratchcardstartreadonly = true;
  scratchcardbuttondisplay = false;
  
  /* chain Dropdown */
  protected locationsSatellite;
  public chainFilteringCtrl: FormControl = new FormControl();
  protected chaindata;
  public searchingChain: boolean = false;
  public filteredServerSideChains: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  protected _onDestroyChain = new Subject<void>();
  
  /********************** Auto Search For Satellite Move *************************/ 
  constructor(public router: Router,
    private _Activatedroute: ActivatedRoute,
    private _customerService: CustomerService,
    private _locationService: LocationService,
    private api: LocationService,
    private formBuilder: FormBuilder,
    private _scratchservice: ScratchService,
    private _statService: StatService,
    private toasterservice: ToasterService,
    private httpClient: HttpClient) {
    this.exceedThreshold = false;
    this.noRecords = false;
    this.inputcheck = false;
	sessionStorage.removeItem('sessionMainID');
	sessionStorage.removeItem('sessionSatelliteID');
  }


  fetchDetailsDropdown() {

    /**Fetch chains */
    $('.overlay').show();
    this._locationService.getAllChain().subscribe(data => {
      
      this.chaindata = data;

      if (data != null || data.length !== 0) {
        this.chaindata = data;
      }
      $('.overlay').hide();
    },
      err => console.error(err),

      () => console.log('')
    );

    $('.overlay').show();
   




  }
  dropdownchanges() {

    /**** Auto Search chain  ******/
    this.chainFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searchingChain = true),
        takeUntil(this._onDestroyChain),
        debounceTime(200),
        map(search => {
          if (!this.chaindata) {
            return [];
          }

          return this.chaindata.result.filter(chainval =>
            chainval.chainname.toLowerCase().indexOf(search.toLowerCase()) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredChains => {

        if (filteredChains == null || filteredChains === 0 || filteredChains.length === 0) {
          this.noRecordFound = 0;
          this.filteredServerSideChains.next(filteredChains);
        } else {
          this.noRecordFound = 1;
          this.searchingChain = false;
          this.filteredServerSideChains.next(filteredChains);
        }

      },
        error => {
          this.searchingChain = false;
        });

    /** Auto Search chain Move **/
    

  }

  ngOnInit(): void {
    $('#progress-spinner-tech').hide();
    this.datefiltersessionForm = this.formBuilder.group({
      startdate: [moment().subtract(5, 'days').format('YYYY-MM-DD')],
      stopdate: [moment().subtract(1, 'day').format('YYYY-MM-DD')],
      StatValidForLocation: [''],
      StatsType: [''],
      StatsWeergave: ['']
     });

     this.fetchDetailsDropdown();
    this.populatefromdropdown();
    
  }

  ngAfterViewInit(): void {
    this.dropdownchanges();
  }

  

 
 
  onSubmit(form: NgForm) {
    this.buttondisabled = true;
    console.log(form.value);
    this.data = JSON.stringify(form.value);
    this.isSpinnerShow = true;
    const formData = new FormData();
      //JSON.parse(this.data, (key, value) => {
        
          if(this.datefiltersessionForm.get('startdate').value){
            this.datefiltersessionForm.get('startdate').setValue(moment(this.datefiltersessionForm.get('startdate').value).format('YYYY-MM-DD'));
          }else{
            this.buttondisabled = false;
            this.isSpinnerShow = false;
            this.toasterservice.showErrorStats("Please select a start date to filter");
            return
          }   
        
          if(this.datefiltersessionForm.get('stopdate').value){
            this.datefiltersessionForm.get('stopdate').setValue(moment(this.datefiltersessionForm.get('stopdate').value).format('YYYY-MM-DD'));
          }
        

        if(this.datefiltersessionForm.get('StatValidForLocation').value==''){
          this.datefiltersessionForm.get('StatValidForLocation').setValue(0);
          }
        

        if(this.datefiltersessionForm.get('StatsType').value==''){
          this.toasterservice.showErrorStats("Please select a stat type to filter");
          this.isSpinnerShow = false;
          this.buttondisabled = false;
          return;
        }  
      //});

      
     
      this._statService.getStatFilterData(form.value).subscribe(
        response => {
          this.noRecords = false;
          this.isSpinnerShow = false;
            console.log('stats', response);
            if ((response != undefined)) {
              
              if(response.status == 200){
                let file = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                FileSaver.saveAs(file, 'Statistic' + '-' + moment().format('D-M-YYYY H_m') + '.xlsx');
                this.buttondisabled = false;
              }
            }else{
              this.noRecords = true;
              this.isSpinnerShow = false;
              this.buttondisabled = false;
              //this.toasterservice.showErrorScratchcard("Search related no result found..");
            }
        });
      }

      
      populatefromdropdown(){
        /*
        this._scratchservice.getOrderPropertyByCatalogue(20).subscribe(res => {
          this.ordertypeList = res;
    
          this.StatsType = this.ordertypeList.filter(r =>
            r.attrname == 'StatsType' 
          );
    
          this.StatsWeergave = this.ordertypeList.filter(r =>
            r.attrname == 'StatsWeergave'
          );
    
        }, (err) => {
          console.log(err);
        });*/

        this._locationService.getLocationProperty('StatsType').subscribe(data => {
          this.StatsType = data;
        }, (err) => {
         // this.dialogRef.close({ event: 'Cancel' });
        });

        this._locationService.getLocationProperty('StatsWeergave').subscribe(data => {
          this.StatsWeergave = data;
        }, (err) => {
         // this.dialogRef.close({ event: 'Cancel' });
        });
      }

      public hasError = (controlName: string, errorName: string) => {
        return this.datefiltersessionForm.controls[controlName].hasError(errorName);
      }
  
}
 
