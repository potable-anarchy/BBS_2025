/**
 * Header component with welcome message and connection status
 */

import styled from 'styled-components';
import { theme } from '../styles/theme';
import { ConnectionStatus } from '../context/AuthContext';

interface HeaderProps {
  handle: string;
  connectionStatus: ConnectionStatus;
  onLogout: () => void;
}

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: rgba(0, 0, 0, 0.9);
  border-bottom: 2px solid ${theme.colors.primary};
  font-family: ${theme.fonts.mono};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }
`;

const WelcomeSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
    text-align: center;
  }
`;

const WelcomeText = styled.div`
  color: ${theme.colors.primary};
  font-size: 1rem;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Handle = styled.span`
  color: ${theme.colors.accent};
  font-weight: bold;
  text-shadow: 0 0 8px ${theme.colors.accent}66;
`;

const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};

  @media (max-width: 768px) {
    gap: ${theme.spacing.md};
  }
`;

const ConnectionIndicator = styled.div<{ status: ConnectionStatus }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: 0.85rem;
  color: ${({ status }) => {
    switch (status) {
      case ConnectionStatus.CONNECTED:
        return theme.colors.success;
      case ConnectionStatus.CONNECTING:
        return theme.colors.warning;
      case ConnectionStatus.ERROR:
        return theme.colors.error;
      default:
        return theme.colors.secondary;
    }
  }};
`;

const StatusDot = styled.div<{ status: ConnectionStatus }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ status }) => {
    switch (status) {
      case ConnectionStatus.CONNECTED:
        return theme.colors.success;
      case ConnectionStatus.CONNECTING:
        return theme.colors.warning;
      case ConnectionStatus.ERROR:
        return theme.colors.error;
      default:
        return theme.colors.secondary;
    }
  }};
  box-shadow: 0 0 8px
    ${({ status }) => {
      switch (status) {
        case ConnectionStatus.CONNECTED:
          return theme.colors.success;
        case ConnectionStatus.CONNECTING:
          return theme.colors.warning;
        case ConnectionStatus.ERROR:
          return theme.colors.error;
        default:
          return theme.colors.secondary;
      }
    }}66;

  ${({ status }) =>
    status === ConnectionStatus.CONNECTING &&
    `
    animation: pulse 1.5s infinite;
  `}

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid ${theme.colors.secondary};
  color: ${theme.colors.secondary};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-family: ${theme.fonts.mono};
  font-size: 0.85rem;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.2s;

  &:hover {
    border-color: ${theme.colors.error};
    color: ${theme.colors.error};
    box-shadow: 0 0 10px ${theme.colors.error}33;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const getStatusText = (status: ConnectionStatus): string => {
  switch (status) {
    case ConnectionStatus.CONNECTED:
      return 'CONNECTED';
    case ConnectionStatus.CONNECTING:
      return 'CONNECTING...';
    case ConnectionStatus.ERROR:
      return 'ERROR';
    default:
      return 'DISCONNECTED';
  }
};

export function Header({ handle, connectionStatus, onLogout }: HeaderProps) {
  return (
    <HeaderContainer>
      <WelcomeSection>
        <WelcomeText>
          WELCOME, <Handle>@{handle}</Handle>
        </WelcomeText>
      </WelcomeSection>

      <StatusSection>
        <ConnectionIndicator status={connectionStatus}>
          <StatusDot status={connectionStatus} />
          {getStatusText(connectionStatus)}
        </ConnectionIndicator>

        <LogoutButton onClick={onLogout}>LOGOUT</LogoutButton>
      </StatusSection>
    </HeaderContainer>
  );
}
