import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

interface LoginRequest {
  username: string,
  password: string,
}

interface SignupRequest {
  username: string,
  email: string,
  password: string,
}

interface AuthResponse {
  message: string,
  status : number,
  token?: string, // Token for login
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  // Login method
  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/u/login', payload);
  }

  // Admin login method
  adminLogin(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/u/admin-login', payload);
  }

  // Signup method
  signup(payload: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/u/register', payload);
  }
}
