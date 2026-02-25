import React from 'react';
import motion from '../../utils/gameUtils/motion';
import { ThrustRack } from '../RetroThrust';
import { RetroTurnRack } from "../RetroTurn";

const Player = ({ globalPlayer, intensity }) => {
  return (
    <>
      <img
        id='player-object'
        className={globalPlayer.pressW ? 'fire' : ''}
        alt='player-sprite'
        src={require(`../../assets/img/player_sprt.png`)}
        style={motion(globalPlayer.x, globalPlayer.y, globalPlayer.dir)}
      />
      {(globalPlayer.invnsTimer) ? (<img
        id='player-object'
        className={globalPlayer.pressW ? 'fire' : ''}
        alt='player-sprite'
        src={require('../../assets/img/player_sprt_invs.gif')}
        style={motion(globalPlayer.xB, globalPlayer.y, globalPlayer.dir)} />) : ("")
        }
      {globalPlayer.xB !== globalPlayer.x && <img
        id='player-object'
        className={globalPlayer.pressW ? 'fire' : ''}
        alt='player-sprite'
        src={require('../../assets/img/player_sprt.png')}
        style={motion(globalPlayer.xB, globalPlayer.y, globalPlayer.dir)} />}
      {globalPlayer.yB !== globalPlayer.y && <img
        id='player-object'
        className={globalPlayer.pressW ? 'fire' : ''}
        alt='player-sprite'
        src={require('../../assets/img/player_sprt.png')}
        style={motion(globalPlayer.x, globalPlayer.yB, globalPlayer.dir)} />}
      {globalPlayer.xB !== globalPlayer.x && globalPlayer.yB !== globalPlayer.y && <img
        id='player-object'
        className={globalPlayer.pressW ? 'fire' : ''}
        alt='player-sprite'
        src={require('../../assets/img/player_sprt.png')}
        style={motion(globalPlayer.xB, globalPlayer.yB, globalPlayer.dir)} />}
      <RetroTurnRack trigger={!!globalPlayer.pressD || !!globalPlayer.pressA} intensity={intensity} />
      <ThrustRack active={!!globalPlayer.pressW} intensity={intensity} />
    </>
  )
}

export default Player;