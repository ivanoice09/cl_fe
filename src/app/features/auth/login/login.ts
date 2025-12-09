import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginCredentials } from '../../../shared/models/LoginCredentials';
import { LoginHttp } from '../../../shared/services/login-http';
import { HttpStatusCode } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service';
import { AlertService } from '../../../shared/services/alert-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  showPassword = false;

  showResetPasswordModal = false;

  loginCredentials: LoginCredentials = new LoginCredentials('', '');
  jwtToken: any;
  jwtTokenPayload: any;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToReset() {
    this.showResetPasswordModal = false;
    this.router.navigate(['/reset-password']);
  }

  constructor(
    private httplogin: LoginHttp, 
    private auth: AuthService, 
    private router: Router, 
    private alertService: AlertService) {}

  loginBackend(eml: HTMLInputElement, pwd: HTMLInputElement, remember?: HTMLInputElement) {
    if (eml.value != '' && pwd.value != '') {
      this.loginCredentials.email = eml.value;
      this.loginCredentials.password = pwd.value;

      this.httplogin.HttpPostLogin(this.loginCredentials).subscribe({
        next: (response) => {
          switch (response.status) {
            case HttpStatusCode.Ok:
              console.log('Login successful');
              this.jwtToken = response.body?.token;
              this.jwtTokenPayload = jwt_decode.jwtDecode(this.jwtToken);
              const persistent = remember ? remember.checked : true;
              this.auth.SetJwtInfo(true, this.jwtToken, this.jwtTokenPayload.email, persistent);
              console.log('Decoded JWT payload:', this.jwtTokenPayload);
              console.log('Customer ID from token:', this.jwtTokenPayload.CustomerId);
              console.log('Email from token:', this.jwtTokenPayload.email);
              console.log('Role from token:', this.jwtTokenPayload.role);
              console.log('Expiration from token:', this.jwtTokenPayload.exp);
              console.log('Issuer from token:', this.jwtTokenPayload.iss);
              console.log('Audience from token:', this.jwtTokenPayload.aud);

              // Reinderizza l'utente al profile
              this.router.navigate(['/profile']);

              // Alert service
              this.alertService.showAlert('logged in successfully');            
              break;

            case HttpStatusCode.Unauthorized:
              console.error('Login failed: Unauthorized');
              break;

            default:
              console.error('Login failed with status:', response.status);
              break;
          }
        },
        error: (err) => {
          if (err.status === 409 && err.error?.requiresPasswordUpdate) {
            localStorage.setItem('userEmail', eml.value);
            this.showResetPasswordModal = true;
            return;
          }

          console.error('Login failed with status:', err.status);
        },
      });
    } else {
      alert('Wrong Credentials!');
    }
  }
}
