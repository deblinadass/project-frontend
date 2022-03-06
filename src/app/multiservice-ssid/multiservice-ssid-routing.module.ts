import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MultiserviceSsidComponent } from './multiservice-ssid.component';


const routes: Routes = [
  {
    path: '', component: MultiserviceSsidComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultiserviceSsidRoutingModule { }
