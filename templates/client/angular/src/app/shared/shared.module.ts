import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { HasAnyRoleDirective, IsAuthenticatedDirective } from "./directives";

import { AmplifyAngularModule, AmplifyService, AmplifyModules } from 'aws-amplify-angular';
import Auth from '@aws-amplify/auth';

@NgModule({
  exports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    HasAnyRoleDirective,
    IsAuthenticatedDirective,
    NgbModule,
    TranslateModule,
    FontAwesomeModule,
    AmplifyAngularModule
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    TranslateModule,
    FontAwesomeModule,
    AmplifyAngularModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    HasAnyRoleDirective,
    IsAuthenticatedDirective
  ],
  providers: [
    {
      provide: AmplifyService,
      useFactory:  () => {
        return AmplifyModules({
          Auth
        });
      }
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
