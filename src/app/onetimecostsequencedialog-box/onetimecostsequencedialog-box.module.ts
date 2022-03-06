import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OnetimecostsequencedialogBoxComponent } from './onetimecostsequencedialog-box.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrModule } from 'ngx-toastr';
import { LocationService } from '../_services/location.service';
import { OnetimecostsequencedialogBoxRoutingModule } from './onetimecostsequencedialog-box-routing.module';



@NgModule({
  imports: [
      CommonModule,
      OnetimecostsequencedialogBoxComponent,
      OnetimecostsequencedialogBoxRoutingModule,
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
      ToastrModule.forRoot()
  ],   
  exports: [
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
  
   ],            
      providers: [
          LocationService,
          DatePipe
      ],
  
})
export class OnetimecostsequencedialogBoxModule { }
