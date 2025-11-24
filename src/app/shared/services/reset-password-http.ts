import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResetPwdCredentials } from '../models/ResetPwdCredentials';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordHttp {
  
  constructor(private http: HttpClient) {}

  HttpPostResetPwd(resetPwdCredentials: ResetPwdCredentials): Observable<any> {
    return this.http.post('https://localhost:7000/api/Auth/PasswordReset', resetPwdCredentials, { observe: 'response', withCredentials: true });
  }
}
