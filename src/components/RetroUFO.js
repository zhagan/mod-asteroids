import React, { useEffect, useMemo, useRef } from 'react';
import {
    AudioProvider,
    useModStream,
    NoiseGenerator,
    VCA,
    Filter,
    Mixer,
    Monitor, Clock, Sequencer, ToneGenerator,
} from '@mode-7/mod';

// RetroCollision: short, impactful, retro collision sound
export function RetroUFO({ trigger, intensity = 1 }) {
  const vca = useModStream();
  const vca1 = useModStream();
  const oscOut = useModStream();
  const pitchOut = useModStream();
  const clockOut = useModStream();
  const gateOut = useModStream();
  const clockRef = useRef();
  const [gate, setGate] = React.useState(0);

  useEffect(() => {
    if (trigger === 1 && clockRef.current) {
      setGate(0.3)
      clockRef.current.start()
    } else if (trigger === 0 && clockRef.current) {
        setGate(0)
      clockRef.current.stop()
    }
  }, [trigger])


  return (
    <>
      <Clock output={clockOut}
             bpm={140}>
          {controls => {
              clockRef.current = controls;
              return null;
          }}
      </Clock>
      <Sequencer
          clock={clockOut}
          output={pitchOut}
          gateOutput={gateOut}
          numSteps={16}
          steps={[
            {active: true, value: 0},
            {active: true, value: 3},
            {active: true, value: 0},
            {active: true, value: 3, slide: true},
            {active: false, value: 2},
            {active: true, value: 0},
            {active: true, value: 3},
            {active: true, value: 2},
            {active: true, value: 0},
            {active: true, value: 3},
            {active: false, value: 0},
            {active: true, value: 3},
            {active: false, value: 2},
            {active: true, value: 0},
            {active: true, value: 3},
            {active: true, value: 2},
         ]}
      />
      <ToneGenerator output={oscOut} frequency={110} cv={pitchOut} cvAmount={100} waveform="sawtooth"/>
      <VCA input={oscOut} output={vca} cv={gateOut}/>
      <VCA input={vca} output={vca1} gain={gate} />
      <Monitor input={vca1} />
    </>
  );
}

export function RetroUFORack(props) {
  return (
    <AudioProvider>
      <RetroUFO {...props} />
    </AudioProvider>
  );
}
