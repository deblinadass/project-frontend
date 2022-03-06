import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerContactViewMainComponent } from './customercontactviewmain.component';

const routes: Routes = [
    {
      path: '', component: CustomerContactViewMainComponent
	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerContactViewMainRoutingModule {}
