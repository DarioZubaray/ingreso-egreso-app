import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../ingreso-egreso.model';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  ingresos: number;
  egresos: number;

  totalIngresos: number;
  totalEgresos: number;

  subs = new Subscription();

  public doughnutChartLabels: string[] = ['Egresos', 'Ingresos'];
  public doughnutChartData: number[] = [];

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.subs = this.store.select('ingresoEgreso').subscribe(ingresoEgreso => {
      this.contarIngresoEgreso(ingresoEgreso.items);
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  contarIngresoEgreso(items: IngresoEgreso[]) {
    this.ingresos = 0;
    this.egresos = 0;
    this.totalIngresos = 0;
    this.totalEgresos = 0;

    items.forEach(item => {
      if (item.tipo === 'ingreso') {
        this.totalIngresos++;
        this.ingresos += item.monto;
      }
      if (item.tipo === 'egreso') {
        this.totalEgresos++;
        this.egresos += item.monto;
      }
    });

    this.doughnutChartData = [this.egresos, this.ingresos];
  }

}
