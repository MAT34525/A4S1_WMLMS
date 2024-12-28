import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AdminPageNavbarComponent} from '../admin-page-navbar/admin-page-navbar.component';

@Component({
  selector: 'app-admin-page',
  imports: [
    RouterOutlet,
    AdminPageNavbarComponent
  ],
  templateUrl: './admin-page.component.html',
  standalone: true,
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {

}
