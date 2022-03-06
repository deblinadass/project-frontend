import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersearchComponent } from './customersearch.component';

const routes: Routes = [
    {
      path: '', component: CustomersearchComponent},
    { path: '', redirectTo: 'customersearch', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomersearchRoutingModule {}
