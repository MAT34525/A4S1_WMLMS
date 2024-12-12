import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {AgGridAngular} from 'ag-grid-angular';
import type {ColDef} from 'ag-grid-community';
import {AdminUserPageButtonsComponent} from '../admin-user-page-buttons/admin-user-page-buttons.component';
import {Albums, DUMMY_ALBUM, DUMMY_PLAYLIST, Playlists, PlaylistTracks, Tracks, Users} from '../schema';
import {AdminServiceService} from '../admin-service.service';
import {GridOptionsService} from '@ag-grid-community/core';
import {NONE_TYPE} from '@angular/compiler';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-admin-tables-page',
  imports: [
    MatButton,
    AgGridAngular,
    NgIf
  ],
  templateUrl: './admin-tables-page.component.html',
  standalone: true,
  styleUrl: './admin-tables-page.component.css'
})
export class AdminTablesPageComponent {

  loaded :boolean = false;
  active : "NONE"|"ALBUMS"|"PLAYLISTS" = "PLAYLISTS";

  colDefs: ColDef[] = [];

  rowData : Albums[] | Playlists[] = [];

  private readonly adminService= inject(AdminServiceService);

  constructor() {

  }

  ngOnInit() {

  }

  onLoadAlbumsClick() {

    this.loaded = false;

    this.active = "ALBUMS";

    this.adminService.getAlbums().subscribe({
      next: data => {
        this.rowData = data;
        console.log('GET /admin/albums', data);
      }, error:err=> {
        console.log("Failed to load User List");
      }
    });

    this.colDefs = []

    for (const key in DUMMY_ALBUM) {
      this.colDefs.push({ field : key });
    }

    this.loaded = true;

  }

  onLoadPlaylistsClick() {

    this.loaded = false;

    this.active = "PLAYLISTS";

    this.adminService.getPlaylists().subscribe({
      next: data => {
        this.rowData = data;
        console.log('GET /admin/albums', data);
      }, error:err=> {
        console.log("Failed to load User List");
      }
    });

    this.colDefs = []

    for (const key in DUMMY_PLAYLIST) {
      this.colDefs.push({ field : key });
    }

    this.loaded = true;
  }

  onLoadForumsClick() {

  }

  onLoadCommentsClick() {


  }

}
