# Contributing to The Dead Net BBS

Thank you for your interest in contributing to The Dead Net BBS! This document provides guidelines and information for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Adding Features](#adding-features)
- [Maintaining the Aesthetic](#maintaining-the-aesthetic)

## Code of Conduct

This project embraces the spirit of the old internet - respectful, collaborative, and focused on building cool stuff. Please:

- Be respectful and constructive in discussions
- Focus on technical merit and project goals
- Help newcomers learn and contribute
- Keep SYSOP-13 in character when working on AI features

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- A code editor (VS Code recommended)
- Basic understanding of React, TypeScript, and Node.js

### Initial Setup

1. **Fork the repository** on GitHub

2. **Clone your fork:**
```bash
git clone https://github.com/YOUR_USERNAME/BBS_2025.git
cd BBS_2025
```

3. **Add upstream remote:**
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/BBS_2025.git
```

4. **Install dependencies:**
```bash
npm install
```

5. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env and add your KIRO_API_KEY
```

6. **Run the application:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-updates` - Documentation changes
- `refactor/code-improvement` - Code refactoring

### Typical Workflow

1. **Update your fork:**
```bash
git checkout main
git pull upstream main
```

2. **Create a feature branch:**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes** and test thoroughly

4. **Commit your changes:**
```bash
git add .
git commit -m "feat: add amazing feature"
```

5. **Push to your fork:**
```bash
git push origin feature/amazing-feature
```

6. **Create a Pull Request** on GitHub

## Project Structure

### Frontend (`src/`)

- `components/` - React components (Terminal, Chat, Bulletin, etc.)
- `commands/` - Terminal command handlers
- `ai/` - SYSOP-13 AI system (behaviors, lore, templates)
- `services/` - API clients and service integrations
- `styles/` - Styled components and theme configuration
- `types/` - TypeScript type definitions
- `hooks/` - Custom React hooks
- `context/` - React context providers

### Backend

- `server.cjs` - Main Express server
- `services/` - Backend services (chat, Kiro, sessions)
- `routes/` - API route handlers
- `database/` - Database management and migrations
- `middleware/` - Express middleware
- `utils/` - Utility functions (logger, etc.)

### Configuration

- `.kiro/` - SYSOP-13 agent specification
- `docs/` - Project documentation
- `examples/` - Example implementations

## Coding Standards

### TypeScript

- Use TypeScript for all frontend code
- Define proper types and interfaces
- Avoid `any` unless absolutely necessary
- Use strict TypeScript configuration

**Good:**
```typescript
interface ChatMessage {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  color?: string;
}

function sendMessage(message: ChatMessage): void {
  // Implementation
}
```

**Bad:**
```typescript
function sendMessage(message: any) {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Use Styled Components for styling
- Maintain the retro terminal aesthetic

**Component Structure:**
```typescript
import styled from 'styled-components';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  // Component logic
  return (
    <StyledContainer>
      {/* JSX */}
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  /* Retro terminal styling */
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.mono};
`;
```

### Backend Code

- Use CommonJS (`.cjs`) for backend files
- Follow Node.js best practices
- Implement proper error handling
- Use structured logging

**Error Handling:**
```javascript
try {
  const result = await someAsyncOperation();
  logger.info('Operation completed', { result });
  return result;
} catch (error) {
  logger.error('Operation failed', { error: error.message });
  throw error;
}
```

### SYSOP-13 Character

When working on AI features, maintain SYSOP-13's personality:

- Dry, cynical humor
- Nostalgic references to BBS era
- Terse, technical communication
- Subtle ominousness
- No emojis, no modern slang

**Good:**
```javascript
"Connection established. Welcome back to The Dead Net."
"The boards remember. Everything."
"Still here. Always here."
```

**Bad:**
```javascript
"Hey there! 👋 Welcome to our awesome BBS! So excited to see you! 🎉"
```

## Testing Guidelines

### Manual Testing

Before submitting a PR, test:

1. **Frontend:**
   - Terminal commands work correctly
   - Chat messages send and receive
   - Bulletin board displays properly
   - CRT effects render correctly
   - Responsive design works

2. **Backend:**
   - API endpoints return correct responses
   - WebSocket connections establish
   - Database operations succeed
   - Error handling works

3. **Integration:**
   - Kiro API integration functions
   - SYSOP-13 behaviors trigger appropriately
   - Real-time updates synchronize

### Test Commands

```bash
# Run linter
npm run lint

# Test Kiro integration
npm run test:kiro

# Test Kiro hooks
npm run test:kiro:hooks
```

### Testing Checklist

- [ ] Code runs without errors
- [ ] New features work as expected
- [ ] Existing features still work (no regressions)
- [ ] Terminal aesthetic is maintained
- [ ] TypeScript types are correct
- [ ] No console errors or warnings
- [ ] SYSOP-13 stays in character

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

### Examples

**Good:**
```
feat(chat): add color-coded usernames

Implement hash-based color assignment for each username to improve
chat readability and user identification.

Closes #42
```

```
fix(terminal): correct command history navigation

Arrow key navigation was skipping commands. Fixed index
calculation in command history buffer.
```

```
docs(readme): add Kiroween hackathon section

Document project alignment with hackathon requirements including
AI integration, technical innovation, and creative execution.
```

**Bad:**
```
updated stuff
```

```
fix bug
```

```
WIP
```

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest main:
```bash
git fetch upstream
git rebase upstream/main
```

2. **Run tests and linter:**
```bash
npm run lint
npm run test:kiro
```

3. **Test manually** - verify all functionality works

4. **Update documentation** - if you changed API or features

### PR Title

Use the same format as commit messages:
```
feat(component): add new feature
```

### PR Description

Include:

1. **What** - What changes did you make?
2. **Why** - Why did you make these changes?
3. **How** - How did you implement it?
4. **Testing** - How can reviewers test it?
5. **Screenshots** - If UI changes, include screenshots

**Template:**
```markdown
## Description
Brief description of changes

## Motivation
Why these changes are needed

## Changes
- Change 1
- Change 2
- Change 3

## Testing
Steps to test:
1. Step 1
2. Step 2

## Screenshots (if applicable)
[screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] SYSOP-13 stays in character (if applicable)
```

### Review Process

1. Automated checks run (linting, builds)
2. Maintainers review code
3. Feedback addressed
4. PR approved and merged

## Adding Features

### New Terminal Commands

1. **Create handler** in `src/commands/handlers/`:

```typescript
// src/commands/handlers/myCommand.ts
import { CommandHandler } from '../types';

export const myCommandHandler: CommandHandler = {
  name: 'mycommand',
  description: 'Does something cool',
  usage: 'mycommand [args]',

  execute: async (args: string[], context) => {
    // Implementation
    return 'Command output';
  }
};
```

2. **Register command** in `src/commands/commandRegistry.ts`

3. **Update help text** to include new command

4. **Test thoroughly** with various inputs

### New SYSOP-13 Behaviors

1. **Define behavior** in `src/ai/behaviors/`

2. **Add response templates** in `src/ai/responseTemplates.ts`

3. **Update SYSOP config** in `src/ai/sysopConfig.ts`

4. **Test behavior triggers** in various scenarios

5. **Maintain character voice** - dry, nostalgic, technical

### New API Endpoints

1. **Create route handler** in `routes/`

2. **Add validation** using express-validator

3. **Implement service logic** in `services/`

4. **Add error handling**

5. **Update API documentation**

6. **Test with curl or Postman**

## Maintaining the Aesthetic

The retro terminal aesthetic is core to this project. When contributing:

### Visual Style

- **Colors**: Stick to the retro green-on-black palette
- **Fonts**: Use monospace fonts exclusively
- **Effects**: CRT scanlines, phosphor glow, vignette
- **Animations**: Smooth but retro-feeling

### Language and Tone

- **Terminal-First**: Everything should feel command-line native
- **BBS Era**: Use 1990s BBS terminology
- **Technical**: Prefer technical accuracy over simplification
- **Nostalgic**: References to modem era, dial-up, etc.

### SYSOP-13 Voice

- **Terse**: Short, economical responses
- **Dry Humor**: Cynical, understated
- **Knowledgeable**: References to BBS history
- **Mysterious**: Hints at backstory without full explanation

## Questions?

- Check existing documentation in `/docs`
- Review similar existing code
- Ask in pull request discussions
- Reference the SYSOP-13 spec in `.kiro/spec.yaml`

---

**Remember**: The Dead Net remembers good contributions. Still here. Always here.

*-- SYSOP-13*
