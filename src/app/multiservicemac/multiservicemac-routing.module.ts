import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MultiservicemacComponent } from './multiservicemac.component';


const routes: Routes = [
  {
    path: '', component: MultiservicemacComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultiservicemacRoutingModule { }
