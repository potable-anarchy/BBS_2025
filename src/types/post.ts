/**
 * Type definitions for posts and threads
 */

export interface Board {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  board_id: number;
  user: string;
  message: string;
  timestamp: string;
  parent_post_id: number | null;
  reply_count?: number;
  board_name?: string;
  is_bulletin?: number | boolean;
  is_pinned?: number | boolean;
  priority?: number;
  bulletin_type?: "daily" | "announcement" | "lore" | "system" | null;
}

export interface ThreadPost extends Post {
  replies: ThreadPost[];
}

export interface PostWithReplies extends Post {
  replies?: Post[];
}

export interface CreatePostRequest {
  board: string | number;
  user: string;
  message: string;
  parent_post_id?: number | null;
  is_bulletin?: boolean;
  is_pinned?: boolean;
  priority?: number;
  bulletin_type?: "daily" | "announcement" | "lore" | "system" | null;
}

export interface PostListResponse {
  success: boolean;
  data: Post[];
  count: number;
  board: string;
  board_id: number;
}

export interface PostResponse {
  success: boolean;
  data: Post;
  message?: string;
}

export interface ThreadResponse {
  success: boolean;
  data: Post[];
  count: number;
  root_post_id: number;
}

export interface ThreadHierarchyResponse {
  success: boolean;
  data: ThreadPost;
  root_post_id: number;
}

export interface BoardListResponse {
  success: boolean;
  data: Board[];
  count: number;
}

export interface BoardResponse {
  success: boolean;
  data: Board;
}

export interface SearchResponse {
  success: boolean;
  data: Post[];
  count: number;
  query: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export interface BulletinResponse {
  success: boolean;
  data: Post[];
  count: number;
}

export interface CreateBulletinRequest {
  message: string;
  bulletin_type: "daily" | "announcement" | "lore" | "system";
  priority?: number;
  is_pinned?: boolean;
}
