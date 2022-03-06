import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LetteragreementformComponent } from './letteragreementform.component';

const routes: Routes = [
    {
      path: '', component: LetteragreementformComponent,
      children: [
        
      ]
  	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LetteragreementformRoutingModule {}
