import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { Router, RouterModule } from '@angular/router';
import { CreatePost } from './create-post/create-post';
import { MyPosts } from './my-posts/my-posts';

import { ApprovedPost } from './approved-post/approved-post';

import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MaterialModule, 
    RouterModule,
    CreatePost,
    MyPosts,
    ApprovedPost
  ],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})


export class UserDashboard implements OnInit {
  currentUser: string | null = '';
  selectedView: string = 'home';
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
