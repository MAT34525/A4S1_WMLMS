import {Component, inject} from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import {MatButton} from '@angular/material/button';
import {AgGridAngular} from 'ag-grid-angular';
import {NgIf, NgStyle} from '@angular/common';
import type {ColDef} from 'ag-grid-community';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminServiceService} from '../admin-service.service';

@Component({
  selector: 'app-admin-queries-page',
  imports: [
    AngularSplitModule,
    MatButton,
    AgGridAngular,
    NgIf,
    NgStyle
  ],
  templateUrl: './admin-queries-page.component.html',
  standalone: true,
  styleUrl: './admin-queries-page.component.css'
})
export class AdminQueriesPageComponent {

  loaded : boolean = true;
  rowData : [] = [];
  colDefs  : ColDef[] = []

  response:any

  adminService=inject(AdminServiceService);

  constructor(private activeRoute : ActivatedRoute, private route : Router) {
  }

  onRunCutomQuery() {
    this.adminService.customQuery("SELECT * FROM USERS WHERE IS_ARTIST='N'").subscribe(ret => this.updateTable(ret));
  }

  updateTable(data: any) {
    let { message } = data;

    if(message !== undefined)
    {
      console.log("Invalid query !")
      return;
    }

    this.colDefs = data[1];
    this.rowData = data[0];

    console.log("RESPONSE :", data)
  }


}
