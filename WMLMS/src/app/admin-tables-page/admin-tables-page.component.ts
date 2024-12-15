import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {AgGridAngular} from 'ag-grid-angular';
import type {ColDef} from 'ag-grid-community';
import {AdminUserPageButtonsComponent} from '../admin-user-page-buttons/admin-user-page-buttons.component';
import {
  Albums,
  DUMMY_ALBUM, DUMMY_FORUM_POST,
  DUMMY_FORUM_REPLY,
  DUMMY_PLAYLIST, DUMMY_TRACK, ForumPosts, ForumReplies,
  Playlists,
  PlaylistTracks,
  Tracks,
  Users
} from '../schema';
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
  colDefs: ColDef[] = [];

  rowData : Albums[] | Playlists[] | ForumReplies[] | ForumPosts[] | Tracks[] = [];

  private readonly adminService= inject(AdminServiceService);

  constructor() {

  }

  ngOnInit() {
  }

  // Function to load the albums into the data grid
  onLoadAlbumsClick() {
    // Hide the ag-grid while preparing the content
    this.loaded = false;

    // Reset columns headers and rows
    this.colDefs = []
    this.rowData = []

    // Load the rows content
    this.adminService.getAlbums().subscribe({
      next: data => {
        this.rowData = data;
      }, error:err=> {
        console.log("Failed to load Albums List");
      }
    });

    // Fill the column headers table with the selected interface keys (using dummy)
    for (const key in DUMMY_ALBUM) {
      this.colDefs.push({ field : key });
    }

    // Show and refresh the ag-grid
    this.loaded = true;
  }

  // Function to load the playlists into the data grid
  onLoadPlaylistsClick() {
    // Hide the ag-grid while preparing the content
    this.loaded = false;

    // Reset columns headers and rows
    this.colDefs = []
    this.rowData = []

    // Load the rows content
    this.adminService.getPlaylists().subscribe({
      next: data => {
        this.rowData = data;
      }, error:err=> {
        console.log("Failed to load Playlists List");
      }
    });

    // Fill the column headers table with the selected interface keys (using dummy)
    for (const key in DUMMY_PLAYLIST) {
      this.colDefs.push({ field : key });
    }

    // Show and refresh the ag-grid
    this.loaded = true;
  }

  // Function to load the forums replies into the data grid
  onLoadForumsRepliesClick() {
    // Hide the ag-grid while preparing the content
    this.loaded = false;

    // Reset columns headers and rows
    this.colDefs = []
    this.rowData = []

    // Load the rows content
    this.adminService.getForumsReplies().subscribe({
      next: data => {
        this.rowData = data;
      }, error:err=> {
        console.log("Failed to load Forums Replies List");
      }
    });

    // Fill the column headers table with the selected interface keys (using dummy)
    for (const key in DUMMY_FORUM_REPLY) {
      this.colDefs.push({ field : key });
    }

    // Show and refresh the ag-grid
    this.loaded = true;
  }

  // Function to load the forums posts into the data grid
  onLoadForumsPostsClick() {
    // Hide the ag-grid while preparing the content
    this.loaded = false;

    // Reset columns headers and rows
    this.colDefs = []
    this.rowData = []

    // Load the rows content
    this.adminService.getForumsPosts().subscribe({
      next: data => {
        this.rowData = data;
      }, error:err=> {
        console.log("Failed to load Forums Posts List");
      }
    });

    // Fill the column headers table with the selected interface keys (using dummy)
    for (const key in DUMMY_FORUM_POST) {
      this.colDefs.push({ field : key });
    }

    // Show and refresh the ag-grid
    this.loaded = true;
  }

  // Function to load the forums replies into the data grid
  onLoadTracksClick() {
    // Hide the ag-grid while preparing the content
    this.loaded = false;

    // Reset columns headers and rows
    this.colDefs = []
    this.rowData = []

    // Load the rows content
    this.adminService.getTracks().subscribe({
      next: data => {
        this.rowData = data;
      }, error:err=> {
        console.log("Failed to load Forums Replies List");
      }
    });

    // Fill the column headers table with the selected interface keys (using dummy)
    for (const key in DUMMY_TRACK) {
      this.colDefs.push({ field : key });
    }

    // Show and refresh the ag-grid
    this.loaded = true;
  }
}
