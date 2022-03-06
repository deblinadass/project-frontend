import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HardwarewarningComponent } from './hardwarewarning.component';

const routes: Routes = [
    {
      path: '', component: HardwarewarningComponent
	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HardwarewarningRoutingModule {}
