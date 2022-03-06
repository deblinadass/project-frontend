import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';

const routes: Routes = [
    {
      path: '', component: LoginComponent},
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'contacts', loadChildren: () => import('../customersearch/customersearch.module').then(m => m.CustomersearchModule) },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule {}
