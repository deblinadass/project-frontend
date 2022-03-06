import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BouwauditlogComponent } from './bouwauditlog.component';


const routes: Routes = [
    {
      path: '', component: BouwauditlogComponent},
    { path: '', redirectTo: 'crm', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BouwauditlogRoutingModule {}