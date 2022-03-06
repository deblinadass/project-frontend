import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MacauthdialogBoxComponent } from './macauthdialog-box.component';

const routes: Routes = [
    {
      path: '', component: MacauthdialogBoxComponent},
    { path: '', redirectTo: 'scratchdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MacauthdialogBoxRoutingModule {}
