import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerContactComponent } from './customercontact.component';

const routes: Routes = [
    {
      path: '', component: CustomerContactComponent
	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerContactRoutingModule {}
