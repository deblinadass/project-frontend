import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { NgModule, ErrorHandler} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';

import { AuthenticationService } from './_services/authentication.service';
import { AuthorizationService } from './_services/authorization.service';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { AppErrorHandler } from './_helpers/common/errors/app-global-error-handler';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};


export const MY_FORMATS = {
    parse: {
      dateInput: 'DD/MM/YYYY'
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    }
  };

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatDialogModule,
        ToastrModule.forRoot({
            positionClass: 'toast-top-right',//'toast-bottom-right',
            newestOnTop: false,
            //preventDuplicates: true,
        }), // ToastrModule added
        HttpClientModule,       
        NgbModule,       
        AppRoutingModule,
        MatNativeDateModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })        
    ],
    declarations: [AppComponent],
    providers: [AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
          },
          {
            provide: ErrorHandler,
            useClass: AppErrorHandler
          },
          {
            provide: MatDialogRef,
            useValue: {}
          },
          AuthenticationService,
          AuthorizationService,
          { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
          {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
            {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},


    
           
        
        
    ],
    bootstrap: [AppComponent]
})



export class AppModule {}

