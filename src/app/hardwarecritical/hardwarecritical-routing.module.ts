import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HardwarecriticalComponent } from './hardwarecritical.component';

const routes: Routes = [
    {
      path: '', component: HardwarecriticalComponent
	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HardwarecriticalRoutingModule {}
