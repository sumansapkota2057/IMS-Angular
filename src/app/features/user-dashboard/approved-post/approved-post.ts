import { Component, OnInit } from '@angular/core';
import { Post } from '../../../core/model/post.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../core/services/post';
import { Comment } from '../../../core/model/comment.model';

import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { CommentService } from '../../../core/services/comment.service';

@Component({
   selector: 'app-approved-posts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './approved-post.html',    
  styleUrls: ['./approved-post.css']
})
export class ApprovedPost  implements OnInit {
    posts: Post[] = [];
  loading = false;
  selectedPost: Post | null = null;
  comments: Comment[] = [];
  commentForm: FormGroup;
  loadingComments = false;

  currentUser: string = '';

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadApprovedPosts();
     this.currentUser = sessionStorage.getItem('username') || ''; this.currentUser = sessionStorage.getItem('username') || '';
  }
  

  loadApprovedPosts(): void {
    this.loading = true;
    this.postService.getApprovedPosts().subscribe({
      next: (response) =>{
      this.posts = (response.data || []).sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      this.loading = false;
    },
      error: (error) => {
        this.snackBar.open('Failed to load posts', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  viewPost(post: Post): void {
    this.selectedPost = post;
    this.loadComments(post.id!);
  }

  closePostView(): void {
    this.selectedPost = null;
    this.comments = [];
    this.commentForm.reset();
  }

  loadComments(postId: number): void {
    this.loadingComments = true;
    this.commentService.getCommentsByPost(postId).subscribe({
      next: (response) => {
        this.comments = response.data || [];
        this.loadingComments = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load comments', 'Close', { duration: 3000 });
        this.loadingComments = false;
      }
    });
  }

  addComment(): void {
    if (this.commentForm.valid && this.selectedPost?.id) {
      const request = {
        content: this.commentForm.value.content,
        postId: this.selectedPost.id
      };

      this.commentService.addComment(request).subscribe({
        next: (response) => {
          this.snackBar.open('Comment added successfully', 'Close', { duration: 3000 });
          this.commentForm.reset();
          this.loadComments(this.selectedPost!.id!);
        },
        error: (error) => {
          this.snackBar.open('Failed to add comment', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteComment(commentId: number) {
  if (!confirm('Are you sure you want to delete this comment?')) return;

  this.commentService.deleteComment(commentId).subscribe({
    next: () => {
      
      this.comments = this.comments.filter(c => c.id !== commentId);
      this.snackBar.open('Comment deleted', 'Close', { duration: 2000 });
    },
    error: (err) => {
      console.error(err);
      this.snackBar.open('Failed to delete comment', 'Close', { duration: 2000 });
    }
  });
}

}
