import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterCredentials } from '../models/RegisterCredentials';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterHttp {
  
  constructor(private http: HttpClient) {}

  HttpPostRegister(registerCredentials: RegisterCredentials): Observable<any> {
    return this.http.post('https://localhost:7000/api/Auth/Register', registerCredentials, { observe: 'response', withCredentials: true })
  }
}
