import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditlocationComponent } from './editlocation.component';


const routes: Routes = [
  {
    path: '', component: EditlocationComponent},
  {
    path: 'editlocation/:id',
    component: EditlocationComponent,
    data: { title: 'Edit Product' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditlocationRoutingModule { }
