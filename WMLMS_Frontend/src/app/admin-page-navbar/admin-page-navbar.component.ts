import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbNavLink} from "@ng-bootstrap/ng-bootstrap";
import {MatAnchor} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';


@Component({
  selector: 'app-admin-page-navbar',
  imports: [
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    RouterLink,
    NgbNavLink,
    RouterOutlet,
    MatAnchor,
    MatButtonToggleGroup,
    MatButtonToggle
  ],
  templateUrl: './admin-page-navbar.component.html',
  standalone: true,
  styleUrl: './admin-page-navbar.component.css'
})
export class AdminPageNavbarComponent {

}
