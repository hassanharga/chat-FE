import { HttpRequest,HttpEvent, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor (private tokenSer: TokenService) {}
// tslint:disable-next-line: max-line-length
  intercept(req: import('@angular/common/http').HttpRequest<any>,
             next: import('@angular/common/http').HttpHandler): import('rxjs').Observable<import('@angular/common/http').HttpEvent<any>> {

    const token = this.tokenSer.getToken();
    if (token) {
      const cloned = req.clone ({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }

  }

}
