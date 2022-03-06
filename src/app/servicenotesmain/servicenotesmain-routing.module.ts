import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServicenotesmainComponent } from './servicenotesmain.component';


const routes: Routes = [
  {
    path: '', component: ServicenotesmainComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicenotesmainRoutingModule { }
