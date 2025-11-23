import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthJwtHeader {
  
  authenticationJwtHeader = new HttpHeaders({
    'content-type': 'application/json',
    'responseType': 'text'
  })

  public isLoggedIn: boolean = false;

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
