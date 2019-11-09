import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { User } from './user.model';

import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducers';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { SetUserAction, UnsetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();
  private usuario: User;

  constructor(public afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener() {
     this.afAuth.authState.subscribe((fbUser: firebase.User) => {
        if (fbUser) {
          this.userSubscription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
              .subscribe((usuarioObj: any) => {
                const newUser = new User(usuarioObj);
                this.usuario = newUser;
                this.store.dispatch(new SetUserAction(newUser));
              });
        } else {
          this.usuario = null;
          this.userSubscription.unsubscribe();
        }
    });
  }

  crearUsuario(nombre: string, email: string, password: string): void {

    this.store.dispatch(new ActivarLoadingAction());

    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(resp => {

          const user: User = {
            uid: resp.user.uid,
            nombre,
            email: resp.user.email
          };

          this.afDB.doc(`${user.uid}/usuario`)
              .set(user)
              .then( () => {
                this.store.dispatch(new DesactivarLoadingAction());
                this.router.navigate(['/']);
              });

        })
        .catch(err => {
          console.error(err);
          this.store.dispatch(new DesactivarLoadingAction());
          Swal('Error al crear usuario', err.message, 'error');
        });
  }

  login(email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());

    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(resp => {
      this.store.dispatch(new DesactivarLoadingAction());
      this.router.navigate(['/']);
    })
    .catch(err => {
      console.error(err);
      this.store.dispatch(new DesactivarLoadingAction());
      Swal('Error en el login', err.message, 'error');
    });
  }

  logout() {
    this.store.dispatch(new UnsetUserAction());

    this.router.navigate(['/login']);

    this.afAuth.auth.signOut();
  }

  isAuthenticated() {
    return this.afAuth.authState.pipe(
      map( fbUser => {
        if (fbUser == null) {
          this.router.navigateByUrl('/login');
        }
        return fbUser != null;
      })
    );
  }

  getUsuario() {
    return {... this.usuario};
  }
}
