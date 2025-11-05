import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import XTermTerminal from "./components/XTermTerminal";
import ModemDialIn from "./components/ModemDialIn";
import { LoginForm, Header, ChatFeed } from "./components";
import { GlobalStyles } from "./styles/GlobalStyles";
import CRTScreen from "./components/CRTScreen";
import type { CRTConfig } from "./styles/crtEffects";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useWebSocket } from "./hooks/useWebSocket";
import { theme } from "./styles/theme";

const AppContainer = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.header`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 48px;
  color: #00ff00;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  margin-bottom: 10px;
  font-family: "Courier New", Courier, monospace;

  &::before {
    content: "> ";
    color: #00ff00;
  }
`;

const Subtitle = styled.p`
  color: #00ff00;
  opacity: 0.8;
  font-size: 16px;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MainPanel = styled.div`
  min-height: 600px;
`;

const ChatPanel = styled.div`
  min-height: 600px;
  max-height: 800px;
`;

const TerminalSection = styled.section`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #00ff00;
  font-size: 20px;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #00ff00;
`;

function AppContent() {
  const {
    session,
    isAuthenticated,
    connectionStatus,
    login,
    logout,
    setConnectionStatus,
  } = useAuth();
  const [showDialIn, setShowDialIn] = useState(true);
  const crtEnabled = true;
  const crtConfig: Partial<CRTConfig> = {
    scanlines: true,
    flicker: true,
    phosphorGlow: true,
    vignette: true,
    chromaticAberration: false,
    curvature: false,
    intensity: "medium",
  };

  // Initialize WebSocket connection when authenticated
  const socket = useWebSocket({
    session,
    onConnectionChange: setConnectionStatus,
  });

  // Show login form if not authenticated
  if (!isAuthenticated || !session) {
    return (
      <>
        <GlobalStyles />
        <LoginForm onLogin={login} />
      </>
    );
  }

  // Show dial-in animation first (after login)
  if (showDialIn) {
    return (
      <>
        <GlobalStyles />
        <CRTScreen enabled={crtEnabled} config={crtConfig}>
          <ModemDialIn
            onComplete={() => {
              setShowDialIn(false);
            }}
          />
        </CRTScreen>
      </>
    );
  }

  // Show main app when authenticated and dial-in complete
  return (
    <>
      <GlobalStyles />
      <MainContent>
        <Header
          handle={session.handle}
          connectionStatus={connectionStatus}
          onLogout={logout}
        />
        <AppContainer>
          <PageHeader>
            <Title>THE DEAD NET</Title>
            <Subtitle>Where old connections never truly die...</Subtitle>
          </PageHeader>

          <ContentLayout>
            <MainPanel>
              <CRTScreen enabled={crtEnabled} config={crtConfig}>
                <TerminalSection>
                  <SectionTitle>Terminal</SectionTitle>
                  <XTermTerminal
                    welcomeMessage={`Welcome to THE DEAD NET
Version 13.0.0 - SYSOP-13 Active
Type "help" for available commands.

`}
                    onCommand={(cmd) => {
                      console.log("Command received:", cmd);
                    }}
                  />
                </TerminalSection>
              </CRTScreen>
            </MainPanel>

            <ChatPanel>
              <CRTScreen enabled={crtEnabled} config={crtConfig}>
                <ChatFeed socket={socket} currentUsername={session?.handle} />
              </CRTScreen>
            </ChatPanel>
          </ContentLayout>
        </AppContainer>
      </MainContent>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
