import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router'
import {AdminServiceService} from '../admin-service.service';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import {AdminUserPageButtonsComponent} from '../admin-user-page-buttons/admin-user-page-buttons.component';
import {Users} from '../schema';
import {ITextFilterParams} from '@ag-grid-community/core';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-admin-user-page',
  imports: [
    AgGridAngular,
    MatButton,
    NgIf
  ],
  templateUrl: './admin-user-page.component.html',
  standalone: true,
  styleUrl: './admin-user-page.component.css'
})

// Tutorial to add CRUD controls
// https://blog.ag-grid.com/building-crud-in-ag-grid-with-angular-ngrx/

export class AdminUserPageComponent implements OnInit{

  private readonly adminService = inject(AdminServiceService);

  public components: {
    [p: string]: any;
  } = {
    AdminUserPageButtonsComponent: AdminUserPageButtonsComponent,
  };

  rowData : Users[] ;

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: "USER_ID" },
    {
      field: "USERNAME",
      filter: "agTextColumnFilter",
      filterParams: countryFilterParams
    },
    { field: "FULL_NAME" },
    { field: "EMAIL" },
    {
      headerName: "ACTIONS",
      field: "USER_ID",
      cellRenderer: AdminUserPageButtonsComponent,
    },
  ];

  constructor(private route : Router) {
    this.rowData = [];
  }

  ngOnInit() {
    this.getUsers();
    // this.dataSource.paginator = this.paginator;
  }

  getUsers()
  {
    this.adminService.getUsers().subscribe({
      next: data => {
        this.rowData = data;
      }, error:err=> {
        console.log("Failed to load User List");
      }
    });
  }

  onReloadClick()
  {
    this.getUsers();
  }
}

// Filters and searches tutorial : https://www.ag-grid.com/angular-data-grid/filter-text/#text-filter-options

const containsFilterParams: ITextFilterParams = {
  filterOptions: ["contains"],
  textMatcher: ({ value, filterText }) => {
    const literalMatch = contains(value, filterText || "");
    return !!literalMatch;
  }
};

function contains(target: string, lookingFor: string) {
  return target && target.indexOf(lookingFor) >= 0;
}
