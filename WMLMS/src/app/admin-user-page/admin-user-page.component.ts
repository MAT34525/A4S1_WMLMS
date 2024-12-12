import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router'
import {AdminServiceService, User} from '../admin-service.service';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community'; // Column Definition Type Interface

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import {AdminUserPageButtonsComponent} from '../admin-user-page-buttons/admin-user-page-buttons.component';

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

  rowData : User[] ;

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: "USER_ID" },
    { field: "USERNAME" },
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
        console.log('GET /admin/user-list', data);
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
