import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MKTorderauditlogComponent } from './mktorderauditlog.component';


const routes: Routes = [
    {
      path: '', component: MKTorderauditlogComponent},
    { path: '', redirectTo: 'crm', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MKTorderauditlogRoutingModule {}