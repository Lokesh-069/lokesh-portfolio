import { motion } from "framer-motion";
import { useMemo } from "react";

/* ===================== TORCH ===================== */
export function Torch({ className = "", scale = 1 }: { className?: string; scale?: number }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ transform: `scale(${scale})` }}>
      {/* flame */}
      <motion.div
        animate={{ scaleY: [1, 1.15, 0.95, 1.1, 1], scaleX: [1, 0.9, 1.05, 0.95, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto"
        style={{
          width: 12,
          height: 18,
          background: "radial-gradient(ellipse at 50% 70%, #fff7a8 0%, #ffd24a 35%, #ff7a18 70%, transparent 100%)",
          filter: "drop-shadow(0 -2px 12px #ff9a3c) drop-shadow(0 0 18px #ffb84c)",
          borderRadius: "50% 50% 40% 40% / 60% 60% 40% 40%",
        }}
      />
      {/* stick */}
      <div
        className="mx-auto"
        style={{
          width: 6,
          height: 22,
          background: "linear-gradient(180deg,#a06a32 0%, #6b3f1d 100%)",
          boxShadow: "inset -1px 0 0 #4a2a12, inset 1px 0 0 #c98a52",
        }}
      />
    </div>
  );
}

/* ===================== AMBIENT PARTICLES =====================
   Renders N rising particles inside a relative container. */
export function AmbientParticles({
  count = 18,
  color = "var(--primary)",
  size = 3,
  className = "",
}: {
  count?: number;
  color?: string;
  size?: number;
  className?: string;
}) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 60,
        s: size * (0.6 + Math.random() * 0.9),
        key: i,
      })),
    [count, size],
  );
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {items.map((p) => (
        <motion.span
          key={p.key}
          className="absolute bottom-0"
          style={{
            left: `${p.left}%`,
            width: p.s,
            height: p.s,
            background: color,
            boxShadow: `0 0 ${p.s * 3}px ${color}`,
          }}
          animate={{ y: [0, -600], x: [0, p.drift], opacity: [0, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ===================== XP ORBS (skills) ===================== */
export function XPOrbs({ count = 14 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        dur: 3 + Math.random() * 3,
        size: 6 + Math.random() * 6,
        key: i,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((o) => (
        <motion.div
          key={o.key}
          className="absolute rounded-full"
          style={{
            left: `${o.left}%`,
            top: `${o.top}%`,
            width: o.size,
            height: o.size,
            background: "radial-gradient(circle at 30% 30%, #d6ff7a, #6ec23c 60%, #2d6a16 100%)",
            boxShadow: "0 0 12px #9aff5c, 0 0 24px #6ec23c",
          }}
          animate={{ y: [0, -12, 0], scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: o.dur, delay: o.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ===================== REDSTONE DUST (projects) ===================== */
export function RedstoneDust({ count = 22 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 5,
        dur: 4 + Math.random() * 4,
        s: 2 + Math.random() * 2,
        key: i,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((p) => (
        <motion.span
          key={p.key}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: "10%",
            width: p.s,
            height: p.s,
            background: "#ff2a2a",
            boxShadow: "0 0 8px #ff2a2a, 0 0 14px #ff5252",
          }}
          animate={{ y: [0, 500], opacity: [0, 1, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

/* ===================== ENCHANT GLYPHS (resume) ===================== */
const GLYPHS = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᛇ", "ᛈ", "ᛉ", "ᛊ", "ᛏ", "ᛒ", "ᛗ"];
export function EnchantGlyphs({ count = 14 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        ch: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        left: Math.random() * 100,
        delay: Math.random() * 4,
        dur: 5 + Math.random() * 4,
        size: 12 + Math.random() * 16,
        key: i,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((g) => (
        <motion.span
          key={g.key}
          className="absolute font-pixel"
          style={{
            left: `${g.left}%`,
            top: "100%",
            color: "#c9a8ff",
            fontSize: g.size,
            textShadow: "0 0 8px #a78bfa, 0 0 16px #7c3aed",
          }}
          animate={{ y: [0, -400], opacity: [0, 1, 0], rotate: [0, 360] }}
          transition={{ duration: g.dur, delay: g.delay, repeat: Infinity, ease: "linear" }}
        >
          {g.ch}
        </motion.span>
      ))}
    </div>
  );
}

/* ===================== BEDROCK STRIP (footer) ===================== */
export function BedrockStrip({ className = "" }: { className?: string }) {
  // tiled "bedrock" pattern
  return (
    <div
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={{
        height: 24,
        backgroundImage:
          "linear-gradient(45deg,#2a2a2a 25%,transparent 25%),linear-gradient(-45deg,#2a2a2a 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#3a3a3a 75%),linear-gradient(-45deg,transparent 75%,#3a3a3a 75%)",
        backgroundSize: "12px 12px",
        backgroundPosition: "0 0,0 6px,6px -6px,-6px 0",
        backgroundColor: "#4a4a4a",
        boxShadow: "inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -3px 0 rgba(0,0,0,0.5)",
      }}
    />
  );
}

/* ===================== FLOATING CUBES (hero) ===================== */
const CUBE_COLORS = ["#4ade80", "#22d3ee", "#a78bfa", "#f59e0b", "#ef4444", "#78350f"];
export function FloatingCubes({ count = 10 }: { count?: number }) {
  const cubes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        top: 20 + Math.random() * 60,
        size: 18 + Math.random() * 22,
        color: CUBE_COLORS[i % CUBE_COLORS.length],
        delay: Math.random() * 3,
        dur: 5 + Math.random() * 4,
        rot: (Math.random() - 0.5) * 30,
        key: i,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {cubes.map((c) => (
        <motion.div
          key={c.key}
          className="absolute"
          style={{
            left: `${c.left}%`,
            top: `${c.top}%`,
            width: c.size,
            height: c.size,
            background: c.color,
            boxShadow: `inset -3px -3px 0 rgba(0,0,0,0.4), inset 3px 3px 0 rgba(255,255,255,0.25), 3px 3px 0 rgba(0,0,0,0.6)`,
            transform: `rotate(${c.rot}deg)`,
            imageRendering: "pixelated",
          }}
          animate={{ y: [0, -16, 0], rotate: [c.rot, c.rot + 8, c.rot] }}
          transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ===================== HEART BAR (about) ===================== */
export function HeartBar({ count = 10, filled = 8 }: { count?: number; filled?: number }) {
  return (
    <div className="flex gap-1" aria-label={`${filled} of ${count} hearts`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          animate={i < filled ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08 }}
          className="text-base"
          style={{ filter: i < filled ? "drop-shadow(0 0 4px #ff4d6d)" : "grayscale(1) opacity(0.4)" }}
        >
          ❤
        </motion.span>
      ))}
    </div>
  );
}
