import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(private authenticationService: AuthenticationService, private router: Router, private dialogRef: MatDialog) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authenticationService.getJwtToken()) {
      request = this.addToken(request, this.authenticationService.getJwtToken());
      // tslint:disable-next-line:align
    }
    return next.handle(request).pipe(catchError(error => {

      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(request, next).pipe(catchError(error => {
          return this.handle403Error();
        }));
      }

      else if (error instanceof HttpErrorResponse && error.status === 403) {
        return this.handle403Error();
      }
      else {
        return throwError(error);
      }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `bearer ${token}`
      }
    });
  }

  private handle403Error() {
    this.dialogRef.closeAll();
    this.authenticationService.clearSessionData();
    this.router.navigate(['/logout']);
    return Observable.throw('Token Expired');
  }



  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authenticationService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(this.authenticationService.getJwtToken());
          return next.handle(this.addToken(request, this.authenticationService.getJwtToken()));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        // tslint:disable-next-line:variable-name
        switchMap(() => {
          return next.handle(this.addToken(request, this.authenticationService.getJwtToken()));
        }));
    }
  }
}
