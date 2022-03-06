
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})

export class ToasterService {
    constructor(private toastr: ToastrService) { }
    showErrorOrderCompletion(error_message) {
        this.toastr.error(error_message, '', {
            timeOut: 10000
        });
    }
    showErrorScratchcard(error_message) {
        this.toastr.error('Err Message: ' + error_message + '. ', '', {
            timeOut: 10000
        });
    }
    showErrorStats(error_message) {
        this.toastr.error(error_message, '', {
            timeOut: 10000
        });
    }
    showError(error_message) {
        this.toastr.error(error_message, '', {
            timeOut: 10000
        });
    }
    showOrderCompletion(message) {
        this.toastr.success(message, '', {
            timeOut: 10000
        });
    }
}
