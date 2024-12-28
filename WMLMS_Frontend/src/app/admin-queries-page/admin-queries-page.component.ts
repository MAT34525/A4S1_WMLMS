// Angular
import {Component, inject} from '@angular/core';
import {AngularSplitModule} from 'angular-split';
import {MatButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

// AG Grid
import {AgGridAngular} from 'ag-grid-angular';
import type {ColDef} from 'ag-grid-community';

// Project
import {AdminService} from '../admin-service.service';

@Component({
  selector: 'app-admin-queries-page',
  imports: [
    AngularSplitModule,
    MatButton,
    AgGridAngular,
    NgIf,
    FormsModule,
    NgForOf,
  ],
  templateUrl: './admin-queries-page.component.html',
  standalone: true,
  styleUrl: './admin-queries-page.component.css'
})
export class AdminQueriesPageComponent {

  adminService=inject(AdminService);

  // Ag Grid
  rowData : [] = [];
  colDefs  : ColDef[] = [];
  loaded : boolean = true;

  // Queries
  query: string = '';

  isError : boolean = false;
  errorMessage : string = '';

  protected customQueries : { name: string, query: string }[] = [
    {
      name: "SELECT ALL USERS",
      query: "SELECT * FROM USERS",
    },
    {
      name: "SELECT ALL ARTISTS",
      query: "SELECT * FROM ARTISTS",
    },
    {
      name: "INSERT TEMPLATE",
      query: "INSERT INTO TABLE_NAME (COL_1, COL_2) VALUES (VAL_1, VAL_2)"
    }
  ]

  // Modify the selected query
  onUpdateQuery(query: string){
    this.query = query;
  }

  // Run and get the results of custom queries
  onRunCustomQuery() {

    let query = this.query

    // Check if the query is non-null and not too short
    if(query === null || query.length < 5)
    {
      return;
    }

    // Update table data with query result
    this.adminService.customQuery(query).subscribe(ret => this.updateTable(ret));
  }

  // Update the ag-grid when the result has been received
  updateTable(data: {message : string, code : number} | any) {

    let { message } = data;

    // Check if the response is valid
    this.isError = (message !== undefined);

    if(this.isError)
    {
      // Clear table
      this.colDefs = [];
      this.rowData = [];

      this.errorMessage = message.original.code;

      return;
    }

    // Update ag-grid content
    this.colDefs = data[1];
    this.rowData = data[0];
  }
}
