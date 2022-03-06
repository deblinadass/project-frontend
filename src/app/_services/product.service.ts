import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { of, Observable, BehaviorSubject, throwError, from } from 'rxjs';
import { catchError, mapTo, tap, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '../editlocation/location';
import { Audit } from '../interface/interface';
import { HSTExceptionService } from './exception.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const apiUrl = environment.locationDetails;

@Injectable({
  providedIn: 'root'
})

export class ProductService {

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

  

  scratchcard_search(searchData:any){  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'}); 
    
    return this.http.get(`${this.legacyapiUrl}getsession/${searchData}/`, {headers}).
    pipe(
      map((data: any[]) => {
        return data;
      }), catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
   );
  } 	

  getProductList(location_id: number, catalogue_id: number) {
    return this.http.get(`${this.prodapiUrl}products/${location_id}/${catalogue_id}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getProductByInstallbaseId(productInstallbaseId: number) {
    return this.http.get(`${this.prodapiUrl}productbyid/${productInstallbaseId}/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getProductAttrValue(product_id: number) {
    return this.http.get(`${this.prodapiUrl}product_attribute/?product_id=${product_id}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getLocation(id: string): Observable<Location> {
    const url = `${apiUrl}locations/${id}`;
    return this.http.get<Location>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  deleteProductDigi(id: string) {
    const url = `${this.prodapiUrl}deleteproduct/${id}/`;
    return this.http.delete(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getSingleProduct(id: string) {
    const url = `${this.prodapiUrl}getsingleproduct/${id}/`;
    return this.http.get(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateProduct(id, product): Observable<any> {
    const url = `${apiUrl}updateproduct/${id}/`;
    return this.http.post(url, product, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  relocateProduct(id, location_id): Observable<any> {
    const url = `${this.prodapiUrl}relocateproduct/${id}/`;
    return this.http.post(url, location_id, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  addLocation(location): Observable<Location> {
    return this.http.put<Location>(`${apiUrl}createlocation/`, location, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  changeStatus(id: string, status: any): Observable<any> {
    const url = `${this.prodapiUrl}changestatus/${id}/`;
    return this.http.put<any>(url, status, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  changeCatalogueStatus(id: string, status: any): Observable<any> {
    const url = `${this.prodapiUrl}changecataloguestatus/${id}/`;
    return this.http.put<any>(url, status, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getTabList() {
    return this.http.get(`${this.prodapiUrl}producttabs_list/`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getattributelist(catalogue_id: number) {
    return this.http.get(`${this.prodapiUrl}productattribute/${catalogue_id}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );

  }

  getmacpropertylist(catalogue_id: number) {
    const url = `${this.prodapiUrl}productpropertybycatalogue/${catalogue_id}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );

  }

  getProduct(product_id: number) {
    return this.http.get(`${this.prodapiUrl}getproduct/${product_id}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );

  }

  getProductCatalogueList() {
    return this.http.get(`${this.prodapiUrl}viewproductcataloguelist`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getProductCatalogueProperty() {
    return this.http.get(`${this.prodapiUrl}productcatalogueproperty`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getProductCountPerCustomer(customerid) {
    return this.http.get(`${this.prodapiUrl}getproductcountpercustomer/${customerid}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getProductCatalogueFilterByDate(productgroup, creationdate, ordertype, locationid): Observable<any[]> {
    const url = `${this.prodapiUrl}getfiltercataloguelist/${productgroup}/${creationdate}/${ordertype}/${locationid}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getProductAuditLog(id, catid): Observable<Audit[]> {
    const url = `${this.prodapiUrl}product_log/${id}/${catid}/`;
    return this.http.get<Audit[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
}