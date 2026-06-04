import { useEffect, useRef, useState } from "react";

type Entity = { x: number; y: number; type: "cube" | "obstacle" };
const W = 16, H = 10, CELL = 40;

export function MiniGame({ onComplete }: { onComplete: () => void }) {
  const [player, setPlayer] = useState({ x: 1, y: 1 });
  const [entities, setEntities] = useState<Entity[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [hit, setHit] = useState(false);
  const keys = useRef<Set<string>>(new Set());

  // spawn
  useEffect(() => {
    const ents: Entity[] = [];
    for (let i = 0; i < 12; i++)
      ents.push({ x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H), type: "cube" });
    for (let i = 0; i < 6; i++)
      ents.push({ x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H), type: "obstacle" });
    setEntities(ents);
  }, []);

  // timer
  useEffect(() => {
    const id = setInterval(() => setTime((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (time === 0) onComplete();
  }, [time, onComplete]);

  // input
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase());
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // movement loop
  useEffect(() => {
    const id = setInterval(() => {
      setPlayer((p) => {
        let { x, y } = p;
        if (keys.current.has("w") || keys.current.has("arrowup")) y--;
        if (keys.current.has("s") || keys.current.has("arrowdown")) y++;
        if (keys.current.has("a") || keys.current.has("arrowleft")) x--;
        if (keys.current.has("d") || keys.current.has("arrowright")) x++;
        x = Math.max(0, Math.min(W - 1, x));
        y = Math.max(0, Math.min(H - 1, y));
        return { x, y };
      });
    }, 120);
    return () => clearInterval(id);
  }, []);

  // collisions
  useEffect(() => {
    setEntities((ents) => {
      const next: Entity[] = [];
      for (const e of ents) {
        if (e.x === player.x && e.y === player.y) {
          if (e.type === "cube") {
            setScore((s) => s + 1);
            continue;
          } else {
            setHit(true);
            setTimeout(() => setHit(false), 200);
            setTime((t) => Math.max(0, t - 2));
          }
        }
        next.push(e);
      }
      return next;
    });
  }, [player]);

  useEffect(() => {
    if (entities.length > 0 && entities.every((e) => e.type === "obstacle")) onComplete();
  }, [entities, onComplete]);

  const progress = ((30 - time) / 30) * 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background starfield">
      <div className="mb-4 flex w-full max-w-3xl items-center justify-between px-4">
        <div className="font-pixel text-xs text-foreground text-shadow-block">
          ENERGY: <span className="text-accent">{score}</span>
        </div>
        <div className="font-pixel text-xs text-foreground text-shadow-block">
          TIME: <span className="text-primary">{time}s</span>
        </div>
        <button onClick={onComplete} className="pixel-btn pixel-btn-purple !py-2 !px-4">
          Skip Game →
        </button>
      </div>

      <div className="mb-2 h-3 w-full max-w-3xl bg-muted pixel-border">
        <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div
        className={`relative pixel-border bg-night-2 ${hit ? "animate-pulse" : ""}`}
        style={{
          width: W * CELL,
          height: H * CELL,
          background:
            "repeating-linear-gradient(0deg, oklch(0.18 0.06 270), oklch(0.18 0.06 270) 39px, oklch(0.22 0.06 270) 40px), repeating-linear-gradient(90deg, oklch(0.18 0.06 270), oklch(0.18 0.06 270) 39px, oklch(0.22 0.06 270) 40px)",
        }}
      >
        {entities.map((e, i) => (
          <div
            key={i}
            className={`absolute ${e.type === "cube" ? "shadow-glow" : ""}`}
            style={{
              left: e.x * CELL + 4,
              top: e.y * CELL + 4,
              width: CELL - 8,
              height: CELL - 8,
              background: e.type === "cube" ? "var(--cyan-glow)" : "var(--destructive)",
              border: "3px solid rgba(0,0,0,0.6)",
              boxShadow:
                e.type === "cube"
                  ? "inset -3px -3px 0 0 rgba(0,0,0,0.3), inset 3px 3px 0 0 rgba(255,255,255,0.3)"
                  : "inset -3px -3px 0 0 rgba(0,0,0,0.4)",
            }}
          />
        ))}
        <div
          className="absolute transition-all duration-100"
          style={{
            left: player.x * CELL + 4,
            top: player.y * CELL + 4,
            width: CELL - 8,
            height: CELL - 8,
            background: "var(--accent)",
            border: "3px solid rgba(0,0,0,0.7)",
            boxShadow:
              "inset -3px -3px 0 0 rgba(0,0,0,0.4), inset 3px 3px 0 0 rgba(255,255,255,0.3), 0 0 20px var(--accent)",
          }}
        >
          <div className="absolute left-1 top-2 h-1.5 w-1.5 bg-background" />
          <div className="absolute right-1 top-2 h-1.5 w-1.5 bg-background" />
        </div>
      </div>

      <p className="mt-4 font-display text-lg text-muted-foreground">
        Use <kbd className="pixel-border bg-muted px-2 py-0.5 text-xs">WASD</kbd> to move. Collect cyan cubes. Avoid red.
      </p>
    </div>
  );
}
