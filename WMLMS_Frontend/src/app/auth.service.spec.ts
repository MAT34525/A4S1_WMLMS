import { Component, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);

  username = '';
  password = '';
  errorMessage = '';

  onSubmit() {
    const payload = { username: this.username, password: this.password };

    this.authService.login(payload).subscribe({
      next: response => {
        console.log('Login success:', response.message);
        // Save token in localStorage or redirect
        localStorage.setItem('token', response.token || '');
      },
      error: err => {
        console.error('Login failed:', err);
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
