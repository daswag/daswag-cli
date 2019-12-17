
import { Directive, TemplateRef, ViewContainerRef, AfterViewChecked } from '@angular/core';
import {AuthService} from "../../core/auth";

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *appIsAuthenticated>...</some-element>
 *
 *     <some-element *appIsAuthenticated>...</some-element>
 * ```
 */
@Directive({
  selector: '[appIsAuthenticated]'
})
export class IsAuthenticatedDirective implements AfterViewChecked {

  constructor(private authService: AuthService, private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) {}

  ngAfterViewChecked() {
    this.updateView();
    // Get notified each time authentication state changes.
    this.authService.getCurrentUser().subscribe(() => this.updateView());
  }

  private updateView(): void {
    this.viewContainerRef.clear();
    if (this.authService.signedIn) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
