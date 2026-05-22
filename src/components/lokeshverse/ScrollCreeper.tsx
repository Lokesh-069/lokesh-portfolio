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
 * as the user scrolls down the page, with spawn and Minecraft-style blast effects.
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

  // Blast effect: trigger when near bottom (~150px from end)
  const scrollProgress = maxScroll > 0 ? scroll / maxScroll : 0;
  const blastThreshold = 0.93;
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

  // Walk-cycle hop (stop hopping when blasting)
  const hop = isBlasting ? 0 : Math.abs(Math.sin(scroll / 28)) * -6;

  // Minecraft blast stages:
  // 0.0 - 0.3: Creeper flashes white (warning)
  // 0.3 - 0.5: Expansion begins
  // 0.5 - 1.0: Full explosion with particles
  const flashProgress = Math.min(blastProgress / 0.3, 1);
  const expandProgress = blastProgress > 0.3 ? Math.min((blastProgress - 0.3) / 0.2, 1) : 0;
  const explodeProgress = blastProgress > 0.5 ? (blastProgress - 0.5) / 0.5 : 0;

  // Flash effect: rapid white flashing
  const flashIntensity = flashProgress * Math.sin(blastProgress * 50);
  
  // Expansion: slight scale up before explosion
  const expandScale = 1 + expandProgress * 0.3;
  
  // Final explosion: creeper disappears, particles fly
  const creeperOpacity = explodeProgress > 0 ? 1 - explodeProgress : 1;

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-20 will-change-transform"
        style={{
          transform: `translate3d(${x}px, ${y + hop}px, 0) rotate(${rot}deg) scaleX(${facing}) scale(${spawnScale * expandScale})`,
          opacity: spawnOpacity * creeperOpacity,
          transition: isBlasting ? "none" : "transform 80ms linear",
        }}
      >
        <CreeperSVG flashIntensity={flashIntensity} />
      </div>
      
      {/* Minecraft-style explosion particles */}
      {explodeProgress > 0 && (
        <MinecraftExplosion x={x} y={y + hop} progress={explodeProgress} />
      )}
    </>
  );
}

