import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingTicketdialogBoxComponent } from './billing-ticketdialog-box.component';

const routes: Routes = [
    {
      path: '', component: BillingTicketdialogBoxComponent},
    { path: '', redirectTo: 'billing-ticketdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillingTicketdialogBoxRoutingModule {}
