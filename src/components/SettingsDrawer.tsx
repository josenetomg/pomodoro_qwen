import {
  LIMITS,
  MODE_META,
  type Mode,
  type Settings,
} from "../lib/types";
import { IconMinus, IconPlus, IconX } from "./icons";

interface Props {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdate: (patch: Partial<Settings>) => void;
  onRestore: () => void;
}

function Stepper({
  label,
  hint,
  dotColor,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  hint?: string;
  dotColor?: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const btn =
    "flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-muted transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-90 disabled:pointer-events-none disabled:opacity-25";
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-white/[0.03] px-4 py-3 transition-colors hover:border-white/[0.14]">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[15px] font-medium">
          {dotColor && <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: dotColor }} />}
          {label}
        </p>
        {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Diminuir ${label}`}>
          <IconMinus width={14} height={14} />
        </button>
        <span className="w-16 text-center font-mono text-lg font-semibold tabular-nums">
          {value}
          <span className="ml-1 text-[11px] font-normal text-muted">{unit}</span>
        </span>
        <button className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Aumentar ${label}`}>
          <IconPlus width={14} height={14} />
        </button>
      </div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  on,
  onToggle,
}: {
  label: string;
  hint: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 rounded-lg border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-left transition-colors hover:border-white/[0.14]"
    >
      <div>
        <p className="text-[15px] font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-muted">{hint}</p>
      </div>
      <span
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300"
        style={{ backgroundColor: on ? "var(--accent)" : "rgba(243,236,227,0.12)" }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-[#f7efe7] shadow transition-all duration-300"
          style={{ left: on ? 22 : 2 }}
        />
      </span>
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted first:mt-0">
      {children}
    </p>
  );
}

export function SettingsDrawer({ open, onClose, settings, onUpdate, onRestore }: Props) {
  const dur = (m: Mode) => ({
    value: settings[m],
    min: LIMITS[m][0],
    max: LIMITS[m][1],
    dot: MODE_META[m].color,
    onChange: (v: number) => onUpdate({ [m]: v } as Partial<Settings>),
  });

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-label="Ajustes do timer"
        className={`fixed right-0 top-0 z-50 flex h-full w-[400px] max-w-[94vw] flex-col border-l border-white/10 bg-[#1b130e] shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">Ajustes</h2>
            <p className="mt-0.5 text-xs text-muted">Salvos automaticamente neste navegador</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar ajustes"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted transition-all hover:border-white/30 hover:text-ink active:scale-90"
          >
            <IconX width={16} height={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <SectionLabel>Durações</SectionLabel>
          <div className="space-y-2.5">
            <Stepper label="Foco" dotColor={MODE_META.focus.color} unit="min" {...dur("focus")} />
            <Stepper label="Pausa curta" dotColor={MODE_META.short.color} unit="min" {...dur("short")} />
            <Stepper label="Pausa longa" dotColor={MODE_META.long.color} unit="min" {...dur("long")} />
          </div>

          <SectionLabel>Ciclo</SectionLabel>
          <div className="space-y-2.5">
            <Stepper
              label="Pausa longa a cada"
              hint="pomodoros até a pausa longa"
              value={settings.longEvery}
              min={LIMITS.longEvery[0]}
              max={LIMITS.longEvery[1]}
              unit="sessões"
              onChange={(v) => onUpdate({ longEvery: v })}
            />
            <Stepper
              label="Meta diária"
              hint="pomodoros que você quer fechar por dia"
              value={settings.dailyGoal}
              min={LIMITS.dailyGoal[0]}
              max={LIMITS.dailyGoal[1]}
              unit="pomos"
              onChange={(v) => onUpdate({ dailyGoal: v })}
            />
          </div>

          <SectionLabel>Comportamento</SectionLabel>
          <div className="space-y-2.5">
            <Toggle
              label="Encadear sessões"
              hint="a próxima sessão começa sozinha após o fim"
              on={settings.autoStart}
              onToggle={() => onUpdate({ autoStart: !settings.autoStart })}
            />
            <Toggle
              label="Som de conclusão"
              hint="um acorde suave ao fechar cada sessão"
              on={settings.sound}
              onToggle={() => onUpdate({ sound: !settings.sound })}
            />
          </div>

          <p className="mt-6 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-muted">
            Com o timer parado, novas durações valem na hora. Durante uma
            sessão, elas entram a partir da próxima.
          </p>
        </div>

        <footer className="border-t border-white/[0.07] px-6 py-4">
          <button
            onClick={onRestore}
            className="w-full rounded-lg border border-white/10 py-2.5 text-sm font-medium text-muted transition-all hover:border-white/25 hover:text-ink active:scale-[0.98]"
          >
            Restaurar padrões (25 / 5 / 15)
          </button>
        </footer>
      </div>
    </>
  );
}
