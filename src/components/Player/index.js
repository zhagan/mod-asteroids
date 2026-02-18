import React from 'react';
import motion from '../../utils/gameUtils/motion';
import { ThrustRack } from '../RetroThrust';
import { RetroFireRack } from '../RetroFire';

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
      {/* --- Retro Thruster Sound --- */}
      <ThrustRack active={!!globalPlayer.pressW} intensity={intensity} />
      {/* --- Retro Gun Fire Sound --- */}
      <RetroFireRack trigger={!!globalPlayer.pressSpace} intensity={intensity} />
    </>
  )
}

export default Player;