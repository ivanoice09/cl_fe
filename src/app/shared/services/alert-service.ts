import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type AlertType = 'info' | 'warning' | 'error';

export interface AlertState {
  message: string;
  visible: boolean;
  type: AlertType;
}

const initialState: AlertState = {
  message: '',
  visible: false,
  type: 'info',
};

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly alertState = new BehaviorSubject<AlertState>({ ...initialState });

  alertState$ = this.alertState.asObservable();

  showPersistent(message: string, type: AlertType = 'info') {
    this.alertState.next({ message, visible: true, type });
  }

  dismiss() {
    this.alertState.next({ ...initialState });
  }
}