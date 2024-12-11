import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

// User Table **KEEP THE COLUMNS IN UPPERCASE**
export interface User {
  USER_ID : number,
  USERNAME : string,
  PASSWORD : string,
  EMAIL: string,
  FULL_NAME : string
}


@Injectable({
  providedIn: 'root'
})

export class AdminServiceService {


  httpClient = inject(HttpClient);

  constructor() {}

  // Get request for the user list
  getUsers() : Observable<User[]>
  {
    console.log("Admin Service Get : User List");
    return this.httpClient.get<User[]>('/admin/user-list');
  }

  // Get request for a specific user using IDs
  getUser(user_id : number) : Observable<User>
  {
    console.log("Admin Service Get : User By ID");
    return this.httpClient.get<User>(`/admin/user/${user_id}`);
  }
}

