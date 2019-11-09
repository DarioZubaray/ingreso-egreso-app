import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {

  username: string;
  subs = new Subscription();

  constructor(public store: Store<AppState>) { }

  ngOnInit() {
    this.subs = this.store.select('auth').pipe(filter(auth => auth.user != null)).subscribe(auth => {
      this.username = auth.user.nombre;
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
