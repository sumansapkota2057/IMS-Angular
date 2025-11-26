import { Post } from "./post.model";
import { User } from "./user.model";

export interface Comment {
  id?: number;
  content: string;
  post?: Post;
  user?: User;
  createdAt?: string;
}

export interface CommentCreateRequest {
  content: string;
  postId: number;
}
