import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScratchdialogBoxComponent } from './scratchdialog-box.component';

const routes: Routes = [
    {
      path: '', component: ScratchdialogBoxComponent},
    { path: '', redirectTo: 'scratchdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScratchdialogBoxRoutingModule {}
