import React, { useEffect } from 'react';
import {
    AudioProvider,
    useModStream,
    ToneGenerator,
    NoiseGenerator,
    VCA,
    Filter,
    Mixer,
    Monitor,
    LFO,
} from '@mode-7/mod';

// RetroCollision: short, impactful, retro collision sound
export function RetroTurn({ trigger, intensity = 1 }) {
  const osc = useModStream();
  const noise = useModStream();
  const filtered1 = useModStream();
  const mixed = useModStream();
  const vca = useModStream();
  const filtered = useModStream();
  const filtered2 = useModStream();

  const lfo = useModStream();
  const [gate, setGate] = React.useState(0);

  useEffect(() => {
    setGate(trigger ? 1 : 0)
  }, [trigger])


  return (
    <>

      <LFO output={lfo} frequency={1.9} waveform="triangle"/>

      <ToneGenerator
        output={osc}
        waveform="square"
        frequency={50}
        cv={lfo}
        cvAmount={20}
      />
      <Filter input={osc} output={filtered} type="highpass" cutoff={220} />

      <NoiseGenerator output={noise} type="white" />
      <Filter input={noise} output={filtered1} type="highpass" cutoff={200} />

      {/* Mix oscillator and noise (more noise for crunch) */}
      <Mixer inputs={[filtered, filtered1]} output={mixed} levels={[0.4, 0.2]} />
      <Filter input={mixed} output={filtered2} type="lowpass" cutoff={2000} />

      <VCA input={filtered2} output={vca} gain={gate} />
      <Monitor input={vca} />
    </>
  );
}

export function RetroTurnRack(props) {
  return (
    <AudioProvider>
      <RetroTurn {...props} />
    </AudioProvider>
  );
}
