import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HSTExceptionService } from './exception.service';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const apiUrl = environment.infraapiUrl;
const legacyapiUrl = environment.legacyapiUrl;

@Injectable({
  providedIn: 'root'
})
export class InfraService {

  constructor(private http: HttpClient, private hstExceptionService: HSTExceptionService, public router: Router) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status == 403 || error.status == 500) {

      }
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getMonitoringList(locationid: number) {
    return this.http.get(`${apiUrl}monitoringlist/${locationid}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }
  getMonitoringListAll() {

    return this.http.get(`${legacyapiUrl}getmonitoringdata/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }
  getSessionActual() {
    return this.http.get(`${legacyapiUrl}getsessionactualdata/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }

  getHardwareList(locationid: number) {
    return this.http.get(`${apiUrl}hardwarelist/${locationid}/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }
  getHardwareCriticalM() {

    return this.http.get(`${apiUrl}hardwarelistcrtM/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }
  getHardwareWarningM() {

    return this.http.get(`${apiUrl}hardwarelistwrnM/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }
  getHardwareCriticalU() {
    return this.http.get(`${apiUrl}hardwarelistcrtU/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }
  getHardwareWarningU() {
    return this.http.get(`${apiUrl}hardwarelistwrnU/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }

  getAlarms(locationid: number) {

    return this.http.get(`${apiUrl}getalarms/${locationid}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }
  getAlarmsAll() {

    return this.http.get(`${legacyapiUrl}getalarmdata/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }

  getUserCount() {
    return this.http.get(`${legacyapiUrl}getusercountdata/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }
  getTopFiveSession(locationid: number) {

    return this.http.get(`${apiUrl}gettopfivesession/${locationid}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }
  getLineGroup(locationid: number) {

    return this.http.get(`${legacyapiUrl}getlinegroup/${locationid}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }
  getLineGroupSpeed() {

    return this.http.get(`${legacyapiUrl}getlinegroupspeed/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }

  getLineGroupUserBandwidth() {

    return this.http.get(`${legacyapiUrl}getlinegroupuserbandwidth/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }

  getLineGroupSubnet() {
    return this.http.get(`${legacyapiUrl}getlinegroupsubnet/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }

  getLineGroupSubnetService() {
    return this.http.get(`${legacyapiUrl}getlinegroupsubnetservice/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }

  getSession(formData) {
    return this.http.post<any>(`${legacyapiUrl}getinfrasession/`, formData);
  }

  getSessionByAccountId(formData) {
    return this.http.post<any>(`${legacyapiUrl}sessionaccountid/`, formData);
  }
  checkBigErrorMessage() {

    return this.http.get(`${legacyapiUrl}getbigerrormsg/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => { return this.hstExceptionService.throwApplicationError(error); })
      );

  }
}
