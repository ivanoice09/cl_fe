import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenHttp {
  
  constructor(private http: HttpClient) {}

  HttpPostRefreshToken(): Observable<any> {
    return this.http.post('https://localhost:7000/api/Auth/Refresh', {}, 
      { observe: 'response', withCredentials: true }
    );
  }
}
