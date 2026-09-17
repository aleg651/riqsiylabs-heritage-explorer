import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="surface-deep mt-24">
      <div className="andean-fret h-2 w-full opacity-70" />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl font-semibold tracking-[0.2em]">RIQSIY</p>
          <p className="mt-2 max-w-xs text-sm opacity-80">
            Redescubre lo que siempre estuvo frente a ti. Experiencia educativa e investigación sobre la
            valoración del patrimonio arqueológico cusqueño.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Experiencia</p>
          <ul className="mt-2 space-y-1 opacity-80">
            <li>
              <Link to="/aventura">Aventura RIQSIY</Link>
            </li>
            <li>
              <Link to="/descubre">Descubre</Link>
            </li>
            <li>
              <Link to="/mira-mas-alla">Mira más allá</Link>
            </li>
            <li>
              <Link to="/escanea">Escanea y descubre</Link>
            </li>
            <li>
              <Link to="/mapa">Mapa de nuestro patrimonio</Link>
            </li>
            <li><Link to="/yachay">RIQSIY Yachay</Link></li>
            <li><Link to="/detective">Detective del Patrimonio</Link></li>
            <li><Link to="/yachaq">Yachaq RIQSIY</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Proyecto</p>
          <ul className="mt-2 space-y-1 opacity-80">
            <li>
              <Link to="/por-que">¿Por qué existe RIQSIY?</Link>
            </li>
            <li>
              <Link to="/investigacion">Nuestra investigación</Link>
            </li>
            <li>
              <Link to="/evidencia-campo">Evidencia de campo</Link>
            </li>
            <li>
              <Link to="/progreso">Mi progreso</Link>
            </li>
            <li><Link to="/pasaporte">Pasaporte RIQSIY</Link></li>
            <li><Link to="/modo-jurado">Modo Jurado</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-4 text-center text-xs opacity-60">
        Proyecto escolar de investigación · Cusco, Perú · Datos de ejemplo para demostración
      </p>
    </footer>
  );
}
