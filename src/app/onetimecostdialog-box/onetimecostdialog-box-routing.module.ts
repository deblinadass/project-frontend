import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OneTimeCostdialogBoxComponent } from './onetimecostdialog-box.component';

const routes: Routes = [
    {
      path: '', component: OneTimeCostdialogBoxComponent},
    { path: '', redirectTo: 'OneTimeCostdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OneTimeCostdialogBoxRoutingModule {}
