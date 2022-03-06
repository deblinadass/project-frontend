import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServicenotesComponent } from './servicenotes.component';


const routes: Routes = [
  {
    path: '', component: ServicenotesComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicenotesRoutingModule { }
