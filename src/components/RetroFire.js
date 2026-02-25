import React, {useEffect, useMemo, useRef } from 'react';
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
    Flanger,
} from '@mode-7/mod';

// RetroFire: short, punchy, retro gunshot effect
export function RetroFire({ trigger, intensity = 1 }) {
  const osc = useModStream();
  const noise = useModStream();
  const mixed = useModStream();
  const filtered = useModStream();
  const vca = useModStream();
  const env = useModStream();
  const lfoVca = useModStream();
  const flanger = useModStream();

  const adsrControlRef = useRef();
  const adsrParams = useMemo(() => ({
    attack: 0.005,
    decay: 0.08 + 0.04 * (1 - intensity),
    sustain: 1,
    release: 0.1,
  }), [intensity]);

  useEffect(() => {
    console.log('trigger', trigger)
    adsrControlRef.current.trigger()
    setTimeout(() => {
      adsrControlRef.current.releaseGate()
    }, 10)
  }, [trigger])
  // Pitch envelope for oscillator (optional)
  const baseFreq = useMemo(() => 320 + 180 * intensity, [intensity]);
  // const oscPitchMod = useMemo(() => 80 + 60 * intensity, [intensity]);

  return (
    <>
      {/* Envelope for amplitude */}
      {/* <LFO output={lfo} frequency={10} waveform="sawtooth" direction="down" /> */}
      {/* <VCA input={lfo} output={lfoVca} gain={gate} /> */}
      <ADSR output={env} {...adsrParams} gate={lfoVca}>
        {controls => {
          adsrControlRef.current = controls
        }}
      </ADSR>
      {/* Oscillator for "snap" */}
      <ToneGenerator
        output={osc}
        waveform="square"
        frequency={baseFreq}
        cv={env}
        cvAmount={-1200}
      />
      {/* Noise for "pop" */}
      <NoiseGenerator output={noise} type="white" />
      {/* Mix oscillator and noise */}
      <Mixer inputs={[osc, noise]} output={mixed} levels={[0.5, 0.3]} />
      {/* Filter for retro character */}
      <Filter
        input={mixed}
        output={filtered}
        type="highpass"
        cutoff={100 + 1200 * intensity}
        resonance={0.3}
        cutoffCv={env}
        cutoffCvAmount={-1200}
      />
      <Flanger input={filtered} output={flanger}/>
      {/* VCA for amplitude envelope */}
      <VCA input={flanger} output={vca} cv={env} />
      <Monitor input={vca} />
    </>
  );
}

export function RetroFireRack(props) {
  return (
    <AudioProvider>
      <RetroFire {...props} />
    </AudioProvider>
  );
}
