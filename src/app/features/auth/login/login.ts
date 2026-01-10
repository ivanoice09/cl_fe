import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

  showPassword = false;
  showResetPasswordModal = false;
  submitted = false;
  jwtToken: any;
  jwtTokenPayload: any;
  wrongCredentials = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private httplogin: LoginHttp,
    private auth: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      this.loginForm.patchValue({email:savedEmail})
    }
  }

  loginBackend(remember?: HTMLInputElement) {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;

    this.httplogin.HttpPostLogin({ email, password }).subscribe({
      next: (response) => {
        switch (response.status) {
          case HttpStatusCode.Ok:
            this.jwtToken = response.body?.token;
            this.jwtTokenPayload = jwt_decode.jwtDecode(this.jwtToken);
            const persistent = remember ? remember.checked : true;
            this.auth.SetJwtInfo(true, this.jwtToken, this.jwtTokenPayload.email, persistent);

            // Decommentare per vedere dal console i valori ritornati nel token:

            // console.log('Decoded JWT payload:', this.jwtTokenPayload);
            // console.log('Customer ID from token:', this.jwtTokenPayload.CustomerId);
            // console.log('Email from token:', this.jwtTokenPayload.email);
            // console.log('Role from token:', this.jwtTokenPayload.role);
            // console.log('Expiration from token:', this.jwtTokenPayload.exp);
            // console.log('Issuer from token:', this.jwtTokenPayload.iss);
            // console.log('Audience from token:', this.jwtTokenPayload.aud);

            this.router.navigate(['/profile']);
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

        // email e password sbagliato
        if (err.status === 401) { 
          this.alertService.showAlert('Invalid email or password', 'error');
          this.wrongCredentials = true;
          this.loginForm.get('email')?.markAsTouched();
          this.loginForm.get('password')?.markAsTouched();
          return;
        }

        // se il client incontra l'errore 409 (conflict) fa uscire un modal
        // che chiederà all'utente di cambiare la password
        if (err.status === 409 && err.error?.requiresPasswordUpdate) {
          localStorage.setItem('userEmail', email);
          this.showResetPasswordModal = true;
          return;
        }
      },

    });

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToResetPassword() {
    this.showResetPasswordModal = false;
    this.router.navigate(['/reset-password']);
  }

  clearErrors() {
    if (this.submitted) {
      this.submitted = false;
    }
  }

}
