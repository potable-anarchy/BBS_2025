import React from 'react';
import styled from 'styled-components';
import type { Post as PostType } from '../types/post';
import { formatTimestamp, formatFullTimestamp } from '../utils/dateUtils';

interface PostProps {
  post: PostType;
  depth?: number;
  onReply?: (postId: number) => void;
  onViewThread?: (postId: number) => void;
  showReplyCount?: boolean;
}

const PostContainer = styled.div<{ depth: number }>`
  margin-left: ${props => props.depth * 2}ch;
  margin-bottom: 0.5rem;
  border-left: ${props => props.depth > 0 ? `2px solid ${props.theme.colors.dim}` : 'none'};
  padding-left: ${props => props.depth > 0 ? '1ch' : '0'};
`;

const PostHeader = styled.div`
  display: flex;
  gap: 1ch;
  color: ${props => props.theme.colors.dim};
  font-size: 0.9em;
  margin-bottom: 0.25rem;
`;

const PostUser = styled.span`
  color: ${props => props.theme.colors.cyan};
  font-weight: bold;
`;

const PostId = styled.span`
  color: ${props => props.theme.colors.magenta};
`;

const PostTimestamp = styled.span`
  color: ${props => props.theme.colors.dim};
  cursor: help;
`;

const PostMessage = styled.div`
  color: ${props => props.theme.colors.foreground};
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 0.25rem;
  padding-left: ${props => props.theme.spacing?.small || '0.5ch'};
`;

const PostFooter = styled.div`
  display: flex;
  gap: 2ch;
  font-size: 0.85em;
  color: ${props => props.theme.colors.dim};
  margin-top: 0.25rem;
`;

const PostAction = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.blue};
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  text-decoration: underline;

  &:hover {
    color: ${props => props.theme.colors.cyan};
  }

  &:focus {
    outline: 1px dotted ${props => props.theme.colors.cyan};
  }
`;

const ReplyCount = styled.span`
  color: ${props => props.theme.colors.yellow};
`;

const PostDivider = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.dim};
  opacity: 0.3;
  margin: 0.5rem 0;
`;

export const Post: React.FC<PostProps> = ({
  post,
  depth = 0,
  onReply,
  onViewThread,
  showReplyCount = true
}) => {
  const timestamp = formatTimestamp(post.timestamp);
  const fullTimestamp = formatFullTimestamp(post.timestamp);

  return (
    <>
      <PostContainer depth={depth}>
        <PostHeader>
          <PostId>#{post.id}</PostId>
          <PostUser>{post.user}</PostUser>
          <PostTimestamp title={fullTimestamp}>
            {timestamp}
          </PostTimestamp>
          {post.board_name && (
            <span style={{ color: 'var(--color-green, #00ff00)' }}>
              /{post.board_name}
            </span>
          )}
        </PostHeader>

        <PostMessage>{post.message}</PostMessage>

        <PostFooter>
          {onReply && (
            <PostAction onClick={() => onReply(post.id)}>
              reply
            </PostAction>
          )}

          {showReplyCount && post.reply_count !== undefined && post.reply_count > 0 && (
            <>
              <ReplyCount>
                {post.reply_count} {post.reply_count === 1 ? 'reply' : 'replies'}
              </ReplyCount>
              {onViewThread && (
                <PostAction onClick={() => onViewThread(post.id)}>
                  view thread
                </PostAction>
              )}
            </>
          )}

          {post.parent_post_id && (
            <span style={{ color: 'var(--color-dim, #666)' }}>
              re: #{post.parent_post_id}
            </span>
          )}
        </PostFooter>
      </PostContainer>

      {depth === 0 && <PostDivider />}
    </>
  );
};

export default Post;
