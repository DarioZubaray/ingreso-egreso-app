import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';
import { ChartsModule } from 'ng2-charts';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { IngresoEgresoComponent } from './ingreso-egreso.component';
import { EstadisticaComponent } from './estadistica/estadistica.component';
import { DetalleComponent } from './detalle/detalle.component';
import { OrderIngresoEgresoPipe } from './order-ingreso-egreso.pipe';
import { StoreModule } from '@ngrx/store';
import { ingresoEgresoReducer } from './ingreso-egreso.reducer';

@NgModule({
  declarations: [
    DashboardComponent,
    IngresoEgresoComponent,
    EstadisticaComponent,
    DetalleComponent,
    OrderIngresoEgresoPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ChartsModule,
    DashboardRoutingModule,
    StoreModule.forFeature('ingreso-egreso', ingresoEgresoReducer)
  ]
})
export class IngresoEgresoModule { }
