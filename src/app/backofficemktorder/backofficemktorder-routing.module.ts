import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackofficeMKTorderComponent } from './backofficemktorder.component';


const routes: Routes = [
  {
    path: '', component: BackofficeMKTorderComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeMKTorderRoutingModule { }
