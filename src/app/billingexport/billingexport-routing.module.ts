import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingExportComponent } from './billingexport.component';

const routes: Routes = [
    {
      path: '', component: BillingExportComponent},
    { path: '', redirectTo: 'billingexport', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillingExportRoutingModule {}
