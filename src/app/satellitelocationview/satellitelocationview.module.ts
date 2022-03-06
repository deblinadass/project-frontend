import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SatellitelocationviewRoutingModule } from './satellitelocationview-routing.module';
import { SatellitelocationviewComponent } from './satellitelocationview.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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
import { CommonExtraModule } from '../common-extra.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CustomerContactdialogBoxComponent } from '../customercontactdialog-box/customercontactdialog-box.component';
import { OneTimeCostdialogBoxComponent } from '../onetimecostdialog-box/onetimecostdialog-box.component';
import { AuditlogComponent } from '../auditlog/auditlog.component';
import { InfraComponent } from '../infra/infra.component';
import { MatTreeModule } from '@angular/material/tree';
import { SatelliteDialogBoxComponent } from '../satellite-dialog-box/satellite-dialog-box.component';
import { OnetimecostsequencedialogBoxComponent } from '../onetimecostsequencedialog-box/onetimecostsequencedialog-box.component';
import { TicketdialogmailComponent } from '../ticketdialogmail/ticketdialogmail.component';
import { LettersAgreementComponent } from '../letters-agreement/letters-agreement.component';
import { LetteragreementformComponent } from '../letteragreementform/letteragreementform.component';
import { MultiserviceSsidComponent } from '../multiservice-ssid/multiservice-ssid.component';
import { MultiservicewlanComponent } from '../multiservicewlan/multiservicewlan.component';
import { MultiserviceroutedComponent } from '../multiservicerouted/multiservicerouted.component';
import { MultiservicemacComponent } from '../multiservicemac/multiservicemac.component';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
    imports: [
        CommonModule,
        SatellitelocationviewRoutingModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        HttpClientModule,
        NgbModule,
        FormsModule,
        MatButtonModule,
        MatTableModule,
        MatIconModule,
        MatPaginatorModule,
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
        CommonExtraModule,
		NgxMatSelectSearchModule,
         MatTreeModule,
         ClipboardModule,
        ToastrModule.forRoot()
    ],
    exports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        FlexLayoutModule,
		NgxMatSelectSearchModule
    ],
    providers: [
    ],
    declarations: [
        SatellitelocationviewComponent,
        CustomerContactdialogBoxComponent,
		OneTimeCostdialogBoxComponent,
        AuditlogComponent,
        InfraComponent,
        SatelliteDialogBoxComponent,
        OnetimecostsequencedialogBoxComponent,
        TicketdialogmailComponent,
        LetteragreementformComponent,
        MultiserviceSsidComponent,
        MultiservicewlanComponent,
        MultiserviceroutedComponent,
        MultiservicemacComponent
    ],
    entryComponents: [
        CustomerContactdialogBoxComponent,
		 OneTimeCostdialogBoxComponent,
		 InfraComponent,
         SatelliteDialogBoxComponent,
         OnetimecostsequencedialogBoxComponent,
         TicketdialogmailComponent,
         LetteragreementformComponent,
         MultiserviceSsidComponent,
         MultiservicewlanComponent,
         MultiserviceroutedComponent,
         MultiservicemacComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SatellitelocationviewModule { }