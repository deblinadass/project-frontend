import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChaindialogBoxComponent } from './chaindialog-box.component';

const routes: Routes = [
    {
      path: '', component: ChaindialogBoxComponent
	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChaindialogBoxRoutingModule {}
