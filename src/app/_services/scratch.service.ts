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

const apiUrl = environment.orderapiUrl;
const apiUrlProduct = environment.productapiUrl;

@Injectable({
  providedIn: 'root'
})
export class ScratchService {

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

  getproductnaam(): Observable<any[]> {
    const url = `${apiUrlProduct}productdata/3/ZTVProductNaam`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  cataloguepropertybygroup(productgroup: string): Observable<any[]> {
    const url = `${apiUrlProduct}cataloguepropertybygroup/${productgroup}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getproductstatus(productcatalogueid: number): Observable<any[]> {
    const url = `${apiUrlProduct}getproductstatus/${productcatalogueid}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getOrderList(cataloguegroup_id: number, location_id: number): Observable<any[]> {
    const url = `${apiUrl}getorderlist/${cataloguegroup_id}/${location_id}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getBackofficeScaratchOrderList(cataloguegroup_id: number): Observable<any[]> {
    const url = `${apiUrl}getbackofficescratchorderlist/${cataloguegroup_id}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getOrderByProductID(productid: any): Observable<any[]> {
    const url = `${apiUrl}getOrderByProductID/${productid}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getOrderProperty(property: string): Observable<any[]> {
    const url = `${apiUrl}orderproperty/${property}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getOrderPropertyByCatalogue(ordercatalogue: number): Observable<any[]> {
    const url = `${apiUrl}orderpropertylist/${ordercatalogue}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getOrderStateForScratchCard(): Observable<any[]> {
    const url = `${apiUrl}getscorderstatelist/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  async checkScratchCardAlreadyExist(cardnumber: String): Promise<any[]>{
    const url = `${apiUrl}checkscratchcardalreadyexist/${cardnumber}`;
    var result = await this.http.get<any[]>(url, httpOptions).toPromise();
    return result;
  }
}