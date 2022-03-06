import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnduserviewComponent } from './enduserview.component';



const routes: Routes = [
  {
    path: '',
    component: EnduserviewComponent,
    children: [
		{ path: '', loadChildren: () => import('../abonnement/abonnement.module').then(m => m.AbonnementModule) },
		{ path: 'abonnement', loadChildren: () => import('../abonnement/abonnement.module').then(m => m.AbonnementModule) },
		{ path: 'payment', loadChildren: () => import('../payment/payment.module').then(m => m.PaymentModule)},
		{ path: 'session', loadChildren: () => import('../session/session.module').then(m => m.SessionModule)},
		  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnduserviewRoutingModule { }