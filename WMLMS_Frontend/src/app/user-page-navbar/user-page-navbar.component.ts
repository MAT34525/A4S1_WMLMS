import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatAnchor} from "@angular/material/button";

@Component({
  selector: 'app-user-page-navbar',
    imports: [
        RouterLink,
        MatAnchor
    ],
  templateUrl: './user-page-navbar.component.html',
  standalone: true,
  styleUrl: './user-page-navbar.component.css'
})
export class UserPageNavbarComponent {

}
