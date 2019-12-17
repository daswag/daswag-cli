import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from "./home/home-page.component";
import { AuthGuardService} from "../../core/auth";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        component: HomePageComponent,
        data: {
          title: 'Home'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullPagesRoutingModule { }
