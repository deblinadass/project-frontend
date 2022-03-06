import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpBackend} from '@angular/common/http';
import { of, Observable, BehaviorSubject, throwError, from } from 'rxjs';
import { catchError, mapTo, tap, map } from 'rxjs/operators';
import {environment} from '../../environments/environment';
import { CustomerModel } from '../_models/customersearch.model';
import { Router } from '@angular/router';
import { HSTExceptionService } from './exception.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private tokens: any;
  private httpClient: HttpClient;
  apiURL: string = environment.customerSearchDetails;
    
   constructor(private http: HttpClient, private hstExceptionService: HSTExceptionService, public router: Router) { }

   customerSearch_details(searchData:any){  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'}); 
    
    return this.http.get(`${this.apiURL}search/${searchData}`, {headers}).
    pipe(
      map((data: CustomerModel[]) => {
        return data;
      }), catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
   );
  } 	


  customerTechSearch_details(searchData:any, searchType:string){  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'}); 
    
    return this.http.get(`${this.apiURL}technicalsearch/${searchData}/${searchType}/`, {headers}).
    pipe(
      map((data: CustomerModel[]) => {
        return data;
      }), catchError((error: HttpErrorResponse) => {return this.hstExceptionService.throwApplicationError(error);})
   );
  } 	
}