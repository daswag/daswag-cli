import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { AuthService } from '../auth';
import { Logger } from "../services";

const log = new Logger('AuthInterceptor');

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request || !request.url) {
      return next.handle(request);
    }

    this.authService.loadCurrentCredentials().then((creds: any) => {
      console.log(creds);
      return next.handle(request);
    }).catch((err: any) => {
      log.error(err);

    })
  }
}
