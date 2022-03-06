import { Injectable } from '@angular/core';
import { Observable, of, throwError, forkJoin  } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';
import { HSTExceptionService } from './exception.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = environment.ticketapiUrl;
const apiLegacyUrl = environment.legacyapiUrl;
const locationurl = environment.locationDetails;
@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient, private hstExceptionService: HSTExceptionService, public router: Router) { }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      if(error.status==403 || error.status==500){
      }
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getTicketList() {
    return this.http.get(`${apiUrl}viewticketlist`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }


  getTicketListByType(tickettype, status) {
    return this.http.get(`${apiUrl}viewticketlistbytype/${tickettype}/${status}/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getTicketListByTypeMonitoring(tickettype, status) {
    return this.http.get(`${apiUrl}viewticketlistbytypestatus/${tickettype}/${status}/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }


  /*getStateList(): Observable<any[]> {

    return this.http.get<any[]>(`${apiUrl}/getissustatelist`, httpOptions).
      pipe(
        tap(),
        catchError(this.handleError(`getStateList id=`))
      );
  }*/

  getStateList(): Observable<any[]> {
    const url = `${apiUrl}getissustatelist`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getMailDetails(mailid):Observable<any[]> {
    const url = `${apiLegacyUrl}getmaildetails/${mailid}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getCommunicationgroup() {

    return this.http.get(`${apiUrl}getcommunicationgroup`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }


  getcommunicationgroupticket(tickettype) {

    return this.http.get(`${apiUrl}getcommunicationgroupticket/${tickettype}/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getalarmdatabylocation(locationid) {

    return this.http.get(`${apiLegacyUrl}getalarmdatabylocation/${locationid}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getAlarmsAll() {

    return this.http.get(`${apiLegacyUrl}getalarmdata/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );

  }



  getLocationTicketList(locationid) {

    return this.http.get(`${apiUrl}viewlocationticketlist/${locationid}/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getTicketProperty(){
    return this.http.get(`${apiUrl}ticketpropertylist`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getIssueProperty(property,issuetype): Observable<any[]> {
    const url = `${apiUrl}issueproperty/${property}/${issuetype}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getIssueNextStateProperty(currentstateid): Observable<any[]> {
    const url = `${apiUrl}nextstatelist/${currentstateid}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  addTicket(ticket): Observable<any[]> {
    return this.http.post<any[]>(`${apiUrl}createticket/`, ticket, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateTicket(ticket, id): Observable<any[]> {
    return this.http.put<any[]>(`${apiUrl}updateticket/${id}/`, ticket, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  ticketTransfer(ticket, id): Observable<any[]>{
    return this.http.put<any[]>(`${apiUrl}tickettransfer/${id}/`, ticket, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
 
  addMonitoringTicket(ticket): Observable<any[]> {
    return this.http.post<any[]>(`${apiUrl}createmonitoringticket/`, ticket, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateMonitoringTicket(ticket, id): Observable<any[]> {
    return this.http.put<any[]>(`${apiUrl}updatemonitoringticket/${id}/`, ticket, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  
  getCustomerContacts(locationid): Observable<any[]> {
    const url = `${locationurl}customercontactlistsat/${locationid}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  getCommunicationgroupByID(comid) {

    return this.http.get(`${apiUrl}getcommunicationgroupbyorgid/${comid}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }
  getMonTicketByCustomerid1(customerid){
    return this.http.get(`${apiUrl}getmonticketbylocationid/${customerid}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }
  async getMonTicketByCustomerid(customerid): Promise<any[]> {
    const url = `${apiUrl}getmonticketbylocationid/${customerid}`;
    var result = await this.http.get<any[]>(url, httpOptions).toPromise();
    return result;
  }
  getActiveTickets(){
    return this.http.get(`${apiUrl}getactivemontickets/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }
}