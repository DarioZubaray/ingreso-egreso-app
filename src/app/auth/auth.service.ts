import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { User } from './user.model';

import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore) { }

  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
        console.log(fbUser);
    });
  }

  crearUsuario(nombre: string, email: string, password: string): void {

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
                this.router.navigate(['/']);
              });

        })
        .catch(err => {
          console.error(err);
          Swal('Error al crear usuario', err.message, 'error');
        });
  }

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(resp => {
      this.router.navigate(['/']);
    })
    .catch(err => {
      console.error(err);
      Swal('Error en el login', err.message, 'error');
    });
  }

  logout() {
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
}
