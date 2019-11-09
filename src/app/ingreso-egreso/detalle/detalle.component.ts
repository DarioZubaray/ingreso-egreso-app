import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  subs = new Subscription();
  items: IngresoEgreso[] = [];

  constructor(private store: Store<AppState>, public ingresoEgrsoService: IngresoEgresoService) { }

  ngOnInit() {
    this.subs = this.store.select('ingresoEgreso').subscribe(ingresoEgreso => {
      this.items = ingresoEgreso.items;
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  borrarItem(item: any) {
    this.ingresoEgrsoService.borrarIngresoEgreso(item.uid).then( () => {
      Swal('Item borrado', `Se ha borrado ${item.descripcion} con éxito el elemento seleccionado`, 'success');
    }).catch( () => {
      Swal('Error', `Se ha produccido un error al borrar el elemento ${item.descripcion} seleccionado`, 'error');
    });
  }
}
