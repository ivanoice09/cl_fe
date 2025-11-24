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

  // Impostare il local e session storage
  SetJwtInfo(isLogged: boolean, token: string='') {
    if(isLogged) {
      this.authenticationJwtHeader = this.authenticationJwtHeader.set('Authorization', `Bearer ${token}`);
      localStorage.setItem('jwtToken', token);
      sessionStorage.setItem('LoginStatus', token);
      this.isLoggedIn = true;
    } else {
      this.authenticationJwtHeader = this.authenticationJwtHeader.delete('Authorization');
      localStorage.removeItem('jwtToken');
      sessionStorage.removeItem('LoginStatus');
      this.isLoggedIn = false;
    }
  }

  public GetLoginStatus(): boolean {
    return this.isLoggedIn;
  }
  
}
