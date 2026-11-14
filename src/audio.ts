let context: AudioContext | null = null;

// One context lets the desktop button unlock golf and decorative sounds together.
export function unlockAudio() {
  try {
    context ??= new AudioContext();
    void context.resume().catch(() => {});
    return context;
  } catch {
    return null;
  }
}

function noise(audio: AudioContext, duration: number) {
  const source = audio.createBufferSource();
  const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * duration), audio.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  source.buffer = buffer;
  return source;
}

export function playClick() {
  const audio = unlockAudio();
  if (!audio) return;
  const now = audio.currentTime;
  const source = noise(audio, 0.085);
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 850;
  filter.Q.value = 0.8;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
  source.connect(filter).connect(gain).connect(audio.destination);
  source.start(now);
  // A brief low wooden resonance adds body without a bright electronic ping.
  const body = audio.createOscillator();
  body.type = "triangle";
  body.frequency.setValueAtTime(190, now);
  body.frequency.exponentialRampToValueAtTime(95, now + 0.055);
  const bodyGain = audio.createGain();
  bodyGain.gain.setValueAtTime(0.24, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
  body.connect(bodyGain).connect(audio.destination);
  body.start(now);
  body.stop(now + 0.07);
}

export function playPop() {
  const audio = unlockAudio();
  if (!audio) return;
  const now = audio.currentTime;
  const pop = noise(audio, 0.1);
  const impact = audio.createGain();
  impact.gain.setValueAtTime(0.32, now);
  impact.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  pop.connect(impact).connect(audio.destination);
  pop.start(now);
}
