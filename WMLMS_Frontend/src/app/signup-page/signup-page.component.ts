import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Form fields
  username: string = '';
  email: string = '';
  password: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  // Handle form submission
  onSubmit(): void {
    const payload = {username: this.username, email: this.email, password: this.password};

    this.authService.signup(payload).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        this.successMessage = 'Signup successful. You can now log in!';
        // Redirect to login page after success
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.error('Signup failed:', err);
        if (err.status === 409) {
          this.errorMessage = 'Username already exists. Please choose another.';
        } else {
          this.errorMessage = 'Signup failed. Please try again.';
        }
      }
    });
  }
}
