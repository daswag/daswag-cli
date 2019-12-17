import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap'

import { Logger } from '../services/logger.service';

import {Observable, Subject} from "rxjs";
import { AmplifyService }  from 'aws-amplify-angular';
import Amplify from 'aws-amplify';
import { environment } from '../../../environments/environment';

const log = new Logger('AuthService');

@Injectable()
export class AuthService {

  signedIn: boolean;
  private user: any;
  private currentUserSubject = new Subject<any>();

  constructor(public router: Router,
              private amplifyService: AmplifyService) {
    Amplify.configure({
      Auth: {
        // REQUIRED - Amazon Cognito Identity Pool ID
        identityPoolId: environment.identityPoolId,
        // REQUIRED - Amazon Cognito Region
        region: environment.region,
        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: environment.userPoolId,
        // OPTIONAL - Amazon Cognito Web Client ID
        userPoolWebClientId: environment.userPoolWebClientId,
      }
    });
    // Subscribe to Auth state change
    this.subscribeAuthState();
  }

  public login(): void {
    this.amplifyService.auth().federatedSignIn();
  }

  public logout(): void {
    this.amplifyService.auth().signOut().then(() => {
      this.router.navigate(['/pages/home']);
    }).catch((err: any) => {
      log.error(err);
    });
  }

  public isAuthenticated(): boolean {
    return this.signedIn;
  }

  public async loadCurrentCredentials(): Promise<any> {
    return this.amplifyService.auth().currentCredentials();
  }

  public async loadCurrentUser(): Promise<any> {
    return this.amplifyService.auth().currentAuthenticatedUser({
      bypassCache: false
    });
  }

  public async loadCurrentSession(): Promise<any> {
    return this.amplifyService.auth().currentSession();
  }

  public getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  public hasAnyRolesDirect(user_roles: Array<string>, roles: Array<string>): boolean {
    if(!user_roles) {
      return false;
    }
    for (let i = 0; i < roles.length; i++) {
      if (user_roles.includes(roles[i])) {
        return true;
      }
    }

    return false;
  }

  public hasAnyRoles(roles: Array<string>): boolean {
    return this.hasAnyRolesDirect(this.getUserRoles(), roles);
  }

  public getPicture() {
    return null;
  }

  private getUserRoles() {
    return this.signedIn ? this.user.signInUserSession.idToken.payload["cognito:groups"] : null;
  }

  private subscribeAuthState() {
    this.amplifyService.authStateChange$
      .subscribe(authState => {
        this.signedIn = authState.state === 'signedIn';
        if (!authState.user) {
          this.user = null;
          this.currentUserSubject.next(null);
        } else {
          this.user = authState.user;
          this.currentUserSubject.next(this.user);
          console.log(this.user);
        }
      });
  }
}
