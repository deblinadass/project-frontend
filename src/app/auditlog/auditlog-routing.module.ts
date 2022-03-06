import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditlogComponent } from './auditlog.component';


const routes: Routes = [
    {
      path: '', component: AuditlogComponent},
    { path: '', redirectTo: 'crm', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuditlogRoutingModule {}