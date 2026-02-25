import React, { useState } from 'react';
import './App.css';
import Auth from './utils/auth';
import Main from './pages/Main';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { baseGameState } from './utils/gameStateDefaults';

function App() {
  const isLoggedIn = (Auth.loggedIn()) ? 1 : 0;
  const [gameState, setGameState] = useState(() => ({
    ...baseGameState,
    loggedIn: isLoggedIn,
    restartId: 0,
  }));

  return (
    <ThemeProvider theme={theme}>
      <Main key={gameState.restartId} setGameState={setGameState} gameState={gameState} />
    </ThemeProvider>
  );
}

export default App;
