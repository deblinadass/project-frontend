import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';


@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        FlexLayoutModule
    ],
    declarations: [
        DashboardComponent
    ],
    exports:[
        FlexLayoutModule
    ]
})
export class DashboardModule {}
