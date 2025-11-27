import { User } from "./user.model";


export interface Post {
  id?: number;
  title: string;
  description: string;
  type: string;
  status: PostStatus;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
  adminNotes?: string;
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RESOLVED = 'RESOLVED'
}

export interface PostCreateRequest {
  title: string;
  description: string;
  type: string;
}

export interface PostUpdateRequest {
  title?: string;
  description?: string;
  status?: PostStatus;
  adminNotes?: string;
}


