import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { VoxelWorld } from "./VoxelWorld";

export function Intro({ onStart, onSkipGame }: { onStart: () => void; onSkipGame: () => void }) {
  const [phase, setPhase] = useState<"loading" | "reveal" | "ready">("loading");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 1200);
    const t2 = setTimeout(() => setPhase("ready"), 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-background">
      <div className="absolute inset-0 starfield opacity-50" />
      <div className="absolute inset-0">
        <VoxelWorld intro={phase !== "ready"} />
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,oklch(0.08_0.04_270)_100%)]" />

      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <motion.div
            key="loading"
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-background"
          >
            <div className="font-pixel text-xs text-primary animate-blink">GENERATING WORLD…</div>
            <div className="mt-4 h-3 w-64 pixel-border bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: "linear" }}
                className="h-full bg-accent"
              />
            </div>
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="pointer-events-none absolute inset-x-0 bottom-32 flex justify-center"
          >
            <div className="text-center">
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="font-pixel text-sm text-primary text-shadow-glow"
              >
                A LOKESHVERSE EXPERIENCE
              </motion.h2>
            </div>
          </motion.div>
        )}

        {phase === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-pixel text-xs text-accent mb-3 tracking-widest"
            >
              WELCOME TO
            </motion.div>
            <motion.h1
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
              className="font-pixel text-4xl md:text-7xl text-shadow-glow bg-gradient-to-b from-primary via-secondary to-accent bg-clip-text text-transparent"
              style={{ WebkitTextStroke: "1px rgba(0,0,0,0.5)" }}
            >
              LOKESHVERSE
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="font-display text-lg md:text-xl text-muted-foreground mt-4 max-w-md px-4"
            >
              A cinematic block-world portfolio by Lokesh Hazra
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-10 flex flex-col items-center gap-3"
            >
              <button onClick={onStart} className="pixel-btn animate-blink">
                ▶ PRESS START
              </button>
              <button onClick={onSkipGame} className="font-pixel text-[10px] text-muted-foreground hover:text-primary transition-colors mt-2 underline-offset-4 hover:underline">
                skip game →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
