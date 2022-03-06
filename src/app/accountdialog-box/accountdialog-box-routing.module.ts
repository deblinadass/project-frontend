import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountdialogBoxComponent } from './accountdialog-box.component';

const routes: Routes = [
    {
      path: '', component: AccountdialogBoxComponent
	}  
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountdialogBoxRoutingModule {}
