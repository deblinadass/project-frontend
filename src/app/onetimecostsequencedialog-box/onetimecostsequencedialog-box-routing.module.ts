import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnetimecostsequencedialogBoxComponent } from './onetimecostsequencedialog-box.component';

const routes: Routes = [
    {
      path: '', component: OnetimecostsequencedialogBoxComponent},
    { path: '', redirectTo: 'OneTimeCostdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OnetimecostsequencedialogBoxRoutingModule {}
