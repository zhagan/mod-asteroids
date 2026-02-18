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

  const adsrParams = useMemo(() => ({
    attack: 0.002,
    decay: 0.22 + 0.12 * (1 - intensity), // longer decay for impact
    sustain: 1.0,
    release: 2,
  }), [intensity]);

  // Lower base frequency, more pitch drop for a "thud"
  const baseFreq = useMemo(() => 110 + 60 * intensity, [intensity]);
  const oscPitchMod = useMemo(() => 180 + 60 * intensity, [intensity]);

  useEffect(() => {
    if (trigger && controlsRef.current) {
      controlsRef.current.trigger();
      setTimeout(() => {
          controlsRef.current.releaseGate();
      }, 100); // slight delay to ensure envelope retriggers properly
    }
  }, [trigger]);

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
      <Mixer inputs={[osc, noise, noise1]} output={mixed} levels={[0.6, 1.0, 1.0]} />
      {/* Filter for retro character (lowpass for thud) */}
      <Filter
        input={mixed}
        output={filtered}
        type="lowpass"
        cutoff={600 + 900 * intensity}
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
