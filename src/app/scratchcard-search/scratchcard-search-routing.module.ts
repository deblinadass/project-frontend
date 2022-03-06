import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScratchcardSearchComponent } from './scratchcard-search.component';

const routes: Routes = [
    {
      path: '', component: ScratchcardSearchComponent},
    { path: '', redirectTo: 'scratchcard-search', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScratchcardSearchRoutingModule {}
