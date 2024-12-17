import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Form Fields
  username = '';
  password = '';
  errorMessage = '';

  // Handle Form Submission
  onSubmit(): void {
    const payload = { username: this.username, password: this.password };

    this.authService.login(payload).subscribe({
      next: (response) => {
        if(response['message']) {
          if(response.status === 200) {
            console.log('Login successful:', response.message);
            localStorage.setItem('token', response.token || '');
            this.router.navigate(['/']); // Redirect to homepage or dashboard
            return;
          } else {
            console.log('Login failed :', response.message);
            return;
          }
        } else {
          console.error('Login failed:', response.message);
          this.errorMessage = 'Invalid username or password';
        }

      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
