/**
 * Login form component with terminal aesthetic
 */

import { useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

interface LoginFormProps {
  onLogin: (handle: string) => void;
}

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${theme.colors.background};
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.mono};
  padding: ${theme.spacing.lg};
`;

const LoginBox = styled.div`
  max-width: 600px;
  width: 100%;
  border: 2px solid ${theme.colors.primary};
  padding: ${theme.spacing.xl};
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 20px ${theme.colors.primary}33;

  @media (max-width: 768px) {
    padding: ${theme.spacing.lg};
    border-width: 1px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0 0 ${theme.spacing.md} 0;
  text-align: center;
  text-shadow: 0 0 10px ${theme.colors.primary};
  letter-spacing: 2px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  margin: 0 0 ${theme.spacing.xl} 0;
  color: ${theme.colors.secondary};
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: ${theme.colors.secondary};
  letter-spacing: 1px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${theme.colors.primary};
  background: ${theme.colors.background};
  padding: ${theme.spacing.sm};
  transition: all 0.2s;

  &:focus-within {
    box-shadow: 0 0 10px ${theme.colors.primary}66;
    border-color: ${theme.colors.accent};
  }
`;

const Prompt = styled.span`
  color: ${theme.colors.accent};
  margin-right: ${theme.spacing.sm};
  user-select: none;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.mono};
  font-size: 1rem;
  caret-color: ${theme.colors.primary};

  &::placeholder {
    color: ${theme.colors.secondary};
    opacity: 0.5;
  }
`;

const Button = styled.button`
  background: transparent;
  border: 2px solid ${theme.colors.primary};
  color: ${theme.colors.primary};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-family: ${theme.fonts.mono};
  font-size: 1rem;
  cursor: pointer;
  letter-spacing: 2px;
  transition: all 0.2s;
  text-transform: uppercase;

  &:hover:not(:disabled) {
    background: ${theme.colors.primary};
    color: ${theme.colors.background};
    box-shadow: 0 0 15px ${theme.colors.primary}66;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  font-size: 0.85rem;
  text-align: center;
  margin-top: ${theme.spacing.sm};
`;

const HelpText = styled.div`
  color: ${theme.colors.secondary};
  font-size: 0.75rem;
  margin-top: ${theme.spacing.md};
  text-align: center;
  opacity: 0.7;
`;

export function LoginForm({ onLogin }: LoginFormProps) {
  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');

  const validateHandle = (value: string): boolean => {
    // Handle must be 2-20 characters, alphanumeric with underscores/hyphens
    const regex = /^[a-zA-Z0-9_-]{2,20}$/;
    return regex.test(value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedHandle = handle.trim();

    if (!trimmedHandle) {
      setError('Handle cannot be empty');
      return;
    }

    if (!validateHandle(trimmedHandle)) {
      setError('Handle must be 2-20 characters (letters, numbers, _, -)');
      return;
    }

    onLogin(trimmedHandle);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Allow Enter to submit
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>VIBE KANBAN</Title>
        <Subtitle>Terminal-based collaborative task board</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>ENTER YOUR HANDLE</Label>
            <InputWrapper>
              <Prompt>&gt;</Prompt>
              <Input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="username"
                autoFocus
                maxLength={20}
              />
            </InputWrapper>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </InputGroup>

          <Button type="submit" disabled={!handle.trim()}>
            Connect
          </Button>

          <HelpText>
            No password required • Session stored locally
          </HelpText>
        </Form>
      </LoginBox>
    </LoginContainer>
  );
}
