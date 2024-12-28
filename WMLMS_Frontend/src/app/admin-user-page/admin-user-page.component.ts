// Angular
import {Component, inject, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

// AG Grid
import {AgGridAngular} from 'ag-grid-angular';
import {ITextFilterParams} from '@ag-grid-community/core';
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
import {AdminService} from '../admin-service.service';
import {AdminUserPageButtonsComponent} from '../admin-user-page-buttons/admin-user-page-buttons.component';
import {Users} from '../schema';

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

// Filters and searches tutorial : https://www.ag-grid.com/angular-data-grid/filter-text/#text-filter-options

// Filter for the user locked flag
const lockFilterParams: ITextFilterParams = {
  filterOptions: ["equals"],
  maxNumConditions: 1,
  textMatcher: ({ value, filterText }) => {
    const literalMatch = contains(value, filterText || "");
    return !!literalMatch;
  }
};

// Filter for the username lookup
const userFilterParams: ITextFilterParams = {
  filterOptions: ["contains"],
  maxNumConditions: 1,
  textMatcher: ({ value, filterText }) => {
    const literalMatch = contains(value, filterText || "");
    return !!literalMatch;
  }
};

// Function used byt the filters to mach values
function contains(target: string, lookingFor: string) {
  return target && target.indexOf(lookingFor) >= 0;
}

// Set up the columns displayed
const columnDefs: (ColDef<Users, any>)[] = [
  { field: "USER_ID" },
  {
    field: "USERNAME",
    filter: "agTextColumnFilter",
    filterParams: userFilterParams
  },
  { field: "FULL_NAME" },
  { field: "EMAIL" },
  {
    headerName: "ACTIONS",
    field: "IS_LOCKED",
    filter: "agTextColumnFilter",
    filterParams: lockFilterParams,
    width: 300,
    cellRenderer: AdminUserPageButtonsComponent,
    cellRendererParams: {
      USER_ID: "USER_ID",
      IS_LOCKED: "IS_LOCKED"
    },
  },
];

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
  selector: 'app-admin-user-page',
  imports: [
    AgGridAngular,
    MatButton,
    MatIconModule,
    NgIf
  ],
  templateUrl: './admin-user-page.component.html',
  standalone: true,
  styleUrl: './admin-user-page.component.css'
})

// Tutorial to add CRUD controls
// https://blog.ag-grid.com/building-crud-in-ag-grid-with-angular-ngrx/

export class AdminUserPageComponent implements OnInit{

  private readonly adminService : AdminService = inject(AdminService);

  // AG Grid
  private gridApi!: GridApi<Users>;
  protected readonly columnDefs = columnDefs;
  protected readonly gridOptions = gridOptions;
  public components: {[p: string]: any;} = {
    AdminUserPageButtonsComponent: AdminUserPageButtonsComponent,
  };

  rowData : Users[] = [];
  loaded : boolean = false;

  // Load users at init
  ngOnInit() {
    this.getUsers();
  }

  // Load all users
  getUsers()
  {
    this.adminService.getUsers().subscribe({
      next: data => {
        this.loaded = false;
        this.rowData = data;
        this.loaded = true;
      }, error:err=> {
        this.loaded=false;
        console.log("Failed to load User List :", err);
      }
    });
  }

  // Reload user list
  onReloadClick()
  {
    this.getUsers();
  }

  // Load grid
  onGridReady(params : any) {
    this.gridApi = params.api;
  }

  // Export grid
  onBtExport() {
    this.gridApi.exportDataAsCsv();
  }
}
