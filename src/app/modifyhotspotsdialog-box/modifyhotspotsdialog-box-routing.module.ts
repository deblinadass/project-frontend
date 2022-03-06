import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifyhotspotsdialogBoxComponent } from './modifyhotspotsdialog-box.component';

const routes: Routes = [
    {
      path: '', component: ModifyhotspotsdialogBoxComponent},
    { path: '', redirectTo: 'modifyhotspotsdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModifyhotspotsdialogBoxRoutingModule {}
