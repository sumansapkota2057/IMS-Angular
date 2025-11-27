import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { Router, RouterModule } from '@angular/router';
import { StatsOverview } from './stats-overview/stats-overview';
import { ManagePosts } from './manage-posts/manage-posts';
import { Auth } from '../../core/services/auth';

@Component({
   selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MaterialModule, 
    RouterModule,
    StatsOverview,
    ManagePosts
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit {
currentUser: string | null = '';
  selectedView: string = 'dashboard';
  sidenavOpened = true;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  selectView(view: string): void {
    this.selectedView = view;
  }

  logout(): void {
    this.authService.logout();
  }
}
