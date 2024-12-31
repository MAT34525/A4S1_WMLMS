import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MainPageNavbarComponent} from "../main-page-navbar/main-page-navbar.component";

@Component({
    selector: 'app-main-page',
    imports: [
        RouterLink,
        MainPageNavbarComponent
    ],
    templateUrl: './main-page.component.html',
    standalone: true,
    styleUrl: './main-page.component.css'
})
export class MainPageComponent {

}
