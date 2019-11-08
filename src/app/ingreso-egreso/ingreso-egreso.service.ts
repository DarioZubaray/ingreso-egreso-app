import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(public authService: AuthService, private afDb: AngularFirestore) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const user = this.authService.getUsuario();
    return this.afDb.doc(`${user.uid}/ingresos-egresos`).collection('items').add({...ingresoEgreso});
  }
}
