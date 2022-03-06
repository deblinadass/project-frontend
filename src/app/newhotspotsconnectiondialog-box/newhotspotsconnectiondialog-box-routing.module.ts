import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewhotspotsconnectiondialogBoxComponent } from './newhotspotsconnectiondialog-box.component';

const routes: Routes = [
    {
      path: '', component: NewhotspotsconnectiondialogBoxComponent},
    { path: '', redirectTo: 'newhotspotsconnectiondialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewhotspotsconnectiondialogBoxRoutingModule {}
