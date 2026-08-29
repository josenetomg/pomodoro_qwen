import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_SETTINGS,
  MODE_META,
  emptyDay,
  fmtClock,
  todayKey,
  type DayStats,
  type Mode,
  type SessionLog,
  type Settings,
  type StatsStore,
} from "../lib/types";
import { ensureAudio, playChime } from "../lib/sound";

const SETTINGS_KEY = "tomate:settings:v1";
const STATS_KEY = "tomate:stats:v1";

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function loadStats(): StatsStore {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StatsStore;
    const cutoff = todayKey(new Date(Date.now() - 30 * 86_400_000));
    const out: StatsStore = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (k >= cutoff && v && typeof v.focusSeconds === "number") out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export interface ToastMsg {
  id: number;
  message: string;
  tone: Mode | "goal";
}

export function usePomodoro() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [stats, setStats] = useState<StatsStore>(loadStats);
  const [mode, setMode] = useState<Mode>("focus");
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [remainingMs, setRemainingMs] = useState<number>(
    () => loadSettings().focus * 60_000,
  );
  const [toast, setToast] = useState<ToastMsg | null>(null);

  const endsAtRef = useRef(0);
  const settingsRef = useRef(settings);
  const modeRef = useRef(mode);
  const cycleRef = useRef(cycle);
  const runningRef = useRef(running);
  const remainingRef = useRef(remainingMs);
  const completedRef = useRef(false);
  settingsRef.current = settings;
  modeRef.current = mode;
  cycleRef.current = cycle;
  runningRef.current = running;
  remainingRef.current = remainingMs;

  const durMs = useCallback(
    (m: Mode, s?: Settings) => (s ?? settingsRef.current)[m] * 60_000,
    [],
  );

  /* ---------- persistência ---------- */
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      /* noop */
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      /* noop */
    }
  }, [stats]);

  /* ---------- toast ---------- */
  const showToast = useCallback((message: string, tone: ToastMsg["tone"]) => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(id);
  }, [toast]);

  /* ---------- estatísticas ---------- */
  const mergeToday = useCallback(
    (patch: { pomos?: number; secs?: number; log?: SessionLog }) => {
      setStats((prev) => {
        const key = todayKey();
        const day = prev[key] ?? emptyDay(key);
        return {
          ...prev,
          [key]: {
            ...day,
            pomodoros: day.pomodoros + (patch.pomos ?? 0),
            focusSeconds: day.focusSeconds + (patch.secs ?? 0),
            sessions: patch.log ? [...day.sessions, patch.log] : day.sessions,
          },
        };
      });
    },
    [],
  );

  /** Soma o tempo de foco já decorrido (sem contar pomodoro) — usado ao
   * reiniciar, pular ou trocar de modo no meio de uma sessão. */
  const commitPartialFocus = useCallback(() => {
    if (modeRef.current !== "focus") return;
    const elapsed = durMs("focus") - remainingRef.current;
    if (elapsed >= 1000) {
      mergeToday({ secs: Math.floor(elapsed / 1000) });
      // evita contagem dupla em chamadas rápidas consecutivas
      remainingRef.current = durMs("focus");
    }
  }, [durMs, mergeToday]);

  /* ---------- controle do timer ---------- */
  const start = useCallback(() => {
    if (runningRef.current || remainingRef.current <= 0) return;
    ensureAudio();
    completedRef.current = false;
    endsAtRef.current = Date.now() + remainingRef.current;
    setRunning(true);
  }, []);
  const startRef = useRef(start);
  startRef.current = start;

  const pause = useCallback(() => {
    if (!runningRef.current) return;
    setRemainingMs(Math.max(0, endsAtRef.current - Date.now()));
    setRunning(false);
  }, []);

  const toggle = useCallback(() => {
    if (runningRef.current) pause();
    else start();
  }, [pause, start]);

  const reset = useCallback(() => {
    commitPartialFocus();
    setRunning(false);
    setRemainingMs(durMs(modeRef.current));
  }, [commitPartialFocus, durMs]);

  const switchMode = useCallback(
    (m: Mode) => {
      if (m === modeRef.current) return;
      commitPartialFocus();
      setRunning(false);
      setMode(m);
      setRemainingMs(durMs(m));
    },
    [commitPartialFocus, durMs],
  );

  const skip = useCallback(() => {
    commitPartialFocus();
    const s = settingsRef.current;
    const m = modeRef.current;
    let next: Mode;
    if (m === "focus") {
      const c = cycleRef.current + 1;
      const goLong = c >= s.longEvery;
      setCycle(goLong ? 0 : c);
      next = goLong ? "long" : "short";
    } else {
      next = "focus";
    }
    setRunning(false);
    setMode(next);
    setRemainingMs(durMs(next, s));
  }, [commitPartialFocus, durMs]);

  /* ---------- conclusão de sessão ---------- */
  const completeRef = useRef<() => void>(() => {});
  completeRef.current = () => {
    const s = settingsRef.current;
    const m = modeRef.current;
    setRunning(false);
    let next: Mode;
    if (m === "focus") {
      mergeToday({
        pomos: 1,
        secs: s.focus * 60,
        log: { at: Date.now(), mode: "focus", minutes: s.focus },
      });
      playChime("focus", s.sound);
      const c = cycleRef.current + 1;
      const goLong = c >= s.longEvery;
      setCycle(goLong ? 0 : c);
      next = goLong ? "long" : "short";
      showToast(
        goLong
          ? "Ciclo completo! Você merece uma pausa longa."
          : "Pomodoro concluído. Estique as pernas!",
        "focus",
      );
    } else {
      playChime("break", s.sound);
      showToast("Pausa encerrada — de volta ao foco!", m);
      next = "focus";
    }
    setMode(next);
    setRemainingMs(durMs(next, s));
    if (s.autoStart) window.setTimeout(() => startRef.current(), 1200);
  };

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const rem = endsAtRef.current - Date.now();
      if (rem <= 0) {
        if (completedRef.current) return;
        completedRef.current = true;
        setRemainingMs(0);
        remainingRef.current = 0;
        completeRef.current();
      } else {
        setRemainingMs(rem);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [running]);

  /* se o timer está parado, novas durações valem imediatamente */
  useEffect(() => {
    if (!runningRef.current) setRemainingMs(durMs(modeRef.current, settings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.focus, settings.short, settings.long, mode]);

  /* ---------- título da aba ---------- */
  useEffect(() => {
    document.title = running
      ? `${fmtClock(remainingMs)} · ${MODE_META[mode].label} — Tomate`
      : "Tomate · Pomodoro";
  }, [running, remainingMs, mode]);

  /* ---------- meta diária ---------- */
  const bootRef = useRef(true);
  const goalRef = useRef(false);
  useEffect(() => {
    const day = stats[todayKey()];
    const met =
      !!day && settings.dailyGoal > 0 && day.pomodoros >= settings.dailyGoal;
    if (bootRef.current) {
      bootRef.current = false;
      goalRef.current = met;
      return;
    }
    if (met && !goalRef.current) {
      goalRef.current = true;
      playChime("focus", settingsRef.current.sound);
      showToast("Meta diária atingida. Que orgulho!", "goal");
    }
    if (!met) goalRef.current = false;
  }, [stats, settings.dailyGoal, showToast]);

  /* ---------- ajustes ---------- */
  const updateSettings = useCallback(
    (patch: Partial<Settings>) => setSettings((prev) => ({ ...prev, ...patch })),
    [],
  );
  const restoreDefaults = useCallback(
    () => setSettings({ ...DEFAULT_SETTINGS }),
    [],
  );

  const resetToday = useCallback(() => {
    setStats((prev) => ({ ...prev, [todayKey()]: emptyDay(todayKey()) }));
    showToast("Estatísticas de hoje zeradas.", "goal");
  }, [showToast]);

  /* ---------- derivados ---------- */
  const totalMs = settings[mode] * 60_000;
  const today: DayStats = stats[todayKey()] ?? emptyDay(todayKey());
  const liveFocusSeconds =
    today.focusSeconds +
    (mode === "focus"
      ? Math.max(0, Math.floor((durMs("focus") - remainingMs) / 1000))
      : 0);

  return {
    settings,
    stats,
    mode,
    running,
    cycle,
    remainingMs,
    totalMs,
    toast,
    today,
    liveFocusSeconds,
    start,
    pause,
    toggle,
    reset,
    skip,
    switchMode,
    updateSettings,
    restoreDefaults,
    resetToday,
  };
}
