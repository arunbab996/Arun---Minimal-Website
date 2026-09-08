/**
 * A short "tick" for navigation clicks — an XMB-style menu blip.
 *
 * Synthesised rather than sampled: a hi-hat-ish click is just a burst of noise
 * shaped by a filter and a fast decay, so there is no audio file to ship, cache
 * or licence. Tuned to match the reference: a 8kHz lowpass, ~0.3 gain, and a
 * very short release, which is what gives it the dry, clicky quality rather
 * than a hiss.
 */

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

// Browsers refuse to start an AudioContext outside a user gesture, so this is
// called from the click handler rather than on mount.
function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();

    // One noise buffer, generated once and re-used for every click.
    const length = Math.floor(ctx.sampleRate * 0.08);
    noise = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  }
  // Safari suspends the context when the tab loses focus.
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function playClick(volume = 0.3) {
  const ac = ensureContext();
  if (!ac || !noise) return;

  const t = ac.currentTime;
  const src = ac.createBufferSource();
  src.buffer = noise;

  // Highpass sets the pitch of the tick — below this it reads as a thud.
  const hp = ac.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 3200;

  // Lowpass matches the reference's 8kHz ceiling, taking the harsh top off.
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 8000;

  // Instant attack, then a fast exponential decay. exponentialRamp cannot
  // reach zero, hence the small floor before the hard stop.
  const gain = ac.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

  src.connect(hp).connect(lp).connect(gain).connect(ac.destination);
  src.start(t);
  src.stop(t + 0.08);
}
