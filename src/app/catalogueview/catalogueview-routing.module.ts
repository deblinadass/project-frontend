import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogueviewComponent } from './catalogueview.component';


const routes: Routes = [
  {
    path: '', component: CatalogueviewComponent,
    children: [
      { path: '', loadChildren: () => import('../product-catalogue/product-catalogue.module').then(m => m.ProductCatalogueModule) },		
      { path: 'chain', loadChildren: () => import('../chain/chain.module').then(m => m.ChainModule) },		
      { path: 'accounts', loadChildren: () => import('../account/account.module').then(m => m.AccountModule) }, 
      { path: 'product-catalogue', loadChildren: () => import('../product-catalogue/product-catalogue.module').then(m => m.ProductCatalogueModule) },		
      // { path: '', loadChildren: () => import('../infra/infra.module').then(m => m.InfraModule) }, 
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueviewRoutingModule { }
