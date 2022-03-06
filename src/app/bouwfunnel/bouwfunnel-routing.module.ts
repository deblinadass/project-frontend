import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BouwfunnelComponent } from './bouwfunnel.component';


const routes: Routes = [
  {
    path: '', component: BouwfunnelComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BouwfunnelRoutingModule { }
