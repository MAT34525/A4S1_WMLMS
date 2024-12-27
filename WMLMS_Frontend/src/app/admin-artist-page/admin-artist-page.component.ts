import { Component } from '@angular/core';

import {inject, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router'
import {AdminServiceService} from '../admin-service.service';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { MatIconModule } from '@angular/material/icon';

import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  PaginationModule,
  RowSelectionModule,
  RowSelectionOptions,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from 'ag-grid-community';
import {Artists} from '../schema';
import {ITextFilterParams} from '@ag-grid-community/core';
import {AdminUserPageButtonsComponent} from '../admin-user-page-buttons/admin-user-page-buttons.component';
import {AdminArtistPageButtonsComponent} from '../admin-artist-page-buttons/admin-artist-page-buttons.component';

ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  RowSelectionModule,
  PaginationModule,
  ClientSideRowModelModule
]);

// Filters and searches tutorial : https://www.ag-grid.com/angular-data-grid/filter-text/#text-filter-options

const lockFilterParams: ITextFilterParams = {
  filterOptions: ["equals"],
  maxNumConditions: 1,
  textMatcher: ({ value, filterText }) => {
    const literalMatch = contains(value, filterText || "");
    return !!literalMatch;
  }
};

const userFilterParams: ITextFilterParams = {
  filterOptions: ["contains"],
  maxNumConditions: 1,
  textMatcher: ({ value, filterText }) => {
    const literalMatch = contains(value, filterText || "");
    return !!literalMatch;
  }
};

function contains(target: string, lookingFor: string) {
  return target && target.indexOf(lookingFor) >= 0;
}


// Column Definitions: Defines the columns to be displayed.
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

const gridOptions : GridOptions<Artists> | undefined = {
  defaultColDef: {
    editable: false,
    filter:true,
    flex:1
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

  private gridApi!: GridApi<Artists>;
  private artistsCount : number = 0;
  maxPage : number = 0;
   page : number = 0;

  loaded : boolean = false;

  private readonly adminService = inject(AdminServiceService);

  public components: {
    [p: string]: any;
  } = {
    // AdminUserPageButtonsComponent: AdminArtistPageButtonsComponent,
  };

  rowData : Artists[]  = [];

  constructor(private route : Router) {
    this.rowData = [];
    this.adminService.getArtistsCount().subscribe(data => {
        this.artistsCount = data["result"];
        this.maxPage = Math.ceil(this.artistsCount/20);
    });

  }

  ngOnInit() {
    this.getArtists(0);
  }

  async getArtists(page : number)
  {
    console.log('Artist count : ', this.artistsCount);

    let count = 0;

    this.adminService.getArtists(page, 20).subscribe({
      next: data => {
        this.loaded= false;
        this.rowData = data;
        this.loaded = true;
      }, error:err=> {
        this.loaded=false;
        console.log("Failed to load Artist List");
      }});

      console.log(count)

  }


  onReloadClick()
  {
    this.getArtists(this.page);
  }

  onGridReady(params : any) {
    this.gridApi = params.api;
  }


  onBtExport() {
    this.gridApi.exportDataAsCsv();
  }

  protected readonly columnDefs = columnDefs;
  protected readonly gridOptions = gridOptions;

  //
  onPageChange( increment : number) {
    if (this.page + increment < 0) {
      return;
    }

    this.page += increment;

    this.getArtists(this.page);

  }
}
