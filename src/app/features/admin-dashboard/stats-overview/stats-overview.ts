import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { DashboardStats } from '../../../core/model/api-response.model';
import { Dashboard } from '../../../core/services/dashboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
 selector: 'app-stats-overview',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './stats-overview.html',
  styleUrls: ['./stats-overview.css'],
})
export class StatsOverview implements OnInit {
   stats: DashboardStats | null = null;
  loading = false;

  constructor(
    private dashboardService: Dashboard,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
      next: (response) => {
        this.stats = response.data || null;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load statistics', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  refreshStats(): void {
    this.loadStats();
  }


}
