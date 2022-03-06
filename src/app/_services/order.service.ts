import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { concatMap,catchError , tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Order, Orderattributevalue, Orderattribute, Orderbase } from '../scratchdialog-box/scratch';
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

const apiUrl = environment.orderapiUrl;
const apiUrlProduct = environment.productapiUrl;

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private hstExceptionService: HSTExceptionService, public router: Router) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.error.Invalid_CAS != '') {
        // alert(error.error.Invalid_CAS);
      }
      if (error.status == 403 || error.status == 500) {

      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getOrderProperty(property: string): Observable<any[]> {
    const url = `${apiUrl}orderproperty/${property}`;
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
  
  getorderdetails(orderid): Observable<any[]> {
    const url = `${apiUrl}orderdetails/${orderid}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }


  getAtrbe(catalogueid): Observable<Orderattribute> {
    const url = `${apiUrl}orderattribute/${catalogueid}`;
    return this.http.get<Orderattribute>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getMKTAtrbe(): Observable<Orderattribute> {
    const url = `${apiUrl}orderattribute/2`;
    return this.http.get<Orderattribute>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getDigitenneAtrbe(): Observable<Orderattribute> {
    const url = `${apiUrl}orderattribute/1`;
    return this.http.get<Orderattribute>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getAtrbval(id): Observable<Orderattributevalue> {
    const url = `${apiUrl}attrvalue/${id}/`;
    return this.http.get<Orderattributevalue>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  addOrder(order): Observable<Order> {
    return this.http.post<Order>(`${apiUrl}createorder/`, order, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  addOnlineScratchOrder(order): Observable<any> {
    
    return this.http.post<any>(`${apiUrl}createonlinescratchorder/`, order, requestOptions).pipe(
      /*tap(),
      catchError(err => {
        console.log(err);
        //return err;
        return throwError(err);
      })*/
      
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    
    );
  }

  updateOrder(order, id): Observable<Order> {
    return this.http.put<Order>(`${apiUrl}updateorder/${id}/`, order, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  UpdateOrderStatusGenerateProduct(id, order_status): Observable<any> {
    const url = `${apiUrl}updateorderstatuscreateproduct/${id}/`;
    return this.http.post(url, order_status, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  UpdateOrderStatus(id, order_status): Observable<any> {
    const url = `${apiUrl}updateorderstatus/${id}/`;
    return this.http.post(url, order_status, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateScratchCardState(order, id): Observable<Order> {
    return this.http.put<Order>(`${apiUrl}updatescratchcardstate/${id}/`, order, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getAttributesOrder(id): Observable<Orderattribute> {
    const url = `${apiUrl}orderattribute/${id}`;
    return this.http.get<Orderattribute>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getOrderCountPerCustomer(customerid) {
    return this.http.get(`${apiUrl}getordercountpercustomer/${customerid}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  async checkCASAlreadyExists(casnumber): Promise<any[]> {
    const url = `${apiUrl}checkduplicatecas/${casnumber}/`;
    var result = await this.http.get<any[]>(url, httpOptions).toPromise();
    return result;
  }

  async checkCASAlreadyExistsEditOrder(casnumber): Promise<any[]> {
    const url = `${apiUrl}checkduplicatecaseditorder/${casnumber}/`;
    var result = await this.http.get<any[]>(url, httpOptions).toPromise();
    return result;
  }

  getOrderList(cataloguegroup_id: number, location_id: number): Observable<any[]> {
    const url = `${apiUrl}getorderlist/${cataloguegroup_id}/${location_id}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getBouwOrderList(cataloguegroup_id: number, location_id: number): Observable<any[]> {
    const url = `${apiUrl}getbouworderlist/${cataloguegroup_id}/${location_id}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getOrderListAll(cataloguegroup_id: number): Observable<any[]> {
    const url = `${apiUrl}getorderlistall/${cataloguegroup_id}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getOrderListAllByType(cataloguegroup_id: any, status: any): Observable<any[]> {
    const url = `${apiUrl}getorderlistallbytype/${cataloguegroup_id}/${status}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  addOrderNHBouw(order): Observable<Order> {
    return this.http.post<Order>(`${apiUrl}createnhbouworder/`, order, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateOrderNHBouw(order, id): Observable<Order> {
    return this.http.put<Order>(`${apiUrl}updatenhbouworder/${id}/`, order, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getBouwStateList(): Observable<any[]> {
    const url = `${apiUrl}getbouwstatelist`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getBouwNextStateProperty(currentstateid): Observable<any[]> {
    const url = `${apiUrl}nextstatelist/${currentstateid}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getBouwAuditLog(id): Observable<any[]> {
    const url = `${apiUrl}bouw_order_log/${id}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  addOrderMultiService(order): Observable<Order> {
    return this.http.post<Order>(`${apiUrl}createmultiserviceorder/`, order, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateOrderMultiService(order, id): Observable<Order> {
    return this.http.put<Order>(`${apiUrl}updatenmultiserviceorder/${id}/`, order, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getMultiServiceOrderList(cataloguegroup_id: number, location_id: number): Observable<any[]> {
    const url = `${apiUrl}getmultiserviceorderlist/${cataloguegroup_id}/${location_id}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  
  getScartchCardOrderStateList(): Observable<any[]> {
    const url = `${apiUrl}getscorderstatelist`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getScartchCardOrderNextStateProperty(currentstateid): Observable<any[]> {
    const url = `${apiUrl}nextstatelist/${currentstateid}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
}
