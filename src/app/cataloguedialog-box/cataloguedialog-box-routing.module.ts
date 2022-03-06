import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CataloguedialogBoxComponent } from './cataloguedialog-box.component';

const routes: Routes = [
    {
      path: '', component: CataloguedialogBoxComponent},
    { path: '', redirectTo: 'Cataloguedialog-box', pathMatch: 'full' }    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CataloguedialogBoxRoutingModule {}
