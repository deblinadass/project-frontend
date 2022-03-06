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

const requestOptions: any = {
  observe: "response",
  responseType: 'arraybuffer',
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const apiUrl = environment.locationDetails;
const legacyapiUrl = environment.legacyapiUrl;

@Injectable({
  providedIn: 'root'
})
export class StatService {

  constructor(private http: HttpClient, private hstExceptionService: HSTExceptionService, public router: Router) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status == 403 || error.status == 500) {

      }
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getStatFilterData(formData): Observable<any> {
    console.log(formData);
    return this.http.post<any>(`${apiUrl}getstatfilterdata/`, formData, requestOptions).pipe(
      
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    
    );
  }
 
}
