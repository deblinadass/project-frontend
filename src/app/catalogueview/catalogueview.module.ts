import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogueviewComponent } from './catalogueview.component';
import { CatalogueviewRoutingModule } from './catalogueview-routing.module';
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
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProductCatalogueComponent } from '../product-catalogue/product-catalogue.component';
import { ChaindialogBoxComponent } from '../chaindialog-box/chaindialog-box.component';
import { CataloguedialogBoxComponent } from '../cataloguedialog-box/cataloguedialog-box.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonExtraModule } from '../common-extra.module';
import { AccountdialogBoxComponent } from '../accountdialog-box/accountdialog-box.component';



@NgModule({
  imports: [
    CommonModule,
        CatalogueviewRoutingModule,
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
        ToastrModule.forRoot()
  ],
  exports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgxMatSelectSearchModule
  ],
  providers: [
  ],
  declarations: [
    ChaindialogBoxComponent, CataloguedialogBoxComponent, AccountdialogBoxComponent, CatalogueviewComponent
  ],
  entryComponents: [
    CataloguedialogBoxComponent,
    ChaindialogBoxComponent,
    AccountdialogBoxComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class CatalogueviewModule { }
