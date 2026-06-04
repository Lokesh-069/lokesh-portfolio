import { useEffect, useRef, useState } from "react";

export function PixelCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let raf = 0;
    let tx = 0, ty = 0, x = 0, y = 0;
    const move = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (ref.current) ref.current.style.transform = `translate3d(${tx - 12}px, ${ty - 12}px, 0)`;
      const el = e.target as HTMLElement;
      setHovering(!!el.closest("a,button,[role=button],input,textarea,select"));
    };
    const animate = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      if (trailRef.current) trailRef.current.style.transform = `translate3d(${x - 20}px, ${y - 20}px, 0)`;
      raf = requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <style>{`@media (pointer: fine){body, body *{cursor:none !important;}}`}</style>
      <div
        ref={trailRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block transition-[width,height,opacity] duration-200"
        style={{
          width: 40, height: 40,
          background: hovering ? "radial-gradient(circle, var(--purple-glow) 0%, transparent 70%)" : "radial-gradient(circle, var(--cyan-glow) 0%, transparent 70%)",
          opacity: hovering ? 0.8 : 0.45,
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={ref}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{ width: 24, height: 24, transition: "filter 0.2s" }}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" style={{ imageRendering: "pixelated", filter: hovering ? "drop-shadow(0 0 6px var(--purple-glow))" : "drop-shadow(0 0 4px var(--cyan-glow))" }}>
          <g shapeRendering="crispEdges">
            {hovering ? (
              <>
                <rect x="10" y="2" width="4" height="4" fill="var(--purple-glow)" stroke="#000"/>
                <rect x="10" y="18" width="4" height="4" fill="var(--purple-glow)" stroke="#000"/>
                <rect x="2" y="10" width="4" height="4" fill="var(--purple-glow)" stroke="#000"/>
                <rect x="18" y="10" width="4" height="4" fill="var(--purple-glow)" stroke="#000"/>
                <rect x="10" y="10" width="4" height="4" fill="#fff" stroke="#000"/>
              </>
            ) : (
              <>
                <rect x="11" y="0" width="2" height="8" fill="#fff" stroke="#000"/>
                <rect x="11" y="16" width="2" height="8" fill="#fff" stroke="#000"/>
                <rect x="0" y="11" width="8" height="2" fill="#fff" stroke="#000"/>
                <rect x="16" y="11" width="8" height="2" fill="#fff" stroke="#000"/>
                <rect x="11" y="11" width="2" height="2" fill="var(--cyan-glow)"/>
              </>
            )}
          </g>
        </svg>
      </div>
    </>
  );
}
