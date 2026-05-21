import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Intro } from "@/components/lokeshverse/Intro";
import { MiniGame } from "@/components/lokeshverse/MiniGame";
import { Portfolio } from "@/components/lokeshverse/Portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LokeshVerse — Lokesh Hazra · AI & Robotics" },
      { name: "description", content: "A cinematic Minecraft-inspired portfolio for Lokesh Hazra — AI & Robotics student, developer, problem solver." },
      { property: "og:title", content: "LokeshVerse — Lokesh Hazra" },
      { property: "og:description", content: "Enter LokeshVerse: a playable block-world portfolio." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" },
    ],
  }),
  component: Index,
});

type Stage = "intro" | "game" | "portfolio";

function Index() {
  const [stage, setStage] = useState<Stage>("intro");

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.div key="intro" exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6 }}>
            <Intro onStart={() => setStage("game")} onSkipGame={() => setStage("portfolio")} />
          </motion.div>
        )}
        {stage === "game" && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MiniGame onComplete={() => setStage("portfolio")} />
          </motion.div>
        )}
        {stage === "portfolio" && (
          <motion.div key="portfolio" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Portfolio />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
