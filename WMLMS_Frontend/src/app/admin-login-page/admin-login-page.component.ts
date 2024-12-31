// Angular
import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

// Project
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-login-page',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './admin-login-page.component.html',
  styleUrls: ['./admin-login-page.component.css']
})
export class AdminLoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Form Fields
  username = '';
  password = '';
  errorMessage = '';

  // Handle Form Submission
  onSubmit(): void {
    const payload = { username: this.username, password: this.password };

    this.authService.adminLogin(payload).subscribe({
      next: (response) => {

        console.log('Login successful:', response.message);
        localStorage.setItem('token', response.token || '');
        this.router.navigate(['/a']); // Redirect to admin homepage

      },
      error: (err) => {
        console.error('Login failed :', err);
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
