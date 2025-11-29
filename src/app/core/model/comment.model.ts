import { Post } from "./post.model";
import { User } from "./user.model";

export interface Comment {
  id?: number;
  content: string;
  post?: Post;
  username: string
  createdAt?: string;
}

export interface CommentCreateRequest {
  content: string;
  postId: number;
}
