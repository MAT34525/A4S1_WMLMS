// Angular
import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {Observable} from 'rxjs';

// AG Grid
import {AgGridAngular} from 'ag-grid-angular';
import {
  ClientSideRowModelModule,
  ColDef,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  PaginationModule,
  RowSelectionModule,
  TextEditorModule,
  TextFilterModule,
} from 'ag-grid-community';

// Project
import {
  Albums,
  DUMMY_ALBUM, DUMMY_FORUM_POST,
  DUMMY_FORUM_REPLY,
  DUMMY_PLAYLIST, DUMMY_TRACK, ForumPosts, ForumReplies,
  Playlists,
  Tracks,
  Users
} from '../schema';
import {AdminService} from '../admin-service.service';

// AG Grid module registration
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  RowSelectionModule,
  PaginationModule,
  ClientSideRowModelModule
]);

// Set up the grid configuration
const gridOptions : GridOptions<Users> | undefined = {
  defaultColDef: {
    editable: false,
    filter:true,
    flex:1
  },
  pagination: true,
}

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

  private readonly adminService : AdminService = inject(AdminService);

  // AG Grid
  protected readonly gridOptions = gridOptions;
  colDefs: ColDef[] = [];
  rowData : Albums[] | Playlists[] | ForumReplies[] | ForumPosts[] | Tracks[] = [];

  loaded :boolean = false;

  // Error handling
  errorMessage : string = '';
  isError : boolean = false;

  // Default structure to load a selected table into the ag grid
  loadTable(name : string, observable : Observable<any[]>, dummy : any) {

    // Hide the ag-grid while preparing the content
    this.loaded = false;

    // Reset columns headers and rows
    this.colDefs = []
    this.rowData = []

    // Load the rows content
    observable.subscribe({
      next: data => {
        this.isError = false;
        this.rowData = data;
      }, error:err=> {
        this.isError = true;
        this.errorMessage = 'Failed to load ' + name + ' List';
        console.log("Failed to load ", name, " List :", err);
      }
    });

    // Fill the column headers table with the selected interface keys (using dummy)
    for (const key in dummy) {
      this.colDefs.push({ field : key });
    }

    // Show and refresh the ag-grid
    this.loaded = true;
  }

  // Function to load the albums into the data grid
  onLoadAlbumsClick() {
    this.loadTable("Artists", this.adminService.getAlbums(), DUMMY_ALBUM);
  }

  // Function to load the playlists into the data grid
  onLoadPlaylistsClick() {
    this.loadTable("Playlists", this.adminService.getPlaylists(), DUMMY_PLAYLIST);
  }

  // Function to load the forums replies into the data grid
  onLoadForumsRepliesClick() {
    this.loadTable("Forum Replies", this.adminService.getForumsReplies(), DUMMY_FORUM_REPLY);
  }

  // Function to load the forums posts into the data grid
  onLoadForumsPostsClick() {
    this.loadTable("Forum Posts", this.adminService.getForumsPosts(), DUMMY_FORUM_POST);
  }

  // Function to load the forums replies into the data grid
  onLoadTracksClick() {
    this.loadTable("Tracks", this.adminService.getTracks(), DUMMY_TRACK);
  }
}
