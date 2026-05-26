import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { VoxelWorld } from "./VoxelWorld";
import { HallOfKnowledge } from "./HallOfKnowledge";
import { PixelCursor } from "./Cursor";
import { ScrollCreeper } from "./ScrollCreeper";
import { ContactSection } from "./ContactSection";
import {
  Torch,
  AmbientParticles,
  XPOrbs,
  RedstoneDust,
  EnchantGlyphs,
  BedrockStrip,
  FloatingCubes,
  HeartBar,
} from "./MinecraftFX";

const projects = [
  {
    name: "SafeSignal",
    structure: "Emergency Research Lab",
    icon: "🚨",
    color: "var(--destructive)",
    description: "AI emergency detection system using SOS gesture recognition. Detects distress signals in real time and triggers alerts.",
    tech: ["MediaPipe", "OpenCV", "Flask", "React", "Twilio", "Cloudinary"],
    github: "https://github.com/Lokesh-069/SafeSignal-AI",
    live: "https://safe-signal-ai.vercel.app/",
  },
  {
    name: "Coming Soon",
    structure: "Construction Site",
    icon: "🏗️",
    color: "var(--muted-foreground)",
    description: "New AI experiments in progress. Check back soon for more builds from the LokeshVerse.",
    tech: ["TBA"],
    github: "",
    live: "",
  },
];

// logos via simple-icons CDN (svg) — colored brand logos
const ICON = (slug: string, color?: string) =>
  `https://cdn.simpleicons.org/${slug}${color ? `/${color}` : ""}`;

type Skill = { name: string; icon?: string; emoji?: string };
const skills: Record<string, Skill[]> = {
  Technical: [
    { name: "Python", icon: ICON("python") },
    { name: "C++", icon: ICON("cplusplus") },
    { name: "JavaScript", icon: ICON("javascript") },
    { name: "TypeScript", icon: ICON("typescript") },
    { name: "React", icon: ICON("react") },
    { name: "TensorFlow", icon: ICON("tensorflow") },
    { name: "PyTorch", icon: ICON("pytorch") },
    { name: "OpenCV", icon: ICON("opencv") },
    { name: "scikit-learn", icon: ICON("scikitlearn") },
    { name: "NumPy", icon: ICON("numpy") },
    { name: "Pandas", icon: ICON("pandas") },
    { name: "HTML5", icon: ICON("html5") },
  ],
  Tools: [
    { name: "MediaPipe", icon: ICON("mediapipe") },
    { name: "Flask", icon: ICON("flask", "ffffff") },
    { name: "Node.js", icon: ICON("nodedotjs") },
    { name: "Twilio", icon: "https://www.vectorlogo.zone/logos/twilio/twilio-icon.svg" },
    { name: "Cloudinary", icon: ICON("cloudinary") },
    { name: "Git", icon: ICON("git") },
    { name: "GitHub", icon: ICON("github", "ffffff") },
    { name: "VS Code", icon: "https://raw.githubusercontent.com/github/explore/main/topics/visual-studio-code/visual-studio-code.png" },
    { name: "Vercel", icon: ICON("vercel", "ffffff") },
    { name: "Postman", icon: ICON("postman") },
    { name: "Figma", icon: ICON("figma") },
    { name: "Linux", icon: ICON("linux", "ffffff") },
  ],
  Soft: [
    { name: "Problem Solving", emoji: "🧩" },
    { name: "Innovation", emoji: "💡" },
    { name: "Leadership", emoji: "👑" },
    { name: "Teamwork", emoji: "🤝" },
    { name: "Communication", emoji: "💬" },
    { name: "Adaptability", emoji: "🌱" },
  ],
};

function Block({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="mb-12 text-center">
      <div className="font-pixel text-[10px] text-primary tracking-widest mb-3">▸ {tag} ◂</div>
      <h2 className="font-pixel text-2xl md:text-4xl text-shadow-block bg-gradient-to-b from-foreground to-primary bg-clip-text text-transparent">
        {title}
      </h2>
    </div>
  );
}

