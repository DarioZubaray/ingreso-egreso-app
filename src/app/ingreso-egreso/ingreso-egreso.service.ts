import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducers';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  ingresoEgresoListenerSubs = new Subscription();
  ingresoEgresoItemSubs = new Subscription();

  constructor(public authService: AuthService, private afDb: AngularFirestore, private store: Store<AppState>) { }

  initIngresoEgresoListener() {
    this.ingresoEgresoListenerSubs = this.store.select('auth')
      .pipe(
        filter(auth => auth.user != null)
      )
      .subscribe(auth => {
        this.ingresoEgresoItems(auth.user.uid);
      });
  }

  private ingresoEgresoItems(uid: string) {
    this.ingresoEgresoItemSubs = this.afDb.collection(`${uid}/ingresos-egresos/items`)
             .snapshotChanges()
             .pipe(
               map(docData => {
                 return docData.map(doc => {
                   return {
                     uid: doc.payload.doc.id,
                     ...doc.payload.doc.data()
                   };
                 });
               })
             )
             .subscribe((collection: any[]) => {
               console.log(collection);
               this.store.dispatch(new SetItemsAction(collection));
             });
  }

  cancelarSubscriones() {
    this.ingresoEgresoItemSubs.unsubscribe();
    this.ingresoEgresoListenerSubs.unsubscribe();
  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const user = this.authService.getUsuario();
    return this.afDb.doc(`${user.uid}/ingresos-egresos`).collection('items').add({...ingresoEgreso});
  }

  borrarIngresoEgreso(uid: string) {
    const user = this.authService.getUsuario();
    return this.afDb.doc(`${user.uid}/ingresos-egresos/items/${uid}`).delete();
  }
}
