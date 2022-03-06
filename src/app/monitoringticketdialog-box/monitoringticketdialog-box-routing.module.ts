import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitoringTicketdialogBoxComponent } from './monitoringticketdialog-box.component';

const routes: Routes = [
    {
      path: '', component: MonitoringTicketdialogBoxComponent},
    { path: '', redirectTo: 'monitoringticketdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MonitoringTicketdialogBoxRoutingModule {}
