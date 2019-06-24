import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = 'http://localhost:8080/api/chatapp';

  constructor(private http: HttpClient) { }
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.url}/users`);
  }
  getByUserId(id): Observable<any> {
    return this.http.get(`${this.url}/user/${id}`);
  }
  getByUsername(username): Observable<any> {
    return this.http.get(`${this.url}/username/${username}`);
  }
  followUser(id): Observable<any> {
    return this.http.post(`${this.url}/follow-user`, {userFollowed: id });
  }
  unfollowUser(id): Observable<any> {
    return this.http.post(`${this.url}/unfollow-user`, {userFollowed: id });
  }
  markNotification(id, deletedValue?): Observable<any> {
    return this.http.post(`${this.url}/mark`, { id, deletedValue });
  }
  markAllNotification(): Observable<any> {
    return this.http.post(`${this.url}/mark-all`, { all: true });
  }
  upoadImage(image): Observable<any> {
    return this.http.post(`${this.url}/upload-image`, {image});
  }
  setdefaultImage(imgversion, imgId): Observable<any> {
    return this.http.get(`${this.url}/set-default/${imgversion}/${imgId}`);
  }

}
