import { Component } from '@angular/core';
import {LoginPageComponent} from "../login-page/login-page.component";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    LoginPageComponent,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

}
