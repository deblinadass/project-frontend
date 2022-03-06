import { FormControl } from '@angular/forms';

export class UsernameValidators{

  static  noWhitespaceValidator(control: FormControl) {
        let isWhitespace = (control.value).indexOf(' ')>=0;
        let isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true }
    }
}