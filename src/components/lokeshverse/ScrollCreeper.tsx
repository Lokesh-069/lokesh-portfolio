import { useEffect, useState } from "react";

/**
 * A pixel-art Creeper that wanders across the viewport in a sine-wave pattern
 * as the user scrolls down the page.
 */
export function ScrollCreeper() {
  const [scroll, setScroll] = useState(0);
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 768);

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY);
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Pattern: horizontal sine wave across viewport, vertical bob, scroll-driven rotation
  const t = scroll / 220;
  const margin = 80;
  const x = margin + ((Math.sin(t) + 1) / 2) * Math.max(0, vw - margin * 2 - 64);
  const y = vh * 0.55 + Math.sin(t * 1.7) * (vh * 0.28);
  const rot = Math.sin(t * 0.8) * 14;
  // Facing direction follows horizontal velocity
  const facing = Math.cos(t) >= 0 ? 1 : -1;
  // Walk-cycle hop
  const hop = Math.abs(Math.sin(scroll / 28)) * -6;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-20 will-change-transform"
      style={{
        transform: `translate3d(${x}px, ${y + hop}px, 0) rotate(${rot}deg) scaleX(${facing})`,
        transition: "transform 80ms linear",
      }}
    >
      <CreeperSVG />
    </div>
  );
}

function CreeperSVG() {
  // 16x16 pixel creeper rendered as crisp SVG rects
  const G = "#5ab552"; // creeper green
  const D = "#3a8f3a"; // darker green
  const L = "#7ad06d"; // light green
  const K = "#0a0a0a"; // black (face + outline)
  // grid: row of 16 chars each — '.' empty, 'g' green, 'd' dark, 'l' light, 'k' black
  const map = [
    "ggggggggggggggdd",
    "gldlgdgldlglgddd",
    "glddggldgdglgddd",
    "ggdkkggggkkdgddd",
    "ggdkkggggkkdgddd",
    "gggggkkkkggggddd",
    "ggggkkkkkkggggdd",
    "ggggkkggkkggggdd",
    "ggggkkggkkggggdd",
    "ggggkkkkkkggggdd",
    "gggggggggggggddd",
    "gggggggggggggddd",
    "ggddggggggggdddd",
    "gdddggggggggdddd",
    "gdddggggggggdddd",
    "ggddggggggggdddd",
  ];
  const colorOf: Record<string, string | null> = { g: G, d: D, l: L, k: K, ".": null };
  const size = 4; // px per cell -> 64x64 svg
  return (
    <svg
      width={64}
      height={64}
      viewBox="0 0 64 64"
      shapeRendering="crispEdges"
      style={{ filter: "drop-shadow(2px 3px 0 rgba(0,0,0,0.6))" }}
    >
      {map.flatMap((row, y) =>
        row.split("").map((c, x) => {
          const fill = colorOf[c];
          if (!fill) return null;
          return <rect key={`${x}-${y}`} x={x * size} y={y * size} width={size} height={size} fill={fill} />;
        })
      )}
    </svg>
  );
}
