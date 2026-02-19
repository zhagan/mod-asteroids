import React from 'react';
import GameWindow from '../components/GameWindow';

const Main = ({
  gameState,
  setGameState,
  setMenuSoundState,
  menuSoundstate,
}) => {

  // if (!Auth.loggedIn()) {
  //   return <Redirect to="/" />
  // }

  return (
      <GameWindow
        menuSoundstate={menuSoundstate}
        setMenuSoundState={setMenuSoundState}
        setGameState={setGameState}
        gameState={gameState}
      />
  );
};

export default Main;
