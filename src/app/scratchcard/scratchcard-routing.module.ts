import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScratchcardComponent } from './scratchcard.component';

const routes: Routes = [
    {
      path: '', component: ScratchcardComponent
	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScratchcardRoutingModule {}
