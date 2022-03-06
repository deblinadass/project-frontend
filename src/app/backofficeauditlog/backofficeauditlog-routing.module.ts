import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackofficeAuditlogComponent } from './backofficeauditlog.component';


const routes: Routes = [
    {
      path: '', component: BackofficeAuditlogComponent},
    { path: '', redirectTo: 'crm', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BackofficeAuditlogRoutingModule {}