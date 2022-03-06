import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MKTorderauditlogRoutingModule } from './mktorderauditlog-routing.module';

//import { SublocationComponent } from '../sublocation/sublocation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { AuthenticationService } from '../_services/authentication.service';
import { ToastrModule } from 'ngx-toastr';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSortModule} from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    imports: [
        CommonModule,
        MKTorderauditlogRoutingModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        HttpClientModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule ,
        MatTabsModule,
        MatExpansionModule,
        MatDividerModule, 
        MatDialogModule,
        MatFormFieldModule, 
        MatInputModule,
        FormsModule,
        MatDatepickerModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule,
        MatSortModule,
        NgbModule,
        //BrowserAnimationsModule,
        ToastrModule.forRoot()
    ], 
    exports:[
        MatTableModule,//BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule, 
        MatFormFieldModule, 
        MatInputModule,
        MatSortModule,
        NgbModule
    ],               
    providers: [
        AuthenticationService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class MKTorderauditlogModule {}