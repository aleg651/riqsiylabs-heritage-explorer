import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, Lightformer, Sky } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { alturaTerreno, PUNTOS_3D } from "@/lib/machu-muqu-3d";

/* ------------------------------- utilidades ------------------------------- */

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

interface Control {
  /** Movimiento normalizado: x = lateral, y = adelante. */
  move: { x: number; y: number };
  yaw: number;
  pitch: number;
}

const TAM = 80; // lado del terreno en metros

/** Pendiente aproximada del terreno en un punto (0 = plano, 1 = muy inclinado). */
function pendiente(x: number, z: number) {
  const d = 0.6;
  const dx = alturaTerreno(x + d, z) - alturaTerreno(x - d, z);
  const dz = alturaTerreno(x, z + d) - alturaTerreno(x, z - d);
  return Math.min(1, Math.hypot(dx, dz) / (2 * d));
}

/** Textura procedural de suelo: granos de tierra, piedrecillas y manchas de pasto. */
function texturaSuelo(repeticiones: number) {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#8f7f57";
  ctx.fillRect(0, 0, 512, 512);
  const rand = rng(991);
  // manchas amplias
  for (let i = 0; i < 400; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const r = 12 + rand() * 60;
    const tono = rand();
    ctx.fillStyle =
      tono > 0.66
        ? `rgba(120,116,74,${0.10 + rand() * 0.18})`
        : tono > 0.33
          ? `rgba(160,142,96,${0.10 + rand() * 0.18})`
          : `rgba(96,84,58,${0.10 + rand() * 0.2})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // grano fino y piedrecillas
  for (let i = 0; i < 9000; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const s = rand() * 2.2;
    const v = 60 + Math.floor(rand() * 120);
    ctx.fillStyle = `rgba(${v},${v - 8},${Math.floor(v * 0.72)},${0.18 + rand() * 0.4})`;
    ctx.fillRect(x, y, s, s);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeticiones, repeticiones);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Textura de piedra para muros y rocas. */
function texturaPiedra() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#9a9287";
  ctx.fillRect(0, 0, 256, 256);
  const rand = rng(4242);
  for (let i = 0; i < 2600; i++) {
    const x = rand() * 256;
    const y = rand() * 256;
    const s = 1 + rand() * 5;
    const v = 110 + Math.floor(rand() * 90);
    ctx.fillStyle = `rgba(${v},${v - 4},${v - 14},${0.16 + rand() * 0.4})`;
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
  }
  // líquenes verdosos observados en el registro
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = `rgba(122,138,86,${0.12 + rand() * 0.22})`;
    ctx.beginPath();
    ctx.arc(rand() * 256, rand() * 256, 3 + rand() * 12, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* -------------------------------- terreno -------------------------------- */

function Terreno({ segmentos, mapa }: { segmentos: number; mapa: THREE.Texture }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(TAM, TAM, segmentos, segmentos);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes["position"] as THREE.BufferAttribute;
    const colores = new Float32Array(p.count * 3);
    const tierra = new THREE.Color("#96825a");
    const pastoSeco = new THREE.Color("#b7a169");
    const roca = new THREE.Color("#8a8377");
    const verde = new THREE.Color("#6d7b46");
    const c = new THREE.Color();
    const rand = rng(555);
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const z = p.getZ(i);
      const y = alturaTerreno(x, z);
      p.setY(i, y);
      const s = pendiente(x, z);
      c.copy(pastoSeco).lerp(tierra, Math.min(1, s * 1.5));
      c.lerp(roca, Math.max(0, s - 0.45) * 1.4);
      // vegetación más viva en el sector alto (z negativo)
      c.lerp(verde, Math.max(0, (-z / TAM + 0.15)) * 0.55);
      const ruido = 0.92 + rand() * 0.16;
      colores[i * 3] = c.r * ruido;
      colores[i * 3 + 1] = c.g * ruido;
      colores[i * 3 + 2] = c.b * ruido;
    }
    g.setAttribute("color", new THREE.BufferAttribute(colores, 3));
    g.computeVertexNormals();
    return g;
  }, [segmentos]);

  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial map={mapa} vertexColors roughness={0.98} metalness={0} />
    </mesh>
  );
}

/** Cerros lejanos que enmarcan el valle (aproximación visual del entorno). */
function CerrosLejanos() {
  const geo = useMemo(() => {
    const rand = rng(77);
    const g = new THREE.BufferGeometry();
    const vert: number[] = [];
    const radio = 150;
    const pasos = 96;
    for (let i = 0; i < pasos; i++) {
      const a0 = (i / pasos) * Math.PI * 2;
      const a1 = ((i + 1) / pasos) * Math.PI * 2;
      const h0 = 16 + Math.sin(a0 * 3) * 8 + rand() * 14;
      const h1 = 16 + Math.sin(a1 * 3) * 8 + rand() * 14;
      const x0 = Math.cos(a0) * radio;
      const z0 = Math.sin(a0) * radio;
      const x1 = Math.cos(a1) * radio;
      const z1 = Math.sin(a1) * radio;
      vert.push(x0, -6, z0, x1, -6, z1, x1, h1, z1);
      vert.push(x0, -6, z0, x1, h1, z1, x0, h0, z0);
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(vert, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geo} frustumCulled={false}>
      <meshStandardMaterial color="#7d8a92" roughness={1} side={THREE.DoubleSide} flatShading />
    </mesh>
  );
}

/** Manchas de pasto seco y arbustos, como los observados en el registro. */
function Vegetacion({ cantidad }: { cantidad: number }) {
  const pasto = useRef<THREE.InstancedMesh>(null);
  const arbustos = useRef<THREE.InstancedMesh>(null);
  const nA = Math.round(cantidad / 5);

  useEffect(() => {
    const rand = rng(7);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const col = new THREE.Color();
    for (let i = 0; i < cantidad; i++) {
      const x = (rand() - 0.5) * TAM * 0.97;
      const z = (rand() - 0.5) * TAM * 0.97;
      const y = alturaTerreno(x, z);
      const s = 0.5 + rand() * 1.1;
      q.setFromEuler(new THREE.Euler((rand() - 0.5) * 0.25, rand() * Math.PI, (rand() - 0.5) * 0.25));
      m.compose(new THREE.Vector3(x, y + 0.3 * s, z), q, new THREE.Vector3(s * 0.8, s * 1.7, s * 0.8));
      pasto.current?.setMatrixAt(i, m);
      col.setHSL(0.11 + rand() * 0.07, 0.35 + rand() * 0.2, 0.36 + rand() * 0.16);
      pasto.current?.setColorAt(i, col);
    }
    if (pasto.current) {
      pasto.current.instanceMatrix.needsUpdate = true;
      if (pasto.current.instanceColor) pasto.current.instanceColor.needsUpdate = true;
    }

    for (let i = 0; i < nA; i++) {
      const x = (rand() - 0.5) * TAM * 0.92;
      const z = (rand() - 0.5) * TAM * 0.92;
      const y = alturaTerreno(x, z);
      const s = 0.7 + rand() * 0.9;
      q.setFromEuler(new THREE.Euler(rand() * 0.4, rand() * Math.PI, rand() * 0.4));
      m.compose(new THREE.Vector3(x, y + 0.34 * s, z), q, new THREE.Vector3(s, s * 0.75, s));
      arbustos.current?.setMatrixAt(i, m);
      col.setHSL(0.22 + rand() * 0.07, 0.25 + rand() * 0.2, 0.2 + rand() * 0.14);
      arbustos.current?.setColorAt(i, col);
    }
    if (arbustos.current) {
      arbustos.current.instanceMatrix.needsUpdate = true;
      if (arbustos.current.instanceColor) arbustos.current.instanceColor.needsUpdate = true;
    }
  }, [cantidad, nA]);

  return (
    <>
      <instancedMesh ref={pasto} args={[undefined, undefined, cantidad]} frustumCulled={false}>
        <coneGeometry args={[0.4, 0.9, 4]} />
        <meshStandardMaterial roughness={1} flatShading />
      </instancedMesh>
      <instancedMesh ref={arbustos} args={[undefined, undefined, nA]} frustumCulled={false} castShadow>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial roughness={1} flatShading />
      </instancedMesh>
    </>
  );
}

/** Rocas sueltas repartidas en la ladera (evidencia observada en superficie). */
function Rocas({ cantidad, mapa }: { cantidad: number; mapa: THREE.Texture }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const rand = rng(313);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const col = new THREE.Color();
    for (let i = 0; i < cantidad; i++) {
      const x = (rand() - 0.5) * TAM * 0.95;
      const z = (rand() - 0.5) * TAM * 0.95;
      const y = alturaTerreno(x, z);
      const s = 0.3 + rand() * 0.9;
      q.setFromEuler(new THREE.Euler(rand() * 3, rand() * 3, rand() * 3));
      m.compose(new THREE.Vector3(x, y + s * 0.32, z), q, new THREE.Vector3(s, s * 0.7, s * 0.9));
      ref.current?.setMatrixAt(i, m);
      col.setHSL(0.09, 0.06 + rand() * 0.06, 0.44 + rand() * 0.18);
      ref.current?.setColorAt(i, col);
    }
    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true;
      if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    }
  }, [cantidad]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, cantidad]} castShadow receiveShadow frustumCulled={false}>
      <dodecahedronGeometry args={[0.55, 1]} />
      <meshStandardMaterial map={mapa} roughness={0.95} flatShading />
    </instancedMesh>
  );
}

/** Árboles altos y delgados (pinos y eucaliptos observados en el video). */
function Arboles({ cantidad }: { cantidad: number }) {
  const troncos = useRef<THREE.InstancedMesh>(null);
  const copas = useRef<THREE.InstancedMesh>(null);
  const copas2 = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const rand = rng(23);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const col = new THREE.Color();
    for (let i = 0; i < cantidad; i++) {
      // los árboles se concentran en el sector alto y en los bordes
      const x = (rand() - 0.5) * TAM * 0.94;
      const z = -TAM * 0.5 + rand() * TAM * 0.62;
      const y = alturaTerreno(x, z);
      const h = 5 + rand() * 5;
      const giro = rand() * Math.PI;
      q.setFromEuler(new THREE.Euler((rand() - 0.5) * 0.06, giro, (rand() - 0.5) * 0.06));
      m.compose(new THREE.Vector3(x, y + h / 2, z), q, new THREE.Vector3(1, h / 6, 1));
      troncos.current?.setMatrixAt(i, m);

      const anchoCopa = 0.75 + rand() * 0.5;
      col.setHSL(0.27 + rand() * 0.05, 0.28 + rand() * 0.16, 0.16 + rand() * 0.12);

      m.compose(
        new THREE.Vector3(x, y + h * 0.66, z),
        q,
        new THREE.Vector3(anchoCopa * 1.15, 0.85 + rand() * 0.3, anchoCopa * 1.15),
      );
      copas.current?.setMatrixAt(i, m);
      copas.current?.setColorAt(i, col);

      m.compose(
        new THREE.Vector3(x, y + h * 0.95, z),
        q,
        new THREE.Vector3(anchoCopa * 0.75, 0.8 + rand() * 0.3, anchoCopa * 0.75),
      );
      copas2.current?.setMatrixAt(i, m);
      copas2.current?.setColorAt(i, col.offsetHSL(0, 0, 0.06));
    }
    for (const r of [troncos, copas, copas2]) {
      if (r.current) {
        r.current.instanceMatrix.needsUpdate = true;
        if (r.current.instanceColor) r.current.instanceColor.needsUpdate = true;
      }
    }
  }, [cantidad]);

  return (
    <>
      <instancedMesh ref={troncos} args={[undefined, undefined, cantidad]} frustumCulled={false} castShadow>
        <cylinderGeometry args={[0.14, 0.24, 6, 7]} />
        <meshStandardMaterial color="#5d4c39" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={copas} args={[undefined, undefined, cantidad]} frustumCulled={false} castShadow>
        <coneGeometry args={[1.7, 4.6, 8]} />
        <meshStandardMaterial roughness={1} flatShading />
      </instancedMesh>
      <instancedMesh ref={copas2} args={[undefined, undefined, cantidad]} frustumCulled={false} castShadow>
        <coneGeometry args={[1.7, 4.2, 8]} />
        <meshStandardMaterial roughness={1} flatShading />
      </instancedMesh>
    </>
  );
}

/** Muros de piedra sin argamasa, escalonados en la ladera (aproximación referencial). */
function Muros({ mapa }: { mapa: THREE.Texture }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const TRAZOS: { x: number; z: number; largo: number; dir: number; hiladas: number }[] = [
    { x: 4, z: 6, largo: 22, dir: 0, hiladas: 4 },
    { x: 8, z: 0, largo: 18, dir: 0.15, hiladas: 5 },
    { x: 12, z: -6, largo: 14, dir: -0.1, hiladas: 4 },
    { x: -14, z: 12, largo: 12, dir: 1.4, hiladas: 3 },
    { x: 22, z: 12, largo: 10, dir: 1.2, hiladas: 3 },
    { x: -4, z: -20, largo: 9, dir: 0.2, hiladas: 3 },
  ];

  const total = useMemo(
    () => TRAZOS.reduce((acc, t) => acc + t.hiladas * Math.round(t.largo / 0.7), 0),
    [],
  );

  useEffect(() => {
    const rand = rng(101);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const col = new THREE.Color();
    let i = 0;
    for (const t of TRAZOS) {
      const pasos = Math.round(t.largo / 0.7);
      for (let h = 0; h < t.hiladas; h++) {
        for (let s = 0; s < pasos; s++) {
          const desfase = h % 2 === 0 ? 0 : 0.35;
          const d = (s - pasos / 2) * 0.7 + desfase + (rand() - 0.5) * 0.08;
          const x = t.x + Math.cos(t.dir) * d;
          const z = t.z + Math.sin(t.dir) * d;
          const base = alturaTerreno(x, z);
          const ax = 0.6 + rand() * 0.3;
          const ay = 0.3 + rand() * 0.16;
          const az = 0.5 + rand() * 0.22;
          q.setFromEuler(
            new THREE.Euler((rand() - 0.5) * 0.08, t.dir + (rand() - 0.5) * 0.16, (rand() - 0.5) * 0.06),
          );
          m.compose(new THREE.Vector3(x, base + 0.12 + h * 0.34, z), q, new THREE.Vector3(ax, ay, az));
          ref.current?.setMatrixAt(i, m);
          col.setHSL(0.08, 0.05 + rand() * 0.05, 0.46 + rand() * 0.16);
          ref.current?.setColorAt(i, col);
          i++;
        }
      }
    }
    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true;
      if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    }
  }, []);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, total]} castShadow receiveShadow frustumCulled={false}>
      <boxGeometry args={[1, 1, 1, 1, 1, 1]} />
      <meshStandardMaterial map={mapa} roughness={0.92} flatShading />
    </instancedMesh>
  );
}

/* -------------------------------- chullpas -------------------------------- */
/**
 * Torres de piedra tipo chullpa. Aproximación visual referencial:
 * la reseña menciona posibles chullpas, pero su presencia, forma y función
 * son un elemento por investigar. No es una reconstrucción definitiva.
 */
function Chullpas({ mapa, detalle }: { mapa: THREE.Texture; detalle: boolean }) {
  const UBICACIONES: { x: number; z: number; alto: number; radio: number; giro: number }[] = [
    { x: 18, z: -14, alto: 3.2, radio: 1.15, giro: 0.3 },
    { x: 22.5, z: -18.5, alto: 2.6, radio: 1.0, giro: 1.1 },
    { x: -18, z: -18, alto: 2.9, radio: 1.05, giro: -0.5 },
    { x: -22, z: -14, alto: 2.2, radio: 0.9, giro: 0.8 },
  ];

  return (
    <group>
      {UBICACIONES.map((c, idx) => {
        const base = alturaTerreno(c.x, c.z);
        const hiladas = Math.max(4, Math.round(c.alto / 0.42));
        const rand = rng(700 + idx * 37);
        return (
          <group key={idx} position={[c.x, base, c.z]} rotation-y={c.giro}>
            {/* cuerpo por hiladas de piedra */}
            {Array.from({ length: hiladas }).map((_, h) => {
              const t = h / (hiladas - 1);
              const r = c.radio * (1 - t * 0.18);
              const bloques = detalle ? Math.max(8, Math.round(r * 12)) : 1;
              if (!detalle) {
                return (
                  <mesh key={h} position={[0, 0.2 + h * 0.42, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[r, r * 1.03, 0.42, 10, 1, true]} />
                    <meshStandardMaterial map={mapa} color="#9a8f7d" roughness={0.95} flatShading side={THREE.DoubleSide} />
                  </mesh>
                );
              }
              return Array.from({ length: bloques }).map((__, b) => {
                const ang = (b / bloques) * Math.PI * 2 + (h % 2 ? Math.PI / bloques : 0);
                const jit = (rand() - 0.5) * 0.05;
                const ancho = (Math.PI * 2 * r) / bloques + 0.04;
                return (
                  <mesh
                    key={`${h}-${b}`}
                    position={[Math.cos(ang) * (r + jit), 0.2 + h * 0.42, Math.sin(ang) * (r + jit)]}
                    rotation-y={-ang}
                    castShadow
                    receiveShadow
                  >
                    <boxGeometry args={[0.3, 0.38 + rand() * 0.05, ancho]} />
                    <meshStandardMaterial
                      map={mapa}
                      color={new THREE.Color().setHSL(0.09, 0.06, 0.44 + rand() * 0.16)}
                      roughness={0.94}
                      flatShading
                    />
                  </mesh>
                );
              });
            })}
            {/* vano bajo (acceso pequeño observado en torres de este tipo) */}
            <mesh position={[c.radio * 0.98, 0.5, 0]} rotation-y={Math.PI / 2}>
              <boxGeometry args={[0.5, 0.66, 0.34]} />
              <meshStandardMaterial color="#2b241d" roughness={1} />
            </mesh>
            {/* cubierta por aproximación de falsa bóveda */}
            <mesh position={[0, 0.2 + hiladas * 0.42 + 0.18, 0]} castShadow>
              <cylinderGeometry args={[c.radio * 0.28, c.radio * 0.92, 0.5, 9]} />
              <meshStandardMaterial map={mapa} color="#8d8271" roughness={0.95} flatShading />
            </mesh>
            <mesh position={[0, 0.2 + hiladas * 0.42 + 0.48, 0]} castShadow>
              <sphereGeometry args={[c.radio * 0.3, 8, 6]} />
              <meshStandardMaterial map={mapa} color="#877c6b" roughness={0.95} flatShading />
            </mesh>
            {/* piedras caídas al pie */}
            {Array.from({ length: detalle ? 6 : 3 }).map((_, s) => {
              const a = rand() * Math.PI * 2;
              const d = c.radio + 0.4 + rand() * 1.4;
              return (
                <mesh
                  key={`s${s}`}
                  position={[Math.cos(a) * d, 0.12, Math.sin(a) * d]}
                  rotation={[rand(), rand(), rand()]}
                  castShadow
                  receiveShadow
                >
                  <dodecahedronGeometry args={[0.16 + rand() * 0.14, 0]} />
                  <meshStandardMaterial map={mapa} color="#94897a" roughness={0.95} flatShading />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}



/* ------------------------------- personaje ------------------------------- */

function Personaje({
  control,
  onCerca,
  onAvance,
}: {
  control: React.RefObject<Control>;
  onCerca: (n: number | null) => void;
  onAvance: (pos: THREE.Vector3) => void;
}) {
  const grupo = useRef<THREE.Group>(null);
  const piernaIzq = useRef<THREE.Mesh>(null);
  const piernaDer = useRef<THREE.Mesh>(null);
  const brazoIzq = useRef<THREE.Mesh>(null);
  const brazoDer = useRef<THREE.Mesh>(null);
  const torso = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const vel = useRef(new THREE.Vector3());
  const cercaActual = useRef<number | null>(null);
  const acumulado = useRef(0);
  const ciclo = useRef(0);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const c = control.current;
    const g = grupo.current;
    if (!c || !g) return;

    const yaw = c.yaw;
    const adelante = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const derecha = new THREE.Vector3(-Math.cos(yaw), 0, Math.sin(yaw));
    const dir = new THREE.Vector3()
      .addScaledVector(adelante, c.move.y)
      .addScaledVector(derecha, c.move.x);
    const intensidad = Math.min(1, dir.length());
    if (intensidad > 0.01) dir.normalize();

    const objetivo = dir.multiplyScalar(intensidad * 6.5);
    vel.current.x += (objetivo.x - vel.current.x) * (1 - Math.exp(-9 * dt));
    vel.current.z += (objetivo.z - vel.current.z) * (1 - Math.exp(-9 * dt));

    g.position.x = THREE.MathUtils.clamp(g.position.x + vel.current.x * dt, -TAM / 2 + 2, TAM / 2 - 2);
    g.position.z = THREE.MathUtils.clamp(g.position.z + vel.current.z * dt, -TAM / 2 + 2, TAM / 2 - 2);
    g.position.y = alturaTerreno(g.position.x, g.position.z);

    if (intensidad > 0.05) {
      const objetivoYaw = Math.atan2(vel.current.x, vel.current.z);
      g.rotation.y += ((objetivoYaw - g.rotation.y + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, 10 * dt);
    }

    /* animación de caminata */
    const rapidez = Math.hypot(vel.current.x, vel.current.z);
    ciclo.current += rapidez * dt * 2.4;
    const balanceo = Math.sin(ciclo.current) * Math.min(1, rapidez / 5);
    if (piernaIzq.current) piernaIzq.current.rotation.x = balanceo * 0.8;
    if (piernaDer.current) piernaDer.current.rotation.x = -balanceo * 0.8;
    if (brazoIzq.current) brazoIzq.current.rotation.x = -balanceo * 0.6;
    if (brazoDer.current) brazoDer.current.rotation.x = balanceo * 0.6;
    if (torso.current) torso.current.position.y = Math.abs(Math.cos(ciclo.current)) * 0.05 * Math.min(1, rapidez / 5);

    // cámara en tercera persona
    const dist = 7.5;
    const alto = 3.2 + c.pitch * 6;
    const camObj = new THREE.Vector3(
      g.position.x + Math.sin(yaw) * dist,
      g.position.y + alto,
      g.position.z + Math.cos(yaw) * dist,
    );
    const sueloCam = alturaTerreno(camObj.x, camObj.z) + 1.6;
    camObj.y = Math.max(camObj.y, sueloCam);
    camera.position.lerp(camObj, 1 - Math.exp(-7 * dt));
    camera.lookAt(g.position.x, g.position.y + 1.5, g.position.z);

    // puntos de interés cercanos
    let cerca: number | null = null;
    let mejor = 7;
    for (const p of PUNTOS_3D) {
      const d = Math.hypot(p.pos[0] - g.position.x, p.pos[1] - g.position.z);
      if (d < mejor) {
        mejor = d;
        cerca = p.n;
      }
    }
    if (cerca !== cercaActual.current) {
      cercaActual.current = cerca;
      onCerca(cerca);
    }

    acumulado.current += dt;
    if (acumulado.current > 0.4) {
      acumulado.current = 0;
      onAvance(g.position.clone());
    }
  });

  return (
    <group ref={grupo} position={[0, alturaTerreno(0, 30), 30]}>
      {/* Figura estilizada; no representa a un personaje histórico. */}
      <group ref={torso}>
        <mesh position={[0, 1.05, 0]} castShadow>
          <capsuleGeometry args={[0.24, 0.46, 6, 12]} />
          <meshStandardMaterial color="#8c3b2a" roughness={0.75} />
        </mesh>
        {/* mochila de registro */}
        <mesh position={[0, 1.05, -0.22]} castShadow>
          <boxGeometry args={[0.34, 0.42, 0.18]} />
          <meshStandardMaterial color="#3f4a3a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 14]} />
          <meshStandardMaterial color="#a9744f" roughness={0.85} />
        </mesh>
        {/* sombrero */}
        <mesh position={[0, 1.63, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.05, 16]} />
          <meshStandardMaterial color="#c9a227" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.7, 0]} castShadow>
          <cylinderGeometry args={[0.19, 0.21, 0.16, 16]} />
          <meshStandardMaterial color="#b8912a" roughness={0.7} />
        </mesh>
        <mesh ref={brazoIzq} position={[-0.3, 1.16, 0]} castShadow>
          <capsuleGeometry args={[0.075, 0.44, 4, 8]} />
          <meshStandardMaterial color="#8c3b2a" roughness={0.8} />
        </mesh>
        <mesh ref={brazoDer} position={[0.3, 1.16, 0]} castShadow>
          <capsuleGeometry args={[0.075, 0.44, 4, 8]} />
          <meshStandardMaterial color="#8c3b2a" roughness={0.8} />
        </mesh>
      </group>
      <mesh ref={piernaIzq} position={[-0.12, 0.42, 0]} castShadow>
        <capsuleGeometry args={[0.095, 0.5, 4, 8]} />
        <meshStandardMaterial color="#2f3742" roughness={0.9} />
      </mesh>
      <mesh ref={piernaDer} position={[0.12, 0.42, 0]} castShadow>
        <capsuleGeometry args={[0.095, 0.5, 4, 8]} />
        <meshStandardMaterial color="#2f3742" roughness={0.9} />
      </mesh>
      {/* sombra de contacto simple */}
      <mesh position={[0, 0.03, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.42, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

/* ---------------------------- puntos de interés --------------------------- */

function Marcador({
  n,
  x,
  z,
  titulo,
  descubierto,
  activo,
}: {
  n: number;
  x: number;
  z: number;
  titulo: string;
  descubierto: boolean;
  activo: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const y = alturaTerreno(x, z);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.position.y = y + 2.2 + Math.sin(state.clock.elapsedTime * 2 + n) * 0.18;
    }
  });

  const color = activo ? "#f2c14e" : descubierto ? "#7fa87a" : "#c9a227";

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, y + 0.05, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.5, 1.9, 24]} />
        <meshBasicMaterial color={color} transparent opacity={activo ? 0.85 : 0.45} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ref} position={[0, y + 2.2, 0]}>
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={activo ? 0.8 : 0.3} />
      </mesh>
      <Html position={[0, y + 3.1, 0]} center distanceFactor={26} zIndexRange={[10, 0]}>
        <div
          className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
            activo
              ? "border-amber-300 bg-amber-200 text-stone-900"
              : "border-stone-500/70 bg-stone-900/80 text-amber-100"
          }`}
        >
          📍 {n}. {titulo}
        </div>
      </Html>
    </group>
  );
}

