import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

@Injectable()
export class CustomValidatorService {

  constructor() { }

  static CustomerNumberCustomValidation(control: FormControl) {
    var reg = /[^A-Za-z0-9]+/;
    if (control.value) {
      const matches = control.value.match(reg);
      return matches ? null : { 'CustomerNumberCustomValidation': true };
    } else {
      return null;
    }
  }

  static dateValidator(control: FormControl) {
    if (control.value) {
      const matches = control.value.match(/^\d{2}\/\d{2}\/\d{4}$/);
      return matches ? null : { 'invalidDate': true };
    } else {
      return null;
    }
  }
}