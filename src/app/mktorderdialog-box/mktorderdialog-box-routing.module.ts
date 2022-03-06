import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MKTorderdialogBoxComponent } from './mktorderdialog-box.component';

const routes: Routes = [
    {
      path: '', component: MKTorderdialogBoxComponent},
    { path: '', redirectTo: 'mktorderdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MKTorderdialogBoxRoutingModule { }
