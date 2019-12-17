import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from "../../shared/shared.module";
import { FullPagesRoutingModule } from "./full-pages-routing.module";
import {HomePageComponent} from "./home/home-page.component";


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FullPagesRoutingModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    HomePageComponent
  ]
})
export class FullPagesModule { }
