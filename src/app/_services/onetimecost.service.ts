import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { OneTimeCost } from '../onetimecostdialog-box/onetimecost';
import { Audit } from '../interface/interface';
import { BillingSetting } from '../billingsettingdialog-box/billingsetting';
import { HSTExceptionService } from './exception.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const apiUrl = environment.billingapiUrl;
const apiUrlProduct = environment.productapiUrl;

@Injectable({
  providedIn: 'root'
})
export class OneTimeCostService {

  constructor(private http: HttpClient, private hstExceptionService: HSTExceptionService, public router: Router) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      if (error.status == 403 || error.status == 500) {
      }
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

  getOneTimeCostList(location_id: number) {
    return this.http.get(`${apiUrl}viewotclist/${location_id}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getBillingSettingList(location_id: number) {
    return this.http.get(`${apiUrl}viewbillinglist/${location_id}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getInvoicedOneTimeCostList(location_id: number) {
    return this.http.get(`${apiUrl}viewinvoicedotclist/${location_id}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  addBillingSetting(billingsetting): Observable<BillingSetting> {
    return this.http.put<BillingSetting>(`${apiUrl}createbillingsetting/`, billingsetting, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  addOneTimeCost(onetimecost): Observable<OneTimeCost> {
    return this.http.put<OneTimeCost>(`${apiUrl}createotc/`, onetimecost, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  addOneTimeCostSequence(onetimecost): Observable<OneTimeCost> {
    return this.http.put<OneTimeCost>(`${apiUrl}createotcsequence/`, onetimecost, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateOneTimeCost(onetimecost, id): Observable<OneTimeCost> {
    return this.http.post<OneTimeCost>(`${apiUrl}updateotc/${id}/`, onetimecost, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateBillingSetting(billingsetting, id): Observable<BillingSetting> {
    return this.http.post<BillingSetting>(`${apiUrl}updatebillingsetting/${id}/`, billingsetting, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  deleteOneTimeCost(id: string) {
    const url = `${apiUrl}deleteotc/${id}/`;
    return this.http.delete(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  deletBillingSetting(id: string) {
    const url = `${apiUrl}deletebillingsetting/${id}/`;
    return this.http.delete(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getBillingProperty(property): Observable<any[]> {
    const url = `${apiUrl}billingproperty/${property}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getProductName(property, mainproduct): Observable<any[]> {
    const url = `${apiUrl}productname/${property}/${mainproduct}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  checkconfirmbilling(billmonth, productcatalogue): Observable<any[]> {
    const url = `${apiUrl}checkconfirmbilling/` + billmonth + `/` + productcatalogue;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getProductAuditLog(id, catid): Observable<Audit[]> {
    const url = `${apiUrlProduct}product_log/${id}/${catid}/`;
    return this.http.get<Audit[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  changeStatus(id: string, status: any): Observable<any> {
    const url = `${apiUrl}changestatus/${id}/`;
    return this.http.put<any>(url, status, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  
  getOldBillingFile(catalogue_id): Observable<any[]> {
    const url = `${apiUrl}oldbillingfile/`+catalogue_id;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  confirmBilling(billperiod, productcatalogue): Observable<any[]> {
    const url = `${apiUrl}confirmbilling/`+billperiod+`/`+productcatalogue;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(_ => console.log(`confirmBilling method`)),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  
}
