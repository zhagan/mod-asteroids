import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AudioProvider,
  useModStream,
  Monitor,
  MidiPlayer,
  Fluidsynth,
} from '@mode-7/mod';
import { Midi } from '@tonejs/midi';

// RetroCollision: short, impactful, retro collision sound
export function RetroMidi({
  trigger,
  intensity = 1,
  enabled = true,
  onMetadataChange,
  onMidiUrlChange,
  onHeaderTitleChange,
}) {
  const midi = useModStream();
  const fluidsynth = useModStream();
  const controlsRef = useRef();
  const initialRandomMidi = `/uploads/${Math.floor(Math.random() * 1000)}.mid`;
  const [midiLink] = useState(`https://bitmidi.com${initialRandomMidi}`);
  const [soundFontUrl, setSoundFontUrl] = useState('');
  const midiUrl = useMemo(() => midiLink, [midiLink]);
  const baseAssetsUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.location.origin;
  }, []);
  const wasmBaseUrl = useMemo(() => {
    if (!baseAssetsUrl) return '/js-synthesizer/';
    return `${baseAssetsUrl}/js-synthesizer/`;
  }, [baseAssetsUrl]);
  const desiredSoundFontUrl = useMemo(() => {
    if (!baseAssetsUrl) return '/sf2/microgm.sf2';
    return `${baseAssetsUrl}/sf2/microgm.sf2`;
  }, [baseAssetsUrl]);

  const metadataRef = useRef(null);
  const handleControlsReady = (controls) => {
    controlsRef.current = controls;
    const metadata = controls.metadata ?? null;
    if (!onMetadataChange) return;
    if (metadataRef.current === metadata) return;
    metadataRef.current = metadata;
    onMetadataChange(metadata);
  };
  useEffect(() => {
    if (!desiredSoundFontUrl) return;
    if (typeof document === 'undefined') {
      setSoundFontUrl(desiredSoundFontUrl);
      return;
    }
    if (document.readyState === 'complete') {
      setSoundFontUrl(desiredSoundFontUrl);
      return;
    }
    const handleLoad = () => setSoundFontUrl(desiredSoundFontUrl);
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, [desiredSoundFontUrl]);

  useEffect(() => {
    if (!trigger || !controlsRef.current) {
      return;
    }
    controlsRef.current.setMidiUrl(midiUrl);
    controlsRef.current.play();
  }, [trigger, midiUrl]);

  useEffect(() => {
    onMidiUrlChange?.(midiLink);
  }, [midiLink, onMidiUrlChange]);

  useEffect(() => {
    if (!midiLink) {
      onHeaderTitleChange?.(null);
      return;
    }
    const controller = new AbortController();
    let cancelled = false;
    const fetchHeaderTitle = async () => {
      try {
        const response = await fetch(midiLink, { signal: controller.signal });
        if (!response.ok || cancelled) {
          onHeaderTitleChange?.(null);
          return;
        }
        const buffer = await response.arrayBuffer();
        if (cancelled) return;
        const midiFile = new Midi(buffer);
        let title = midiFile.header?.name?.trim() || '';
        if (!title) {
          for (const track of midiFile.tracks) {
            const trackName = track.name?.trim();
            if (trackName) {
              title = trackName;
              break;
            }
            const metaEvent = track.events?.find((event) =>
              ["trackName", "sequenceTrackName", "text", "lyrics", "marker"].includes(event.type) &&
              typeof event?.text === "string" &&
              event.text.trim()
            );
            if (metaEvent?.text?.trim()) {
              title = metaEvent.text.trim();
              break;
            }
          }
        }
        if (!cancelled) {
          onHeaderTitleChange?.(title || null);
        }
      } catch {
        onHeaderTitleChange?.(null);
      }
    };
    fetchHeaderTitle();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [midiLink, onHeaderTitleChange]);

  if (!enabled) return null;

  return (
    <>
      <MidiPlayer output={midi} midiUrl={midiUrl}>
        {(controls) => {
          handleControlsReady(controls);
          return null;
        }}
      </MidiPlayer>
      <Fluidsynth
        midiInput={midi}
        output={fluidsynth}
        soundFontUrl={soundFontUrl}
        wasmBaseUrl={wasmBaseUrl}
        keepSoundFontinSketch={false}
      />
      <Monitor input={fluidsynth} />
    </>
  );
}

export function RetroMidiRack(props) {
  return (
    <AudioProvider>
      <RetroMidi {...props} />
    </AudioProvider>
  );
}
