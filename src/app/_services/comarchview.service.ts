import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { OneTimeCost } from '../onetimecostdialog-box/onetimecost';
import { HSTExceptionService } from './exception.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const apiUrl = environment.locationDetails;

@Injectable({
  providedIn: 'root'
})
export class ComarchViewService {

  constructor(private http: HttpClient, private hstExceptionService: HSTExceptionService, public router: Router) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.error.Invalid_CAS != '') {
      }
      if (error.status == 403 || error.status == 500) {
      }
      return of(result as T);
    };
  }

  getComarchCustomerDetails(location_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrl}getcomarchcustomerdetails/${location_id}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getComarchInvoiceDetails(location_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrl}getcomarchinvoicedetails/${location_id}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getComarchContractDetails(location_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrl}getcomarchcontractdetails/${location_id}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

}
