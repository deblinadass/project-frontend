import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrativeTicketdialogBoxComponent } from './administrative-ticketdialog-box.component';

const routes: Routes = [
    {
      path: '', component: AdministrativeTicketdialogBoxComponent},
    { path: '', redirectTo: 'administrative-ticketdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministrativeTicketdialogBoxRoutingModule {}
