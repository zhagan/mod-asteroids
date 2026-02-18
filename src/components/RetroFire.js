import React, {useEffect, useMemo, useState} from 'react';
import {
    AudioProvider,
    useModStream,
    ToneGenerator,
    NoiseGenerator,
    VCA,
    Filter,
    Mixer,
    Monitor,
    ADSR, LFO, Flanger,
} from '@mode-7/mod';

// RetroFire: short, punchy, retro gunshot effect
export function RetroFire({ trigger, intensity = 1 }) {
  const osc = useModStream();
  const noise = useModStream();
  const mixed = useModStream();
  const filtered = useModStream();
  const vca = useModStream();
  const env = useModStream();
  const lfo = useModStream();
  const lfoVca = useModStream();
  const flanger = useModStream();

  const [gate, setGate] = useState(0);
  const adsrParams = useMemo(() => ({
    attack: 0.005,
    decay: 0.08 + 0.04 * (1 - intensity),
    sustain: 0.0,
    release: 0.01,
  }), [intensity]);

  useEffect(() => {
    console.log('trigger', trigger)
    setGate(trigger ? 1 : 0)
  }, [trigger])
  // Pitch envelope for oscillator (optional)
  const baseFreq = useMemo(() => 320 + 180 * intensity, [intensity]);
  const oscPitchMod = useMemo(() => 80 + 60 * intensity, [intensity]);

  return (
    <>
      {/* Envelope for amplitude */}
      <LFO output={lfo} frequency={10} waveform="sawtooth" direction="down" />
      <VCA input={lfo} output={lfoVca} gain={gate} />
      <ADSR output={env} {...adsrParams} gate={lfoVca} />
      {/* Oscillator for "snap" */}
      <ToneGenerator
        output={osc}
        waveform="triangle"
        frequency={baseFreq}
        cv={env}
        cvAmount={oscPitchMod}
      />
      {/* Noise for "pop" */}
      <NoiseGenerator output={noise} type="white" />
      {/* Mix oscillator and noise */}
      <Mixer inputs={[osc, noise]} output={mixed} levels={[0.9, 0.4]} />
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
