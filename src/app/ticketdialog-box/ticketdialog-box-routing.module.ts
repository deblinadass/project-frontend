import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketdialogBoxComponent } from './ticketdialog-box.component';

const routes: Routes = [
    {
      path: '', component: TicketdialogBoxComponent},
    { path: '', redirectTo: 'ticketdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketdialogBoxRoutingModule {}
