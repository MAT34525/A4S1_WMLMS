import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface user {
  user_id : Number,
  username : String,
  password : String,
  email : String,
  full_name : String
}


@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  httpClient = inject(HttpClient);

  constructor() {}

  // Get request for the user list
  getUsers() : Observable<user[]>
  {
    console.log("Admin Service Get : User List");
    return this.httpClient.get<user[]>('/admin/user-list');
  }

  // Get request for a specific user
  getUser(user_id : number) : Observable<user>
  {
    console.log("Admin Service Get : User By ID");
    return this.httpClient.get<user>(`/admin/user/${user_id}`);
  }
}

