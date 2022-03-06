import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisconnecthotspotsdialogBoxComponent } from './disconnecthotspotsdialog-box.component';

const routes: Routes = [
    {
      path: '', component: DisconnecthotspotsdialogBoxComponent},
    { path: '', redirectTo: 'disconnecthotspotsdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisconnecthotspotsdialogBoxRoutingModule {}
