import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CONTENT_ROUTES, FULL_ROUTES } from "./shared";

import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/pages/home',
    pathMatch: 'full',
  },
  { path: '', component: FullLayoutComponent, data: { title: 'full Views' }, children: FULL_ROUTES },
  { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
