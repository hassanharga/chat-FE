import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  // url = 'http://localhost:8080/api/chatapp';
  url = 'https://chat-bee.herokuapp.com/api/chatapp';

  constructor(private http: HttpClient) { }

  sendMessage(senderId, receiverId, receiverName, message): Observable<any> {
    return this.http.post(`${this.url}/chat-message/${senderId}/${receiverId}`, {
      receiverId,
      receiverName,
      message
    });
  }

  getAllMessages(senderId, receiverId): Observable<any> {
    return this.http.get(`${this.url}/chat-message/${senderId}/${receiverId}`);
  }
  markReceiverMessages(sender, receiver): Observable<any> {
    return this.http.get(`${this.url}/receiver-messages/${sender}/${receiver}`);
  }

  markAllMessages(): Observable<any> {
    return this.http.get(`${this.url}/mark-all-messages`);
  }
}
