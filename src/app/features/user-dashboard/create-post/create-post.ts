import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../shared/material.module';
import { PostService } from '../../../core/services/post';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './create-post.html',
    styleUrls: ['./create-post.css']
})
export class CreatePost {
   postForm: FormGroup;
  loading = false;
  postTypes = ['ISSUE', 'COMPLAINT', 'ANNOUNCEMENT', 'LOST_FOUND', 'HELP_REQUEST'];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private snackBar: MatSnackBar
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      type: ['ISSUE', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      this.loading = true;
      this.postService.createPost(this.postForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Post created successfully!', 'Close', { duration: 3000 });
          this.postForm.reset({ type: 'ISSUE' });
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Failed to create post. Please try again.', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.postForm.reset({ type: 'ISSUE' });
  }

}