/* --------------------------------- escena -------------------------------- */

export interface Escena3DProps {
  control: React.RefObject<Control>;
  calidadBaja: boolean;
  descubiertos: number[];
  puntoCerca: number | null;
  onCerca: (n: number | null) => void;
  onAvance: (pos: THREE.Vector3) => void;
}

function Mundo({
  calidadBaja,
  descubiertos,
  puntoCerca,
  control,
  onCerca,
  onAvance,
}: Escena3DProps) {
  const suelo = useMemo(() => texturaSuelo(calidadBaja ? 18 : 34), [calidadBaja]);
  const piedra = useMemo(() => texturaPiedra(), []);

  useEffect(
    () => () => {
      suelo.dispose();
      piedra.dispose();
    },
    [suelo, piedra],
  );

  return (
    <>
      <Sky sunPosition={[38, 12, 22]} turbidity={9} rayleigh={2.2} mieCoefficient={0.012} mieDirectionalG={0.92} />
      <fog attach="fog" args={["#d8c7a6", 40, 210]} />
      <hemisphereLight args={["#cfe0f2", "#6b5738", 0.45]} />
      <directionalLight
        position={[38, 26, 22]}
        intensity={3.2}
        color="#ffd9a0"
        castShadow={!calidadBaja}
        shadow-mapSize-width={calidadBaja ? 512 : 2048}
        shadow-mapSize-height={calidadBaja ? 512 : 2048}
        shadow-bias={-0.0004}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-camera-far={140}
      />
      {!calidadBaja && (
        <Environment resolution={128}>
          <Lightformer intensity={1.6} color="#eaf2ff" position={[0, 12, 0]} scale={[24, 24, 1]} rotation-x={Math.PI / 2} />
          <Lightformer intensity={0.7} color="#b8a377" position={[0, -6, 0]} scale={[30, 30, 1]} rotation-x={-Math.PI / 2} />
          <Lightformer intensity={0.6} color="#ffe2b0" position={[12, 3, -8]} scale={[16, 6, 1]} />
        </Environment>
      )}
      <CerrosLejanos />
      <Terreno segmentos={calidadBaja ? 48 : 140} mapa={suelo} />
      <Vegetacion cantidad={calidadBaja ? 220 : 900} />
      <Rocas cantidad={calidadBaja ? 60 : 180} mapa={piedra} />
      <Arboles cantidad={calidadBaja ? 30 : 80} />
      <Muros mapa={piedra} />
      <Chullpas mapa={piedra} detalle={!calidadBaja} />

      {PUNTOS_3D.map((p) => (
        <Marcador
          key={p.id}
          n={p.n}
          x={p.pos[0]}
          z={p.pos[1]}
          titulo={p.titulo}
          descubierto={descubiertos.includes(p.n)}
          activo={puntoCerca === p.n}
        />
      ))}
      <Personaje control={control} onCerca={onCerca} onAvance={onAvance} />
      {!calidadBaja && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={0.72} luminanceSmoothing={0.3} mipmapBlur radius={0.75} />
          <HueSaturation saturation={0.16} />
          <BrightnessContrast brightness={-0.02} contrast={0.14} />
          <Vignette offset={0.24} darkness={0.7} eskil={false} />
          <SMAA />
        </EffectComposer>
      )}
    </>
  );
}

export function Escena3D(props: Escena3DProps) {
  const { calidadBaja } = props;
  return (
    <Canvas
      shadows={calidadBaja ? false : "soft"}
      dpr={calidadBaja ? 1 : [1, 1.8]}
      camera={{ position: [0, 8, 40], fov: 58, near: 0.1, far: 400 }}
      gl={{ antialias: !calidadBaja, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >

      <Mundo {...props} />
    </Canvas>
  );
}

export default Escena3D;
export type { Control };
