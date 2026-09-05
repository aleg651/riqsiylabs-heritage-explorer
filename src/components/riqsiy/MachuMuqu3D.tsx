import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
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

/* -------------------------------- terreno -------------------------------- */

function Terreno({ segmentos }: { segmentos: number }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(TAM, TAM, segmentos, segmentos);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const z = p.getZ(i);
      p.setY(i, alturaTerreno(x, z));
    }
    g.computeVertexNormals();
    return g;
  }, [segmentos]);

  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial color="#9c8b5e" roughness={0.95} />
    </mesh>
  );
}

/** Manchas de pasto seco y arbustos, como los observados en el registro. */
function Vegetacion({ cantidad }: { cantidad: number }) {
  const pasto = useRef<THREE.InstancedMesh>(null);
  const arbustos = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const rand = rng(7);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    for (let i = 0; i < cantidad; i++) {
      const x = (rand() - 0.5) * TAM * 0.95;
      const z = (rand() - 0.5) * TAM * 0.95;
      const y = alturaTerreno(x, z);
      const s = 0.6 + rand() * 0.9;
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rand() * Math.PI);
      m.compose(new THREE.Vector3(x, y + 0.35 * s, z), q, new THREE.Vector3(s, s * 1.4, s));
      pasto.current?.setMatrixAt(i, m);
    }
    if (pasto.current) pasto.current.instanceMatrix.needsUpdate = true;

    const nA = Math.round(cantidad / 6);
    for (let i = 0; i < nA; i++) {
      const x = (rand() - 0.5) * TAM * 0.9;
      const z = (rand() - 0.5) * TAM * 0.9;
      const y = alturaTerreno(x, z);
      const s = 0.7 + rand() * 0.8;
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rand() * Math.PI);
      m.compose(new THREE.Vector3(x, y + 0.35 * s, z), q, new THREE.Vector3(s, s * 0.8, s));
      arbustos.current?.setMatrixAt(i, m);
    }
    if (arbustos.current) arbustos.current.instanceMatrix.needsUpdate = true;
  }, [cantidad]);

  return (
    <>
      <instancedMesh ref={pasto} args={[undefined, undefined, cantidad]} frustumCulled={false}>
        <coneGeometry args={[0.45, 0.9, 5]} />
        <meshStandardMaterial color="#c4a961" roughness={1} flatShading />
      </instancedMesh>
      <instancedMesh
        ref={arbustos}
        args={[undefined, undefined, Math.round(cantidad / 6)]}
        frustumCulled={false}
      >
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#5f6b3c" roughness={1} flatShading />
      </instancedMesh>
    </>
  );
}

/** Árboles altos y delgados (pinos y eucaliptos observados en el video). */
function Arboles({ cantidad }: { cantidad: number }) {
  const troncos = useRef<THREE.InstancedMesh>(null);
  const copas = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const rand = rng(23);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    for (let i = 0; i < cantidad; i++) {
      // los árboles se concentran en el sector alto y en los bordes
      const x = (rand() - 0.5) * TAM * 0.92;
      const z = -TAM * 0.5 + rand() * TAM * 0.62;
      const y = alturaTerreno(x, z);
      const h = 4 + rand() * 4;
      m.compose(new THREE.Vector3(x, y + h / 2, z), q, new THREE.Vector3(1, h / 6, 1));
      troncos.current?.setMatrixAt(i, m);
      m.compose(
        new THREE.Vector3(x, y + h * 0.85, z),
        q,
        new THREE.Vector3(0.9 + rand() * 0.5, 1 + rand() * 0.6, 0.9 + rand() * 0.5),
      );
      copas.current?.setMatrixAt(i, m);
    }
    if (troncos.current) troncos.current.instanceMatrix.needsUpdate = true;
    if (copas.current) copas.current.instanceMatrix.needsUpdate = true;
  }, [cantidad]);

  return (
    <>
      <instancedMesh ref={troncos} args={[undefined, undefined, cantidad]} frustumCulled={false} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 6, 6]} />
        <meshStandardMaterial color="#6b5a45" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={copas} args={[undefined, undefined, cantidad]} frustumCulled={false}>
        <coneGeometry args={[1.5, 4.5, 7]} />
        <meshStandardMaterial color="#3f5233" roughness={1} flatShading />
      </instancedMesh>
    </>
  );
}

