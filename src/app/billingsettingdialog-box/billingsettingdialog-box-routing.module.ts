import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingSettingdialogBoxComponent } from './billingsettingdialog-box.component';

const routes: Routes = [
    {
      path: '', component: BillingSettingdialogBoxComponent},
    { path: '', redirectTo: 'billingsettingdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillingSettingdialogBoxRoutingModule {}
