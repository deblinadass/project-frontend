import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpeninghoursComponent } from './openinghours.component';

const routes: Routes = [
    {
      path: '', component: OpeninghoursComponent,
      children: [
        
      ]
  	}  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OpeninghoursRoutingModule {}
