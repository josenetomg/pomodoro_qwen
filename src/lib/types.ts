export type Mode = "focus" | "short" | "long";

export interface Settings {
  focus: number;
  short: number;
  long: number;
  longEvery: number;
  dailyGoal: number;
  autoStart: boolean;
  sound: boolean;
}

export interface SessionLog {
  at: number;
  mode: Mode;
  minutes: number;
}

export interface DayStats {
  date: string;
  pomodoros: number;
  focusSeconds: number;
  sessions: SessionLog[];
}

export type StatsStore = Record<string, DayStats>;

export const DEFAULT_SETTINGS: Settings = {
  focus: 25,
  short: 5,
  long: 15,
  longEvery: 4,
  dailyGoal: 8,
  autoStart: false,
  sound: true,
};

export const MODE_META: Record<
  Mode,
  { label: string; color: string; tagline: string }
> = {
  focus: {
    label: "Foco",
    color: "#ff6b4a",
    tagline: "Trabalho profundo — uma coisa de cada vez",
  },
  short: {
    label: "Pausa curta",
    color: "#5fc98e",
    tagline: "Levante, hidrate, olhe pela janela",
  },
  long: {
    label: "Pausa longa",
    color: "#6ea8e8",
    tagline: "Você mereceu — desligue de verdade",
  },
};

export const MODE_ORDER: Mode[] = ["focus", "short", "long"];

export const LIMITS = {
  focus: [5, 90],
  short: [1, 30],
  long: [5, 60],
  longEvery: [2, 8],
  dailyGoal: [1, 20],
} as const;

export function todayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function dayKeyOffset(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return todayKey(d);
}

export function emptyDay(date: string): DayStats {
  return { date, pomodoros: 0, focusSeconds: 0, sessions: [] };
}

export function fmtClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function fmtHuman(totalSec: number): string {
  if (totalSec <= 0) return "0 min";
  const h = Math.floor(totalSec / 3600);
  const m = Math.round((totalSec % 3600) / 60);
  if (h > 0) return `${h} h ${String(m).padStart(2, "0")} min`;
  if (m > 0) return `${m} min`;
  return `${totalSec} s`;
}

export function fmtTimeOfDay(ts: number): string {
  return new Date(ts).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
