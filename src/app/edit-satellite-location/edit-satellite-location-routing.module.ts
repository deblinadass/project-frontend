import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditSatelliteLocationComponent } from './edit-satellite-location.component';


const routes: Routes = [
	{
    path: '', component: EditSatelliteLocationComponent
	},
  {
    path: 'edit-satellite-location/:id',
    component: EditSatelliteLocationComponent,
    data: { title: 'Edit Satellite Location' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditSatelliteLocationRoutingModule { }
