import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router'
import {AdminServiceService, user} from '../admin-service.service';
import {
  MatColumnDef,
  MatHeaderCell,
  MatTable, MatTableModule
} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-admin-user-page',
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    NgIf
  ],
  templateUrl: './admin-user-page.component.html',
  styleUrl: './admin-user-page.component.css'
})
export class AdminUserPageComponent implements OnInit{

  private readonly adminService = inject(AdminServiceService);

  userList: user[];
  constructor(private route : Router) {
    this.userList = [];
  }

  // Table
  displayedColumns: string[] = ['USER_ID', 'USERNAME', 'EMAIL', 'FULL_NAME', 'COMMANDS'];

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getUsers();
    // this.dataSource.paginator = this.paginator;
  }

  getUsers()
  {
    this.adminService.getUsers().subscribe({
      next: data => {
        this.userList = data;
        console.log('get Http /admin/user-list', data);
      }, error:err=> {
        console.log("Failed to load Lessons, saving to component field");
      }
    });
  }

  onReloadClick()
  {
    this.getUsers();
  }

  onDeleteClick(user_id : Number)
  {
    console.log("Admin user delete triggered for user : ", user_id);
  }

  onViewClick(user_id : Number)
  {
    console.log("Admin user view triggered for user : ", user_id);
    this.route.navigate(['/a/users/view', user_id]); // , user_id]);
  }

  onEditClick(user_id: Number)
  {
    console.log("Admin user edit triggered for user : ", user_id);
  }

}
