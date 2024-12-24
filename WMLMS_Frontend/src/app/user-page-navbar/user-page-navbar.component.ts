import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {MatAnchor} from "@angular/material/button";

@Component({
  selector: 'app-user-page-navbar',
    imports: [
        RouterLink,
        NgbDropdown,
        NgbDropdownToggle,
        NgbDropdownMenu,
        MatAnchor
    ],
  templateUrl: './user-page-navbar.component.html',
  standalone: true,
  styleUrl: './user-page-navbar.component.css'
})
export class UserPageNavbarComponent {

}
