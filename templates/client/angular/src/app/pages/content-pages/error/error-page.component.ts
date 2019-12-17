import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
  message: string;
  number: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    console.log(this.route.data);
    this.route.data.subscribe(routeData => {
      this.number = routeData.errorNumber ? routeData.errorNumber : '404';
      this.message = routeData.errorMessage ? routeData.errorMessage : "Something went wrong here.";
    });
  }
}
