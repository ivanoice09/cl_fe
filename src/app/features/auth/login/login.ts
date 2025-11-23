import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginCredentials } from '../../../shared/models/LoginCredentials';
import { LoginHttp } from '../../../shared/services/login-http';
import { AuthJwtHeader } from '../../../shared/services/auth-jwt-header';
import { HttpStatusCode } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  showPassword = false;

  loginCredentials: LoginCredentials = new LoginCredentials('', '');
  jwtToken: any;
  jwtTokenPayload: any;
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(private http: LoginHttp, private authJwtHeader: AuthJwtHeader, private router: Router) {}

  loginBackend(eml: HTMLInputElement, pwd: HTMLInputElement) {
    if(eml.value != "" && pwd.value != "") {
      this.loginCredentials.email = eml.value;
      this.loginCredentials.password = pwd.value;

      this.http.HttpPostLogin(this.loginCredentials).subscribe({
        next: (response) => {
          switch (response.status) {
            case HttpStatusCode.Ok:
              console.log('Login successful');
              this.jwtToken = response.body?.token;
              this.jwtTokenPayload = jwt_decode.jwtDecode(this.jwtToken);
              this.authJwtHeader.SetJwtInfo(true, this.jwtToken);
              console.log('Decoded JWT payload:', this.jwtTokenPayload);
              console.log('User ID from token:', this.jwtTokenPayload.userId);
              console.log('Email from token:', this.jwtTokenPayload.email);
              console.log('Role from token:', this.jwtTokenPayload.role);
              console.log('Expiration from token:', this.jwtTokenPayload.exp);
              console.log('Issuer from token:', this.jwtTokenPayload.iss);
              console.log('Audience from token:', this.jwtTokenPayload.aud);

              // Reinderizza l'utente al home
              this.router.navigate(['/home']);

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
          console.error('Login failed with status:', err);
        }
      });
    } else {
      alert("Wrong Credentials!");
    }
  }

}
