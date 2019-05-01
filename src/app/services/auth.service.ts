import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = 'http://localhost:8080/api/chatapp';
  constructor(private http: HttpClient) { }
  createUser(body): Observable<any> {
    return this.http.post<any>(`${this.url}/register`, body);
  }
  loginUser(body): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, body);
  }

}
