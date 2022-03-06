import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TicketsRoutingModule } from './tickets-routing.module';
import { TicketsComponent } from './tickets.component';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TicketdialogBoxComponent } from '../ticketdialog-box/ticketdialog-box.component';
import { TicketauditlogComponent } from '../ticketauditlog/ticketauditlog.component';
import { BillingTicketdialogBoxComponent } from '../billing-ticketdialog-box/billing-ticketdialog-box.component';
import { AdministrativeTicketdialogBoxComponent } from '../administrative-ticketdialog-box/administrative-ticketdialog-box.component';

@NgModule({
    imports: [
        CommonModule,
        TicketsRoutingModule,
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
        ToastrModule.forRoot(),
        MatSnackBarModule,
        
    ],   
    exports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        FlexLayoutModule,
        MatSnackBarModule,
       
        
     ],            
        

        declarations: [
            TicketdialogBoxComponent,
            TicketsComponent,
            TicketauditlogComponent,
            BillingTicketdialogBoxComponent,
            AdministrativeTicketdialogBoxComponent,
        ],
        entryComponents: [
            TicketdialogBoxComponent,
            TicketsComponent,
            TicketauditlogComponent,
            BillingTicketdialogBoxComponent,
            AdministrativeTicketdialogBoxComponent,
        ],
    
})
export class TicketsModule {}