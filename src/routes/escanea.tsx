import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { QrCode, ScanLine } from "lucide-react";
import { SITIOS } from "@/lib/riqsiy-data";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";

export const Route = createFileRoute("/escanea")({
  head: () => ({
    meta: [
      { title: "Escanea y descubre — Códigos QR del patrimonio | RIQSIY" },
      {
        name: "description",
        content:
          "Cada sitio arqueológico tiene su código QR: al escanearlo se abre su historia, una curiosidad, un reto y una reflexión.",
      },
      { property: "og:title", content: "Escanea y descubre | RIQSIY" },
      {
        property: "og:description",
        content: "QR → Centro arqueológico → Historia → Curiosidad → Reto → Reflexión.",
      },
    ],
  }),
  component: Escanea,
});

function qrUrl(slug: string) {
  const destino = `https://riqsiy.app/descubre/${slug}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(destino)}`;
}

function Escanea() {
  const navigate = useNavigate();
  const [simulando, setSimulando] = useState<string | null>(null);

  const simular = (slug: string) => {
    setSimulando(slug);
    setTimeout(() => navigate({ to: "/descubre/$slug", params: { slug } }), 900);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SectionTitle
        eyebrow="En el lugar"
        title="Escanea y descubre"
        description="Los códigos se colocan en paneles junto a cada sitio. Al escanearlos, el estudiante recibe la ruta completa: historia → curiosidad → reto → reflexión."
      />

      <div className="surface-deep mt-8 flex flex-wrap items-center gap-4 rounded-lg p-6 text-sm">
        <ScanLine className="h-6 w-6 text-gold-soft" />
        <p className="max-w-2xl opacity-85">
          ¿No estás en el sitio? Usa el botón “Simular escaneo” para demostrar el flujo completo durante la
          feria científica.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SITIOS.map((s) => (
          <div key={s.slug} className="shadow-stone rounded-lg border border-border bg-card p-5 text-center">
            <img
              src={qrUrl(s.slug)}
              alt={`Código QR de ${s.nombre}`}
              loading="lazy"
              width={240}
              height={240}
              className="mx-auto h-40 w-40 rounded-md border border-border bg-background p-2"
            />
            <h3 className="mt-4 font-display text-lg">{s.nombre}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Historia · Curiosidad · Reto · Reflexión
            </p>
            <button
              type="button"
              onClick={() => simular(s.slug)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <QrCode className="h-4 w-4" />
              {simulando === s.slug ? "Leyendo código..." : "Simular escaneo"}
            </button>
            <Link
              to="/descubre/$slug"
              params={{ slug: s.slug }}
              className="mt-2 inline-block text-xs text-muted-foreground underline underline-offset-4"
            >
              Abrir sin escanear
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
