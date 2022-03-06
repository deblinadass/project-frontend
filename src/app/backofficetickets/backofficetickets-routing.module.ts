import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackofficeticketsComponent } from './backofficetickets.component';

const routes: Routes = [
    {
      path: '', 
      component: BackofficeticketsComponent,
     /* children: [
            { path: 'tickets', loadChildren: () => import('../backofficetickets/backofficetickets.module').then(m => m.BackofficeticketsModule) },
            { path: 'noctickets', loadChildren: () => import('../backofficetickets/backofficetickets.module').then(m => m.BackofficeticketsModule) },
        ]*/
	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BackofficeticketsRoutingModule {}
