import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MacauthComponent } from './macauth.component';

const routes: Routes = [
    {
      path: '', component: MacauthComponent
	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MacauthRoutingModule {}
