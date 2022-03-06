import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HSTExceptionService } from './exception.service';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const httpOption = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

const requestOptions: any = {
  observe: "response",
  responseType: "arraybuffer",
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const legacyapiUrl = environment.legacyapiUrl;

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient, private hstExceptionService: HSTExceptionService, public router: Router) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status == 403 || error.status == 500) {

      }
      return of(result as T);
    };
  }

  getDocument(type): Observable<any[]> {
    const url = `${legacyapiUrl}documentlist/${type}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  createDocument(document): Observable<any> {
    return this.http.put<Blob>(`${legacyapiUrl}createdocument/`, document, requestOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  downloadDocument(docid): Observable<Blob> {
    const url = `${legacyapiUrl}downloaddocument/${docid}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  downloadStaticDocument(docid, docname, locationid): Observable<Blob> {
    const url = `${legacyapiUrl}downloadstaticdocument/${docid}/${docname}/${locationid}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}