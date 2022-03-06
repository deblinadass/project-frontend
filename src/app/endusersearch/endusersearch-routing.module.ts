import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EndusersearchComponent } from './endusersearch.component';

const routes: Routes = [
    {
      path: '', component: EndusersearchComponent},
    { path: '', redirectTo: 'endusersearch', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EndusersearchRoutingModule {}
