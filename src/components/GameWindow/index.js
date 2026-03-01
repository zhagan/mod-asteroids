import React, { useState, useEffect, useRef } from "react";
//components
import Hud from '../Hud';
import Player from '../Player';
import Asteroid from '../Asteroid';
import GameOver from "../GameOver";
import Touch from "../Touch";
import { RetroCollisionRack } from '../RetroCollision';
//utilities
import motion from '../../utils/gameUtils/motion';
import updateAsteroids from '../../utils/updateObjects/updateAsteroids';
import updatePlayer from '../../utils/updateObjects/updatePlayer';
import updateBullet from '../../utils/updateObjects/updateBullet';
import updateUfo from '../../utils/updateObjects/updateUfo'
import checkShipCollision from '../../utils/collisions/checkShipCollision';
import checkBulletCollision from '../../utils/collisions/checkBulletCollision';
import asteroidGeneration from '../../utils/createObjects/asteroidGeneration';
import generateBullet from '../../utils/createObjects/generateBullet';
import { checkScreenScale } from '../../utils/gameUtils/checkScreenScale';
import {RetroUFORack} from "../RetroUFO";
import { RetroFireRack } from "../RetroFire";
import { RetroMidiRack } from "../RetroMidi";

const SOUND_VOLUME_ITEMS = [
  { key: 'midi', label: 'Retro MIDI' },
  { key: 'fire', label: 'Retro Fire' },
  { key: 'turn', label: 'Retro Turn' },
  { key: 'thrust', label: 'Retro Thrust' },
  { key: 'ufo', label: 'Retro UFO' },
  { key: 'collision', label: 'Retro Collision' },
];
const formatDuration = (seconds) => {
  if (typeof seconds !== 'number' || Number.isNaN(seconds)) return '--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
};
const getMetaName = (metadata, url, headerName) => {
  if (!metadata) return 'Loading...';
  const name = metadata.name?.trim();
  if (name) return name;
  if (headerName?.trim()) return headerName.trim();
  if (url) {
    const parts = url.split('/');
    const last = parts[parts.length - 1];
    return last || 'Unknown';
  }
  return 'Unknown';
};

const GameWindow = ({ gameState, setGameState, soundVolumes, setSoundVolumes }) => {
  //------------------------------States---------------------------//
  const gameSpeed = 16.667;//16.667ms per frame = ~ 60fps
  const [ufo, setUfo] = useState({ x: -200, y: 50, bullet: { x: -1000, y: -1000 } });
  const [screenScale, setScreenScale] = useState(window.innerWidth / 1920);
  const [globalPlayer, setGlobalPlayer] = useState({
    x: 906, y: 478, xB: 906, yB: 478, dir: 90, thrust: 0.2, vx: 0, vy: 0,
    turnSpeed: 5, spriteDim: { w: 54, h: 62 }, alive: true, invnsTimer: 120
  });
  const [asteroids, setAsteroids] = useState({});
  const [bullets, setBullets] = useState([]);
  const [playBullet, setPlayBullet] = useState(0)
  const [gameStarted, setGameStarted] = useState(false);
  const [midiMetadata, setMidiMetadata] = useState(null);
  const [midiLink, setMidiLink] = useState('');
  const [headerTitle, setHeaderTitle] = useState(null);
  const [midiStopSignal, setMidiStopSignal] = useState(0);
  const setSoundVolume = (key, value) => {
    setSoundVolumes((prev) => ({ ...prev, [key]: value }));
  };
  //----------------------------Variables-------------------------//
  const keysPressed = useRef([]);
  const tpCache = useRef([]);
  let screenWidth = window.innerWidth;
  const level = useRef(1);
  const numOfAst = useRef();
  const timer = useRef();
  const spaceDown = useRef(0);
  const bonus = useRef();
  const isUfo = useRef(0);

  const ufoSprite = (Math.random < .1) ? 'ufo - rick' : 'ufo';
  //-------------------------GAME LOOP-------------------------//
  const loop = () => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        //This setState stays here to trigger the useState below
        //By grouping all the state changes in the useEffect we get better performance
        //but we need to change a state to loop the useEffect

        setGlobalPlayer((oldPlayer) => updatePlayer(oldPlayer, keysPressed.current, tpCache));
        checkScreenScale(screenWidth, setScreenScale);
        // console.log(gameState.loggedIn)
        loop();
      }, gameSpeed);
    });
  };

  // -----------------WHERE GAME LOGIC GOES----------------//
  useEffect(() => {
    level.current = gameState.curLevel;
    numOfAst.current = document.querySelectorAll('#asteroid-object').length;
    //update object states--
    setAsteroids((oldPositions) => updateAsteroids(oldPositions, level.current));
    if (bullets) setBullets((oldPositions) => (updateBullet(oldPositions)));
    if (isUfo.current) setUfo(old => (updateUfo(old, globalPlayer)));
    //   //UFO Checks--

    if (ufo.x > 1920) isUfo.current = 0;
    //Make bullets--
    if (globalPlayer.alive && spaceDown.current === 1 && bullets.length <= 5) {
      spaceDown.current = 2;
      // playSoundCancel('bullet_snd');
      setPlayBullet(prev => prev + 1)
      setBullets((old) => ([...old, generateBullet(globalPlayer)]));
      setTimeout(() => (spaceDown.current === 2) ? spaceDown.current = 1 : false, 200)
    }

    //New Level--
    if (numOfAst.current <= 0) {
      (gameState.timer <= 30) ? bonus.current = 10000 : bonus.current = 1000;
      if (gameState.curLevel === 0) bonus.current = 0;
      setGlobalPlayer(old => ({ ...old, invnsTimer: 120 }));
      setGameState(old => ({ ...old, curLevel: old.curLevel + 1, timer: 0, score: (old.score + bonus.current) }))
      setAsteroids(asteroidGeneration(asteroids, globalPlayer, 2, gameState.curLevel + 1, 0, 0, 1));
      setTimeout(() => bonus.current = 0, 3000);
    }
    //collision checks--
    checkBulletCollision(bullets, setBullets, setAsteroids, asteroids, globalPlayer, setGameState, ufo, setUfo, setGlobalPlayer);
    checkShipCollision(globalPlayer, setGlobalPlayer, setGameState, asteroids, ufo);
    //DONT PUT ANYMORE INTO DEPENDENCY!! globalPlayer constantly updates!

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalPlayer]);

  //-------------------------Key Input----------------------//
  //keyboard key event handlers. Keeps an array of all currently pressed keys
  const logKeyDown = (e) => {
    if (!keysPressed.current.includes(e.key)) keysPressed.current = [...keysPressed.current, e.key.toLowerCase()];
    if (keysPressed.current.includes(" ") && spaceDown.current !== 2) spaceDown.current = 1;
  };
  const logKeyUp = (e) => {
    const newKeys = keysPressed.current.filter((key) => key !== e.key.toLowerCase());
    if (!newKeys.includes(" ")) spaceDown.current = 0;
    if (newKeys !== keysPressed.current) keysPressed.current = newKeys;
  };

  //------------------USE EFFECT ON MOUNT------------------//
  useEffect(() => {
    if (!gameStarted) return;

    // Start Game Timer
    timer.current = setInterval(() => {
      if (!isUfo.current && Math.random() < .02) {
        isUfo.current = 1;
      };
      setGameState((old) => ({ ...old, timer: old.timer + 1 }));
    }, 1000);
    document.addEventListener("keyup", logKeyUp);
    document.addEventListener("keydown", logKeyDown);

    loop();//Start game loop
    return () => {
      clearInterval(timer.current);
      document.removeEventListener("keyup", logKeyUp);
      document.removeEventListener("keydown", logKeyDown);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted]);

  // Stop Timer when Player Dies
  useEffect(() => {
    return () => {
      clearInterval(timer.current);
    };
  }, [globalPlayer.alive]);

  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';
  let borderWidth = (window.innerWidth - (screenScale * 1920)) / 2; //calcualtes the pixel width the game window should move left based on the users screen aspect ratio

  const playerSpeed = Math.sqrt(globalPlayer.vx ** 2 + globalPlayer.vy ** 2);
  const maxSpeed = 10; // Adjust this value to match your game's max speed
  const intensity = Math.min(playerSpeed / maxSpeed, 1);
  const handleQuit = () => {
    setGameState((old) => ({
      ...old,
      lives: 0,
      gameOver: 1,
    }));
    setGlobalPlayer((old) => ({ ...old, alive: false }));
    setMidiStopSignal((prev) => prev + 1);
  };
  //-----------------------JSX-------------------------//
  return (
    <div id="game-container">
      <div
        id="game-window"
        className="App"
        style={{ transform: `scale(${screenScale})`, left: `${borderWidth}px` }}> {/*"left" keeps the window centered based on the screen scale */}
        {/* --------GameWindowBegins------- */}
        {!gameStarted && (
          <div id="start-overlay">
            <button
              type="button"
              className="nes-btn is-primary"
              onClick={() => setGameStarted(true)}
            >
              Start Game
            </button>
          </div>
        )}
        {(gameState.lives === 3 && globalPlayer.invnsTimer) ? (<div id='start-display'>{(gameState.curLevel === 1) ? "!START!" : ''}</div>) : ('')}
        {(globalPlayer.invnsTimer && gameState.curLevel !== 1 && bonus.current) ? (<div id='bonus-element'>Bonus:{bonus.current}</div>) : ('')}
        {(globalPlayer.invnsTimer && gameState.curLevel !== 1 && bonus.current !== 10000 && bonus.current) ? (<div id='no-bonus-element'>No Time Bonus</div>) : ('')}
        {/*------------- HUD  -------------*/}
        <Hud
          gameState={gameState}
          setGameState={setGameState}
          setGlobalPlayer={setGlobalPlayer}
          onQuit={handleQuit}
        />
        <div id="sound-toggle-panel" className="nes-container is-rounded">
          <div className="panel-title">Sound FX</div>
          <div className="sound-toggle-list">
            {SOUND_VOLUME_ITEMS.map((item) => (
              <label className="sound-toggle-row" key={item.key}>
                <span>{item.label}</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={soundVolumes[item.key]}
                  onChange={(event) =>
                    setSoundVolume(item.key, Number(event.target.value))
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === 'ArrowLeft' ||
                      event.key === 'ArrowRight' ||
                      event.key === 'ArrowUp' ||
                      event.key === 'ArrowDown'
                    ) {
                      event.preventDefault();
                    }
                  }}
                />
                <span>{Math.round(soundVolumes[item.key] * 100)}%</span>
              </label>
            ))}
          </div>
          <div className="midi-metadata">
            <div className="midi-meta-title">MIDI</div>
            <div className="midi-meta-row">
              <span>Name</span>
              <span>{getMetaName(midiMetadata, midiLink, headerTitle)}</span>
            </div>
            <div className="midi-meta-row">
              <span>Tracks</span>
              <span>{midiMetadata?.tracks ?? '--'}</span>
            </div>
            <div className="midi-meta-row">
              <span>Duration</span>
              <span>{formatDuration(midiMetadata?.duration)}</span>
            </div>
            <div className="midi-meta-row">
              <span>Tempo</span>
              <span>{midiMetadata?.tempo ? `${midiMetadata.tempo} bpm` : '--'}</span>
            </div>
            <div className="midi-meta-row midi-meta-link">
              {midiLink ? (
                <a href={midiLink} target="_blank" rel="noreferrer">
                  Link
                </a>
              ) : (
                <span>Loading...</span>
              )}
            </div>
          </div>
        </div>
        {/* UFO */}
        <img id="ufo-object" alt="ufo" style={{ 'left': ufo.x }} src={require(`../../assets/img/${ufoSprite}.png`)}></img>
        <img id='bullet-object' alt="bullet" src={require("../../assets/img/bullet.png")} style={motion(ufo.bullet.x, ufo.bullet.y, ufo.bullet.dir)} />
        {/*--------- RENDER PLAYER / GAME OVER ---------*/}
        {globalPlayer.alive ? (
          <Player
            globalPlayer={globalPlayer}
            intensity={intensity}
            turnVolume={soundVolumes.turn}
            thrustVolume={soundVolumes.thrust}
          />
        ) : (
          <GameOver gameState={gameState} />
        )}
        {/*--------- RENDER BULLETS ---------*/}
        {bullets.map((pos, i) => {
          return pos ? (
            <img key={`bullet-${i}`} id='bullet-object' alt="bullet-sprite" src={require("../../assets/img/bullet.png")} style={motion(pos.x, pos.y, pos.dir)} />
          ) : ("");
        })}
        {/*--------- RENDER ASTEROIDS ---------*/}
        {Object.keys(asteroids).map((posId) => {
          const pos = asteroids[posId];
          return pos.alive ? <Asteroid key={`asteroid-id-${posId}`} pos={pos} posId={posId} /> : '';
        })}
        <RetroMidiRack
          trigger={!!gameStarted}
          volume={soundVolumes.midi}
          enabled={soundVolumes.midi > 0}
          stopSignal={midiStopSignal}
          onMetadataChange={setMidiMetadata}
          onMidiUrlChange={setMidiLink}
          onHeaderTitleChange={setHeaderTitle}
        />

        <RetroFireRack trigger={playBullet} intensity={intensity} volume={soundVolumes.fire} />
        {/* --- Retro UFO Sound --- */}
        <RetroUFORack trigger={isUfo.current} intensity={intensity} volume={soundVolumes.ufo} />
        {/* --- Retro Collision Sound: Player --- */}
        <RetroCollisionRack
          trigger={globalPlayer.bulletCollision}
          intensity={intensity}
          volume={soundVolumes.collision}
        />
        <RetroCollisionRack
          trigger={globalPlayer.collision}
          intensity={intensity}
          volume={soundVolumes.collision}
        />
      </div>
      {/*-------TOUCH CONTROLS------*/}
      {(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && globalPlayer.alive) ?

        <Touch tpCache={tpCache} spaceDown={spaceDown} />

        : ("")}
    </div>
  );
};
export default GameWindow;
