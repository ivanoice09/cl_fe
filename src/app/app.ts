import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './core/layout/navbar/navbar';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cl_fe');

  showNavbar = true;

  constructor(private router: Router) {

    // Serve a nascondere il navbar in qualsiasi pagina che vogliamo
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const current = this.router.routerState.root.firstChild;
        this.showNavbar = !current?.snapshot.data['hideNavbar'];
      });
  }
}