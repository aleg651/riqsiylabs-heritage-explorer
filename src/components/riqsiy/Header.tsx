import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-riqsiy.png";
import { useProgreso } from "@/lib/progress";
import { AUTOR } from "@/lib/riqsiy-gamification";

const NAV = [
  { to: "/descubre", label: "Descubre" },
  { to: "/machu-muqu-3d", label: "Machu Muqu 3D" },

  { to: "/mira-mas-alla", label: "Mira más allá" },
  { to: "/juegos", label: "Minijuegos" },
  { to: "/escanea", label: "Escanea" },
  { to: "/mapa", label: "Mapa" },
  { to: "/antes-y-despues", label: "Antes y ahora" },
  { to: "/historias", label: "Historias" },
  { to: "/compromiso", label: "Mi compromiso" },
  { to: "/recompensas", label: "Recompensas" },
  { to: "/test", label: "Test" },
  { to: "/investigacion", label: "Investigación" },
  { to: "/fencyt", label: "FENCYT" },
  { to: "/progreso", label: "Mi progreso" },
] as const;

export function Header() {
  const [abierto, setAbierto] = useState(false);
  const { coins, nivel, hidratado } = useProgreso();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2" onClick={() => setAbierto(false)}>
          <img src={logo} alt="Logo RIQSIY" width={40} height={40} className="h-9 w-9" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-[0.18em] text-primary">RIQSIY</span>
            <span className="hidden text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:block">
              Autor: {AUTOR}
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden flex-wrap items-center justify-end gap-1 xl:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-3">
          <span className="hidden rounded-full border border-border px-3 py-1 text-xs font-medium sm:inline-flex">
            {hidratado ? `${nivel.actual.icono} ${nivel.actual.nombre}` : "👀 Curioso"}
          </span>
          <span className="rounded-full border border-accent/50 bg-accent/15 px-3 py-1 text-xs font-semibold text-foreground">
            🟡 {hidratado ? coins : 0}
          </span>
        </div>

        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setAbierto((v) => !v)}
          className="rounded-md border border-border p-2 xl:hidden"
        >
          {abierto ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {abierto && (
        <nav className="grid gap-1 border-t border-border bg-background px-4 py-3 xl:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setAbierto(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
