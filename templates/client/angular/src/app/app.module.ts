import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { SharedModule } from "./shared/shared.module";
import { CoreModule } from "./core/core.module";

import { NgxWebstorageModule } from 'ngx-webstorage';

import { AppRoutingModule } from './app-routing.module';
import { AppInitService } from './app.init';
import { AppComponent } from './app.component';
import { ContentLayoutComponent, FullLayoutComponent } from "./layouts";


export function init_app(appLoadService: AppInitService) {
  return () => appLoadService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    FullLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    NgxWebstorageModule.forRoot()
  ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AppInitService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
