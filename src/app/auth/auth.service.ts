import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { }

  crearUsuario(nombre: string, email: string, password: string): void {
    console.log({nombre, email});

    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(resp => {
          console.log(resp);
        })
        .catch(console.error);
  }
}
