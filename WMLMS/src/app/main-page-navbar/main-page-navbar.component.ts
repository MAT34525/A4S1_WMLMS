import { Component } from '@angular/core';
import {
  NgbAccordionDirective,
  NgbDropdown,
  NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu,
  NgbDropdownToggle, NgbNav,
  NgbNavItemRole,
  NgbNavLink, NgbNavLinkBase,
  NgbNavLinkButton,
  NgbNavPane
} from '@ng-bootstrap/ng-bootstrap';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-main-page-navbar',
  standalone: true,
  imports: [
    NgbDropdownToggle,
    MatButton,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    NgbNavPane,
    NgbNavLinkButton,
    NgbNavLink,
    NgbNavItemRole,
    MatIcon,
    MatIconButton,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    NgbNavLinkBase,
    NgbDropdown,
    NgbNav,
    RouterLink,
    NgbDropdownMenu,
    NgbAccordionDirective
  ],
  templateUrl: './main-page-navbar.component.html',
  styleUrl: './main-page-navbar.component.css'
})
export class MainPageNavbarComponent {

}
