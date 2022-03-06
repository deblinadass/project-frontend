import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingConfirmationComponent } from './billing-confirmation.component';

const routes: Routes = [
    {
      path: '', component: BillingConfirmationComponent},
    { path: '', redirectTo: 'BillingConfirmation', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillingConfirmationRoutingModule {}