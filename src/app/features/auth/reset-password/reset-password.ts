import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResetPwdCredentials } from '../../../shared/models/ResetPwdCredentials';
import { ResetPasswordHttp } from '../../../shared/services/reset-password-http';
import { Auth } from '../../../shared/services/auth';
import { HttpStatusCode } from '@angular/common/http';


@Component({
  selector: 'app-reset-password',
  imports: [CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

  showPassword = false;

  resetPwdCredentials: ResetPwdCredentials = new ResetPwdCredentials('', '');

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(private http: ResetPasswordHttp, private auth: Auth, private router: Router) {}

  resetPasswordBackend(eml: HTMLInputElement, newPwd: HTMLInputElement) {
    if(eml.value != "" && newPwd.value != "") {
      this.resetPwdCredentials.email = eml.value;
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
        }
      });
    } else {
      alert("Something went wrong");
    }
  }

}
