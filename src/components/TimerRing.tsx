import { MODE_META, fmtClock, type Mode } from "../lib/types";
import { IconPause, IconPlay, IconReset, IconSkip } from "./icons";

interface Props {
  mode: Mode;
  running: boolean;
  remainingMs: number;
  totalMs: number;
  cycle: number;
  longEvery: number;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
}

const R = 136;
const C = 2 * Math.PI * R;

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
  const major = i % 5 === 0;
  const r1 = major ? 151 : 155;
  const r2 = 161;
  return {
    x1: 180 + r1 * Math.cos(a),
    y1: 180 + r1 * Math.sin(a),
    x2: 180 + r2 * Math.cos(a),
    y2: 180 + r2 * Math.sin(a),
    major,
  };
});

export function TimerRing({
  mode,
  running,
  remainingMs,
  totalMs,
  cycle,
  longEvery,
  onToggle,
  onReset,
  onSkip,
}: Props) {
  const meta = MODE_META[mode];
  const progress = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  const started = running || remainingMs < totalMs;
  const canReset = started;

  const status = running ? "em andamento" : started ? "pausado" : "pronto para começar";

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-[min(80vw,380px)] aspect-square reveal" style={{ animationDelay: "120ms" }}>
        {/* anel tracejado girando ao fundo */}
        <div
          className={`spin-slower absolute inset-[-26px] rounded-full border border-dashed transition-colors duration-700 ${
            running ? "border-white/15" : "border-white/[0.06]"
          }`}
        />

        <svg viewBox="0 0 360 360" className="h-full w-full">
          {/* trilho */}
          <circle cx="180" cy="180" r={R} fill="none" stroke="rgba(243,236,227,0.08)" strokeWidth="10" />
          {/* brilho sob o arco */}
          <circle
            cx="180"
            cy="180"
            r={R}
            fill="none"
            stroke={meta.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            transform="rotate(-90 180 180)"
            opacity="0.35"
            style={{ filter: "blur(9px)", transition: "stroke-dashoffset 0.35s linear, stroke 0.7s" }}
          />
          {/* arco de progresso */}
          <circle
            cx="180"
            cy="180"
            r={R}
            fill="none"
            stroke={meta.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            transform="rotate(-90 180 180)"
            style={{ transition: "stroke-dashoffset 0.35s linear, stroke 0.7s" }}
          />
          {/* marcações de relógio */}
          {TICKS.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.major ? "rgba(243,236,227,0.25)" : "rgba(243,236,227,0.09)"}
              strokeWidth={t.major ? 2 : 1}
              strokeLinecap="round"
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span
            className="flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{
              color: meta.color,
              borderColor: `${meta.color}44`,
              backgroundColor: `${meta.color}14`,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
            {meta.label}
          </span>

          <span className="font-mono text-[clamp(3.4rem,13vw,4.6rem)] font-semibold leading-none tracking-tight tabular-nums">
            {fmtClock(remainingMs)}
          </span>

          <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted">
            <span
              className={`h-1.5 w-1.5 rounded-full ${running ? "pulse-soft" : ""}`}
              style={{
                backgroundColor: running ? meta.color : started ? "#e5b061" : "rgba(243,236,227,0.3)",
              }}
            />
            {status}
          </span>
        </div>
      </div>

      {/* controles */}
      <div className="flex items-center gap-4 reveal" style={{ animationDelay: "220ms" }}>
        <button
          onClick={onReset}
          disabled={!canReset}
          title="Reiniciar sessão (R)"
          aria-label="Reiniciar sessão"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-muted transition-all duration-200 hover:border-white/30 hover:text-ink active:scale-90 disabled:pointer-events-none disabled:opacity-30"
        >
          <IconReset width={19} height={19} />
        </button>

        <button
          onClick={onToggle}
          className="group flex h-16 items-center gap-3 rounded-full pl-7 pr-8 font-display text-lg font-bold tracking-tight transition-all duration-300 hover:brightness-110 active:scale-95"
          style={{
            backgroundColor: meta.color,
            color: "#21130d",
            boxShadow: `0 10px 40px -10px ${meta.color}99`,
          }}
        >
          {running ? (
            <>
              <IconPause width={20} height={20} />
              Pausar
            </>
          ) : (
            <>
              <IconPlay width={20} height={20} className="translate-x-[1px]" />
              {started ? "Continuar" : "Iniciar"}
            </>
          )}
        </button>

        <button
          onClick={onSkip}
          title="Pular para a próxima sessão"
          aria-label="Pular sessão"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-muted transition-all duration-200 hover:border-white/30 hover:text-ink active:scale-90"
        >
          <IconSkip width={19} height={19} />
        </button>
      </div>

      {/* ritmo do ciclo */}
      <div className="flex items-center gap-3 reveal" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center gap-2">
          {Array.from({ length: longEvery }, (_, i) => {
            const filled = i < cycle;
            return (
              <span
                key={`${longEvery}-${i}-${filled ? "f" : "e"}`}
                className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 ${filled ? "dot-pop" : ""}`}
                style={{
                  backgroundColor: filled ? meta.color : "rgba(243,236,227,0.14)",
                  boxShadow: filled ? `0 0 10px ${meta.color}66` : "none",
                }}
              />
            );
          })}
        </div>
        <span className="font-mono text-xs tabular-nums text-muted">
          {cycle}/{longEvery} até a pausa longa
        </span>
      </div>
    </div>
  );
}
