import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackOfficeComponent } from './back-office.component';
import { MonitoringComponent } from '../monitoring/monitoring.component';
import { BackofficeMKTorderComponent } from '../backofficemktorder/backofficemktorder.component';


/*const routes: Routes = [
    {
      path: '', component: BackOfficeComponent
	}  
];*/


const routes: Routes = [
    {
      path: '',
      component: BackOfficeComponent,
      children: [
          { path: '', loadChildren: () => import('../backofficetickets/backofficetickets.module').then(m => m.BackofficeticketsModule) },
          { path: 'monitoring', loadChildren: () => import('../monitoring/monitoring.module').then(m => m.MonitoringModule) },
          { path: 'mtorder', loadChildren: () => import('../backofficemktorder/backofficemktorder.module').then(m => m.BackofficeMKTorderModule) },
		      { path: 'tickets', loadChildren: () => import('../backofficetickets/backofficetickets.module').then(m => m.BackofficeticketsModule) },
          { path: 'orders', loadChildren: () => import('../backofficeorder/backofficeorder.module').then(m => m.BackofficeorderModule) },
          { path: 'noctickets', loadChildren: () => import('../backofficetickets/backofficetickets.module').then(m => m.BackofficeticketsModule) },
          { path: 'billingtickets', loadChildren: () => import('../backofficetickets/backofficetickets.module').then(m => m.BackofficeticketsModule) },
          { path: 'admintickets', loadChildren: () => import('../backofficetickets/backofficetickets.module').then(m => m.BackofficeticketsModule) },
          { path: 'monitoringtickets', loadChildren: () => import('../backofficetickets/backofficetickets.module').then(m => m.BackofficeticketsModule) },
          { path: 'nocticketsclosed', loadChildren: () => import('../backofficetickets/backofficetickets.module').then(m => m.BackofficeticketsModule) },
          { path: 'billingticketsclosed', loadChildren: () => import('../backofficetickets/backofficetickets.module').then(m => m.BackofficeticketsModule) },
          { path: 'adminticketsclosed', loadChildren: () => import('../backofficetickets/backofficetickets.module').then(m => m.BackofficeticketsModule) },
          { path: 'monitoringticketsclosed', loadChildren: () => import('../backofficetickets/backofficetickets.module').then(m => m.BackofficeticketsModule) },


          { path: 'hotspots', loadChildren: () => import('../backofficeorder/backofficeorder.module').then(m => m.BackofficeorderModule) },
          { path: 'hotspotsclosed', loadChildren: () => import('../backofficeorder/backofficeorder.module').then(m => m.BackofficeorderModule) },
          { path: 'connection', loadChildren: () => import('../backofficeorder/backofficeorder.module').then(m => m.BackofficeorderModule) },
          { path: 'connectionclosed', loadChildren: () => import('../backofficeorder/backofficeorder.module').then(m => m.BackofficeorderModule) },
          { path: 'scratchcard', loadChildren: () => import('../backofficeorder/backofficeorder.module').then(m => m.BackofficeorderModule) },

          //{ path: 'online-scratchcard', loadChildren: () => import('../backoffice-scratchcard/backoffice-scratchcard.module').then(m => m.BackofficeScratchcardModule) },
          


        ]
    }
  ];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BackOfficeRoutingModule {}
