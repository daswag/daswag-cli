import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ErrorPageComponent} from "./error/error-page.component";


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'error',
        component: ErrorPageComponent,
        data: {
          title: 'Error',
        }
      },
      {
        path: 'accessdenied',
        component: ErrorPageComponent,
        data: {
          title: 'Access Denied',
          errorNumber: '403',
          errorMessage: 'You are not allowed to access this page.'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentPagesRoutingModule { }
