let ctx: AudioContext | null = null;

export function ensureAudio(): void {
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === "suspended") void ctx.resume();
  } catch {
    /* áudio indisponível — segue em silêncio */
  }
}

function tone(freq: number, at: number, dur: number, vol: number): void {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(vol, at + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

export function playChime(kind: "focus" | "break", enabled: boolean): void {
  if (!enabled) return;
  ensureAudio();
  if (!ctx) return;
  try {
    const t = ctx.currentTime + 0.03;
    if (kind === "focus") {
      tone(523.25, t, 0.5, 0.16);
      tone(659.25, t + 0.16, 0.5, 0.15);
      tone(783.99, t + 0.32, 0.75, 0.13);
    } else {
      tone(659.25, t, 0.45, 0.15);
      tone(493.88, t + 0.18, 0.65, 0.12);
    }
  } catch {
    /* noop */
  }
}
