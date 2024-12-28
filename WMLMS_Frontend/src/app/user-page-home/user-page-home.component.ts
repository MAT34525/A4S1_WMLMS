import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {UserPageNavbarComponent} from '../user-page-navbar/user-page-navbar.component';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-user-page-home',
  imports: [
    RouterOutlet,
    UserPageNavbarComponent,
    MatButton,
    RouterLink
  ],
  templateUrl: './user-page-home.component.html',
  standalone: true,
  styleUrl: './user-page-home.component.css'
})
export class UserPageHomeComponent {

}
