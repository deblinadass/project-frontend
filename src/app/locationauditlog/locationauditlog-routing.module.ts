import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationauditlogComponent } from './locationauditlog.component';


const routes: Routes = [
  {
    path: '', component: LocationauditlogComponent},
  { path: '', redirectTo: 'crm', pathMatch: 'full' }    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationauditlogRoutingModule { }
