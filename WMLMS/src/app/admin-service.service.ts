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

  getUsers() : Observable<user[]>
  {
    return this.httpClient.get<user[]>('/admin/user-list');
  }

  getUser() : Number
  {
    this.httpClient.get('/admin/user-list/:id', {params : { id: 1 }});
    return 0;
  }
}

