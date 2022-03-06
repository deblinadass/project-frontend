import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ProductCatalogue } from '../cataloguedialog-box/catalogue';
import { HSTExceptionService } from './exception.service';
//import { Iptv } from '../iptvdialog-box/iptv';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const apiUrl = environment.productapiUrl;

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  constructor(private http: HttpClient, private hstExceptionService: HSTExceptionService, public router: Router) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

     
      if (error.error.Invalid_CAS != '') {       
      }

    
      if (error.status == 403 || error.status == 500) {

      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /*Added*/

 

  getCatalogueProperty(property): Observable<any[]> {
    const url = `${apiUrl}catalogueproperty/${property}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }


  getCatalogueName(productgroup, producttype): Observable<any[]> {
    const url = `${apiUrl}cataloguename/${productgroup}/${producttype}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  addProductCatalogue(productcatalogue): Observable<ProductCatalogue> {
    return this.http.post<ProductCatalogue>(`${apiUrl}createcatalogue/`, productcatalogue, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }


  updateProductCatalogue(productcatalogue, id): Observable<ProductCatalogue> {
    return this.http.put<ProductCatalogue>(`${apiUrl}updatecatalogue/${id}/`, productcatalogue, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  deleteProductCatalogue(id: string) {
    const url = `${apiUrl}deletecatalogue/${id}/`;
    return this.http.delete(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
}
