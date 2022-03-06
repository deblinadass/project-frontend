import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExportComponent } from './Export.component';

const routes: Routes = [
    {
      path: '', component: ExportComponent},
    { path: '', redirectTo: 'Export', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExportRoutingModule {}
