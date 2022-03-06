import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContractsatelliteComponent } from './contractsatellite.component';

const routes: Routes = [
    {
      path: '', component: ContractsatelliteComponent
	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContractsatelliteRoutingModule {}
