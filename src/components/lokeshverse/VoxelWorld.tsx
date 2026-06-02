import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/* ---------- Single voxel block ---------- */
function Block({
  position,
  color,
  emissive = "#000000",
  emissiveIntensity = 0,
  roughness = 0.95,
}: {
  position: [number, number, number];
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        flatShading
        roughness={roughness}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}

/* ---------- Tree (oak) ---------- */
function Tree({ position }: { position: [number, number, number] }) {
  const [x, y, z] = position;
  return (
    <group>
      {[0, 1, 2, 3].map((i) => (
        <Block key={`t${i}`} position={[x, y + i, z]} color="#5b3a1c" />
      ))}
      {/* leaves cluster */}
      {[
        [0, 0, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1],
        [1, 0, 1], [-1, 0, -1], [1, 0, -1], [-1, 0, 1],
        [0, 1, 0], [1, 1, 0], [-1, 1, 0], [0, 1, 1], [0, 1, -1],
        [0, 2, 0],
      ].map(([dx, dy, dz], i) => (
        <Block
          key={`l${i}`}
          position={[x + dx, y + 3 + dy, z + dz]}
          color={i % 3 === 0 ? "#2f7a2a" : "#3d9c36"}
        />
      ))}
    </group>
  );
}

/* ---------- Glowing torch (block + point light) ---------- */
function TorchBlock({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((s) => {
    if (lightRef.current) {
      lightRef.current.intensity = 2.2 + Math.sin(s.clock.elapsedTime * 8 + position[0]) * 0.4;
    }
  });
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.25, 0.7, 0.25]} />
        <meshStandardMaterial color="#7a4a1f" flatShading />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.35]} />
        <meshStandardMaterial color="#ffb84c" emissive="#ff7a18" emissiveIntensity={2.5} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.6, 0]} color="#ffae3c" intensity={2.4} distance={8} decay={2} />
    </group>
  );
}

/* ---------- Floating island ---------- */
function FloatingIsland({ offset = 0, withTrees = true, withTorches = true }: { offset?: number; withTrees?: boolean; withTorches?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.5 + offset) * 0.3;
  });
  const blocks = useMemo(() => {
    const arr: { pos: [number, number, number]; color: string; emissive?: string; ei?: number }[] = [];
    // organic-ish heightmap
    for (let x = -4; x <= 4; x++)
      for (let z = -4; z <= 4; z++) {
        const d = Math.sqrt(x * x + z * z);
        const hNoise = Math.round(Math.sin(x * 0.9 + offset) * 0.5 + Math.cos(z * 0.8 - offset) * 0.5);
        if (d < 4) {
          // grass top — shade variations
          const grassShade = (x + z + 100) % 3 === 0 ? "#3fa83a" : (x * z) % 2 === 0 ? "#4ade80" : "#52c45a";
          arr.push({ pos: [x, hNoise, z], color: grassShade });
          // dirt
          for (let k = 1; k <= 2; k++) arr.push({ pos: [x, hNoise - k, z], color: k === 1 ? "#8b5a2b" : "#6b3f1d" });
          // stone core
          if (d < 3) arr.push({ pos: [x, hNoise - 3, z], color: "#5a5a5a" });
          if (d < 2) arr.push({ pos: [x, hNoise - 4, z], color: "#3d3d3d" });
        }
      }
    // ore highlights
    arr.push({ pos: [2, -3, -1], color: "#7dd3fc", emissive: "#22d3ee", ei: 0.8 }); // diamond
    arr.push({ pos: [-2, -3, 1], color: "#fde047", emissive: "#facc15", ei: 0.6 }); // gold
    arr.push({ pos: [1, -4, 2], color: "#f87171", emissive: "#ef4444", ei: 0.7 }); // redstone
    return arr;
  }, [offset]);

  return (
    <group ref={ref}>
      {blocks.map((b, i) => (
        <Block key={i} position={b.pos} color={b.color} emissive={b.emissive ?? "#000"} emissiveIntensity={b.ei ?? 0} />
      ))}
      {withTrees && (
        <>
          <Tree position={[1, 1, 1]} />
          <Tree position={[-2, 1, -2]} />
        </>
      )}
      {withTorches && (
        <>
          <TorchBlock position={[3, 1.5, 0]} />
          <TorchBlock position={[-3, 1.5, 2]} />
        </>
      )}
    </group>
  );
}

