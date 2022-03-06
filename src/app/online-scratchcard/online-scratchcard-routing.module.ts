import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnlineScratchcardComponent } from './online-scratchcard.component';

const routes: Routes = [
    {
      path: '', component: OnlineScratchcardComponent},
    { path: '', redirectTo: 'scratchdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OnlineScratchcardRoutingModule {}
