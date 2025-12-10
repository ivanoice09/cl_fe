import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginCredentials } from '../../../shared/models/LoginCredentials';
import { LoginHttp } from '../../../shared/services/login-http';
import { HttpStatusCode } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service';
import { AlertService } from '../../../shared/services/alert-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // Very useful properties
  showPassword = false;
  showResetPasswordModal = false;
  submitted = false;
  jwtToken: any;
  jwtTokenPayload: any;
  wrongCredentials = false;

  // This is needed to implement proper validation errors
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  // loginCredentials: LoginCredentials = new LoginCredentials('', '');

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToResetPassword() {
    this.showResetPasswordModal = false;
    this.router.navigate(['/reset-password']);
  }

  constructor(
    private httplogin: LoginHttp,
    private auth: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  loginBackend(remember?: HTMLInputElement) {
    this.submitted = true;
    this.wrongCredentials = false;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email!;
    const pwd = this.loginForm.value.password!;

    this.httplogin.HttpPostLogin({ email, password: pwd }).subscribe({
      next: (response) => {
        switch (response.status) {
          case HttpStatusCode.Ok:
            console.log('Login successful');
            this.jwtToken = response.body?.token;
            this.jwtTokenPayload = jwt_decode.jwtDecode(this.jwtToken);
            const persistent = remember ? remember.checked : true;
            this.auth.SetJwtInfo(true, this.jwtToken, this.jwtTokenPayload.email, persistent);

            // console.log('Decoded JWT payload:', this.jwtTokenPayload);
            // console.log('Customer ID from token:', this.jwtTokenPayload.CustomerId);
            // console.log('Email from token:', this.jwtTokenPayload.email);
            // console.log('Role from token:', this.jwtTokenPayload.role);
            // console.log('Expiration from token:', this.jwtTokenPayload.exp);
            // console.log('Issuer from token:', this.jwtTokenPayload.iss);
            // console.log('Audience from token:', this.jwtTokenPayload.aud);

            // Reinderizza l'utente al profile
            this.router.navigate(['/profile']);

            // Alert service
            this.alertService.showAlert('logged in successfully', 'success');
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

        // Wrong email or password
        if (err.status === 401) { 
          this.alertService.showAlert('Invalid email or password', 'error');
          this.wrongCredentials = true;
          this.loginForm.get('email')?.markAsTouched();
          this.loginForm.get('password')?.markAsTouched();
          this.submitted = false;
          return;
        }

        // Force reset password
        if (err.status === 409 && err.error?.requiresPasswordUpdate) {
          localStorage.setItem('userEmail', email);
          this.showResetPasswordModal = true;
          this.submitted = false;
          return;
        }

        console.error('Login failed with status:', err.status);
      },
    });
  }
}
