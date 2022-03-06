import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackofficeorderComponent } from './backofficeorder.component';


const routes: Routes = [
  {
    path: '', component: BackofficeorderComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeorderRoutingModule { }
