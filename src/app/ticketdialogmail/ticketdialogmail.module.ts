import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TicketdialogmailRoutingModule } from './ticketdialogmail-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
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
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {SafeHtmlPipe} from "../_pipes/safehtml.pipe";
//import {UnescapePipe} from "../_pipes/unescape.pipe";
import { HTMLEscapeUnescapeModule } from 'html-escape-unescape';

@NgModule({
    imports: [
        CommonModule,
        TicketdialogmailRoutingModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        HttpClientModule,
        NgbModule,
        FormsModule,
        MatButtonModule,
        MatTableModule,
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
        MatProgressSpinnerModule,
        MatSlideToggleModule,
		NgxMatSelectSearchModule,
        HTMLEscapeUnescapeModule,
        ToastrModule.forRoot()
    ],   

    declarations: [
        
        SafeHtmlPipe,
        //UnescapePipe
    ],   
       
    exports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
		TicketdialogmailRoutingModule,
		NgxMatSelectSearchModule,
        HTMLEscapeUnescapeModule,
        SafeHtmlPipe
     ],  
     
        providers: [
        ],
    
	schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class TicketdialogmailModule {}