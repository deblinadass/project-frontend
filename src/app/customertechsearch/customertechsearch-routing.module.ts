import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomertechsearchComponent } from './customertechsearch.component';

const routes: Routes = [
    {
      path: '', component: CustomertechsearchComponent},
    { path: '', redirectTo: 'customersearch', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomertechsearchRoutingModule {}
