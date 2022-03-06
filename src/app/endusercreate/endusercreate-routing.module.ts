import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EndusercreateComponent } from './endusercreate.component';

const routes: Routes = [
    {
      path: '', component: EndusercreateComponent,
      children: [
      ]
  	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EndusercreateRoutingModule {}
