import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function Block({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} flatShading roughness={0.9} />
    </mesh>
  );
}

function FloatingIsland({ offset = 0 }: { offset?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.5 + offset) * 0.3;
  });
  const blocks = useMemo(() => {
    const arr: { pos: [number, number, number]; color: string }[] = [];
    for (let x = -3; x <= 3; x++)
      for (let z = -3; z <= 3; z++) {
        const d = Math.sqrt(x * x + z * z);
        if (d < 3.5) {
          arr.push({ pos: [x, 0, z], color: "#4ade80" });
          arr.push({ pos: [x, -1, z], color: "#78350f" });
          if (d < 2.5) arr.push({ pos: [x, -2, z], color: "#57534e" });
        }
      }
    arr.push({ pos: [0, 1, 0], color: "#22d3ee" });
    arr.push({ pos: [1, 1, 0], color: "#a78bfa" });
    arr.push({ pos: [-2, 1, 1], color: "#f59e0b" });
    return arr;
  }, []);
  return (
    <group ref={ref}>
      {blocks.map((b, i) => (
        <Block key={i} position={b.pos} color={b.color} />
      ))}
    </group>
  );
}

function Portal() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.z = s.clock.elapsedTime * 0.3;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.7 + Math.sin(s.clock.elapsedTime * 2) * 0.2;
    }
  });
  return (
    <group position={[0, 3, -6]}>
      <mesh ref={ref}>
        <torusGeometry args={[2, 0.4, 8, 24]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.9} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.7, 24]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Stars() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 80;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 40 + 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 80 - 20;
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
      <pointsMaterial color="#ffffff" size={0.15} sizeAttenuation />
    </points>
  );
}

function CameraRig({ intro }: { intro: boolean }) {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (intro) {
      const p = Math.min(t / 4, 1);
      state.camera.position.set(
        Math.sin(p * Math.PI) * 8,
        4 + (1 - p) * 6,
        12 - p * 4,
      );
      state.camera.lookAt(0, 2, -2);
    } else {
      state.camera.position.x = Math.sin(t * 0.2) * 6;
      state.camera.position.y = 4 + Math.sin(t * 0.3) * 0.5;
      state.camera.position.z = 8 + Math.cos(t * 0.2) * 2;
      state.camera.lookAt(0, 1, -2);
    }
  });
  return null;
}

export function VoxelWorld({ intro = false }: { intro?: boolean }) {
  return (
    <Canvas shadows camera={{ position: [0, 8, 14], fov: 60 }} dpr={[1, 2]}>
      <Suspense fallback={null}>
        <fog attach="fog" args={["#1a1033", 10, 40]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 15, 5]} intensity={1.2} color="#a78bfa" castShadow />
        <pointLight position={[0, 4, -6]} intensity={2} color="#22d3ee" distance={20} />
        <Stars />
        <FloatingIsland />
        <group position={[8, 2, -8]}><FloatingIsland offset={2} /></group>
        <group position={[-9, -1, -10]}><FloatingIsland offset={4} /></group>
        <Portal />
        <CameraRig intro={intro} />
      </Suspense>
    </Canvas>
  );
}
