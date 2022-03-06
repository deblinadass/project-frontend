import { MainlocationModel } from '../_models/mainlocation.model';
import { Location } from '../editlocation/location';
import { Injectable } from '@angular/core';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Audit } from '../interface/interface';
import { CustomerContact } from '../customercontactdialog-box/customercontact';
import { Chain } from '../chain/chain';
import { Account } from '../accountdialog-box/account';
import { AuthenticationService } from './authentication.service';
import { HSTExceptionService } from './exception.service';
import { Contracts, Revenue, Valuation, Businessmodel, Macauthentication } from '../contract/contract';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const apiUrl = environment.locationDetails;

@Injectable({
  providedIn: 'root'
})

export class LocationService {
  options: any;

  constructor(private http: HttpClient, public router: Router, private authenticationService: AuthenticationService, private hstExceptionService: HSTExceptionService) { }
  apiURL: string = environment.locationDetails;
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //console.error(error.status);
      if (error.status == 403 || error.status == 500) {
      }
      //console.error(error); // log to console instead
      return of(result as T);
    };
  }
  ngOnInit() {
    const token = this.authenticationService.getJwtToken();
    this.options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `bearer ${token}` })
    };

  }

  location_details(id: string): Observable<any> {
    const url = `${apiUrl}locations/${id}`;
    return this.http.get<any>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  location_attr_details(id: string): Observable<any> {
    const url = `${apiUrl}getLocationDetails/${id}`;
    return this.http.get<any>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getLocationProperty(property): Observable<any[]> {
    const url = `${apiUrl}customerproperty/${property}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  getAllChain(): Observable<any[]> {
    const url = `${apiUrl}chainlist/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  getAllCountry(): Observable<any[]> {
    const url = `${apiUrl}countrylist/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  getAllLocationProperty(): Observable<any[]> {
    const url = `${apiUrl}customerpropertyall/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  getLocationChainId(chainid: string): Observable<any[]> {
    const url = `${apiUrl}chainid/${chainid}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  getLocationCountryId(countryid: string): Observable<any[]> {
    const url = `${apiUrl}countryid/${countryid}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }


  getTicketAuditLog(ticketid): Observable<any[]> {
    const url = `${apiUrl}locationticketauditlog/${ticketid}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateLocation(id, location): Observable<any> {
    const url = `${apiUrl}updatelocation/${id}/`;
    return this.http.post(url, location, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateLocationNotes(id, location): Observable<any> {
    const url = `${apiUrl}updatelocationnotes/${id}/`;
    return this.http.post(url, location, httpOptions).pipe(
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

  sublocation_list(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}location_list/${id}`, httpOptions).
      pipe(
        map((data: MainlocationModel[]) => {
          return data;
        }), catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  addLocation(location): Observable<Location> {
    return this.http.put<Location>(`${apiUrl}createlocation/`, location, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  auditData: any[] = [];


  getAuditLog(id): Observable<Audit[]> {
    const url = `${apiUrl}location_log/${id}`;
    return this.http.get<Audit[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }


  getMainBillingmodel(id): Observable<any> {
    const url = `${apiUrl}get_main_billingmodel/${id}/`;
    return this.http.get<any>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getCustomerContactList(id: number) {
    const url = `${apiUrl}customercontactlist/${id}`;
    return this.http.get(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  getCustomerContactListSat(id: number) {
    const url = `${apiUrl}customercontactlistsat/${id}`;
    return this.http.get(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getCustomerContactListSatellite(id: number): Observable<any> {
    const url = `${apiUrl}customercontactlistsat/${id}`;
    return this.http.get(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }



  addCustomerContact(customercontact): Observable<CustomerContact> {
    return this.http.put<CustomerContact>(`${apiUrl}createcustomercontact/`, customercontact, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateCustomerContact(customercontact, id): Observable<CustomerContact> {
    return this.http.post<CustomerContact>(`${apiUrl}updatecustomercontact/${id}/`, customercontact, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  deleteCustomerContact(id: string) {
    const url = `${apiUrl}deletecustomercontact/${id}/`;
    return this.http.delete(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getTabList(customertype: string) {
    return this.http.get(`${apiUrl}customertabslist/${customertype}`, httpOptions).
      pipe(
        tap(),
        catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
      );
  }

  getChainList() {
    const url = `${apiUrl}getchainlist`;
    return this.http.get(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  addChain(chain): Observable<Chain> {
    return this.http.put<Chain>(`${apiUrl}createchain/`, chain, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateChain(chain, id): Observable<Chain> {
    return this.http.post<Chain>(`${apiUrl}updatechain/${id}/`, chain, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  addAccount(account): Observable<Account> {
    return this.http.put<Account>(`${apiUrl}createaccount/`, account, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateAccount(account, id): Observable<Account> {
    return this.http.post<Account>(`${apiUrl}updateaccount/${id}/`, account, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getAccountList() {
    const url = `${apiUrl}accountlist`;
    return this.http.get(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getChainAuditLog(): Observable<Audit[]> {
    const url = `${apiUrl}chain_log`;
    return this.http.get<Audit[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getAccountAuditLog(): Observable<Audit[]> {
    const url = `${apiUrl}account_log`;
    return this.http.get<Audit[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  mainLocationSearch(locationid: number): Observable<any> {
    const url = `${this.apiURL}main_location_list/${locationid}/`;
    return this.http.get<any>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  relocateSatelliteLocation(id, location_id): Observable<any> {
    const url = `${this.apiURL}relocateSatelliteLocation/${id}/`;
    return this.http.post(url, location_id, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getMKTorderAuditLog(hstorderid): Observable<any[]> {
    const url = `${apiUrl}locationmktorderauditlog/${hstorderid}/`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getContactDetail(locationid): Observable<any[]> {
    const url = `${this.apiURL}doccustomercontacts/${locationid}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getOpeningHours(customerid: string): Observable<any[]> {
    const token = this.authenticationService.getJwtToken();
    const header = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `bearer ${token}` })
    };
    const url = `${apiUrl}openinghourpercustomer/${customerid}`;
    return this.http.get<any[]>(url, header).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getOrderAccounts(locationid): Observable<any[]> {
    const url = `${this.apiURL}docorderaccounts/${locationid}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateOpeningHours(openinghours): Observable<any> {
    const token = this.authenticationService.getJwtToken();
    const header = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `bearer ${token}` })
    };
    return this.http.post<any>(`${apiUrl}updateopeninghours/`, openinghours, header).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  addExceptionDays(exceptiondays): Observable<any[]> {
    const token = this.authenticationService.getJwtToken();
    const header = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `bearer ${token}` })
    };
    return this.http.post<any>(`${apiUrl}updateexceptiondays/`, exceptiondays, header).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getExceptionDays(customerid: string): Observable<any[]> {
    const token = this.authenticationService.getJwtToken();
    const header = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `bearer ${token}` })
    };
    const url = `${apiUrl}exceptionlist/${customerid}`;
    return this.http.get<any[]>(url, header).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  deleteException(id: string) {
    const token = this.authenticationService.getJwtToken();
    const header = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `bearer ${token}` })
    };
    const url = `${apiUrl}deleteexception/${id}/`;
    return this.http.delete(url, header).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  addContracts(contracts): Observable<Contracts> {
    return this.http.put<Contracts>(`${apiUrl}createcontracts/`, contracts, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  getContractList(id: number) {
    const url = `${apiUrl}contractlist/${id}`;
    return this.http.get(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  addRevenue(revenue): Observable<Revenue> {
    return this.http.put<Revenue>(`${apiUrl}createrevenue/`, revenue, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  addValuation(valuation): Observable<Valuation> {
    return this.http.put<Valuation>(`${apiUrl}createvaluation/`, valuation, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }


  getRevenueList(id: number) {
    const url = `${apiUrl}revenuelist/${id}`;
    return this.http.get(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateContract(customercontract, id): Observable<Contracts> {
    return this.http.post<Contracts>(`${apiUrl}updatecontract/${id}/`, customercontract, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  updateRevenue(customerrevenue, id): Observable<Revenue> {
    return this.http.post<Revenue>(`${apiUrl}updaterevenue/${id}/`, customerrevenue, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  updateValuation(valuation, id): Observable<Valuation> {
    return this.http.post<Valuation>(`${apiUrl}updatevaluation/${id}/`, valuation, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  getValuationList(id: number) {
    const url = `${apiUrl}valuationlist/${id}`;
    return this.http.get(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  addBusinessmodel(businessmodel): Observable<Businessmodel> {
    return this.http.put<Businessmodel>(`${apiUrl}createvbusinessmodel/`, businessmodel, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  updateBusinessmodel(businessmodel, id): Observable<Businessmodel> {
    return this.http.post<Businessmodel>(`${apiUrl}updatebusinessmodel/${id}/`, businessmodel, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );


  }
  addMacauthentication(macauthentication): Observable<Macauthentication> {
    return this.http.put<Macauthentication>(`${apiUrl}createmacauthentication/`, macauthentication, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  updateMacauthentication(macauthentication, id): Observable<Macauthentication> {
    return this.http.post<Macauthentication>(`${apiUrl}updatemacauthentication/${id}/`, macauthentication, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );


  }
  getBusinessmodelList(id: number) {
    const url = `${apiUrl}businesslist/${id}`;
    return this.http.get(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getMacauthticationList(id: number) {
    const url = `${apiUrl}maclist/${id}`;
    return this.http.get(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  locations_details(): Observable<any> {
    const url = `${apiUrl}getAllLocationDetails/`;
    return this.http.get<any>(url, httpOptions).pipe(
      tap(),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  getCustomerNote(customerid: number): Observable<any> {
    const url = `${apiUrl}getCustomerNote/${customerid}/`;
    return this.http.get<any>(url, httpOptions).pipe(
      tap(_ => console.log(`fetched `)),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  addServiceNotes(kpncustomerservice): Observable<any> {
    return this.http.put<any>(`${apiUrl}servicenote/`, kpncustomerservice, httpOptions).pipe(
      tap((prolocationduct: Businessmodel) => console.log(``)),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
  getstatisticspayment(id: number) {
    const url = `${apiUrl}statisticspayment/${id}`;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log(`fetched Location Property=`)),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );


  }
  omzetCalculation(id: number) {
    const url = `${apiUrl}omzetCalculation/${id}`;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log(`fetched Location Property=`)),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }

  createEnduser(user): Observable<any> {
    return this.http.post<any>(`${apiUrl}createenduser/`, user, httpOptions).pipe(
      tap((prolocationduct: Businessmodel) => console.log(``)),
      catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
    );
  }
}