import { Component, OnInit } from '@angular/core';

import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { AmplifyService }  from 'aws-amplify-angular';

import {AuthService} from '../../core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  signedIn: boolean;
  user: any;
  modalRef: NgbModalRef;

  // Icons
  faUser = faUser;

  constructor(
    public authService: AuthService,
    private amplifyService: AmplifyService
  ) {
    this.amplifyService.authStateChange$
      .subscribe(authState => {
        if(authState.state === 'signedIn' && this.modalRef) {
          this.modalRef.close('SignedIn');
        }
      });
  }

  ngOnInit() {
  }

  login() {
    // TODO
  }

  logout() {
    this.authService.logout();
  }
}
