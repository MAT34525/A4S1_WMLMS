import {Component} from '@angular/core';
import {MatAnchor} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-main-page-navbar',
    imports: [
        RouterLink,
        MatAnchor
    ],
    templateUrl: './main-page-navbar.component.html',
    standalone: true,
    styleUrl: './main-page-navbar.component.css'
})
export class MainPageNavbarComponent {

}
