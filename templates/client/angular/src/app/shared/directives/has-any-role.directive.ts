
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import {AuthService} from "../../core/auth";

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *appHasAnyRole="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *appHasAnyRole="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
  selector: '[appHasAnyRole]'
})
export class HasAnyRoleDirective {
  private roles: string[];

  constructor(private authService: AuthService, private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) {}

  @Input()
  set appHasAnyRole(value: string | string[]) {
    this.roles = typeof value === 'string' ? [value] : value;
    this.updateView();
    // Get notified each time authentication state changes.
    this.authService.getCurrentUser().subscribe(() => this.updateView());
  }

  private updateView(): void {
    const hasAnyRole = this.authService.hasAnyRoles(this.roles);
    this.viewContainerRef.clear();
    if (hasAnyRole) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
