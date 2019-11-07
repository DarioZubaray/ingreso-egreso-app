import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth, private router: Router) { }

  crearUsuario(nombre: string, email: string, password: string): void {
    console.log({nombre, email});

    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(resp => {
          console.log(resp);
          this.router.navigate(['/']);
        })
        .catch(err => {
          console.error(err);
          Swal('Error al crear usuario', err.message, 'error');
        });
  }

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(resp => {
      console.log(resp);
      this.router.navigate(['/']);
    })
    .catch(err => {
      console.error(err);
      Swal('Error en el login', err.message, 'error');
    });
  }
}
