import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SatellitelocationviewComponent } from './satellitelocationview.component';

/*const routes: Routes = [
    {
      path: '', component: SatellitelocationviewComponent},
    { path: '', redirectTo: 'satellitelocationview', pathMatch: 'full' }    
];*/

const routes: Routes = [
  {
    path: '',
    component: SatellitelocationviewComponent,
    children: [
		{ path: '', loadChildren: () => import('../customercontact/customercontact.module').then(m => m.CustomerContactModule) },
		{ path: 'contacts', loadChildren: () => import('../customercontact/customercontact.module').then(m => m.CustomerContactModule) },
		{ path: 'eenmaligekosten', loadChildren: () => import('../onetimecost/onetimecost.module').then(m => m.OneTimeCostModule) }, 
		{ path: 'infra', loadChildren: () => import('../infra/infra.module').then(m => m.InfraModule) }, 
    { path: 'tickets', loadChildren: () => import('../tickets/tickets.module').then(m => m.TicketsModule) }, 
    { path: 'scratchcard', loadChildren: () => import('../scratchcard/scratchcard.module').then(m => m.ScratchcardModule) }, 
    { path: 'mktorder', loadChildren: () => import('../mktorder/mktorder.module').then(m => m.MKTorderModule) }, 
    { path: 'letters', loadChildren: () => import('../letters-agreement/letters-agreement.module').then(m => m.LettersAgreementModule) },
    { path: 'multiservice', loadChildren: () => import('../macauth/macauth.module').then(m => m.MacauthModule) }, 
    { path: 'openingstijden', loadChildren: () => import('../openinghours/openinghours.module').then(m => m.OpeninghoursModule) },
    { path: 'bouwfunnel', loadChildren: () => import('../bouwfunnel/bouwfunnel.module').then(m => m.BouwfunnelModule) },
	  { path: 'contracts', loadChildren: () => import('../contractsatellite/contractsatellite.module').then(m => m.ContractsatelliteModule) },
    { path: 'service-notes', loadChildren: () => import('../servicenotes/servicenotes.module').then(m => m.ServicenotesModule) },
	  { path: 'comarchview', loadChildren: () => import('../comarchview/comarchview.module').then(m => m.ComarchViewModule) },
    { path: 'scratchcard-search', loadChildren: () => import('../scratchcard-search/scratchcard-search.module').then(m => m.ScratchcardSearchModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SatellitelocationviewRoutingModule { }