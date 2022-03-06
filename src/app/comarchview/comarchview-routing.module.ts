import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComarchViewComponent } from './comarchview.component';

const routes: Routes = [
    {
      path: '', component: ComarchViewComponent
	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ComarchViewRoutingModule {}
