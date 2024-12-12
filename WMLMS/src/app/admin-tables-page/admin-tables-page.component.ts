import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {AgGridAngular} from 'ag-grid-angular';
import type {ColDef} from 'ag-grid-community';
import {AdminUserPageButtonsComponent} from '../admin-user-page-buttons/admin-user-page-buttons.component';
import {Albums, PlaylistTracks, Tracks, Users} from '../schema';
import {AdminServiceService} from '../admin-service.service';

@Component({
  selector: 'app-admin-tables-page',
  imports: [
    MatButton,
    AgGridAngular
  ],
  templateUrl: './admin-tables-page.component.html',
  standalone: true,
  styleUrl: './admin-tables-page.component.css'
})
export class AdminTablesPageComponent {

  loaded :boolean = false;

  colDefs: ColDef[] = [];

  rowData : Albums[] | PlaylistTracks[] = [];

  private readonly adminService= inject(AdminServiceService);

  constructor() {

  }

  ngOnInit() {

  }

  onLoadAlbumsClick() {

    this.adminService.getAlbums().subscribe({
      next: data => {
        this.rowData = data;
        console.log('GET /admin/albums', data);
      }, error:err=> {
        console.log("Failed to load User List");
      }
    });

    let temp : Albums = {
      ALBUM_ID : '',
      NAME: '',
      ARTIST_ID : '',
      RELEASE_DATE: new Date()
    };

    for (const key in temp) {
      this.colDefs.push({field : String(key) });
      console.log(this.colDefs);
    }

    gridOptions.api.setGridOption('columnDefs', colDefs);

    // add the data to the grid
    gridOptions.api.setRowData('rowData', data);
  }

  onLoadPlaylistsClick() {

  }

  onLoadForumsClick() {

  }

  onLoadCommentsClick() {


  }

}
