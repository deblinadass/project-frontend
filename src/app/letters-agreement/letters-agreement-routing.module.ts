import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LettersAgreementComponent } from './letters-agreement.component';

const routes: Routes = [
    {
      path: '', component: LettersAgreementComponent,
      children: [
        
      ]
  	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LettersAgreementRoutingModule {}
