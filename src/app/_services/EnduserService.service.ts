import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { of, Observable, BehaviorSubject, throwError, from } from 'rxjs';
import { catchError, mapTo, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HSTExceptionService } from './exception.service';

@Injectable({
  providedIn: 'root'
})
export class EnduserService {
  apiURL: string = environment.enduserSearch;
  constructor(private http: HttpClient, private hstExceptionService: HSTExceptionService, public router: Router) { }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      if (error.status == 403 || error.status == 500) {

      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  enduserSearch_details(searchData: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(`${this.apiURL}endusersearch/${searchData}`, { headers }).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  fetchAccount(accountId: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(`${this.apiURL}fetchaccount/${accountId}`, { headers }).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  fetchSubscription(accountId: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.apiURL}fetchsubscription/${accountId}`, { headers }).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  fetchPayment(accountId: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.apiURL}getpayment/${accountId}`, { headers }).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }
}