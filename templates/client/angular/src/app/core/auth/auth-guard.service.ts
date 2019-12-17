import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import {Logger} from "../services";

const log = new Logger('AuthGuardService');

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public authService: AuthService, public router: Router) {
  }

  canActivate(): boolean | Promise<boolean> {
    return this.authService.loadCurrentUser().then(() => {
      return true;
    }).catch(err => {
      log.info(err);
      this.router.navigate(['/pages/accessdenied']);
      return false;
    });
  }
}
