import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  url = 'http://localhost:8080/api/chatapp';
  constructor(private http: HttpClient) { }
  addPost(body): Observable<any> {
    return this.http.post(`${this.url}/posts/add-post`, body);
  }
}
