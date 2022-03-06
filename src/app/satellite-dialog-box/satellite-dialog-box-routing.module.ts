import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SatelliteDialogBoxComponent } from './satellite-dialog-box.component';

const routes: Routes = [
    {
      path: '', component: SatelliteDialogBoxComponent},
    { path: '', redirectTo: 'satellite-dialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SatelliteDialogBoxRoutingModule {}
