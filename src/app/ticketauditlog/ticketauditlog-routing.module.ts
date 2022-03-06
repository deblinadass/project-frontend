import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketauditlogComponent } from './ticketauditlog.component';


const routes: Routes = [
    {
      path: '', component: TicketauditlogComponent},
    { path: '', redirectTo: 'crm', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketauditlogRoutingModule {}