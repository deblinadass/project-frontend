import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerContactdialogBoxComponent } from './customercontactdialog-box.component';

const routes: Routes = [
    {
      path: '', component: CustomerContactdialogBoxComponent},
    { path: '', redirectTo: 'CustomerContactdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerContactdialogBoxRoutingModule {}
