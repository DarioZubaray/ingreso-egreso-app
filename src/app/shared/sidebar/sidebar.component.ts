import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit , OnDestroy {

  username: string;
  subs = new Subscription();

  constructor(public authService: AuthService,
              public store: Store<AppState>,
              public ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.subs = this.store.select('auth')
        .pipe(filter(auth => auth.user != null))
        .subscribe(auth => {
          this.username = auth.user.nombre;
        });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.ingresoEgresoService.cancelarSubscripciones();
  }
}
