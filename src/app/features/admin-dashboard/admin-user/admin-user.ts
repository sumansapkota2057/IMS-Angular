import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';


import { Observable } from 'rxjs';
import { User } from '../../../core/model/user.model';
import { UserService } from '../../../core/services/users';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatTableModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'username', 'email', 'roles', 'status'];
  loading = false;

  constructor(private userService: UserService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to fetch users', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getRoles(user: User): string {
    return user.roles ? user.roles.map(r => r.roleName).join(', ') : '';
  }

  getStatus(user: User): string {
    return user.active ? 'Active' : 'Inactive';
  }
}
