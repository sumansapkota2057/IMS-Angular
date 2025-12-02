import { Component, OnInit } from '@angular/core';
import { Post, PostStatus } from '../../../core/model/post.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/material.module';
import { PostService } from '../../../core/services/post';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';


interface StatusAction {
  status: PostStatus;
  label: string;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-manage-posts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './manage-posts.html',
  styleUrls: ['./manage-posts.css'],
})
export class ManagePosts implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  loading = false;
  selectedPost: Post | null = null;
  notesForm: FormGroup;
  filterStatus: string = 'ALL';
  PostStatus = PostStatus;

  statusActions: StatusAction[] = [
    { status: PostStatus.APPROVED, label: 'Approve', color: 'primary', icon: 'check_circle' },
    { status: PostStatus.REJECTED, label: 'Reject', color: 'warn', icon: 'cancel' },
    { status: PostStatus.RESOLVED, label: 'Resolve', color: 'accent', icon: 'task_alt' }
  ];

  statusFilters = [
    { value: 'ALL', label: 'All Posts', count: 0 },
    { value: 'PENDING', label: 'Pending Approval', count: 0 },
    { value: 'APPROVED', label: 'Approved', count: 0 },
    { value: 'REJECTED', label: 'Rejected', count: 0 },
    { value: 'RESOLVED', label: 'Resolved', count: 0 }
  ];

  constructor(
    private postService: PostService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder,
   
  ) {
    this.notesForm = this.fb.group({
      notes: ['']
    });
  

  }

  ngOnInit(): void {
    this.loadAllPosts();
  }

  loadAllPosts(): void {
    this.loading = true;
    this.postService.getAllPosts().subscribe({
      next: (response) => {
        this.posts = response.data || [];
        this.updateStatusCounts();
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load posts', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  updateStatusCounts(): void {
    const postsWithoutDraft = this.posts.filter(p => p.status !== PostStatus.DRAFT);
    this.statusFilters[0].count = postsWithoutDraft.length;
    this.statusFilters[1].count = postsWithoutDraft.filter(p => p.status === PostStatus.PENDING).length;
    this.statusFilters[2].count = postsWithoutDraft.filter(p => p.status === PostStatus.APPROVED).length;
    this.statusFilters[3].count = postsWithoutDraft.filter(p => p.status === PostStatus.REJECTED).length;
    this.statusFilters[4].count = postsWithoutDraft.filter(p => p.status === PostStatus.RESOLVED).length;
  }

  

 applyFilter(): void {
  const postsWithoutDraft = this.posts.filter(p => p.status !== PostStatus.DRAFT);

  if (this.filterStatus === 'ALL') {
    this.filteredPosts = [...postsWithoutDraft];
  } else {
    this.filteredPosts = postsWithoutDraft.filter(
      post => post.status === this.filterStatus
    );
  }
  if (this.filterStatus === PostStatus.APPROVED) {
    this.filteredPosts.sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }
  else {
    this.filteredPosts.sort(
      (a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
    );
  }
}

  

  onFilterChange(status: string): void {
    this.filterStatus = status;
    this.applyFilter();
  }

  viewPost(post: Post): void {
    this.selectedPost = post;
    this.notesForm.patchValue({ notes: post.adminNotes || '' });
  }

  closePostView(): void {
    this.selectedPost = null;
    this.notesForm.reset();
  }

  changeStatus(post: Post, newStatus: PostStatus): void {
    const statusLabels: { [key: string]: string } = {
      'APPROVED': 'approve',
      'REJECTED': 'reject',
      'RESOLVED': 'resolve'
    };

    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: `${statusLabels[newStatus]} Post`,
        message: `Are you sure you want to ${statusLabels[newStatus]} this post?`,
        confirmText: statusLabels[newStatus].charAt(0).toUpperCase() + statusLabels[newStatus].slice(1),
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && post.id) {
        const notes = this.notesForm.value.notes;
        let apiCall;

        switch (newStatus) {
          case PostStatus.APPROVED:
            apiCall = this.postService.approvePost(post.id, notes);
            break;
          case PostStatus.REJECTED:
            apiCall = this.postService.rejectPost(post.id, notes);
            break;
          case PostStatus.RESOLVED:
            apiCall = this.postService.resolvePost(post.id, notes);
            break;
          default:
            return;
        }

        apiCall.subscribe({
          next: () => {
            this.snackBar.open(`Post ${statusLabels[newStatus]}d successfully`, 'Close', { duration: 3000 });
            this.closePostView();
            this.loadAllPosts();
          },
          error: () => {
            this.snackBar.open(`Failed to ${statusLabels[newStatus]} post`, 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  getAvailableActions(post: Post): StatusAction[] {
    if (post.status === PostStatus.PENDING) {
      return this.statusActions.filter(a => a.status === PostStatus.APPROVED || a.status === PostStatus.REJECTED);
    } else if (post.status === PostStatus.APPROVED) {
      return this.statusActions.filter(a => a.status === PostStatus.RESOLVED);
    }
    return [];
  }

  getStatusColor(status: PostStatus): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'primary',
      'APPROVED': 'primary',
      'REJECTED': 'warn',
      'RESOLVED': 'primary'
    };
    return colors[status] || 'primary';
  }

  getStatusIcon(status: PostStatus): string {
    const icons: { [key: string]: string } = {
      'PENDING': 'pending',
      'APPROVED': 'check_circle',
      'REJECTED': 'cancel',
      'RESOLVED': 'task_alt'
    };
    return icons[status] || 'info';
  }
}
