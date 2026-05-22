// import { useEffect, useState } from "react";

// /**
//  * A pixel-art Creeper that wanders across the viewport in a sine-wave pattern
//  * as the user scrolls down the page.
//  */
// export function ScrollCreeper() {
//   const [scroll, setScroll] = useState(0);
//   const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
//   const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 768);

//   useEffect(() => {
//     const onScroll = () => setScroll(window.scrollY);
//     const onResize = () => {
//       setVw(window.innerWidth);
//       setVh(window.innerHeight);
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("resize", onResize);
//     onScroll();
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       window.removeEventListener("resize", onResize);
//     };
//   }, []);

//   // Pattern: horizontal sine wave across viewport, vertical bob, scroll-driven rotation
//   const t = scroll / 220;
//   const margin = 80;
//   const x = margin + ((Math.sin(t) + 1) / 2) * Math.max(0, vw - margin * 2 - 64);
//   const y = vh * 0.55 + Math.sin(t * 1.7) * (vh * 0.28);
//   const rot = Math.sin(t * 0.8) * 14;
//   // Facing direction follows horizontal velocity
//   const facing = Math.cos(t) >= 0 ? 1 : -1;
//   // Walk-cycle hop
//   const hop = Math.abs(Math.sin(scroll / 28)) * -6;

//   return (
//     <div
//       aria-hidden
//       className="pointer-events-none fixed left-0 top-0 z-20 will-change-transform"
//       style={{
//         transform: `translate3d(${x}px, ${y + hop}px, 0) rotate(${rot}deg) scaleX(${facing})`,
//         transition: "transform 80ms linear",
//       }}
//     >
//       <CreeperSVG />
//     </div>
//   );
// }

// function CreeperSVG() {
//   // 16x16 pixel creeper rendered as crisp SVG rects
//   const G = "#5ab552"; // creeper green
//   const D = "#3a8f3a"; // darker green
//   const L = "#7ad06d"; // light green
//   const K = "#0a0a0a"; // black (face + outline)
//   // grid: row of 16 chars each — '.' empty, 'g' green, 'd' dark, 'l' light, 'k' black
//   const map = [
//     "ggggggggggggggdd",
//     "gldlgdgldlglgddd",
//     "glddggldgdglgddd",
//     "ggdkkggggkkdgddd",
//     "ggdkkggggkkdgddd",
//     "gggggkkkkggggddd",
//     "ggggkkkkkkggggdd",
//     "ggggkkggkkggggdd",
//     "ggggkkggkkggggdd",
//     "ggggkkkkkkggggdd",
//     "gggggggggggggddd",
//     "gggggggggggggddd",
//     "ggddggggggggdddd",
//     "gdddggggggggdddd",
//     "gdddggggggggdddd",
//     "ggddggggggggdddd",
//   ];
//   const colorOf: Record<string, string | null> = { g: G, d: D, l: L, k: K, ".": null };
//   const size = 4; // px per cell -> 64x64 svg
//   return (
//     <svg
//       width={64}
//       height={64}
//       viewBox="0 0 64 64"
//       shapeRendering="crispEdges"
//       style={{ filter: "drop-shadow(2px 3px 0 rgba(0,0,0,0.6))" }}
//     >
//       {map.flatMap((row, y) =>
//         row.split("").map((c, x) => {
//           const fill = colorOf[c];
//           if (!fill) return null;
//           return <rect key={`${x}-${y}`} x={x * size} y={y * size} width={size} height={size} fill={fill} />;
//         })
//       )}
//     </svg>
//   );
// }
import { useEffect, useState } from "react";

/**
 * A pixel-art Creeper that wanders across the viewport in a sine-wave pattern
 * as the user scrolls down the page, with spawn and blast effects.
 */
