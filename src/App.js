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
  const [soundVolumes, setSoundVolumes] = useState({
    midi: 1,
    fire: 1,
    turn: 1,
    thrust: 1,
    ufo: 1,
    collision: 1,
  });

  return (
    <ThemeProvider theme={theme}>
      <Main
        key={gameState.restartId}
        setGameState={setGameState}
        gameState={gameState}
        soundVolumes={soundVolumes}
        setSoundVolumes={setSoundVolumes}
      />
    </ThemeProvider>
  );
}

export default App;
