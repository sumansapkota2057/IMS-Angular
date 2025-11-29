import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { Router, RouterModule } from '@angular/router';
import { CreatePost } from './create-post/create-post';
import { MyPosts } from './my-posts/my-posts';
import { ApprovedPost } from './approved-post/approved-post';
import { Auth } from '../../core/services/auth';
import { PostService } from '../../core/services/post';


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

  allPosts: any[] = [];
  approvedPosts: any[] = [];
  loadingPosts = true;
  errorMessage = '';

  constructor(
    private authService: Auth,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
   
  }

  selectView(view: string): void {
    this.selectedView = view;
    if (view === 'home') {
      
    }
  }

  logout(): void {
    this.authService.logout();
  }






}