export function ScrollCreeper() {
  const [scroll, setScroll] = useState(0);
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 768);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScroll(window.scrollY);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setMaxScroll(max);
    };
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setMaxScroll(max);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Spawn effect: fade in + scale up during first ~300px of scroll
  const spawnProgress = Math.min(scroll / 300, 1);
  const spawnScale = 0.3 + spawnProgress * 0.7;
  const spawnOpacity = spawnProgress;

  // Blast effect: trigger when near bottom (~200px from end)
  const scrollProgress = maxScroll > 0 ? scroll / maxScroll : 0;
  const blastThreshold = 0.95;
  const isBlasting = scrollProgress >= blastThreshold;
  const blastProgress = isBlasting ? Math.min((scrollProgress - blastThreshold) / (1 - blastThreshold), 1) : 0;

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

  // Blast effect: shake + expand
  const blastShakeX = isBlasting ? (Math.random() - 0.5) * 20 * blastProgress : 0;
  const blastShakeY = isBlasting ? (Math.random() - 0.5) * 20 * blastProgress : 0;
  const blastScale = 1 + blastProgress * 2;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-20 will-change-transform"
      style={{
        transform: `translate3d(${x + blastShakeX}px, ${y + hop + blastShakeY}px, 0) rotate(${rot}deg) scaleX(${facing}) scale(${spawnScale * blastScale})`,
        opacity: spawnOpacity * (1 - blastProgress * 0.3),
        transition: isBlasting ? "none" : "transform 80ms linear",
      }}
    >
      <CreeperSVG isBlasting={isBlasting} blastProgress={blastProgress} />
      
      {/* Blast particles */}
      {isBlasting && <BlastEffect progress={blastProgress} />}
    </div>
  );
}

function BlastEffect({ progress }: { progress: number }) {
  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const distance = progress * 150;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const size = 8 - progress * 6;
    const opacity = 1 - progress;
    
    return (
      <div
        key={i}
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          width: size,
          height: size,
          backgroundColor: i % 3 === 0 ? "#ff6b00" : i % 3 === 1 ? "#ffaa00" : "#ff3300",
          transform: `translate(${x}px, ${y}px)`,
          opacity,
          borderRadius: "50%",
          boxShadow: "0 0 8px currentColor",
        }}
      />
    );
  });

  return <div className="absolute inset-0">{particles}</div>;
}

function CreeperSVG({ isBlasting, blastProgress }: { isBlasting: boolean; blastProgress: number }) {
  // 16x16 pixel creeper rendered as crisp SVG rects
  const G = "#5ab552"; // creeper green
  const D = "#3a8f3a"; // darker green
  const L = "#7ad06d"; // light green
  const K = "#0a0a0a"; // black (face + outline)
  
  // Blast: transition to white/red
  const blastColor = isBlasting ? `rgb(${255}, ${Math.floor(150 * (1 - blastProgress))}, ${Math.floor(50 * (1 - blastProgress))})` : null;

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
  
  const colorOf: Record<string, string | null> = { 
    g: blastColor || G, 
    d: blastColor || D, 
    l: blastColor || L, 
    k: blastColor || K, 
    ".": null 
  };
  
  const size = 4; // px per cell -> 64x64 svg
  
  return (
    <svg
      width={64}
      height={64}
      viewBox="0 0 64 64"
      shapeRendering="crispEdges"
      style={{ 
        filter: isBlasting 
          ? `drop-shadow(0 0 ${blastProgress * 20}px rgba(255,100,0,0.9)) brightness(${1 + blastProgress * 2})`
          : "drop-shadow(2px 3px 0 rgba(0,0,0,0.6))" 
      }}
    >
      {map.flatMap((row, y) =>
        row.split("").map((c, x) => {
          const fill = colorOf[c];
          if (!fill) return null;
          
          // Individual pixel displacement during blast
          const pixelShakeX = isBlasting ? (Math.random() - 0.5) * blastProgress * 3 : 0;
          const pixelShakeY = isBlasting ? (Math.random() - 0.5) * blastProgress * 3 : 0;
          
          return (
            <rect
              key={`${x}-${y}`}
              x={x * size + pixelShakeX}
              y={y * size + pixelShakeY}
              width={size}
              height={size}
              fill={fill}
              opacity={isBlasting ? 1 - blastProgress * 0.5 : 1}
            />
          );
        })
      )}
    </svg>
  );
}
