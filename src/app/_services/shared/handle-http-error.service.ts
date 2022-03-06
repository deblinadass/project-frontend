import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { NotFoundError } from 'src/app/_helpers/common/errors/not-found-error';
import { AppError } from 'src/app/_helpers/common/errors/app-error';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpErrorResponse } from '@angular/common/http';
import { BadRequestError } from 'src/app/_helpers/common/errors/bad-request-error';


@Injectable({
  providedIn: 'root'
})
export class HandleHttpErrorService {



  constructor(private toastr: ToastrManager) { }


/*static handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }*/

  static handleError(error) {
    // tslint:disable-next-line:prefer-const
    let toastr: ToastrManager;
    if (error.status === 404) {
      // tslint:disable-next-line:no-unused-expression
      // return Observable.throw(new NotFoundError());
      // window.alert('Not found');
      console.log('Not found' + error);
      return throwError(new NotFoundError());

    } else if (error.status === 400) {
      
      console.log('Not found' + error);
      return throwError(new BadRequestError());

    }
    else {
      // server-side error
      // return Observable.throw(new AppError(error));
      // window.alert(error.message);
      // toastr.errorToastr('Server Error Test' + error.message, 'Failed!');
      return throwError(new AppError(error));
    }
  }
}
