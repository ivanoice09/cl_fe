import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginCredentials } from '../models/LoginCredentials';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginHttp {
  
  constructor(private http: HttpClient) {}

  HttpPostLogin(loginCredentials: LoginCredentials): Observable<any> {
    return this.http.post('https://localhost:7000/api/Auth/Login', loginCredentials, { observe: 'response', withCredentials: true});
  } 
}