/* ---------- Lava pool (emissive) ---------- */
function LavaPool({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((s) => {
    if (ref.current) ref.current.emissiveIntensity = 1.4 + Math.sin(s.clock.elapsedTime * 2) * 0.3;
  });
  return (
    <group position={position}>
      {[[0,0,0],[1,0,0],[0,0,1],[1,0,1],[-1,0,0],[0,0,-1]].map(([x,y,z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial ref={i === 0 ? ref : undefined} color="#ff7a18" emissive="#ff3c00" emissiveIntensity={1.6} />
        </mesh>
      ))}
      <pointLight color="#ff6a1a" intensity={3} distance={12} position={[0.5, 0.8, 0.5]} />
    </group>
  );
}

/* ---------- Drifting cloud (voxel) ---------- */
function Cloud({ y, z, speed = 0.4, offset = 0 }: { y: number; z: number; speed?: number; offset?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) {
      ref.current.position.x = ((s.clock.elapsedTime * speed + offset) % 40) - 20;
    }
  });
  const blocks = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let x = 0; x < 5; x++)
      for (let z = 0; z < 2; z++)
        if (Math.random() > 0.25) arr.push([x, 0, z]);
    return arr;
  }, []);
  return (
    <group ref={ref} position={[0, y, z]}>
      {blocks.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[1.4, 0.7, 1.4]} />
          <meshStandardMaterial color="#f5f5fa" transparent opacity={0.85} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Animated portal ---------- */
function Portal() {
  const ref = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.z = t * 0.3;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.7 + Math.sin(t * 2) * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.z = -t * 0.6;
      const s2 = 1 + Math.sin(t * 3) * 0.05;
      innerRef.current.scale.set(s2, s2, s2);
    }
  });
  return (
    <group position={[0, 4, -7]}>
      <mesh ref={ref}>
        <torusGeometry args={[2.2, 0.45, 10, 32]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.9} />
      </mesh>
      <mesh ref={innerRef}>
        <circleGeometry args={[1.9, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.45} />
      </mesh>
      <pointLight color="#a78bfa" intensity={4} distance={18} />
    </group>
  );
}

/* ---------- Floating ember particles ---------- */
function Embers() {
  const ref = useRef<THREE.Points>(null);
  const { positions, velocities } = useMemo(() => {
    const n = 120;
    const p = new Float32Array(n * 3);
    const v = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = Math.random() * 10 - 2;
      p[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      v[i] = 0.005 + Math.random() * 0.015;
    }
    return { positions: p, velocities: v };
  }, []);
  useFrame(() => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const a = attr.array as Float32Array;
    for (let i = 0; i < velocities.length; i++) {
      a[i * 3 + 1] += velocities[i];
      if (a[i * 3 + 1] > 10) a[i * 3 + 1] = -2;
    }
    attr.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffae3c" size={0.12} sizeAttenuation transparent opacity={0.9} />
    </points>
  );
}

/* ---------- Stars ---------- */
function Stars() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 90;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 50 + 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 90 - 20;
    }
    return arr;
  }, []);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.18} sizeAttenuation transparent opacity={0.9} />
    </points>
  );
}

/* ---------- Camera ---------- */
function CameraRig({ intro }: { intro: boolean }) {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (intro) {
      const p = Math.min(t / 4, 1);
      state.camera.position.set(
        Math.sin(p * Math.PI) * 9,
        5 + (1 - p) * 7,
        14 - p * 5,
      );
      state.camera.lookAt(0, 2, -2);
    } else {
      state.camera.position.x = Math.sin(t * 0.2) * 7;
      state.camera.position.y = 5 + Math.sin(t * 0.3) * 0.6;
      state.camera.position.z = 9 + Math.cos(t * 0.2) * 2;
      state.camera.lookAt(0, 1.5, -2);
    }
  });
  return null;
}

/* ---------- Main scene ---------- */
export function VoxelWorld({ intro = false }: { intro?: boolean }) {
  return (
    <Canvas shadows camera={{ position: [0, 9, 16], fov: 55 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#0c0a1f"]} />
      <Suspense fallback={null}>
        <fog attach="fog" args={["#1a1033", 14, 48]} />

        {/* Lighting */}
        <ambientLight intensity={0.35} color="#7c6bcf" />
        <hemisphereLight args={["#a78bfa", "#1a0f3d", 0.5]} />
        <directionalLight
          position={[12, 18, 6]}
          intensity={1.4}
          color="#fde68a"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[0, 5, -7]} intensity={2.5} color="#22d3ee" distance={22} />

        <Stars />
        <Embers />

        {/* Islands */}
        <FloatingIsland />
        <group position={[9, 3, -9]}><FloatingIsland offset={2} withTrees={false} /></group>
        <group position={[-10, -1, -11]}><FloatingIsland offset={4} withTorches={false} /></group>
        <group position={[6, -3, 5]} scale={0.7}><FloatingIsland offset={1.5} withTrees={false} withTorches={false} /></group>

        {/* Lava on far island */}
        <LavaPool position={[-10.5, 1, -11]} />

        {/* Clouds */}
        <Cloud y={10} z={-4} speed={0.3} offset={0} />
        <Cloud y={12} z={-12} speed={0.2} offset={10} />
        <Cloud y={9} z={4} speed={0.35} offset={20} />

        <Portal />
        <CameraRig intro={intro} />
      </Suspense>
    </Canvas>
  );
}
