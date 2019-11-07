import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

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
        .catch(console.error);
  }
}
