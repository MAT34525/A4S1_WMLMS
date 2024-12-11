import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbNavLink} from "@ng-bootstrap/ng-bootstrap";


@Component({
    selector: 'app-admin-page-navbar',
    imports: [
        NgbDropdown,
        NgbDropdownMenu,
        NgbDropdownToggle,
        RouterLink,
        NgbNavLink,
        RouterOutlet
    ],
    templateUrl: './admin-page-navbar.component.html',
    styleUrl: './admin-page-navbar.component.css'
})
export class AdminPageNavbarComponent {

}
