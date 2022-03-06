import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SatelliteLocationListComponent } from './satellitelocationlist.component';

const routes: Routes = [
    {
      path: '', component: SatelliteLocationListComponent
	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SatelliteLocationListRoutingModule {}
