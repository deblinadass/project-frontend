import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, ValidatorFn, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../_services/location.service';
import { formatDate } from '@angular/common';
import { CatalogueService } from '../_services/catalogue.service';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { DateValidator } from '../_shared/date.validator';
import { ProductService } from '../_services/product.service';
import { ToasterService } from '../_services/toastr.service';

declare var jQuery: any;
declare const editClick: any;
declare var $: any;

export class Custom {
  name: string;
  id: number;
}

@Component({
  selector: 'app-cataloguedialog-box',
  templateUrl: './cataloguedialog-box.component.html',
  styleUrls: ['./cataloguedialog-box.component.scss']
})

export class CataloguedialogBoxComponent {
  action: string;
  local_data: any;
  submitted = false;
  _id: string;
  loading = false;
  customer_details: any;
  jsonArray: any[]
  
  today = new Date();
  jstoday = '';
  isRTLMemoLineForScratchCard: boolean = false;
  buttondisabled = true;
  productgroupList: any[];
  producttypeList: any[];
  productmainList: any[];
  productnameList: any[];
  productpropertyList: any;
  counter: number;
  
  returnUrl: string;
  locationid: number;
  minBillingDate;
  productcatalogueform: FormGroup;
  productTypeList: any[];
  PCFormUpdatedValue: any[] = [];
  selectedproductnameList: any[];
  productmemolineList: any[];
  minStartDate; maxStartDate ;
  minEndDate; maxEndDate ;
  PCFormSubmit: any[] = [];

  @ViewChild('pickerbillingmonth', { static: true }) datePicker: MatDatepicker<any>;

  constructor(
    private api: CatalogueService,
    private formBuilder: FormBuilder,
    private productApi: ProductService,
    public router: Router,
    public dialogRef: MatDialogRef<CataloguedialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _Activatedroute: ActivatedRoute,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private toasterservice: ToasterService,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;

  
  }


  ngOnInit() {
    this.buttondisabled = true;
    this._id = this.route.snapshot.paramMap.get("id");
    //this.populateformdropdown();
    var dt = new Date();
    var day = dt.getDate(), month = dt.getMonth(), year = dt.getFullYear();
    this.minStartDate = new Date(year, month, 1);
    

    if (this.local_data.action == 'Relocate') {
      $('.overlay').show();
     $('.overlay').hide();
    } else if (this.local_data.action == 'Update') {

      this.populateformdropdown();
      if(this.local_data.productgroupid == '1') //Scratch Card
      {
        this.isRTLMemoLineForScratchCard = true;
      }
      else
      {
        this.isRTLMemoLineForScratchCard = false;
      }
 
      this.productcatalogueform = this.formBuilder.group({
        productgroup: ['', Validators.required],
        producttype: ['', Validators.required],
        productname: ['', Validators.required],
        startdate: null,
        enddate: null,
        productprice: [''],
        startstaffel: [''],
        endstaffel: [''],
        rtlmemoline: ['', Validators.required],
        wsmemoline: [''],
        productstatus: 0,
        relatedvve : [''],
        productdescription : [''],
        locationids : ['']
      });

      if(this.local_data.startdateEdit!='' || this.local_data.startdateEdit!=null)
      {
        var format = formatDate(this.local_data.startdateEdit,'yyyy, MM, dd', 'en-US');
        var dt = new Date(format);
        var day = dt.getDate(), month = dt.getMonth(), year = dt.getFullYear();
        this.minEndDate = new Date(year, month, day);
        
      }
      this.formControlValueChanged();
    } else if (this.local_data.action == 'Add') {

      this.productcatalogueform = this.formBuilder.group({
        productgroup: ['', Validators.required],
        producttype: ['', Validators.required],
        productname: ['', Validators.required],
        startdate: null,
        enddate: null,
        productprice: [''],
        startstaffel: [''],
        endstaffel: [''],
        rtlmemoline: ['', Validators.required],
        wsmemoline: [''],
        productstatus: 0,
        relatedvve : [''],
        productdescription : [''],
        locationids : ['']
      });
      this.populateformdropdown();
      this.formControlValueChanged();
    }
    this.buttondisabled = false;
  }





  formControlValueChanged() {
    
    
        
          this.productcatalogueform.get('productprice').valueChanges.subscribe(
            (price) => {

              let productprice = this.productcatalogueform.get('productprice');
              if (productprice.value.length > 0) {

                //productprice.setValidators([Validators.required, Validators.pattern('([0]{1}|[1-9]{1}[0-9]{0,3}|[1-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[0]{1}[,.][0-9]{1}[1-9]{1}|[0]{1}[,.][1-9]{1}[0-9]{1}|[0]{1}[,.][1-9]{1})')]);
                productprice.setValidators([Validators.required, Validators.pattern('([0-9]{1}[0-9]{0,3}|[0-9]{1}[0-9]{0,3}[,.][0-9]{1,2}|[0]{1}[,.][0-9]{1}[1-9]{1}|[0]{1}[,.][1-9]{1}[0-9]{1}|[0]{1}[,.][1-9]{1})')]);
                
                
                productprice.updateValueAndValidity({emitEvent : false});
              } else {
                productprice.setValue('');
                productprice.clearValidators();
                productprice.updateValueAndValidity({emitEvent : false});
              }

            }, error => this.toasterservice.showError(error));


}



  onSubmit(form: NgForm) {
    if (this.productcatalogueform.invalid) {
      return;
    }
    this.buttondisabled = true;
    this.productcatalogueform.controls['productprice'].setValue(this.productcatalogueform.controls['productprice'].value.replace('.', ','));
    //if (this.productcatalogueform.get('deliverydate').value != '') { this.productcatalogueform.get('deliverydate').setValue(this.transformDate(this.productcatalogueform.get('deliverydate').value)); }
    this.jsonArray = form.value;

    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');

    if (this.productcatalogueform.get('startdate').value == '' || this.productcatalogueform.controls['startdate'].value == null) {
      this.productcatalogueform.get('startdate').setValue(null);
    } else {
      this.productcatalogueform.get('startdate').setValue(this.transformDate(this.productcatalogueform.get('startdate').value));
    }

    if (this.productcatalogueform.get('enddate').value == '' || this.productcatalogueform.controls['enddate'].value == null) {
      this.productcatalogueform.get('enddate').setValue(null);
    } else {
      this.productcatalogueform.get('enddate').setValue(this.transformDate(this.productcatalogueform.get('enddate').value));
    }

    if (this.productcatalogueform.get('startstaffel').value == '') {
      this.productcatalogueform.get('startstaffel').setValue(0);
    } else {
      this.productcatalogueform.get('startstaffel').setValue(this.productcatalogueform.get('startstaffel').value);
    }

    if (this.productcatalogueform.get('endstaffel').value == '') {
      this.productcatalogueform.get('endstaffel').setValue(0);
    } else {
      this.productcatalogueform.get('endstaffel').setValue(this.productcatalogueform.get('endstaffel').value);
    }

    if (this.productcatalogueform.get('productprice').value != '' && this.productcatalogueform.get('productprice').value != undefined) {
      //Always storing prices with 2 decimal 
      this.productcatalogueform.get('productprice').setValue(parseFloat(this.productcatalogueform.get('productprice').value.replace(',', ".")).toFixed(2).toString().replace('.', ","));
    }

    this.counter = 0;
    



    this.PCFormSubmit.push(
      {
        productgroup: this.productcatalogueform.get('productgroup').value,
        producttype: this.productcatalogueform.get('producttype').value,
        productname: this.productcatalogueform.get('productname').value,
        startdate: this.productcatalogueform.get('startdate').value ? 
        formatDate(this.productcatalogueform.get('startdate').value, 'yyyy-MM-dd', 'en-US') : null,
        enddate: this.productcatalogueform.get('enddate').value ? 
        formatDate(this.productcatalogueform.get('enddate').value, 'yyyy-MM-dd', 'en-US') : formatDate('2099-12-31', 'yyyy-MM-dd', 'en-US'),
        productstatus: 0,
        startstaffel:0,
        endstaffel:0,
        productprice: this.productcatalogueform.get('productprice').value,
        rtlmemoline: this.productcatalogueform.get('rtlmemoline').value,
        wsmemoline: this.productcatalogueform.get('wsmemoline').value,
        productdescription: this.productcatalogueform.get('productdescription').value,
        relatedvve:'',
        locationids: this.productcatalogueform.get('locationids').value
      }
    );
    this.api.addProductCatalogue(this.PCFormSubmit[0])
      .subscribe(res => {

        //this.onetimecost = [];
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Add', data: this.local_data });
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }

  onUpdate(form: NgForm) {
    
    if (this.productcatalogueform.invalid) {
      return;
    }
    this.buttondisabled = true;
    this.jsonArray = form.value;
    this.jstoday = formatDate(this.today, 'yyyy-MM-dd HH:MM:ss', 'en-US');
    if (this.productcatalogueform.get('startdate').value == '' || this.productcatalogueform.controls['startdate'].value == null) {
      this.productcatalogueform.get('startdate').setValue(null);
    } else {
      this.productcatalogueform.get('startdate').setValue(this.transformDate(this.productcatalogueform.get('startdate').value));
    }

    if (this.productcatalogueform.get('enddate').value == '' || this.productcatalogueform.controls['enddate'].value == null) {
      this.productcatalogueform.get('enddate').setValue(null);
    } else {
      this.productcatalogueform.get('enddate').setValue(this.transformDate(this.productcatalogueform.get('enddate').value));
    }

    if (this.productcatalogueform.get('startstaffel').value == '') {
      this.productcatalogueform.get('startstaffel').setValue(0);
    } else {
      this.productcatalogueform.get('startstaffel').setValue(this.productcatalogueform.get('startstaffel').value);
    }

    if (this.productcatalogueform.get('endstaffel').value == '') {
      this.productcatalogueform.get('endstaffel').setValue(0);
    } else {
      this.productcatalogueform.get('endstaffel').setValue(this.productcatalogueform.get('endstaffel').value);
    }

    if (this.productcatalogueform.get('productprice').value != '' && this.productcatalogueform.get('productprice').value != undefined) {
      //Always storing prices with 2 decimal 
      this.productcatalogueform.get('productprice').setValue(parseFloat(this.productcatalogueform.get('productprice').value.replace(',', ".")).toFixed(2).toString().replace('.', ","));
    }


    var productgroup = this.productcatalogueform.get('productgroup').value;
    var producttype = this.productcatalogueform.get('producttype').value;
    var productname = this.productcatalogueform.get('productname').value;
    var productmemoline = this.productcatalogueform.get('rtlmemoline').value;
    var productgroupvalue, producttypevalue,productnamevalue,productmemolinevalue;
    productgroupvalue = this.getProductName('productgroup','productgroup','','',productgroup);
    producttypevalue = this.getProductName('producttype','producttype','','',producttype);
    productnamevalue = this.getProductName('productname','productname',productgroup,producttype,productname);
    productmemolinevalue = (this.productcatalogueform.get('productgroup').value == '1') ?
    this.getProductName('productmemoline','productmemoline',productgroup,producttype,productmemoline) : productmemoline;
    
    
    this.PCFormUpdatedValue.push(
      {
        id: this.local_data.id,
        catrefid: this.local_data.catrefid,
        productgroup: productgroupvalue,
        producttype: producttypevalue,
        productname: productnamevalue,
        productgroupid: this.productcatalogueform.get('productgroup').value,
        producttypeid: this.productcatalogueform.get('producttype').value,
        productnameid: this.productcatalogueform.get('productname').value,
        startdate: this.productcatalogueform.get('startdate').value ? 
        formatDate(this.productcatalogueform.get('startdate').value, 'dd-MM-yyyy', 'en-US') : '',
        enddate: this.productcatalogueform.get('enddate').value ? 
        formatDate(this.productcatalogueform.get('enddate').value, 'dd-MM-yyyy', 'en-US') : '',
        startdateEdit: this.productcatalogueform.get('startdate').value,
        enddateEdit: this.productcatalogueform.get('enddate').value,
        productstatus: this.local_data.productstatus,
        productstatusvalue: this.local_data.productstatusvalue,
        productprice: this.productcatalogueform.get('productprice').value,
        rtlmemoline: this.productcatalogueform.get('rtlmemoline').value,
        rtlmemolinename: productmemolinevalue,
        wsmemoline: this.productcatalogueform.get('wsmemoline').value,
        productdescription: this.productcatalogueform.get('productdescription').value,
        locationids: this.productcatalogueform.get('locationids').value
        
      }
    );


    this.PCFormSubmit.push(
      {
        catrefid:this.local_data.catrefid,
        productgroup: this.productcatalogueform.get('productgroup').value,
        producttype: this.productcatalogueform.get('producttype').value,
        productname: this.productcatalogueform.get('productname').value,
        startdate: this.productcatalogueform.get('startdate').value ? 
        formatDate(this.productcatalogueform.get('startdate').value, 'yyyy-MM-dd', 'en-US') : null,
        enddate: this.productcatalogueform.get('enddate').value ? 
        formatDate(this.productcatalogueform.get('enddate').value, 'yyyy-MM-dd', 'en-US') : formatDate('2099-12-31', 'yyyy-MM-dd', 'en-US'),
        productstatus: this.local_data.productstatus,
        startstaffel:0,
        endstaffel:0,
        productprice: this.productcatalogueform.get('productprice').value,
        rtlmemoline: this.productcatalogueform.get('rtlmemoline').value,
        wsmemoline: this.productcatalogueform.get('wsmemoline').value,
        productdescription: this.productcatalogueform.get('productdescription').value,
        relatedvve:'',
        locationids: this.productcatalogueform.get('locationids').value
      }
    );
 

   
    this.api.updateProductCatalogue(this.PCFormSubmit[0], this.local_data.id)
      .subscribe(res => {
        this.dialogRef.close({ event: 'Update', data: this.PCFormUpdatedValue });
        this.buttondisabled = false;
      }, (err) => {
        this.buttondisabled = false;
        this.toasterservice.showError(err);
      });
  }


  startdateValidation() {
    var startdate = this.productcatalogueform.get('startdate');
    if (startdate.value != '' && startdate.value != null) {
      startdate.setValidators([DateValidator.dateVaidator]);
      startdate.updateValueAndValidity();
    } else {
      startdate.setValue('');
      startdate.clearValidators();
      startdate.updateValueAndValidity();
    }

    /*if(this.productcatalogueform.get('startdate').value!=''
    || this.productcatalogueform.get('startdate').value!=null){
      var dt = this.productcatalogueform.get('startdate').value;
      var day = dt.getDate(), month = dt.getMonth(), year = dt.getFullYear();
      this.minEndDate = new Date(year, month, day);
      this.productcatalogueform.get('enddate').setValidators([Validators.required]);
    }*/
    
  }

  enddateValidation() {
    var enddate = this.productcatalogueform.get('enddate');
    if (enddate.value != '' && enddate.value != null) {
      enddate.setValidators([DateValidator.dateVaidator]);
      enddate.updateValueAndValidity();
    } else {
      enddate.setValue('');
      enddate.clearValidators();
      enddate.updateValueAndValidity();
    }

    /*if(this.productcatalogueform.get('enddate').value!=''
    || this.productcatalogueform.get('enddate').value!=null){
      var dt = this.productcatalogueform.get('enddate').value;
      var day = dt.getDate(), month = dt.getMonth(), year = dt.getFullYear();
      this.maxStartDate = new Date(year, month, day);
      this.productcatalogueform.get('startdate').setValidators([Validators.required]);
    }*/
  }


  public hasError = (controlName: string, errorName: string) => {
    return this.productcatalogueform.controls[controlName].hasError(errorName);
  }



  doAction() {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  onDelete() {
    this.buttondisabled = true;
    this.api.deleteProductCatalogue(this.local_data.id).subscribe(
      data => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Delete', data: this.local_data });
      }, (err) => {
        this.buttondisabled = false;
        this.dialogRef.close({ event: 'Cancel' });
        this.toasterservice.showError(err);
      }
    );

  }



  populateformdropdown() {
    
    this.productApi.getProductCatalogueProperty().subscribe(data => {
      this.productpropertyList = data;
      let productgroupselected = this.local_data.productgroupid;
      let producttypeselected = this.local_data.producttypeid;
      this.productgroupList = this.productpropertyList.filter(r => 
        r.catalogueproperty == 'productgroup' 
        );

      this.producttypeList = this.productpropertyList.filter(r => 
        r.catalogueproperty == 'producttype' 
        );
      this.productnameList = this.productpropertyList.filter(r => r.catalogueproperty == 'productname' &&
        r.cataloguepropertygroup == productgroupselected && r.cataloguepropertytype == producttypeselected
        );

        this.productmemolineList = this.productpropertyList.filter(r =>
          r.catalogueproperty == 'productmemoline' && r.cataloguepropertygroup == '1' && r.cataloguepropertytype == '1'
        );
        
      }, (err) => {
       this.dialogRef.close({ event: 'Cancel' });
       this.toasterservice.showError(err);
    });

    
  }

  getProductName(type:string, catalogueproperty: string, cataloguepropertygroup?, 
    cataloguepropertytype?,  cataloguepropertyvalue?:string) {
    
      if(type == 'productname'){
        return this.selectedproductnameList= this.productpropertyList.find(r => r.catalogueproperty == catalogueproperty
            && r.cataloguepropertygroup == cataloguepropertygroup && r.cataloguepropertytype == cataloguepropertytype
            && r.cataloguepropertyvalue == cataloguepropertyvalue
            ).cataloguepropertyname;
        }else{
          return this.selectedproductnameList= this.productpropertyList.find(r => r.catalogueproperty == catalogueproperty
            && r.cataloguepropertyvalue == cataloguepropertyvalue
            ).cataloguepropertyname;
        }
    }

  



  selectproductname() {

    
    let productgroupselected = this.productcatalogueform.get('productgroup').value;
    let producttypeselected = this.productcatalogueform.get('producttype').value;
   
    this.productnameList = this.productpropertyList.filter(r => r.catalogueproperty == 'productname' &&
       r.cataloguepropertygroup == productgroupselected && r.cataloguepropertytype == producttypeselected
    );

    if(productgroupselected == '1'){
      this.isRTLMemoLineForScratchCard = true;
    }else{
      this.isRTLMemoLineForScratchCard = false;
    }
  }



  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
}
