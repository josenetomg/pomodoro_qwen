import { useEffect, useState, type CSSProperties } from "react";
import { usePomodoro } from "./hooks/usePomodoro";
import { MODE_META, MODE_ORDER, type Mode } from "./lib/types";
import { TimerRing } from "./components/TimerRing";
import { StatsPanel } from "./components/StatsPanel";
import { SettingsDrawer } from "./components/SettingsDrawer";
import {
  IconGear,
  IconVolume,
  IconVolumeOff,
  TomatoMark,
} from "./components/icons";

function Ambient({ running }: { running: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, #271c12 0%, #14100d 55%, #0e0b09 100%)",
        }}
      />
      {/* brilho que respira e troca de cor com o modo */}
      <div className="absolute left-[42%] top-[44%] h-[46rem] w-[46rem] max-w-none -translate-x-1/2 -translate-y-1/2 lg:left-[34%]">
        <div className={`h-full w-full ${running ? "breathe" : ""}`}>
          <div
            className="h-full w-full rounded-full opacity-[0.13] blur-[110px] transition-colors duration-1000"
            style={{ backgroundColor: "var(--accent)" }}
          />
        </div>
      </div>
      <div className="absolute -bottom-44 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#4a2c16] opacity-40 blur-[120px]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(10,7,5,0.55) 100%)",
        }}
      />
      <div className="grain absolute inset-0 opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}

function ModeTabs({ mode, onSelect }: { mode: Mode; onSelect: (m: Mode) => void }) {
  const idx = MODE_ORDER.indexOf(mode);
  return (
    <div className="relative grid w-full max-w-md grid-cols-3 rounded-full border border-white/[0.08] bg-white/[0.04] p-1 reveal" style={{ animationDelay: "60ms" }}>
      <span
        aria-hidden
        className="absolute bottom-1 top-1 rounded-full transition-all duration-300 ease-out"
        style={{
          left: 4,
          width: "calc((100% - 8px) / 3)",
          transform: `translateX(${idx * 100}%)`,
          backgroundColor: `${MODE_META[mode].color}1c`,
          border: `1px solid ${MODE_META[mode].color}55`,
          boxShadow: `0 0 24px ${MODE_META[mode].color}22`,
        }}
      />
      {MODE_ORDER.map((m) => (
        <button
          key={m}
          onClick={() => onSelect(m)}
          className={`relative z-10 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors duration-200 ${
            m === mode ? "text-ink" : "text-muted hover:text-ink"
          }`}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: MODE_META[m].color }}
          />
          {MODE_META[m].label}
        </button>
      ))}
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-white/15 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-ink/80">
      {children}
    </kbd>
  );
}

export default function App() {
  const p = usePomodoro();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const accent = MODE_META[p.mode].color;
  const { toggle, reset } = p;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      } else if (e.code === "KeyR") {
        reset();
      } else if (e.code === "Escape") {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, reset]);

  const rawDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const dateLong = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const toastColor =
    p.toast && p.toast.tone !== "goal"
      ? MODE_META[p.toast.tone].color
      : "#e5b061";

  return (
    <div
      className="relative min-h-screen font-body text-ink"
      style={{ "--accent": accent } as CSSProperties}
    >
      <Ambient running={p.running} />

      {/* ---------- cabeçalho ---------- */}
      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <TomatoMark size={30} />
            <div>
              <p className="font-display text-xl font-extrabold leading-none tracking-tight">
                tomate
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-muted">
                pomodoro de bolso
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-2 hidden text-sm text-muted md:block">{dateLong}</span>
            <button
              onClick={() => p.updateSettings({ sound: !p.settings.sound })}
              title={p.settings.sound ? "Desativar som" : "Ativar som"}
              aria-label="Alternar som"
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 active:scale-90 ${
                p.settings.sound
                  ? "border-white/15 text-ink hover:border-white/35"
                  : "border-white/[0.07] text-muted hover:text-ink"
              }`}
            >
              {p.settings.sound ? (
                <IconVolume width={18} height={18} />
              ) : (
                <IconVolumeOff width={18} height={18} />
              )}
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              title="Ajustes"
              aria-label="Abrir ajustes"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-all duration-200 hover:border-white/35 active:scale-90"
            >
              <IconGear width={18} height={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ---------- conteúdo ---------- */}
      <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pt-12">
        <section className="flex flex-col items-center gap-7">
          <div className="flex w-full items-center justify-between reveal">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              sessão de hoje
            </span>
            <span
              className="rounded-full border px-3 py-1 font-mono text-xs tabular-nums transition-colors duration-500"
              style={{
                borderColor: `${accent}44`,
                color: accent,
                backgroundColor: `${accent}12`,
              }}
            >
              {p.today.pomodoros} {p.today.pomodoros === 1 ? "pomo" : "pomos"} fechados
            </span>
          </div>

          <ModeTabs mode={p.mode} onSelect={p.switchMode} />

          <p className="-mt-3 text-sm text-muted reveal" style={{ animationDelay: "90ms" }}>
            {MODE_META[p.mode].tagline}
          </p>

          <TimerRing
            mode={p.mode}
            running={p.running}
            remainingMs={p.remainingMs}
            totalMs={p.totalMs}
            cycle={p.cycle}
            longEvery={p.settings.longEvery}
            onToggle={p.toggle}
            onReset={p.reset}
            onSkip={p.skip}
          />

          <p className="hidden items-center gap-2 text-xs text-muted sm:flex reveal" style={{ animationDelay: "380ms" }}>
            <Kbd>espaço</Kbd> iniciar / pausar
            <span className="mx-1 text-white/20">·</span>
            <Kbd>R</Kbd> reiniciar
          </p>
        </section>

        <StatsPanel
          today={p.today}
          stats={p.stats}
          liveFocusSeconds={p.liveFocusSeconds}
          dailyGoal={p.settings.dailyGoal}
          mode={p.mode}
          onResetToday={p.resetToday}
        />
      </main>

      {/* ---------- toast ---------- */}
      {p.toast && (
        <div
          key={p.toast.id}
          role="status"
          className="toast-rise fixed bottom-6 left-1/2 z-[60] flex items-center gap-3 rounded-xl border border-white/10 bg-[#241a13]/95 py-3 pl-4 pr-5 shadow-2xl"
          style={{ borderLeft: `3px solid ${toastColor}` }}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: toastColor, boxShadow: `0 0 12px ${toastColor}` }}
          />
          <p className="text-sm font-medium">{p.toast.message}</p>
        </div>
      )}

      <SettingsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        settings={p.settings}
        onUpdate={p.updateSettings}
        onRestore={p.restoreDefaults}
      />
    </div>
  );
}
