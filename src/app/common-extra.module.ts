import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { NgModule, ErrorHandler} from '@angular/core';

//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './modal/modal.service';



@NgModule({
    imports: [
        CommonModule,        
        //BrowserAnimationsModule,
        ToastrModule.forRoot({
            positionClass: 'toast-center-center',//'toast-bottom-right',
            preventDuplicates: true,
        }), // ToastrModule added
        HttpClientModule,       
        NgbModule
                
    ],
    declarations: [ ModalComponent ],
    exports:[ ModalComponent ],
    providers: [ ModalService ],
    bootstrap: [ ModalComponent ]
})
export class CommonExtraModule {}

