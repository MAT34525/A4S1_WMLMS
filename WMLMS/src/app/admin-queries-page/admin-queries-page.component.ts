import { Component } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import {MatButton} from '@angular/material/button';
import {AgGridAngular} from 'ag-grid-angular';
import {NgIf} from '@angular/common';
import type {ColDef} from 'ag-grid-community';

@Component({
  selector: 'app-admin-queries-page',
  imports: [
    AngularSplitModule,
    MatButton,
    AgGridAngular,
    NgIf
  ],
  templateUrl: './admin-queries-page.component.html',
  standalone: true,
  styleUrl: './admin-queries-page.component.css'
})
export class AdminQueriesPageComponent {

  loaded : boolean = true;
  rowData : [] = [];
  colDefs  : ColDef[] = []

}
