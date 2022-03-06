import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainlocationviewComponent } from './mainlocationview.component';

const routes: Routes = [
  {

  path: '',
  component: MainlocationviewComponent,
  children: [
    { path: '', loadChildren: () => import('../satellitelocationlist/satellitelocationlist.module').then(m => m.SatelliteLocationListModule) },
      { path: 'contact', loadChildren: () => import('../customercontactviewmain/customercontactviewmain.module').then(m => m.CustomerContactViewMainModule) },
	  { path: 'contract', loadChildren: () => import('../contract/contract.module').then(m => m.ContractModule) },
    { path: 'comarchview', loadChildren: () => import('../comarchview/comarchview.module').then(m => m.ComarchViewModule) },
    { path: 'service-notes', loadChildren: () => import('../servicenotesmain/servicenotesmain.module').then(m => m.ServicenotesmainModule) },
  ]
}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainlocationviewRoutingModule {}
