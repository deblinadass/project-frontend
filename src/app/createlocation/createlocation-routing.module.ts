import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatelocationComponent } from './createlocation.component';


const routes: Routes = [
  {
    path: '', component: CreatelocationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatelocationRoutingModule { }

