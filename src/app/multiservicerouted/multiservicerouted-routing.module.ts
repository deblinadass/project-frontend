import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MultiserviceroutedComponent } from './multiservicerouted.component';


const routes: Routes = [
  {
    path: '', component: MultiserviceroutedComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultiserviceroutedRoutingModule { }
