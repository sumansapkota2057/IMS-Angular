import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../shared/material.module';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
   selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, RouterModule],
    templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']

})
export class Register {
   registerForm: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      roles: this.fb.array(['USER']) // Default role
      
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      const { confirmPassword, ...registerData } = this.registerForm.value;
      const request = {
        ...registerData,
        roles: ['ROLE_USER']
      };

      this.authService.register(request).subscribe({
        next: (response) => {
          this.snackBar.open('Registration successful! Please login.', 'Close', { duration: 3000 });
          this.router.navigate(['/login']);
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Registration failed. Please try again.', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

}
