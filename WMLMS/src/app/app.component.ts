import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet, UrlSegment} from '@angular/router';
import {LoginPageComponent} from './login-page/login-page.component';
import {MainPageComponent} from './main-page/main-page.component';
import {MainPageNavbarComponent} from './main-page-navbar/main-page-navbar.component';
import {NgIf} from '@angular/common';
import {TestAgGridComponent} from './test-ag-grid/test-ag-grid.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginPageComponent, MainPageComponent, MainPageNavbarComponent, NgIf, TestAgGridComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})

export class AppComponent{
  title = 'WMLMS';
  admin : boolean = false;

  constructor(private route: ActivatedRoute)
  {
  }

  ngOnInit() {
    this.route.params.subscribe(params => this.updateStatus(params) );
  }

  updateStatus(r : any |  undefined)
  {
    this.route = r;
    console.log(this.route);


    if (!this.route) {
      this.admin = false;
      return;
    }
    else {
      console.log(this.route);
    }

    this.admin = false;
    return;
  }
}
