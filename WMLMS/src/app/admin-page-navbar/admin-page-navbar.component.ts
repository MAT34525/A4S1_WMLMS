import { Component } from '@angular/core';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbNavLink} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-admin-page-navbar',
  standalone: true,
  imports: [
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    RouterLink,
    NgbNavLink
  ],
  templateUrl: './admin-page-navbar.component.html',
  styleUrl: './admin-page-navbar.component.css'
})
export class AdminPageNavbarComponent {

}
