import React, { useEffect, useMemo, useRef } from 'react';
import {
  AudioProvider,
  useModStream,
  ToneGenerator,
  NoiseGenerator,
  VCA,
  Filter,
  Mixer,
  Monitor,
  ADSR,
} from '@mode-7/mod';

// RetroCollision: short, impactful, retro collision sound
export function RetroCollision({ trigger, intensity = 1 }) {
  const osc = useModStream();
  const noise = useModStream();
  const noise1 = useModStream();
  const mixed = useModStream();
  const filtered = useModStream();
  const vca = useModStream();
  const env = useModStream();
  const controlsRef = useRef();

  const [randomSeed, setRandomSeed] = React.useState([Math.random(), Math.random(), Math.random()]);

  const adsrParams = useMemo(() => ({
    attack: 0.001,
    decay: 0.22 + 0.12 * (1 - intensity), // longer decay for impact
    sustain: 1.0,
    release: 1,
  }), [intensity]);

  // Lower base frequency, more pitch drop for a "thud"
  const baseFreq = useMemo(() => 110 + 60 * intensity, [intensity]);
  const oscPitchMod = useMemo(() => 180 + 60 * intensity, [intensity]);

  useEffect(() => {
      setRandomSeed([Math.random(), Math.random(), Math.random()]);
  }, [trigger])

  useEffect(() => {
    if (trigger && controlsRef.current) {
      controlsRef.current.release = 1.0 * randomSeed[0];
      controlsRef.current.sustain = 1.0 * randomSeed[1];
      controlsRef.current.trigger();
      setTimeout(() => {
          controlsRef.current.releaseGate();
      },  10 * randomSeed[1]);
    }
  }, [trigger, randomSeed]);

  return (
    <>
      {/* Envelope for amplitude */}
      <ADSR output={env} {...adsrParams}>
        {(controls) => {
          controlsRef.current = controls;
          return null;
        }}
      </ADSR>
      {/* Oscillator for impact body */}
      <ToneGenerator
        output={osc}
        waveform="triangle"
        frequency={baseFreq}
        cv={env}
        cvAmount={-oscPitchMod}
      />
      {/* Noise for crunch */}
      <NoiseGenerator output={noise} type="white" />
      <NoiseGenerator output={noise1} type="pink" />
      {/* Mix oscillator and noise (more noise for crunch) */}
      <Mixer inputs={[osc, noise, noise1]} output={mixed} levels={[1.0 * randomSeed[0], 1.0 * randomSeed[1] , 1.0 * randomSeed[2]]} />
      {/* Filter for retro character (lowpass for thud) */}
      <Filter
        input={mixed}
        output={filtered}
        type="lowpass"
        cutoff={100 + 1000 * randomSeed[2]}
        resonance={0.5}
        cutoffCv={env}
        cutoffCvAmount={-700}
      />
      {/* VCA for amplitude envelope */}
      <VCA input={filtered} output={vca} cv={env} />
      <Monitor input={vca} />
    </>
  );
}

export function RetroCollisionRack(props) {
  return (
    <AudioProvider>
      <RetroCollision {...props} />
    </AudioProvider>
  );
}
