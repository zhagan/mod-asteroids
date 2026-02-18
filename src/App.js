import React, { useState } from 'react';
import './App.css';
import Auth from './utils/auth';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Start from './pages/Start';
import Main from './pages/Main';
import Nomatch from './components/Nomatch';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {
  const isLoggedIn = (Auth.loggedIn()) ? 1 : 0;
  const [gameState, setGameState] = useState({
    username: ' ',
    curLevel: 0,
    score: 0,
    exp: 0,
    lives: 3,
    playerLevel: 0,
    numberOfAsteroids: 0,
    timer: 0,
    paused: 0,
    gameOver: 0,
    loggedIn: isLoggedIn
  });

  return (
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/">
              <Home setGameState={setGameState} gameState={gameState}/>
            </Route>
            <Route exact path="/start">
              <Start setGameState={setGameState} gameState={gameState} />
            </Route>
            <Route exact path="/main">
              <Main setGameState={setGameState} gameState={gameState} />
            </Route>
            <Route>
              <Nomatch />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
  );
}

export default App;
