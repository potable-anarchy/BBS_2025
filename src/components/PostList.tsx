import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Post as PostType } from '../types/post';
import Post from './Post';

interface PostListProps {
  boardName: string;
  apiUrl?: string;
  onReply?: (postId: number) => void;
  onViewThread?: (postId: number) => void;
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const ListContainer = styled.div`
  padding: 1rem;
  background: ${props => props.theme.colors?.background || '#000'};
  color: ${props => props.theme.colors?.foreground || '#fff'};
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${props => props.theme.colors?.cyan || '#00ffff'};
`;

const BoardTitle = styled.h2`
  font-size: 1.5em;
  color: ${props => props.theme.colors?.cyan || '#00ffff'};
  margin: 0;
`;

const PostCount = styled.span`
  color: ${props => props.theme.colors?.dim || '#666'};
  font-size: 0.9em;
`;

const LoadingMessage = styled.div`
  color: ${props => props.theme.colors?.yellow || '#ffff00'};
  text-align: center;
  padding: 2rem;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors?.red || '#ff0000'};
  text-align: center;
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors?.red || '#ff0000'};
  background: rgba(255, 0, 0, 0.1);
`;

const EmptyMessage = styled.div`
  color: ${props => props.theme.colors?.dim || '#666'};
  text-align: center;
  padding: 2rem;
  font-style: italic;
`;

const RefreshButton = styled.button`
  background: none;
  border: 1px solid ${props => props.theme.colors?.cyan || '#00ffff'};
  color: ${props => props.theme.colors?.cyan || '#00ffff'};
  padding: 0.25rem 1rem;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    background: ${props => props.theme.colors?.cyan || '#00ffff'};
    color: ${props => props.theme.colors?.background || '#000'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PostList: React.FC<PostListProps> = ({
  boardName,
  apiUrl = 'http://localhost:3001/api',
  onReply,
  onViewThread,
  limit = 100,
  autoRefresh = false,
  refreshInterval = 30000
}) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boardId, setBoardId] = useState<number | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${apiUrl}/posts?board=${encodeURIComponent(boardName)}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch posts');
      }

      setPosts(data.data || []);
      setBoardId(data.board_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchPosts, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [boardName, limit, autoRefresh, refreshInterval]);

  if (loading && posts.length === 0) {
    return (
      <ListContainer>
        <LoadingMessage>Loading posts from /{boardName}...</LoadingMessage>
      </ListContainer>
    );
  }

  if (error) {
    return (
      <ListContainer>
        <ErrorMessage>
          <div>Error loading posts: {error}</div>
          <RefreshButton onClick={fetchPosts} style={{ marginTop: '1rem' }}>
            Retry
          </RefreshButton>
        </ErrorMessage>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <ListHeader>
        <BoardTitle>/{boardName}</BoardTitle>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <PostCount>
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </PostCount>
          <RefreshButton onClick={fetchPosts} disabled={loading}>
            {loading ? 'refreshing...' : 'refresh'}
          </RefreshButton>
        </div>
      </ListHeader>

      {posts.length === 0 ? (
        <EmptyMessage>
          No posts yet. Be the first to post on /{boardName}!
        </EmptyMessage>
      ) : (
        posts.map(post => (
          <Post
            key={post.id}
            post={post}
            onReply={onReply}
            onViewThread={onViewThread}
            showReplyCount={true}
          />
        ))
      )}
    </ListContainer>
  );
};

export default PostList;
