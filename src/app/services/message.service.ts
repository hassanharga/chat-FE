import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  url = 'http://localhost:8080/api/chatapp';

  constructor(private http: HttpClient) { }

  sendMessage(senderId, receiverId, receiverName, message) {
    return this.http.post(`${this.url}/chat-message/${senderId}/${receiverId}`, {
      receiverId,
      receiverName,
      message
    });
  }

  getAllMessages(senderId, receiverId) {
    return this.http.get(`${this.url}/chat-message/${senderId}/${receiverId}`);
  }
}
