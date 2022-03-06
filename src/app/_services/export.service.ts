
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HSTExceptionService } from './exception.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const customerUrl = environment.locationDetails;
const productUrl = environment.productapiUrl;
const otcUrl = environment.billingapiUrl;
const ticketUrl = environment.ticketapiUrl;
const orderUrl = environment.orderapiUrl;

@Injectable({
  providedIn: 'root'
})

export class ExportService {

  constructor(private http: HttpClient, private hstExceptionService: HSTExceptionService, public router: Router) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status == 403 || error.status == 500) {

      }
      return of(result as T);
    };
  }

  downloadFile(): Observable<Blob> {
    const url = `${customerUrl}export`;
    return this.http.get(url, {responseType: 'blob' });
  }

  downloadFileOneTimeCost(product): Observable<Blob> {
    const url = `${otcUrl}exportotc/` + product;
    return this.http.get(url, {responseType: 'blob' });
  }

  downloadFileTicket(): Observable<Blob> {
    const url = `${ticketUrl}exportticket/`;
    return this.http.get(url, {responseType: 'blob' });
  }

  downloadFileOrder(product): Observable<Blob> {
    const url = `${orderUrl}orderexport/` + product;
    return this.http.get(url, {responseType: 'blob' });
  }

  downloadFileMacauth(product): Observable<Blob> {
    const url = `${productUrl}productexport/` + product;
    return this.http.get(url, {responseType: 'blob' });
  }


  downloadFileBilling(): Observable<Blob> {
    const url = `${otcUrl}exportbillingsheet/`;
    return this.http.get(url, {responseType: 'blob'});
  }

  downloadAccessBillingFile(oldexport, productcatalogue): Observable<Blob> {
    const url = `${otcUrl}exportaccessbillingsheet/` +oldexport +`/`+productcatalogue+`/`;
    return this.http.get(url, {responseType: 'blob' });
  }

  downloadCombinedBillingFile(oldexport, productcatalogue): Observable<Blob> {
    const url = `${otcUrl}exportcombinedbillingsheet/`;
    return this.http.get(url, {responseType: 'blob' });
  }
  
  downloadComarchCombinedBillingFile(oldexport, productcatalogue): Observable<Blob> {
    const url = `${otcUrl}exportcomarchcombinedbillingsheet/` + oldexport +`/`;
    return this.http.get(url, {responseType: 'blob' });
  }

  getProductType(): Observable<any[]> {
    const url = `${productUrl}productcatalogue/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getOrderProductType(): Observable<any[]> {
    const url = `${productUrl}productcatalogue/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
   downloadContract(): Observable<Blob> {
    const url = `${customerUrl}/contractexport`;
    return this.http.get(url, {responseType: 'blob' });
  }
}