import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

export class Section {
    sectionname: string;
    sectionfieldssetting: JSON;
}

@Injectable({
    providedIn: 'root'
})

export class HSTExceptionService {
    constructor() { }
    throwApplicationError(error) {
        if (error.status === 500) {
            return throwError('Internal Server Error Test');
        }
    }
}