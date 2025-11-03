import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { terminalTheme } from '../styles/theme';

const BoardListContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  background: ${terminalTheme.background.primary};
  border: ${terminalTheme.border.width} solid ${terminalTheme.border.color};
  border-radius: ${terminalTheme.border.radius};
  box-shadow: ${terminalTheme.effects.boxShadow};
  overflow: hidden;
  font-family: ${terminalTheme.fonts.primary};
`;

const BoardHeader = styled.div`
  background: ${terminalTheme.background.secondary};
  padding: ${terminalTheme.spacing.md};
  border-bottom: ${terminalTheme.border.width} solid ${terminalTheme.border.color};
`;

const BoardTitle = styled.h2`
  color: ${terminalTheme.foreground.primary};
  font-size: ${terminalTheme.fontSize.lg};
  text-shadow: ${terminalTheme.effects.textGlow};
  margin: 0;
  font-family: ${terminalTheme.fonts.primary};

  &::before {
    content: '>>> ';
    color: ${terminalTheme.colors.brightGreen};
  }
`;

const BoardBody = styled.div`
  padding: ${terminalTheme.spacing.md};
`;

const BoardItem = styled.div`
  padding: ${terminalTheme.spacing.md};
  margin-bottom: ${terminalTheme.spacing.sm};
  border: 1px solid ${terminalTheme.border.color};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${terminalTheme.background.secondary};
    border-color: ${terminalTheme.foreground.primary};
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const BoardName = styled.div`
  color: ${terminalTheme.foreground.primary};
  font-size: ${terminalTheme.fontSize.base};
  font-weight: bold;
  text-shadow: ${terminalTheme.effects.textGlow};
  margin-bottom: ${terminalTheme.spacing.xs};

  &::before {
    content: '[';
    color: ${terminalTheme.colors.brightGreen};
  }

  &::after {
    content: ']';
    color: ${terminalTheme.colors.brightGreen};
  }
`;

const BoardDescription = styled.div`
  color: ${terminalTheme.foreground.muted};
  font-size: ${terminalTheme.fontSize.sm};
  line-height: 1.5;
`;

const LoadingMessage = styled.div`
  color: ${terminalTheme.foreground.muted};
  font-size: ${terminalTheme.fontSize.base};
  text-align: center;
  padding: ${terminalTheme.spacing.lg};
`;

const ErrorMessage = styled.div`
  color: ${terminalTheme.colors.red};
  font-size: ${terminalTheme.fontSize.base};
  padding: ${terminalTheme.spacing.md};
  border: 1px solid ${terminalTheme.colors.red};
  border-radius: 4px;
  background: rgba(255, 0, 0, 0.1);

  &::before {
    content: '[ERROR] ';
    font-weight: bold;
  }
`;

const BoardMeta = styled.div`
  color: ${terminalTheme.foreground.muted};
  font-size: ${terminalTheme.fontSize.xs};
  margin-top: ${terminalTheme.spacing.xs};
  font-style: italic;
`;

interface Board {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface BoardListProps {
  onBoardSelect?: (board: Board) => void;
}

export const BoardList: React.FC<BoardListProps> = ({ onBoardSelect }) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/boards');
      const data = await response.json();

      if (data.success) {
        setBoards(data.data);
      } else {
        setError(data.error || 'Failed to fetch boards');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleBoardClick = (board: Board) => {
    if (onBoardSelect) {
      onBoardSelect(board);
    }
  };

  return (
    <BoardListContainer>
      <BoardHeader>
        <BoardTitle>MESSAGE BOARDS</BoardTitle>
      </BoardHeader>

      <BoardBody>
        {loading && <LoadingMessage>Loading boards...</LoadingMessage>}

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {!loading && !error && boards.length === 0 && (
          <LoadingMessage>No boards available</LoadingMessage>
        )}

        {!loading && !error && boards.map((board) => (
          <BoardItem key={board.id} onClick={() => handleBoardClick(board)}>
            <BoardName>{board.name}</BoardName>
            <BoardDescription>{board.description}</BoardDescription>
            <BoardMeta>
              Board #{board.id} | Created: {new Date(board.created_at).toLocaleString()}
            </BoardMeta>
          </BoardItem>
        ))}
      </BoardBody>
    </BoardListContainer>
  );
};

export default BoardList;
