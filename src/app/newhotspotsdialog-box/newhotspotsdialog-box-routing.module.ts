import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewhotspotsdialogBoxComponent } from './newhotspotsdialog-box.component';

const routes: Routes = [
    {
      path: '', component: NewhotspotsdialogBoxComponent},
    { path: '', redirectTo: 'newhotspotsdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewhotspotsdialogBoxRoutingModule {}
