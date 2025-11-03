import { createGlobalStyle } from 'styled-components';
import { terminalTheme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${terminalTheme.fonts.primary};
    background: ${terminalTheme.background.gradient};
    min-height: 100vh;
    color: ${terminalTheme.foreground.primary};
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  ::selection {
    background-color: ${terminalTheme.foreground.primary};
    color: ${terminalTheme.background.secondary};
  }

  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: ${terminalTheme.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${terminalTheme.foreground.primary};
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${terminalTheme.foreground.secondary};
  }
`;
