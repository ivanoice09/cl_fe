import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { RegisterCredentials } from '../../../shared/models/RegisterCredentials';
import { RegisterHttp } from '../../../shared/services/register-http';
import { Auth } from '../../../shared/services/auth';
import { HttpStatusCode } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { IJwtCustomPayload } from '../../../shared/models/IJwtCustomPayload';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  showPassword = false;

  registerCredentials: RegisterCredentials = new RegisterCredentials('','','','','','');

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(private http: RegisterHttp, private auth: Auth, private router: Router) {}

  registerBackend(
    name: HTMLInputElement, 
    surname: HTMLInputElement,
    middlename: HTMLInputElement,
    email: HTMLInputElement,
    password: HTMLInputElement,
    phone: HTMLInputElement
  ) 
  {
    if (
      name.value.trim() && 
      surname.value.trim() && 
      // middlename.value != '' && 
      email.value.trim() && 
      password.value.trim() && 
      phone.value.trim()
    ) {
      const reg = {
        name: name.value,
        surname: surname.value,
        middlename: middlename.value,
        email: email.value,
        password: password.value,
        phone: phone.value
      };


      // this.registerCredentials.name = name.value;
      // this.registerCredentials.surname = surname.value;
      // this.registerCredentials.middlename = middlename.value;
      // this.registerCredentials.email = email.value;
      // this.registerCredentials.password = password.value;
      // this.registerCredentials.phone = phone.value;

      this.http.HttpPostRegister(reg).subscribe({
        next: (response) => {
          switch (response.status) {
            case HttpStatusCode.Ok:

              console.log('Register successful, proceded to Login');
              const token = response.body?.token;

              const payload = jwt_decode.jwtDecode<IJwtCustomPayload>(token);
              this.auth.SetJwtInfo(true, token, payload.email);
              // Stampo i claims nel console
              console.log('Decoded JWT payload:', payload);
              console.log('Customer ID from token:', payload.CustomId);
              console.log('Email from token:', payload.email);
              console.log('Role from token:', payload.role);
              console.log('Expiration from token:', payload.exp);
              console.log('Issuer from token:', payload.iss);
              console.log('Audience from token:', payload.aud);

              this.router.navigate(['/profile']);
              break;
            
            case HttpStatusCode.Conflict:
              alert('Email is already registered');
              break;

            default:
              console.error('Registration failed:', response.status);
              break;
          }
        },
        error: (err) => {
          console.error('Registration failed:', err);
        }
      });
    } else {
      alert('Please fill all required fields');
    }
  }
}
