import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  private readonly httpClient = inject(HttpClient);

  constructor() { }

  async getUsers()
  {
    return this.httpClient.get('/admin/user-list');
  }
}
