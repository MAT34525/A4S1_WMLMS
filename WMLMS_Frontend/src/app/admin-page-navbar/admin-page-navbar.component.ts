// Angular
import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';


@Component({
  selector: 'app-admin-page-navbar',
  imports: [
    RouterLink,
    RouterOutlet,
    MatButtonToggleGroup,
    MatButtonToggle
  ],
  templateUrl: './admin-page-navbar.component.html',
  standalone: true,
  styleUrl: './admin-page-navbar.component.css'
})
export class AdminPageNavbarComponent {}
