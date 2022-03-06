import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScratchcardRoutingModule } from './scratchcard-routing.module';
import { ScratchcardComponent } from './scratchcard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
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
import { ScratchdialogBoxComponent } from '../scratchdialog-box/scratchdialog-box.component';
import {OnlineScratchcardComponent} from '../online-scratchcard/online-scratchcard.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
@NgModule({
    imports: [
        CommonModule,
        ScratchcardRoutingModule,
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
        NgxMatSelectSearchModule
        
    ],   
    exports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        FlexLayoutModule,
        MatSnackBarModule,
        NgxMatSelectSearchModule
        
     ],            
        

        declarations: [
            ScratchdialogBoxComponent,
            ScratchcardComponent,
            OnlineScratchcardComponent
        ],
        entryComponents: [
            ScratchdialogBoxComponent,
            ScratchcardComponent,
            OnlineScratchcardComponent
        ],
        providers: [
            DatePipe
        ],
    
})
export class ScratchcardModule {}