import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducers';
import { Subscription } from 'rxjs';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  forma: FormGroup;
  tipo = 'ingreso';
  cargandoSubs: Subscription = new Subscription();
  cargando: boolean;

  constructor(public ingresoEgresoService: IngresoEgresoService, private store: Store<AppState>) { }

  ngOnInit() {
    this.cargandoSubs = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
    });

    this.forma  = new FormGroup({
      descripcion: new FormControl('', Validators.required),
      monto: new FormControl(0, Validators.min(1))
    });
  }

  ngOnDestroy() {
    this.cargandoSubs.unsubscribe();
  }

  crearIngresoEgreso() {
    this.store.dispatch(new ActivarLoadingAction());

    const ingresoEgreso = new IngresoEgreso({...this.forma.value, tipo: this.tipo});
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso).then( () => {

      Swal(`${this.tipo}: ${ingresoEgreso.descripcion}`, 'Creado', 'success');
      this.forma.reset({ monto: 0 });
      this.store.dispatch(new DesactivarLoadingAction());
    })
    .catch(err => {
      Swal(`${this.tipo}: ${ingresoEgreso.descripcion}`, 'Error', 'error');
      this.forma.reset({ monto: 0 });
      this.store.dispatch(new DesactivarLoadingAction());
    });

  }
}
