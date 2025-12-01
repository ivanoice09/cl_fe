import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResetPwdCredentials } from '../../../shared/models/ResetPwdCredentials';
import { ResetPasswordHttp } from '../../../shared/services/reset-password-http';
import { Auth } from '../../../shared/services/auth';
import { HttpStatusCode } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

  email: string = "";

  showPassword = false;

  resetPwdCredentials: ResetPwdCredentials = new ResetPwdCredentials('', '');

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(private http: ResetPasswordHttp, private auth: Auth, private router: Router) {}

  ngOnInit() {
    const savedEmail = this.auth.userEmail || localStorage.getItem('userEmail');
    if (savedEmail) {

      console.log("Email che verrà passato al login:", savedEmail);

      this.email = savedEmail;
    }
  }

  resetPasswordBackend(newPwd: HTMLInputElement) {
    if (this.email.trim() !== "" && newPwd.value != '') {
      this.resetPwdCredentials.email = this.email;
      this.resetPwdCredentials.newPassword = newPwd.value;

      this.http.HttpPostResetPwd(this.resetPwdCredentials).subscribe({
        next: (response) => {
          switch (response.status) {
            case HttpStatusCode.Ok:
              console.log('Password reset successful');
              this.router.navigate(['/login']);
              break;
            default:
              console.error('Password reset failed with status:', response.status);
              break;
          }
        },
        error: (err) => {
          console.error('Password reset failed with status:', err);
        },
      });
    } else {
      alert('Something went wrong');
    }
  }
}
