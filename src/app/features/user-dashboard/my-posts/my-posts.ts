  import { CommonModule } from '@angular/common';
  import { Component } from '@angular/core';
  import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { MaterialModule } from '../../../shared/material.module';
  import { Post, PostStatus } from '../../../core/model/post.model';
  import { PostService } from '../../../core/services/post';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { MatDialog } from '@angular/material/dialog';
  import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

  @Component({
    selector: 'app-my-posts',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MaterialModule],
    templateUrl: './my-posts.html',
    styleUrls: ['./my-posts.css']
  })
  export class MyPosts {

    posts: Post[] = [];
    loading = false;
    editingPost: Post | null = null;
    updateForm: FormGroup;
    PostStatus = PostStatus;

    constructor(
      private postService: PostService,
      private snackBar: MatSnackBar,
      private dialog: MatDialog,
      private fb: FormBuilder
    ) {
      this.updateForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(5)]],
        description: ['', [Validators.required, Validators.minLength(10)]]
      });
    }

    ngOnInit(): void {
      this.loadMyPosts();
    }

    loadMyPosts(): void {
      this.loading = true;
      this.postService.getMyPosts().subscribe({
        next: (response) => {
          this.posts = response.data || [];
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Failed to load posts', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }

 submitForApproval(post: Post) {
  console.log("CLICKED", post);

  const dialogRef = this.dialog.open(ConfirmDialog, {
    data: {
      title: 'Submit Post',
      message: 'Are you sure you want to submit this post for approval?'
    }
  });


  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.postService.submitForApproval(post.id!).subscribe({
        next: (res) => {
          this.snackBar.open('Post submitted for approval!', 'Close', {
            duration: 3000
          });
          this.loadMyPosts(); 
        },
        error: (err) => {
          this.snackBar.open('Submission failed!', 'Close', {
            duration: 3000
          });
          console.error(err);
        }
      });
    }
  });
}

    startEdit(post: Post): void {
      this.editingPost = post;
      this.updateForm.patchValue({
        title: post.title,
        description: post.description
      });
    }

    cancelEdit(): void {
      this.editingPost = null;
      this.updateForm.reset();
    }

    saveEdit(): void {
      if (this.updateForm.valid && this.editingPost?.id) {
        this.postService.updatePost(this.editingPost.id, this.updateForm.value).subscribe({
          next: (response) => {
            this.snackBar.open('Post updated successfully', 'Close', { duration: 3000 });
            this.editingPost = null;
            this.updateForm.reset();
            this.loadMyPosts();
          },
          error: (error) => {
            this.snackBar.open('Failed to update post', 'Close', { duration: 3000 });
          }
        });
      }
    }

    getStatusColor(status: PostStatus): string {
      const colors: { [key: string]: string } = {
        'DRAFT': 'accent',
        'PENDING': 'primary',
        'APPROVED': 'primary',
        'REJECTED': 'warn',
        'RESOLVED': 'primary'
      };
      return colors[status] || 'primary';
    }

    getStatusIcon(status: PostStatus): string {
      const icons: { [key: string]: string } = {
        'DRAFT': 'edit',
        'PENDING': 'pending',
        'APPROVED': 'check_circle',
        'REJECTED': 'cancel',
        'RESOLVED': 'task_alt'
      };
      return icons[status] || 'info';
    }

  }
