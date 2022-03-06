import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpBackend } from '@angular/common/http';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { OauthModel } from '../_models/oauth.model';
import { environment } from '../../environments/environment';
import { UserModel } from '../_models/user.model';
import { HandleHttpErrorService } from './shared/handle-http-error.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private msttokens: any;
  private httpClient: HttpClient;
  private JWT_TOKEN = 'JWT_TOKEN';
  private REFRESH_TOKEN: string;
  private USER_NAME: string;
  private USER_ROLE: string;
  private USER_PREV_LOGIN: string;
  private OauthModel = new OauthModel();
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(handler: HttpBackend, private http: HttpClient) {
    this.httpClient = new HttpClient(handler);
  }

  login(userLoginInfo: UserModel): Observable<boolean> {
    sessionStorage.setItem('currentUser', userLoginInfo.username.toLowerCase());
    return this.httpClient.post<any>(environment.hstloginserviceurl + 'login', userLoginInfo)
      .pipe(
        tap(response => this.storeJwtTokens(response)),
        mapTo(true),
        catchError((HandleHttpErrorService.handleError)));

  }

  getJwtToken() {
    return sessionStorage.getItem('accessToken');
  }

  private getRefreshToken() {
    return sessionStorage.getItem('refreshToken');
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    const params = new HttpParams().append('mstseckey', this.getRefreshToken());
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded' });
    return this.httpClient.post<any>(environment.hstloginserviceurl + 'refresh',
      { 'mstseckey': this.getRefreshToken() },
    ).pipe(
      tap(response => this.storeJwtRefresh(response)),
      mapTo(true),
      catchError((HandleHttpErrorService.handleError)));

  }

  private storeJwtTokens(response) {

    this.msttokens = response;
    this.JWT_TOKEN = this.msttokens['accessToken'];
    this.REFRESH_TOKEN = this.msttokens['refreshToken'];
    this.USER_NAME = this.msttokens['username'];
    this.USER_ROLE = this.msttokens['userrole'];
    this.USER_PREV_LOGIN = this.msttokens['userprevlogin'];
    sessionStorage.setItem('accessToken', this.JWT_TOKEN);
    sessionStorage.setItem('refreshToken', this.REFRESH_TOKEN);
    sessionStorage.setItem('username', this.USER_NAME);
    sessionStorage.setItem('additionalToken', this.USER_ROLE);
    sessionStorage.setItem('userprevlogin', this.USER_PREV_LOGIN);

  }

  private storeJwtRefresh(response) {
    this.msttokens = response;
    this.JWT_TOKEN = this.msttokens['accessToken'];
    this.REFRESH_TOKEN = this.msttokens['refreshToken'];
    this.USER_NAME = this.msttokens['username'];
    if (this.getUser() == this.USER_NAME) {
      sessionStorage.setItem('accessToken', this.JWT_TOKEN);
      sessionStorage.setItem('refreshToken', this.REFRESH_TOKEN);
    } else {
      sessionStorage.setItem('accessToken', '');
      sessionStorage.setItem('refreshToken', '');
    }
  }

  private storeJwtToken(jwt: string) {
    sessionStorage.setItem('accessToken', jwt);
  }

  getUser(): string {
    return sessionStorage.getItem('username');
  }

  getUserRole(): string {
    return sessionStorage.getItem('additionalToken');
  }

  isAdminUser(): boolean {
    return sessionStorage.getItem('additionalToken') == '01000001';
  }

  isSuperUser(): boolean {
    return sessionStorage.getItem('additionalToken') == '01010011' || sessionStorage.getItem('additionalToken') == '01000010';
  }

  isBillingUser(): boolean {
    return sessionStorage.getItem('additionalToken') == '01000010';
  }

  isNOCUser(): boolean {   
    return sessionStorage.getItem('additionalToken') == '01001110';
  }

  hasAccess(action): Observable<any[]> {
    const url = `${environment.hstloginserviceurl}checkuserrole/${action}`;
    return this.http.get<any[]>(url, httpOptions).pipe(
      tap(),
      catchError(this.handleError<any[]>(`role check failed=`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status == 403 || error.status == 500) {
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  clearSessionData() {
    sessionStorage.clear();
  }
}
