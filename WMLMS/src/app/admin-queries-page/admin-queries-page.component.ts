import {Component, inject} from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import {MatButton} from '@angular/material/button';
import {AgGridAngular} from 'ag-grid-angular';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import type {ColDef} from 'ag-grid-community';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminServiceService} from '../admin-service.service';
import {FormsModule} from '@angular/forms';
import {PointOptionsObject} from 'highcharts';

@Component({
  selector: 'app-admin-queries-page',
  imports: [
    AngularSplitModule,
    MatButton,
    AgGridAngular,
    NgIf,
    NgStyle,
    NgForOf,
    FormsModule
  ],
  templateUrl: './admin-queries-page.component.html',
  standalone: true,
  styleUrl: './admin-queries-page.component.css'
})
export class AdminQueriesPageComponent {

  loaded : boolean = true;
  query: string = '';
  rowData : [] = [];
  colDefs  : ColDef[] = [];

  isError : boolean = false;
  errorMessage : string = '';

  customQueries : { name: string, query: string }[] = [
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
      query: "INSERT INTO <TABLE> (<col1>, <col2>) VALUES (<val1>, <val2>)"
    }
  ]

  adminService=inject(AdminServiceService);

  constructor(private activeRoute : ActivatedRoute, private route : Router) {
  }

  onUpdateQuery(query: string){
    this.query = query;
  }

  // Run and get the results of custom queries
  onRunCustomQuery() {

    let query = this.query

    // Check if the query is non null and not too short
    if(query === null || query.length < 5)
    {
      return;
    }

    this.adminService.customQuery(query).subscribe(ret => this.updateTable(ret));
  }

  // Update the ag-grid when the result has been received
  updateTable(data: any) {

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
