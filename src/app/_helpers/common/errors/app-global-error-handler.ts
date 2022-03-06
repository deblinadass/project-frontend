import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class AppErrorHandler implements ErrorHandler {

    handleError(error: any) {
        // alert('An Unxpected Servier Error Occured. ');
        console.log('App Global Error ', error);
    }
}
