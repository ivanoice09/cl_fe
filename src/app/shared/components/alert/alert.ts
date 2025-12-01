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
    this.alertService.alertState$.subscribe((state) => (this.alertState = state));
  }

  closeAlert() {
    this.alertService.dismiss();
  }
}