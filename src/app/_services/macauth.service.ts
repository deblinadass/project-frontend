import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { of, Observable, BehaviorSubject, throwError, from } from 'rxjs';
import { catchError, mapTo, tap, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '../editlocation/location';
import { HSTExceptionService } from './exception.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const apiUrl = environment.locationDetails;

@Injectable({
  providedIn: 'root'
})


export class MacauthService {

  private tokens: any;
  apiURL: string = environment.locationDetails;
  prodapiUrl: string = environment.productapiUrl;
  legacyapiUrl: string = environment.legacyapiUrl;
  constructor(private http: HttpClient, private hstExceptionService: HSTExceptionService, public router: Router) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      if (error.status == 403 || error.status == 500) {
      }
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getUserBandwidth(): Observable<any[]> {
    const url = `${this.legacyapiUrl}getlinegroupuserbandwidth/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }


  addMac(macauth): Observable<any[]> {
    return this.http.post<any[]>(`${this.prodapiUrl}createmacauth/`, macauth, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateMac(macauth, id): Observable<any[]> {
    return this.http.put<any[]>(`${this.prodapiUrl}updatemacauth/${id}/`, macauth, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  deleteMacAuth(id: string) {
    const url = `${this.prodapiUrl}deletemacauth/${id}/`;
    return this.http.delete(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getLocationMacList(locationid: number) {

    return this.http.get(`${this.legacyapiUrl}getmacauth/${locationid}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getMultiserviceSSID(linegroupid: number) {

    return this.http.get(`${this.legacyapiUrl}getmultiservicessid/${linegroupid}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }
}
