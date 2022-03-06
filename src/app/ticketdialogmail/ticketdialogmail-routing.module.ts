import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketdialogmailComponent } from './ticketdialogmail.component';

const routes: Routes = [
    {
      path: '', component: TicketdialogmailComponent},
    { path: '', redirectTo: 'ticketdialogmail', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketdialogmailRoutingModule {}
