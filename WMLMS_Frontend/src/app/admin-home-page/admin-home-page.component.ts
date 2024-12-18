import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-admin-home-page',
  imports: [
    MatButton,
    RouterLink
  ],
  templateUrl: './admin-home-page.component.html',
  standalone: true,
  styleUrl: './admin-home-page.component.css'
})
export class AdminHomePageComponent {

}