function MinecraftExplosion({ x, y, progress }: { x: number; y: number; progress: number }) {
  // Generate consistent particles (using index as seed for consistency during scroll)
  const particles = Array.from({ length: 40 }, (_, i) => {
    // Pseudo-random based on index
    const seed1 = Math.sin(i * 12.9898) * 43758.5453;
    const seed2 = Math.cos(i * 78.233) * 43758.5453;
    const seed3 = Math.sin(i * 45.164) * 43758.5453;
    
    const random1 = seed1 - Math.floor(seed1);
    const random2 = seed2 - Math.floor(seed2);
    const random3 = seed3 - Math.floor(seed3);
    
    // Explosion direction - spherical distribution
    const angle = random1 * Math.PI * 2;
    const elevation = (random2 - 0.5) * Math.PI * 0.6;
    
    // Velocity with variation
    const speed = 80 + random3 * 120;
    const vx = Math.cos(angle) * Math.cos(elevation) * speed;
    const vy = Math.sin(elevation) * speed - 50; // Slight upward bias initially
    
    // Gravity effect
    const gravity = 180;
    const px = vx * progress;
    const py = vy * progress + 0.5 * gravity * progress * progress;
    
    // Particle size variation
    const size = 6 + random1 * 8;
    
    // Fade out
    const fadeStart = 0.6;
    const opacity = progress < fadeStart ? 1 : 1 - ((progress - fadeStart) / (1 - fadeStart));
    
    // Color variations - Minecraft explosion palette
    const colors = [
      "#ff6b00", // Orange
      "#ff8800", // Light orange
      "#ffaa33", // Yellow-orange
      "#ff4400", // Red-orange
      "#ffcc66", // Yellow
      "#cc5500", // Dark orange
      "#ffffff", // White flash
      "#999999", // Gray smoke
      "#666666", // Dark smoke
    ];
    const color = colors[Math.floor(random2 * colors.length)];
    
    // Rotation for blocky effect
    const rotation = random3 * 360 + progress * (random1 - 0.5) * 720;
    
    return {
      id: i,
      x: px,
      y: py,
      size,
      opacity,
      color,
      rotation,
    };
  });

  // Shockwave rings
  const shockwaveRadius = progress * 200;
  const shockwaveOpacity = Math.max(0, 1 - progress * 1.5);

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-30"
      style={{
        transform: `translate3d(${x + 32}px, ${y + 32}px, 0)`,
      }}
    >
      {/* Shockwave rings */}
      <div
        className="absolute"
        style={{
          left: -shockwaveRadius,
          top: -shockwaveRadius,
          width: shockwaveRadius * 2,
          height: shockwaveRadius * 2,
          borderRadius: "50%",
          border: `${Math.max(2, 8 - progress * 6)}px solid rgba(255, 200, 100, ${shockwaveOpacity * 0.6})`,
          opacity: shockwaveOpacity,
        }}
      />
      <div
        className="absolute"
        style={{
          left: -shockwaveRadius * 0.7,
          top: -shockwaveRadius * 0.7,
          width: shockwaveRadius * 1.4,
          height: shockwaveRadius * 1.4,
          borderRadius: "50%",
          border: `${Math.max(2, 6 - progress * 4)}px solid rgba(255, 150, 50, ${shockwaveOpacity * 0.8})`,
          opacity: shockwaveOpacity,
        }}
      />
      
      {/* Central flash */}
      <div
        className="absolute"
        style={{
          left: -60,
          top: -60,
          width: 120,
          height: 120,
          background: `radial-gradient(circle, rgba(255,255,255,${(1 - progress) * 0.9}) 0%, rgba(255,200,100,${(1 - progress) * 0.6}) 30%, transparent 70%)`,
          opacity: 1 - progress,
        }}
      />
      
      {/* Blocky particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.x - p.size / 2,
            top: p.y - p.size / 2,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
            transform: `rotate(${p.rotation}deg)`,
            boxShadow: `0 0 ${4 + (1 - progress) * 8}px ${p.color}`,
            imageRendering: "pixelated",
          }}
        />
      ))}
      
      {/* Smoke puffs (later stage) */}
      {progress > 0.3 && (
        <>
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const dist = (progress - 0.3) * 150;
            const smokeSize = 30 + (progress - 0.3) * 40;
            const smokeOpacity = Math.max(0, (1 - progress) * 0.4);
            
            return (
              <div
                key={`smoke-${i}`}
                className="absolute"
                style={{
                  left: Math.cos(angle) * dist - smokeSize / 2,
                  top: Math.sin(angle) * dist - smokeSize / 2,
                  width: smokeSize,
                  height: smokeSize,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, rgba(100,100,100,${smokeOpacity}) 0%, transparent 70%)`,
                  filter: "blur(4px)",
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

function CreeperSVG({ flashIntensity }: { flashIntensity: number }) {
  // 16x16 pixel creeper rendered as crisp SVG rects
  const G = "#5ab552"; // creeper green
  const D = "#3a8f3a"; // darker green
  const L = "#7ad06d"; // light green
  const K = "#0a0a0a"; // black (face + outline)
  
  // Flash to white when about to explode
  const flash = Math.abs(flashIntensity);
  const flashedG = flash > 0 ? `rgb(${90 + flash * 165}, ${181 + flash * 74}, ${82 + flash * 173})` : G;
  const flashedD = flash > 0 ? `rgb(${58 + flash * 197}, ${143 + flash * 112}, ${58 + flash * 197})` : D;
  const flashedL = flash > 0 ? `rgb(${122 + flash * 133}, ${208 + flash * 47}, ${109 + flash * 146})` : L;
  const flashedK = flash > 0 ? `rgb(${10 + flash * 245}, ${10 + flash * 245}, ${10 + flash * 245})` : K;

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
    g: flashedG, 
    d: flashedD, 
    l: flashedL, 
    k: flashedK, 
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
        filter: flash > 0.3 
          ? `drop-shadow(0 0 ${flash * 15}px rgba(255,255,255,0.9)) brightness(${1 + flash * 1.5})`
          : "drop-shadow(2px 3px 0 rgba(0,0,0,0.6))" 
      }}
    >
      {map.flatMap((row, y) =>
        row.split("").map((c, x) => {
          const fill = colorOf[c];
          if (!fill) return null;
          
          return (
            <rect
              key={`${x}-${y}`}
              x={x * size}
              y={y * size}
              width={size}
              height={size}
              fill={fill}
            />
          );
        })
      )}
    </svg>
  );
}
}
