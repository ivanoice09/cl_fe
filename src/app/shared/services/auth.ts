import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  userEmail: string | null = null;

  // Dichiarazione JwtHeader
  authenticationJwtHeader = new HttpHeaders({
    'content-type': 'application/json',
    'responseType': 'text'
  })

  public isLoggedIn: boolean = false;

  constructor() {
    const storedToken = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
    const storedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');

    if (storedToken) {
      this.authenticationJwtHeader = this.authenticationJwtHeader.set('Authorization', `Bearer ${storedToken}`);
      this.isLoggedIn = true;
    }

    if (storedEmail) {
      this.userEmail = storedEmail;
    }
  }

  // Impostare il local e session storage
  // If `persistent` is true the token/email will be stored in localStorage (persist across browser restarts).
  // If `persistent` is false the token will be stored in sessionStorage (cleared when the tab/window closes)
  SetJwtInfo(isLogged: boolean, token: string = '', email?: string, persistent: boolean = true) {
    if (isLogged) {
      this.authenticationJwtHeader = this.authenticationJwtHeader.set('Authorization', `Bearer ${token}`);

      if (persistent) {
        // persist in localStorage, clear sessionStorage to avoid duplication
        localStorage.setItem('jwtToken', token);
        if (email) {
          localStorage.setItem('userEmail', email);
          this.userEmail = email;
        }
        sessionStorage.removeItem('jwtToken');
        sessionStorage.removeItem('userEmail');
      } else {
        // keep only in sessionStorage, clear localStorage
        sessionStorage.setItem('jwtToken', token);
        if (email) {
          sessionStorage.setItem('userEmail', email);
          this.userEmail = email;
        }
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userEmail');
      }

      this.isLoggedIn = true;
    } else {
      this.authenticationJwtHeader = this.authenticationJwtHeader.delete('Authorization');
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userEmail');
      sessionStorage.removeItem('jwtToken');
      sessionStorage.removeItem('userEmail');
      this.userEmail = null;
      this.isLoggedIn = false;
    }
  }

  public GetLoginStatus(): boolean {
    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
    this.isLoggedIn = !!token;
    return this.isLoggedIn;
  }
  
}