/** Muros de piedra sin argamasa, escalonados en la ladera (aproximación referencial). */
function Muros() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const TRAZOS: { x: number; z: number; largo: number; dir: number; hiladas: number }[] = [
    { x: 4, z: 6, largo: 22, dir: 0, hiladas: 3 },
    { x: 8, z: 0, largo: 18, dir: 0.15, hiladas: 4 },
    { x: 12, z: -6, largo: 14, dir: -0.1, hiladas: 3 },
    { x: -14, z: 12, largo: 12, dir: 1.4, hiladas: 2 },
    { x: 22, z: 12, largo: 10, dir: 1.2, hiladas: 2 },
    { x: -4, z: -20, largo: 9, dir: 0.2, hiladas: 2 },
  ];

  const total = useMemo(
    () => TRAZOS.reduce((acc, t) => acc + t.hiladas * Math.round(t.largo / 0.75), 0),
    [],
  );

  useEffect(() => {
    const rand = rng(101);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    let i = 0;
    for (const t of TRAZOS) {
      const pasos = Math.round(t.largo / 0.75);
      for (let h = 0; h < t.hiladas; h++) {
        for (let s = 0; s < pasos; s++) {
          const d = (s - pasos / 2) * 0.75 + (rand() - 0.5) * 0.12;
          const x = t.x + Math.cos(t.dir) * d;
          const z = t.z + Math.sin(t.dir) * d;
          const base = alturaTerreno(x, z);
          const ax = 0.55 + rand() * 0.35;
          const ay = 0.32 + rand() * 0.2;
          const az = 0.45 + rand() * 0.25;
          q.setFromEuler(new THREE.Euler((rand() - 0.5) * 0.12, t.dir + (rand() - 0.5) * 0.25, (rand() - 0.5) * 0.1));
          m.compose(new THREE.Vector3(x, base + 0.15 + h * 0.36, z), q, new THREE.Vector3(ax, ay, az));
          ref.current?.setMatrixAt(i++, m);
        }
      }
    }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, total]} castShadow receiveShadow frustumCulled={false}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#8d8478" roughness={0.9} flatShading />
    </instancedMesh>
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
  const { camera } = useThree();
  const vel = useRef(new THREE.Vector3());
  const cercaActual = useRef<number | null>(null);
  const acumulado = useRef(0);

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

    // cámara en tercera persona
    const dist = 8;
    const alto = 3.4 + c.pitch * 6;
    const camObj = new THREE.Vector3(
      g.position.x + Math.sin(yaw) * dist,
      g.position.y + alto,
      g.position.z + Math.cos(yaw) * dist,
    );
    const sueloCam = alturaTerreno(camObj.x, camObj.z) + 1.6;
    camObj.y = Math.max(camObj.y, sueloCam);
    camera.position.lerp(camObj, 1 - Math.exp(-7 * dt));
    camera.lookAt(g.position.x, g.position.y + 1.6, g.position.z);

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
      <mesh position={[0, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.26, 0.5, 4, 8]} />
        <meshStandardMaterial color="#8c3b2a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial color="#a9744f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.32, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.06, 10]} />
        <meshStandardMaterial color="#c9a227" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.3, 8]} />
        <meshStandardMaterial color="#3a3a3a" roughness={1} />
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

export function Escena3D({
  control,
  calidadBaja,
  descubiertos,
  puntoCerca,
  onCerca,
  onAvance,
}: Escena3DProps) {
  return (
    <Canvas
      shadows={!calidadBaja}
      dpr={calidadBaja ? 1 : [1, 1.6]}
      camera={{ position: [0, 8, 40], fov: 62, near: 0.1, far: 300 }}
      gl={{ antialias: !calidadBaja, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#c9d6e3"]} />
      <fog attach="fog" args={["#c9d6e3", 45, 130]} />
      <hemisphereLight args={["#dfe8f0", "#6b5a3c", 0.75]} />
      <directionalLight
        position={[26, 34, 18]}
        intensity={1.9}
        color="#ffe9c2"
        castShadow={!calidadBaja}
        shadow-mapSize-width={calidadBaja ? 512 : 1024}
        shadow-mapSize-height={calidadBaja ? 512 : 1024}
      />
      <Terreno segmentos={calidadBaja ? 40 : 96} />
      <Vegetacion cantidad={calidadBaja ? 180 : 520} />
      <Arboles cantidad={calidadBaja ? 28 : 70} />
      <Muros />
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
    </Canvas>
  );
}

export default Escena3D;
export type { Control };
