import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'locationview', loadChildren: () => import('../mainlocationview/mainlocationview.module').then(m => m.MainlocationviewModule) },
			{ path: 'satellite', loadChildren: () => import('../satellitelocationview/satellitelocationview.module').then(m => m.SatellitelocationviewModule) },
			{ path: 'editlocation', loadChildren: () => import('../editlocation/editlocation.module').then(m => m.EditlocationModule) },
            { path: 'createlocation', loadChildren: () => import('../createlocation/createlocation.module').then(m => m.CreatelocationModule) }, 
			{ path: 'create-satellite-location', loadChildren: () => import('../create-satellite-location/create-satellite-location.module').then(m => m.CreateSatelliteLocationModule) }, 
			{ path: 'edit-satellite-location', loadChildren: () => import('../edit-satellite-location/edit-satellite-location.module').then(m => m.EditSatelliteLocationModule) },
            { path: 'customersearch', loadChildren: () => import('../customersearch/customersearch.module').then(m => m.CustomersearchModule) },
			{ path: 'endusersearch', loadChildren: () => import('../endusersearch/endusersearch.module').then(m => m.EndusersearchModule) },
            { path: 'enduser', loadChildren: () => import('../enduserview/enduserview.module').then(m => m.EnduserviewModule) },
            { path: 'backoffice', loadChildren: () => import('../back-office/back-office.module').then(m => m.BackOfficeModule) },
            { path: 'export', loadChildren: () => import('../Export/Export.module').then(m => m.ExportModule) },
            //{ path: 'product-catalogue', loadChildren: () => import('../product-catalogue/product-catalogue.module').then(m => m.ProductCatalogueModule) },		
            { path: 'catalogueview', loadChildren: () => import('../catalogueview/catalogueview.module').then(m => m.CatalogueviewModule) },
            { path: 'billingexport', loadChildren: () => import('../billingexport/billingexport.module').then(m => m.BillingExportModule) },
            { path: 'billing-confirmation', loadChildren: () => import('../billing-confirmation/billing-confirmation.module').then(m => m.BillingConfirmationModule) },
            { path: 'createaccount', loadChildren: () => import('../endusercreate/endusercreate.module').then(m => m.EndusercreateModule) }]
        }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}