import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddsitesurveyDialougeboxComponent } from './addsitesurvey-dialougebox.component';


const routes: Routes = [
  {
    path: '', component: AddsitesurveyDialougeboxComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddsitesurveyDialougeboxRoutingModule { }
