// Angular
import {Component, inject, OnInit} from '@angular/core';
import {AdminService} from '../admin-service.service';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

// AG Grid
import {AgGridAngular} from 'ag-grid-angular';
import {
  ClientSideRowModelModule,
  ColDef,
  GridApi,
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
import {Artists} from '../schema';
import {AdminArtistPageButtonsComponent} from '../admin-artist-page-buttons/admin-artist-page-buttons.component';

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

// Set up the columns displayed
const columnDefs: (ColDef<Artists, any>)[] = [
  {
    field: 'ARTIST_ID',
    type: 'string',
  },
  {
    field: 'NAME',
    type: 'string',
  },
  {
    field: 'IS_VERIFIED',
    type: 'string',
  },
  {
    field: 'CREATED_AT',
    type: 'date',
  },
  {
    headerName: "VERIFY",
    field: "IS_VERIFIED",
    width: 300,
    cellRenderer: AdminArtistPageButtonsComponent,
    cellRendererParams: {
      USER_ID: "ARTIST_ID",
      IS_LOCKED: "IS_VERIFIED"
    },
  },
];

// Set up the grid configuration
const gridOptions : GridOptions<Artists> | undefined = {
  defaultColDef: {
    editable: false,
    filter:true,
    flex:1,
  },
  pagination: false,
}

@Component({
  selector: 'app-admin-artist-page',
  imports: [
    AgGridAngular,
    MatButton,
    MatIconModule,
    NgIf
  ],
  templateUrl: './admin-artist-page.component.html',
  standalone: true,
  styleUrl: './admin-artist-page.component.css'
})
export class AdminArtistPageComponent implements OnInit{

  private readonly adminService = inject(AdminService);

  // AG Grid
  private gridApi!: GridApi<Artists>;
  protected readonly columnDefs = columnDefs;
  protected readonly gridOptions = gridOptions;

  rowData : Artists[]  = [];
  loaded : boolean = false;

  // Pagination
  maxPage : number = 0;
  page : number = 0;

  constructor() {
    this.rowData = [];

    // Preload the page number
    this.adminService.getArtistsCount().subscribe(data => {
        this.maxPage = Math.ceil(data["result"]/20);
    });
  }

  // Load first page at init
  ngOnInit() {
    this.getArtists(0);
  }

  // Load a page of artists using a page number
  async getArtists(page : number)
  {
    this.adminService.getArtists(page, 20).subscribe({
      next: data => {
        this.loaded= false;
        this.rowData = data;
        this.loaded = true;
      }, error:err=> {
        this.loaded=false;
        console.log("Failed to load Artist List", err);
      }});
  }

  // Reload button, reload the selected page data
  onReloadClick()
  {
    this.getArtists(this.page);
  }

  // Load grid
  onGridReady(params : any) {
    this.gridApi = params.api;
  }

  // Export grid
  onBtExport() {
    this.gridApi.exportDataAsCsv();
  }

  // Modify the selected page based on increment
  onPageChange( increment : number) {

    // Check page validity, positive
    if (this.page + increment < 0) {
      this.page = 0;
    }

    // Check page validity, maximum
    if(this.page + increment >= this.maxPage) {
      this.page = this.maxPage;
    } else {
      this.page += increment;
    }

    // Update the displayed artist
    this.getArtists(this.page);
  }
}
