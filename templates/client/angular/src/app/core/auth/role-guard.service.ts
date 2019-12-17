import {Injectable, isDevMode} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import { AuthService } from './auth.service';
import {Logger} from "../services";

const log = new Logger('RoleGuardService');

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(public authService: AuthService, public router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean | Promise<boolean> {
    const roles = route.data['roles'];
    return this.hasAnyRoles(roles);
  }

  hasAnyRoles(roles: Array<string>): Promise<boolean> {
    const authService = this.authService;
    return Promise.resolve(
      authService.loadCurrentUser().then(() => {
        if (!roles || roles.length === 0) {
          return true;
        }
        const hasAnyRole = authService.hasAnyRoles(roles);
        if (hasAnyRole) {
          return true;
        }
        if(isDevMode()) {
          log.error('User has not any of required authorities: ', roles);
        }
        this.router.navigate(['/pages/accessdenied']);
        return false;
      })
        .catch(err => {
          console.log(err);
          this.router.navigate(['/pages/accessdenied']);
          return false;
        })
    );
  }
}
