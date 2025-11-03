import React from 'react';
import styled from 'styled-components';
import { ThreadPost } from '../types/post';
import Post from './Post';

interface ThreadViewProps {
  thread: ThreadPost;
  onReply?: (postId: number) => void;
  maxDepth?: number;
}

const ThreadContainer = styled.div`
  padding: 1rem;
  background: ${props => props.theme.colors?.background || '#000'};
  color: ${props => props.theme.colors?.foreground || '#fff'};
`;

const ThreadTitle = styled.div`
  font-size: 1.2em;
  color: ${props => props.theme.colors?.cyan || '#00ffff'};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${props => props.theme.colors?.cyan || '#00ffff'};
`;

const ReplyList = styled.div<{ depth: number }>`
  margin-left: ${props => props.depth > 0 ? '2ch' : '0'};
`;

const CollapsedReplies = styled.div`
  margin-left: 2ch;
  color: ${props => props.theme.colors?.dim || '#666'};
  font-style: italic;
  padding: 0.5rem;
  border-left: 2px solid ${props => props.theme.colors?.dim || '#666'};
`;

const renderThread = (
  post: ThreadPost,
  depth: number,
  maxDepth: number,
  onReply?: (postId: number) => void
): React.ReactNode => {
  // If we've reached max depth, show a collapsed indicator
  if (depth >= maxDepth && post.replies && post.replies.length > 0) {
    return (
      <div key={post.id}>
        <Post
          post={post}
          depth={depth}
          onReply={onReply}
          showReplyCount={false}
        />
        <CollapsedReplies>
          [{post.replies.length} more {post.replies.length === 1 ? 'reply' : 'replies'} collapsed]
        </CollapsedReplies>
      </div>
    );
  }

  return (
    <div key={post.id}>
      <Post
        post={post}
        depth={depth}
        onReply={onReply}
        showReplyCount={false}
      />

      {post.replies && post.replies.length > 0 && (
        <ReplyList depth={depth}>
          {post.replies.map(reply =>
            renderThread(reply, depth + 1, maxDepth, onReply)
          )}
        </ReplyList>
      )}
    </div>
  );
};

export const ThreadView: React.FC<ThreadViewProps> = ({
  thread,
  onReply,
  maxDepth = 10
}) => {
  const totalReplies = countReplies(thread);

  return (
    <ThreadContainer>
      <ThreadTitle>
        Thread #{thread.id} - {totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}
      </ThreadTitle>

      {renderThread(thread, 0, maxDepth, onReply)}
    </ThreadContainer>
  );
};

// Helper function to count total replies in a thread
function countReplies(post: ThreadPost): number {
  if (!post.replies || post.replies.length === 0) {
    return 0;
  }

  return post.replies.reduce(
    (count, reply) => count + 1 + countReplies(reply),
    0
  );
}

export default ThreadView;
