import React from 'react';
import motion from '../../utils/gameUtils/motion';
import { ThrustRack } from '../RetroThrust';
import { RetroFireRack } from '../RetroFire';
import { RetroTurnRack } from "../RetroTurn";

const Player = ({ globalPlayer, intensity, soundToggles = {} }) => {
  const { turn = true, thrust = true } = soundToggles;
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
      {turn && (
        <RetroTurnRack trigger={!!globalPlayer.pressD || !!globalPlayer.pressA} intensity={intensity} />
      )}

      {/* --- Retro Thruster Sound --- */}
      {thrust && <ThrustRack active={!!globalPlayer.pressW} intensity={intensity} />}
      {/* --- Retro Gun Fire Sound --- */}
      {/* <RetroFireRack trigger={!!globalPlayer.pressSpace} intensity={intensity} /> */}
    </>
  )
}

export default Player;
