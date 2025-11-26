import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../shared/material.module';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
   selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
          
       
          const username = this.loginForm.value.username;
          if (username === 'admin') {
            this.authService.setUserRoles(['ROLE_ADMIN']);
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.authService.setUserRoles(['ROLE_USER']);
            this.router.navigate(['/user-dashboard']);
          }
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Login failed. Please check your credentials.', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

}
