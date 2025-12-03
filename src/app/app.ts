import { Component, OnDestroy, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './core/layout/navbar/navbar';
import { Footer } from './core/layout/footer/footer';
import { filter } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Alert } from './shared/components/alert/alert';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, RouterModule, Alert, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  protected readonly title = signal('cl_fe');

  showNavbar = true;
  loading = false;
  progress = 0;

  private progressInterval?: number;
  private hideTimeout?: number;

  constructor(private router: Router) {
  }

  ngOnDestroy() {
    this.clearTimers();
  }

  private startLoader() {
    this.clearTimers();
    this.loading = true;
    this.progress = 0;

    this.progressInterval = window.setInterval(() => {
      // Gradualmente aumenta la progressione fino al 90%
      if (this.progress < 90) {
        this.progress += Math.max(1, (90 - this.progress) * 0.05);
      }
    }, 200);
  }

  private finishLoader() {
    this.progress = 100;
    this.clearProgressInterval();

    this.hideTimeout = window.setTimeout(() => {
      this.loading = false;
      this.progress = 0;
    }, 300);
  }

  private clearProgressInterval() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = undefined;
    }
  }

  private clearTimers() {
    this.clearProgressInterval();

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
  }
  
}