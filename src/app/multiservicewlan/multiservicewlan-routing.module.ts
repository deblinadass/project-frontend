import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MultiservicewlanComponent } from './multiservicewlan.component';


const routes: Routes = [
  {
    path: '', component: MultiservicewlanComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultiservicewlanRoutingModule { }
