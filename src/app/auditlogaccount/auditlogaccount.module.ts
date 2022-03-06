import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { AuditlogaccountComponent } from './auditlogaccount.component';



@NgModule({
  declarations: [AuditlogaccountComponent],
  imports: [
    CommonModule,
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
    ],
})
export class AuditlogaccountModule { }
