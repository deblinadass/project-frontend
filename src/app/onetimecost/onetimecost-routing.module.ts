import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OneTimeCostComponent } from './onetimecost.component';

const routes: Routes = [
    {
      path: '', component: OneTimeCostComponent
	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OneTimeCostRoutingModule {}
