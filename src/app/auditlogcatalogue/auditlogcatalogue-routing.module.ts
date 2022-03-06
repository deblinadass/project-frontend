import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditlogcatalogueComponent } from './Auditlogcatalogue.component';

const routes: Routes = [
    {
      path: '', component: AuditlogcatalogueComponent},
    { path: '', redirectTo: 'Auditlogcatalogue', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuditlogcatalogueRoutingModule { }
