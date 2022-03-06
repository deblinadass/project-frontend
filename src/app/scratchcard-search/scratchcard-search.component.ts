import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../_services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { HttpClient} from "@angular/common/http";
import { formatDate } from '@angular/common';
import moment from "moment";
import 'moment-timezone';
import { ToasterService } from '../_services/toastr.service';
declare var $: any;
moment.tz.setDefault('Europe/Amsterdam');
@Component({
  selector: 'app-scratchcard-search',
  templateUrl: './scratchcard-search.component.html',
  styleUrls: ['./scratchcard-search.component.scss'],
  animations: [routerTransition()]
})

export class ScratchcardSearchComponent implements OnInit {
  @ViewChild('scardSearchInput', { static: true }) scardSearchInput: ElementRef;
  displayedMultiServiceColumns: string[] = ['start','stop','location','stopreason', 'macaddress', 'useragentdetails', 'download', 'upload', 'lengthoftime', 'resume'];
  scard_details_table: Array<object> = [];
  dataSource = new MatTableDataSource<any>();

  exceedThreshold: boolean;
  noRecords: boolean;
  inputcheck: boolean;
  scard_details: any;
  searchVal: any;
  loading = true;
  isShow = true;
  indeterminate: String;
  waarde;
id;
productCheck : boolean = false;
  constructor(public router: Router,
    private _Activatedroute: ActivatedRoute,
    private _productservice: ProductService,
    private toasterservice: ToasterService,
    private httpClient: HttpClient) {
    this.exceedThreshold = false;
    this.noRecords = false;
    this.inputcheck = false;

    if (sessionStorage.getItem('sessionSatelliteID')) {
      this.id = sessionStorage.getItem('sessionSatelliteID');
    } else {
      sessionStorage.setItem('sessionSatelliteID', this.router.getCurrentNavigation().extras.state.id);
      this.id = sessionStorage.getItem('sessionSatelliteID');
    }
	//sessionStorage.removeItem('sessionMainID');
	//sessionStorage.removeItem('sessionSatelliteID');
  }

  ngOnInit(): void {
    $('.progress-spinner').hide();
    
  }

  ngAfterViewInit() {
    this.scardSearchInput.nativeElement.focus();
 };

  btnClick = function () {
    this.router.navigateByUrl('/createlocation');
  };
  search(scardVal: string) {
    this.productCheck = false;
    this.exceedThreshold = false;
    this.searchVal = scardVal;
    
    if (this.searchVal != '') {
      this.getScardDetails();
      this.isShow = false;
    }
    else
      this.inputcheck = true;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  icon = '';
  linkPath: string;
  getScardDetails() {
    $('.progress-spinner').show();
    this.scard_details_table = [];
    this.dataSource = new MatTableDataSource<any>(this.scard_details_table);

    this._productservice.scratchcard_search(this.searchVal).subscribe(

      data => {
       
        this.scard_details = data;
        console.log(this.scard_details);
        this.productCheck = true;
        this.waarde =  (this.scard_details.product.priceinc && this.scard_details.product.priceinc!=null) ? '€ ' + parseFloat(this.scard_details.product.priceinc.replace(',', ".")).toFixed(2).toString().replace('.', ",") : '';
        this.scard_details.startdate = (this.scard_details.product.startdate && this.scard_details.product.startdate!=null) ? 
        formatDate(this.scard_details.product.startdate , 'dd-MM-yyyy HH:MM', 'en-US') : '';
        this.scard_details.expdate = (this.scard_details.product.subscriptiondata && this.scard_details.product.subscriptiondata!='' && this.scard_details.product.subscriptiondata.expdate!=null) ? 
        formatDate(this.scard_details.product.subscriptiondata.expdate , 'dd-MM-yyyy HH:MM', 'en-US') : '';
        this.scard_details.timeLeft = (this.scard_details.product.timeLeft && this.scard_details.product.timeLeft!=null) ? 
        this.scard_details.product.timeLeft : '';
        this.scard_details.validaAtList = (this.scard_details.product.validaAtList && this.scard_details.product.validaAtList!=null) ? 
        this.scard_details.product.validaAtList : '';
        this.loading = false;
        this.scard_details_table = [];
        if (this.scard_details.exceedThreshold == 1) {
          this.exceedThreshold = true;
        }
        for (let session of this.scard_details.result) {
          
          this.scard_details_table.push(
            {
              "id": session.customerid,
              "start": session.start ?  moment(session.start).format('D-M-YYYY H:m') : '',
              "stop": session.stop ?  moment(session.stop).format('D-M-YYYY H:m') : '',
              "location": session.location_name,    
              "stopreason": session.StopReason,    
              "useragentdetails": session.UserAganetDetails,
              "macaddress": session.macaddress,
              "download":session.download + ' MB',
              "upload": session.upload + ' MB',
              "lengthoftime":session.seconds,
              "resume": (session.resume && session.resume > 0) ? 'Ja' : 'Nee',
            }
          );
        }

        this.dataSource = new MatTableDataSource<any>(this.scard_details_table);
        
        if(this.dataSource.data.length == 0)
        {
          this.noRecords = true;
        }else{
          this.noRecords = false;
        }
        
        this.inputcheck = false;
        $('.progress-spinner').hide();

      },
      (err) => {
        this.scard_details_table = [];
        this.dataSource = new MatTableDataSource<any>(this.scard_details_table);
      

        this.noRecords = true;
        this.exceedThreshold = false;
        this.inputcheck = false;
        $('.progress-spinner').hide();
        this.toasterservice.showError(err);
      });
  }
}
 