export function Portfolio() {
  const [selected, setSelected] = useState<number | null>(null);
  const [chat, setChat] = useState(false);
  const [chatLog, setChatLog] = useState<{ from: "user" | "npc"; text: string }[]>([
    { from: "npc", text: "Hello traveler! I'm your guide in the LokeshVerse. Ask me about Lokesh!" },
  ]);
  const [input, setInput] = useState("");

  // WASD / arrow scrolling
  useEffect(() => {
    let raf = 0;
    const keys = new Set<string>();
    const isTyping = (el: EventTarget | null) => {
      const t = el as HTMLElement | null;
      return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
    };
    const down = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
        keys.add(k);
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    const loop = () => {
      let dy = 0, dx = 0;
      if (keys.has("w") || keys.has("arrowup")) dy -= 18;
      if (keys.has("s") || keys.has("arrowdown")) dy += 18;
      if (keys.has("a") || keys.has("arrowleft")) dx -= 18;
      if (keys.has("d") || keys.has("arrowright")) dx += 18;
      if (dy || dx) window.scrollBy({ top: dy, left: dx, behavior: "auto" });
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      cancelAnimationFrame(raf);
    };
  }, []);

  const ask = (q: string) => {
    setChatLog((l) => [...l, { from: "user", text: q }]);
    const lower = q.toLowerCase();
    let reply = "Lokesh is a 2nd year B.Tech CSE (AI & Robotics) student at IEM Newtown, passionate about AI, computer vision, and automation.";
    if (lower.includes("project")) reply = "His featured project is SafeSignal — an AI emergency detection system using gesture recognition. Check the Structures section!";
    else if (lower.includes("skill")) reply = "Python, C++, JavaScript, React, ML, Computer Vision — plus tools like OpenCV, MediaPipe, Flask, Twilio, Cloudinary.";
    else if (lower.includes("achieve") || lower.includes("award")) reply = "1st Place at CodeShield Hackathon — Cyber Odyssey 2026!";
    else if (lower.includes("contact") || lower.includes("github")) reply = "Find him on GitHub: github.com/Lokesh-069";
    setTimeout(() => setChatLog((l) => [...l, { from: "npc", text: reply }]), 600);
    setInput("");
  };

  return (
    <div className="relative min-h-screen bg-background">
      <PixelCursor />
      <ScrollCreeper />
      {/* persistent 3D world background */}
      <div className="fixed inset-0 -z-10 opacity-40">
        <VoxelWorld />
      </div>
      <div className="fixed inset-0 -z-10 starfield opacity-30" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-background/70 to-background" />

      {/* HUD nav */}
      <nav className="fixed left-1/2 top-4 z-30 -translate-x-1/2">
        <div className="pixel-border flex gap-1 bg-card/90 backdrop-blur px-2 py-2">
          {[
            ["home", "🏠"],
            ["about", "📚"],
            ["projects", "🏗️"],
            ["achievements", "🏆"],
            ["skills", "🎒"],
            ["resume", "📄"],
            ["contact", "✉️"],
          ].map(([id, icon]) => (
            <a
              key={id}
              href={`#${id}`}
              className="font-pixel text-[10px] uppercase px-3 py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              title={id}
            >
              <span className="md:hidden">{icon}</span>
              <span className="hidden md:inline">{icon} {id}</span>
            </a>
          ))}

        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center overflow-hidden">
        <FloatingCubes count={12} />
        <AmbientParticles count={22} color="#a78bfa" />
        {/* corner torches */}
        <div className="absolute left-6 top-24"><Torch /></div>
        <div className="absolute right-6 top-24"><Torch /></div>
        <Block>
          <div className="font-pixel text-[10px] text-accent tracking-widest mb-4 animate-blink">▸ PLAYER SPAWNED ◂</div>
        </Block>
        <Block delay={0.2}>
          <h1 className="font-pixel text-4xl md:text-7xl text-shadow-glow bg-gradient-to-b from-primary via-secondary to-accent bg-clip-text text-transparent" style={{ WebkitTextStroke: "1px rgba(0,0,0,0.5)" }}>
            LOKESH HAZRA
          </h1>
        </Block>
        <Block delay={0.4}>
          <p className="font-display text-xl md:text-2xl text-muted-foreground mt-6 leading-snug">
            AI & Robotics Enthusiast<br/>
            <span className="text-primary">Developer</span> · <span className="text-secondary">Problem Solver</span>
          </p>
        </Block>
        <Block delay={0.55}>
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="font-pixel text-[9px] text-muted-foreground">HEALTH</div>
            <HeartBar count={10} filled={10} />
          </div>
        </Block>
        <Block delay={0.7}>
          <div className="mt-12 bg-card/70 backdrop-blur rounded-2xl px-6 py-4 max-w-md mx-auto flex items-start gap-3 border border-primary/20 shadow-glow">
            <div className="text-3xl animate-float-block">🧙</div>
            <div className="text-left">
              <div className="font-pixel text-[10px] text-accent mb-1">VILLAGER</div>
              <p className="font-display text-base">Welcome! Press <kbd className="bg-muted px-2 py-0.5 text-xs rounded-md border border-muted-foreground/20">S</kbd> or scroll to explore the LokeshVerse →</p>
            </div>
          </div>
        </Block>
        <Block delay={1}>
          <div className="mt-16 font-pixel text-[10px] text-muted-foreground animate-blink">▼ SCROLL TO EXPLORE ▼</div>
        </Block>
      </section>

      {/* ABOUT — Village Library */}
      <section id="about" className="relative px-4 py-32 overflow-hidden">
        <AmbientParticles count={14} color="#22d3ee" size={2} />
        <div className="mx-auto max-w-5xl">
          <SectionHeader tag="LOCATION 01" title="📚 Village Library" />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Student", body: "B.Tech CSE (AI & Robotics), 2nd Year at IEM Newtown.", icon: "🎓" },
              { title: "Passion", body: "Building real-world solutions using AI, computer vision, and automation.", icon: "🤖" },
              { title: "Mission", body: "Becoming an AI/ML engineer who ships products that matter.", icon: "🎯" },
            ].map((b, i) => (
              <Block key={b.title} delay={i * 0.1}>
                <div className="pixel-border bg-card p-6 h-full hover:translate-y-[-4px] transition-transform">
                  <div className="text-4xl mb-3">{b.icon}</div>
                  <div className="font-pixel text-xs text-primary mb-2">{b.title}</div>
                  <p className="font-display text-lg leading-snug text-foreground/90">{b.body}</p>
                </div>
              </Block>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS — Structures */}
      <section id="projects" className="relative px-4 py-32 overflow-hidden">
        <RedstoneDust count={26} />
        <div className="mx-auto max-w-5xl">
          <SectionHeader tag="LOCATION 02" title="🏗️ Structures" />
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <Block key={p.name} delay={i * 0.15}>
                <button
                  onClick={() => setSelected(i)}
                  className="pixel-border bg-card p-6 text-left w-full h-full hover:scale-[1.02] transition-transform cursor-pointer block"
                  style={{ borderLeftColor: p.color, borderLeftWidth: 8 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-5xl animate-float-block">{p.icon}</div>
                    <div className="font-pixel text-[10px] text-muted-foreground">{p.structure}</div>
                  </div>
                  <h3 className="font-pixel text-lg mb-2 text-primary">{p.name}</h3>
                  <p className="font-display text-base text-foreground/80 line-clamp-2">{p.description}</p>
                  <div className="mt-4 font-pixel text-[10px] text-accent">▸ CLICK TO INSPECT</div>
                </button>
              </Block>
            ))}
          </div>
        </div>
      </section>

      {/* HALL OF KNOWLEDGE */}
      <HallOfKnowledge />

      {/* SKILLS — Inventory */}
      <section id="skills" className="relative px-4 py-32 overflow-hidden">
        <XPOrbs count={18} />
        <div className="mx-auto max-w-5xl">
          <SectionHeader tag="LOCATION 04" title="🎒 Inventory" />
          <div className="space-y-8">
            {Object.entries(skills).map(([cat, items], ci) => (
              <Block key={cat} delay={ci * 0.1}>
                <div className="font-pixel text-xs text-secondary mb-3">▸ {cat}</div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {items.map((s, i) => (
                    <motion.div
                      key={s.name}
                      initial={{ opacity: 0, scale: 0.5, y: 10 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
                      whileHover={{ y: -6, scale: 1.15, rotate: [-3, 3, -2, 0] }}
                      className="group relative flex flex-col items-center justify-center text-center p-2 cursor-pointer"
                    >
                      {/* glow aura */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                        style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.55), transparent 65%)" }}
                      />
                      {/* sparkle particles on hover */}
                      <span className="pointer-events-none absolute -top-1 -left-1 h-1.5 w-1.5 bg-accent opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                      <span className="pointer-events-none absolute -top-2 right-0 h-1 w-1 bg-secondary opacity-0 group-hover:opacity-100 group-hover:animate-ping [animation-delay:120ms]" />
                      <span className="pointer-events-none absolute bottom-0 -right-1 h-1.5 w-1.5 bg-primary opacity-0 group-hover:opacity-100 group-hover:animate-ping [animation-delay:240ms]" />

                      <div className="relative h-10 w-10 mb-1 flex items-center justify-center animate-float-block" style={{ animationDelay: `${i * 0.12}s` }}>
                        {s.icon ? (
                          <img
                            src={s.icon}
                            alt={s.name}
                            loading="lazy"
                            className="h-10 w-10 object-contain drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)] group-hover:drop-shadow-[0_0_14px_hsl(var(--accent)/0.9)] transition-all"
                            style={{ imageRendering: "pixelated" }}
                          />
                        ) : (
                          <span className="text-3xl">{s.emoji}</span>
                        )}
                      </div>
                      <div className="relative font-pixel text-[9px] text-foreground/90 leading-tight group-hover:text-primary transition-colors">
                        {s.name}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Block>
            ))}
          </div>
        </div>
      </section>

      {/* RESUME — Enchanted Scroll */}
      <section id="resume" className="relative px-4 py-32 overflow-hidden">
        <EnchantGlyphs count={16} />
        <div className="mx-auto max-w-3xl">
          <SectionHeader tag="LOCATION 05" title="📄 Enchanted Scroll" />
          <Block>
            <div
              className="pixel-border bg-card p-8 text-center relative overflow-hidden"
              style={{ boxShadow: "0 0 40px var(--gold, #c9a84c)55, inset 0 0 30px var(--gold, #c9a84c)22" }}
            >
              {/* sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white"
                  style={{ left: `${10 + i * 11}%`, top: "10%", boxShadow: "0 0 8px var(--gold, #c9a84c)" }}
                  animate={{ y: [0, 220, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl mb-4 inline-block"
                style={{ filter: "drop-shadow(0 0 16px #c9a84c)" }}
              >
                📜
              </motion.div>
              <div className="font-pixel text-[10px] text-accent tracking-widest mb-2 animate-blink">▸ LEGENDARY ITEM ◂</div>
              <h3 className="font-pixel text-xl md:text-2xl text-primary mb-3">Lokesh's Resume</h3>
              <p className="font-display text-lg text-foreground/90 mb-6">
                A scroll of accomplishments, skills, and quests undertaken. Open to read or claim a copy for your own inventory.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/Lokesh_Hazra_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="pixel-btn text-center"
                >
                  📖 VIEW SCROLL ↗
                </a>
                <a
                  href="/Lokesh_Hazra_Resume.pdf"
                  download="Lokesh_Hazra_Resume.pdf"
                  className="pixel-btn pixel-btn-purple text-center"
                >
                  ⬇ DOWNLOAD .PDF
                </a>
              </div>
            </div>
          </Block>
        </div>
      </section>

      {/* CONTACT — Sender Chest */}
      <ContactSection />

      {/* FOOTER */}

      <BedrockStrip />
      <footer className="relative px-4 py-16 text-center">
        <Block>
          <div className="pixel-border inline-block bg-card px-6 py-4">
            <div className="font-pixel text-[10px] text-muted-foreground mb-2">END OF WORLD</div>
            <p className="font-display text-lg">Thanks for exploring the LokeshVerse.</p>
            <a href="https://github.com/Lokesh-069" target="_blank" rel="noreferrer" className="font-pixel text-xs text-primary hover:text-secondary mt-2 inline-block">
              github.com/Lokesh-069 ↗
            </a>
          </div>
        </Block>
      </footer>

      {/* PROJECT MODAL */}
      {selected !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur p-4" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="pixel-border bg-card max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-6xl">{projects[selected].icon}</div>
              <button onClick={() => setSelected(null)} className="font-pixel text-xs text-muted-foreground hover:text-destructive">✕ CLOSE</button>
            </div>
            <div className="font-pixel text-[10px] text-accent mb-1">{projects[selected].structure}</div>
            <h3 className="font-pixel text-xl text-primary mb-3">{projects[selected].name}</h3>
            <p className="font-display text-lg mb-4">{projects[selected].description}</p>
            <div className="mb-4">
              <div className="font-pixel text-[10px] text-secondary mb-2">▸ TECH STACK</div>
              <div className="flex flex-wrap gap-2">
                {projects[selected].tech.map((t) => (
                  <span key={t} className="pixel-border bg-muted px-2 py-1 font-pixel text-[9px]">{t}</span>
                ))}
              </div>
            </div>
            {projects[selected].github && (
              <div className="flex gap-3">
                <a href={projects[selected].github} target="_blank" rel="noreferrer" className="pixel-btn flex-1 text-center">GitHub ↗</a>
                <a href={projects[selected].live} target="_blank" rel="noreferrer" className="pixel-btn pixel-btn-purple flex-1 text-center">Live ↗</a>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* AI Villager */}
      <button
        onClick={() => setChat((c) => !c)}
        className="fixed bottom-6 right-6 z-40 pixel-border bg-card p-3 hover:scale-110 transition-transform"
        title="Chat with villager"
      >
        <div className="text-3xl">🧙</div>
      </button>
      {chat && (
        <div className="fixed bottom-24 right-6 z-40 pixel-border bg-card w-80 max-w-[calc(100vw-2rem)] flex flex-col" style={{ height: 420 }}>
          <div className="font-pixel text-[10px] bg-secondary text-secondary-foreground p-3 flex justify-between">
            <span>▸ VILLAGER GUIDE</span>
            <button onClick={() => setChat(false)}>✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chatLog.map((m, i) => (
              <div key={i} className={`font-display text-sm ${m.from === "user" ? "text-right" : ""}`}>
                <div className={`inline-block px-3 py-2 pixel-border max-w-[85%] ${m.from === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-border flex gap-1 flex-wrap">
            {["Projects?", "Skills?", "Awards?"].map((q) => (
              <button key={q} onClick={() => ask(q)} className="font-pixel text-[9px] px-2 py-1 pixel-border bg-muted hover:bg-primary hover:text-primary-foreground">
                {q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); if (input.trim()) ask(input); }}
            className="p-2 border-t border-border flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-input px-2 py-1 font-display text-sm pixel-border"
            />
            <button className="pixel-btn !py-1 !px-3 !text-[10px]">SEND</button>
          </form>
        </div>
      )}
    </div>
  );
}
