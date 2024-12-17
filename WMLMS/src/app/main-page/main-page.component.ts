import { Component } from '@angular/core';
import {LoginPageComponent} from "../login-page/login-page.component";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MainPageNavbarComponent} from "../main-page-navbar/main-page-navbar.component";

@Component({
    selector: 'app-main-page',
    imports: [
        LoginPageComponent,
        RouterLink,
        MainPageNavbarComponent
    ],
    templateUrl: './main-page.component.html',
    standalone: true,
    styleUrl: './main-page.component.css'
})
export class MainPageComponent {

}
