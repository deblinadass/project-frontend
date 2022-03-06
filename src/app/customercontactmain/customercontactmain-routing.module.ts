import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerContactMainComponent } from './customercontactmain.component';

const routes: Routes = [
    {
      path: '', component: CustomerContactMainComponent},
    { path: '', redirectTo: 'CustomerContactMain', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerContactMainRoutingModule {}
