import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AlertService, AlertState } from '../../services/alert-service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  alertState: AlertState = { message: '', visible: false, type: 'info' };

  constructor(private alertService: AlertService) {
    this.alertService.alertState$.subscribe((state) => {
      this.alertState = state;

      if (state.visible) {
        // Auto close after animation finishes
        setTimeout(() => {
          this.alertService.dismiss();
        }, 3500); // 3s delay + 0.5s animation
      }
    });
  }

  closeAlert() {
    this.alertService.dismiss();
  }
}