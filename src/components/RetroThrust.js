import React, {useEffect, useMemo, useState} from 'react'
import {
    AudioProvider,
    useModStream,
    LFO,
    ToneGenerator,
    NoiseGenerator,
    VCA,
    Filter,
    // Drive,
    Mixer,
    Monitor,
} from '@mode-7/mod'

export function RetroThrust({ active, intensity }) {
  const lfoSlow = useModStream()
  const lfoFast = useModStream()
  // const lfoFastDn = useModStream()
  const saw = useModStream()
  const hiss = useModStream()
  const mixed = useModStream()
  const vca = useModStream()
  // const vca1 = useModStream()
  const filtered = useModStream()
  // const driven = useModStream()
  // const out = useModStream()

  const [gate, setGate] = useState(0)
  // const [speed, setSpeed] = useState(0)

  const lfoCutoffAmt = useMemo(() => 350 + 250 * intensity, [intensity])
  // const driveAmt = useMemo(() => 0.22 + 0.18 * intensity, [intensity])
  // const gainAmt = useMemo(() => 0.28 + 0.12 * intensity, [intensity])
  useEffect(() => {
    setGate(active ? 1 : 0)
  }, [active])
  
  return (
    <>
      <LFO output={lfoSlow} frequency={0.8} waveform="triangle" />
      <LFO output={lfoFast} frequency={18} waveform="sampleHold" direction="down" />
      <ToneGenerator
        output={saw}
        waveform="sawtooth"
        frequency={110 * Math.pow(2, intensity * 2)}
        cv={lfoFast}
        cvAmount={25}
      />
      <NoiseGenerator output={hiss} type="white" />
      <Mixer
        inputs={[saw, hiss]}
        output={mixed}
        levels={[0.4, 0.35]}
      />
      <Filter
        input={mixed}
        output={filtered}
        type="bandpass"
        cutoff={350 * Math.pow(2, intensity * 4)}
        resonance={0.6}
        cutoffCv={lfoSlow}
        cutoffCvAmount={lfoCutoffAmt}
      />
      {/*<Drive input={filtered} output={driven} amount={driveAmt} />*/}
      {/*<VCA input={filtered} output={vca} cv={lfoFastDn} />*/}
      <VCA input={filtered} output={vca} gain={gate} />
      <Monitor input={vca} />
    </>
  )
}

export function ThrustRack(props) {
  return (
    <AudioProvider>
      <RetroThrust {...props} />
    </AudioProvider>
  )
}
