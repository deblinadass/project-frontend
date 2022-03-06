import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoScratchcardComponent } from './bo-scratchcard.component';

const routes: Routes = [
    {
      path: '', component: BoScratchcardComponent},
    { path: '', redirectTo: 'scratchdialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BoScratchcardRoutingModule {}
