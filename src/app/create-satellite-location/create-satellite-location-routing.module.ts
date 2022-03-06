import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateSatelliteLocationComponent } from './create-satellite-location.component';


const routes: Routes = [
  {
    path: '', component: CreateSatelliteLocationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateSatelliteLocationRoutingModule { }
