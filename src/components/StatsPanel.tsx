import {
  MODE_META,
  dayKeyOffset,
  fmtHuman,
  fmtTimeOfDay,
  type DayStats,
  type Mode,
  type StatsStore,
} from "../lib/types";
import { IconCheck, IconEraser } from "./icons";

interface Props {
  today: DayStats;
  stats: StatsStore;
  liveFocusSeconds: number;
  dailyGoal: number;
  mode: Mode;
  onResetToday: () => void;
}

const cardCls =
  "rounded-xl border border-white/[0.07] bg-panel/90 p-5 reveal";

function CardTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
        {children}
      </h2>
      {right}
    </div>
  );
}

export function StatsPanel({ today, stats, liveFocusSeconds, dailyGoal, mode, onResetToday }: Props) {
  const accent = MODE_META[mode].color;

  const days = Array.from({ length: 7 }, (_, i) => {
    const key = dayKeyOffset(i - 6);
    const d = stats[key];
    const mins = d ? Math.round(d.focusSeconds / 60) : 0;
    const date = new Date();
    date.setDate(date.getDate() + i - 6);
    const letter = date
      .toLocaleDateString("pt-BR", { weekday: "short" })
      .replace(".", "")
      .charAt(0)
      .toUpperCase();
    return { key, mins, letter, isToday: i === 6 };
  });
  const maxMins = Math.max(1, ...days.map((d) => d.mins));
  const weekTotal = days.reduce((acc, d) => acc + d.mins, 0);

  const goalPct = dailyGoal > 0 ? Math.min(100, (today.pomodoros / dailyGoal) * 100) : 0;
  const goalMet = dailyGoal > 0 && today.pomodoros >= dailyGoal;

  const sessions = [...today.sessions].reverse();

  return (
    <aside className="flex flex-col gap-4">
      {/* ---------- HOJE ---------- */}
      <section className={cardCls} style={{ animationDelay: "180ms" }}>
        <CardTitle
          right={
            <button
              onClick={onResetToday}
              className="flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-[11px] text-muted transition-all hover:border-white/25 hover:text-ink active:scale-95"
              title="Zerar estatísticas de hoje"
            >
              <IconEraser width={12} height={12} />
              zerar
            </button>
          }
        >
          Hoje
        </CardTitle>

        <p className="font-display text-5xl font-extrabold leading-none tracking-tight">
          {fmtHuman(liveFocusSeconds).split(" ")[0]}
          <span className="ml-2 text-xl font-semibold text-muted">
            {fmtHuman(liveFocusSeconds).split(" ").slice(1).join(" ")}
          </span>
        </p>
        <p className="mt-1.5 text-sm text-muted">tempo em foco {liveFocusSeconds > today.focusSeconds ? "· contando agora" : ""}</p>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-5">
          <div>
            <p className="font-mono text-3xl font-semibold tabular-nums leading-none" style={{ color: accent }}>
              {today.pomodoros}
            </p>
            <p className="mt-1.5 text-xs text-muted">pomodoros concluídos</p>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-3xl font-semibold tabular-nums leading-none">
                {Math.round(goalPct)}
                <span className="text-lg text-muted">%</span>
              </p>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${goalPct}%`,
                  backgroundColor: goalMet ? "#e5b061" : accent,
                }}
              />
            </div>
            <p className="mt-1.5 text-xs tabular-nums text-muted">
              meta diária · {today.pomodoros}/{dailyGoal}
            </p>
          </div>
        </div>

        {goalMet && (
          <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-gold/30 bg-gold/10 px-3.5 py-2.5 text-sm font-medium text-gold">
            <IconCheck width={16} height={16} />
            Meta diária concluída — o resto é lucro.
          </div>
        )}
      </section>

      {/* ---------- ÚLTIMOS 7 DIAS ---------- */}
      <section className={cardCls} style={{ animationDelay: "280ms" }}>
        <CardTitle
          right={
            <span className="font-mono text-xs tabular-nums text-muted">
              {weekTotal > 0 ? `${fmtHuman(weekTotal * 60)} no total` : "semana vazia"}
            </span>
          }
        >
          Últimos 7 dias
        </CardTitle>

        <div className="flex items-end gap-2">
          {days.map((d, i) => (
            <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
              <span className={`font-mono text-[10px] tabular-nums ${d.isToday ? "text-ink" : "text-muted/70"}`}>
                {d.mins > 0 ? d.mins : ""}
              </span>
              <div className="flex h-24 w-full items-end overflow-hidden rounded-md bg-white/[0.03]">
                <div
                  className="bar-grow w-full rounded-md transition-colors duration-500"
                  title={`${d.mins} min de foco`}
                  style={{
                    height: `${Math.max(d.mins > 0 ? 8 : 3, (d.mins / maxMins) * 100)}%`,
                    backgroundColor: d.isToday ? accent : "rgba(243,236,227,0.14)",
                    animationDelay: `${350 + i * 60}ms`,
                    boxShadow: d.isToday && d.mins > 0 ? `0 0 16px ${accent}55` : "none",
                  }}
                />
              </div>
              <span className={`text-[11px] ${d.isToday ? "font-semibold text-ink" : "text-muted"}`}>
                {d.letter}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- SESSÕES ---------- */}
      <section className={cardCls} style={{ animationDelay: "360ms" }}>
        <CardTitle
          right={
            <span className="font-mono text-xs tabular-nums text-muted">
              {sessions.length > 0 ? `${sessions.length} registradas` : ""}
            </span>
          }
        >
          Sessões de hoje
        </CardTitle>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-white/10 px-4 py-7 text-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="13" r="8" />
                <path d="M12 9v4l2.5 2.5M9 2h6" />
              </svg>
            </span>
            <p className="text-sm text-muted">Nenhum pomodoro concluído ainda.</p>
            <p className="text-xs text-muted/70">O primeiro é o mais difícil — vai lá.</p>
          </div>
        ) : (
          <ul className="max-h-56 space-y-1 overflow-y-auto pr-1">
            {sessions.map((s, i) => (
              <li
                key={`${s.at}-${i}`}
                className="reveal flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-white/[0.04]"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="font-mono text-xs tabular-nums text-muted">{fmtTimeOfDay(s.at)}</span>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: MODE_META[s.mode].color }} />
                <span className="text-sm font-medium">{MODE_META[s.mode].label}</span>
                <span className="ml-auto font-mono text-xs tabular-nums text-muted">{s.minutes} min</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
