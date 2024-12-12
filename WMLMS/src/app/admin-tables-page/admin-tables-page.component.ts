import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-admin-tables-page',
  imports: [
    MatButton
  ],
  templateUrl: './admin-tables-page.component.html',
  standalone: true,
  styleUrl: './admin-tables-page.component.css'
})
export class AdminTablesPageComponent {

  loaded :boolean = false;

  constructor() {

  }

  ngOnInit() {

  }

  onLoadSongsClick() {

  }

  onLoadPlaylistsClick() {

  }

  onLoadForumsClick() {

  }

  onLoadCommentsClick() {


  }

}
