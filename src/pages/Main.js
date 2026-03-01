import React from 'react';
import GameWindow from '../components/GameWindow';

const Main = ({
  gameState,
  setGameState,
  setMenuSoundState,
  menuSoundstate,
  soundVolumes,
  setSoundVolumes,
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
        soundVolumes={soundVolumes}
        setSoundVolumes={setSoundVolumes}
      />
  );
};

export default Main;
