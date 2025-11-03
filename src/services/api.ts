/**
 * API service for interacting with the vibe-kanban backend
 */

import {
  Board,
  Post,
  ThreadPost,
  CreatePostRequest,
  PostListResponse,
  PostResponse,
  ThreadResponse,
  ThreadHierarchyResponse,
  BoardListResponse,
  BoardResponse,
  SearchResponse,
  ErrorResponse
} from '../types/post';

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return data as T;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // ============================================
  // BOARD METHODS
  // ============================================

  /**
   * Get all boards
   */
  async getBoards(): Promise<Board[]> {
    const response = await this.fetch<BoardListResponse>('/boards');
    return response.data;
  }

  /**
   * Get a specific board by ID
   */
  async getBoard(boardId: number): Promise<Board> {
    const response = await this.fetch<BoardResponse>(`/boards/${boardId}`);
    return response.data;
  }

  /**
   * Create a new board
   */
  async createBoard(name: string, description?: string): Promise<Board> {
    const response = await this.fetch<BoardResponse>('/boards', {
      method: 'POST',
      body: JSON.stringify({ name, description })
    });
    return response.data;
  }

  // ============================================
  // POST METHODS
  // ============================================

  /**
   * Get posts for a board
   */
  async getPosts(
    board: string | number,
    options?: {
      limit?: number;
      offset?: number;
      includeReplies?: boolean;
    }
  ): Promise<PostListResponse> {
    const params = new URLSearchParams({
      board: String(board),
      limit: String(options?.limit || 100),
      offset: String(options?.offset || 0),
      includeReplies: String(options?.includeReplies || false)
    });

    return this.fetch<PostListResponse>(`/posts?${params}`);
  }

  /**
   * Get a specific post by ID
   */
  async getPost(postId: number): Promise<Post> {
    const response = await this.fetch<PostResponse>(`/posts/${postId}`);
    return response.data;
  }

  /**
   * Create a new post or reply
   */
  async createPost(request: CreatePostRequest): Promise<Post> {
    const response = await this.fetch<PostResponse>('/posts', {
      method: 'POST',
      body: JSON.stringify(request)
    });
    return response.data;
  }

  /**
   * Delete a post and all its replies
   */
  async deletePost(postId: number): Promise<void> {
    await this.fetch(`/posts/${postId}`, {
      method: 'DELETE'
    });
  }

  // ============================================
  // THREAD METHODS
  // ============================================

  /**
   * Get direct replies to a post
   */
  async getReplies(postId: number, limit: number = 100): Promise<Post[]> {
    const response = await this.fetch<PostListResponse>(
      `/posts/${postId}/replies?limit=${limit}`
    );
    return response.data;
  }

  /**
   * Get full thread as flat array
   */
  async getThread(postId: number): Promise<Post[]> {
    const response = await this.fetch<ThreadResponse>(
      `/posts/${postId}/thread`
    );
    return response.data;
  }

  /**
   * Get full thread as nested hierarchy
   */
  async getThreadHierarchy(postId: number): Promise<ThreadPost> {
    const response = await this.fetch<ThreadHierarchyResponse>(
      `/posts/${postId}/thread/hierarchy`
    );
    return response.data;
  }

  // ============================================
  // USER METHODS
  // ============================================

  /**
   * Get all posts by a specific user
   */
  async getUserPosts(username: string, limit: number = 100): Promise<Post[]> {
    const response = await this.fetch<PostListResponse>(
      `/users/${encodeURIComponent(username)}/posts?limit=${limit}`
    );
    return response.data;
  }

  // ============================================
  // SEARCH METHODS
  // ============================================

  /**
   * Search posts by message content
   */
  async searchPosts(
    query: string,
    options?: {
      board?: number;
      limit?: number;
    }
  ): Promise<SearchResponse> {
    const params = new URLSearchParams({
      q: query,
      limit: String(options?.limit || 50)
    });

    if (options?.board) {
      params.append('board', String(options.board));
    }

    return this.fetch<SearchResponse>(`/search?${params}`);
  }
}

// Export singleton instance
export const api = new ApiService();

export default api;
