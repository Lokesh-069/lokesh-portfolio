import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

export type Certificate = {
  id: string;
  title: string;
  category: "Hackathon" | "Participation" | "Achievement" | "Competition" | "AI / ML" | "Events";
  date?: string;
  organization: string;
  type: "Participation" | "Winner" | "Finalist";
  previewImage?: string;
  pdfLink?: string;
  achievementLevel: "bronze" | "silver" | "gold" | "diamond";
};

const CERTIFICATES: Certificate[] = [
  { id: "c1", title: "Poster Presentation — AI in Healthcare Robotics", category: "AI / ML", date: "Feb 2026", organization: "Dept. of Robotics & AI, IEM Newtown", type: "Participation", achievementLevel: "silver", previewImage: "/certificates/cert-01.jpg" },
  { id: "c2", title: "SnowStorm Hackathon", category: "Hackathon", organization: "Tech4Hack", type: "Participation", achievementLevel: "bronze", previewImage: "/certificates/cert-02.jpg" },
  { id: "c3", title: "Quiz Competition", category: "Competition", date: "Feb 2026", organization: "UEM Kolkata", type: "Participation", achievementLevel: "bronze", previewImage: "/certificates/cert-03.jpg" },
  { id: "c4", title: "ML Canvas 4.0", category: "AI / ML", date: "Jan 2026", organization: "Dept. of CSE (AI & ML), UEM Kolkata", type: "Participation", achievementLevel: "silver", previewImage: "/certificates/cert-04.jpg" },
  { id: "c5", title: "IgniteX 2.0", category: "Events", date: "Jan 2026", organization: "IMI Kolkata — Flagship Tech-Fest", type: "Participation", achievementLevel: "bronze", previewImage: "/certificates/cert-05.jpg" },
  { id: "c6", title: "Hack2Hire — AI-Powered Interview Hackathon", category: "Hackathon", date: "Feb 2026", organization: "UnsaidTalks Education", type: "Participation", achievementLevel: "silver", previewImage: "/certificates/cert-06.jpg" },
  { id: "c14", title: "TechSprint 2026 — Participation", category: "Hackathon", organization: "GDG On Campus UEM Kolkata × Hack2skill", type: "Participation", achievementLevel: "silver", previewImage: "/certificates/cert-07.jpg" },
  { id: "c7", title: "TechSprint 2026 — Top 10 Finalist", category: "Achievement", organization: "GDG On Campus UEM Kolkata × Hack2skill", type: "Finalist", achievementLevel: "gold", previewImage: "/certificates/cert-08.jpg" },
  { id: "c8", title: "DoubleSlash 4.0", category: "Hackathon", organization: "IEEE Jadavpur University Student Branch", type: "Participation", achievementLevel: "bronze", previewImage: "/certificates/cert-09.jpg" },
  { id: "c15", title: "CodeShield — 1st Position", category: "Achievement", date: "Mar 2026", organization: "Cyber Odyssey 2.0, UEM Kolkata", type: "Winner", achievementLevel: "diamond", previewImage: "/certificates/cert-10.jpg" },
  { id: "c9", title: "Brain-o-vate Project Competition", category: "Competition", date: "Mar 2026", organization: "IEEE CS SBC, UEM Kolkata", type: "Participation", achievementLevel: "silver", previewImage: "/certificates/cert-11.jpg" },
  { id: "c10", title: "CodeShield Cyber Hackathon — Participation", category: "Hackathon", date: "Mar 2026", organization: "Cyber Odyssey 2.0, UEM Kolkata", type: "Participation", achievementLevel: "silver", previewImage: "/certificates/cert-12.jpg" },
  { id: "c11", title: "APPFORGE — SRJAN 2K26", category: "Events", date: "Feb–Mar 2026", organization: "IEM Management House", type: "Participation", achievementLevel: "bronze", previewImage: "/certificates/cert-13.jpg" },
  { id: "c12", title: "TechSprint Hackathon 2025–26", category: "Hackathon", organization: "GDG on Campus VVIET Mysuru × Hack2Skill", type: "Participation", achievementLevel: "silver", previewImage: "/certificates/cert-14.jpg" },
  { id: "c13", title: "Kharagpur Data Science Hackathon", category: "AI / ML", organization: "Kharagpur Data Analytics Group, IIT Kharagpur", type: "Participation", achievementLevel: "silver", previewImage: "/certificates/cert-15.jpg" },
];

const FILTERS = ["All", "Hackathon", "Participation", "Achievement", "Competition", "AI / ML", "Events"] as const;

const levelColor = {
  bronze: "#cd7f32",
  silver: "#c0c0c0",
  gold: "var(--gold)",
  diamond: "var(--cyan-glow)",
};
const levelGlow = {
  bronze: "0 0 16px #cd7f32",
  silver: "0 0 18px #e5e5e5",
  gold: "0 0 22px var(--gold)",
  diamond: "0 0 30px var(--cyan-glow)",
};

function CertificateCard({ cert, onClick, index }: { cert: Certificate; onClick: () => void; index: number }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 30, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: (index % 8) * 0.04, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={{ y: -6, scale: 1.04, rotate: -1 }}
      onClick={onClick}
      className="pixel-border bg-card p-4 text-left relative overflow-hidden group"
      style={{ borderColor: "oklch(0 0 0 / 0.6)" }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${levelColor[cert.achievementLevel]}33, transparent 70%)` }}
      />
      {/* enchant sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0], y: [10, -20], x: [0, (i - 1) * 8] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
            style={{ left: `${30 + i * 20}%`, top: "70%", boxShadow: levelGlow[cert.achievementLevel] }}
          />
        ))}
      </div>
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="pixel-border p-2 flex items-center justify-center"
            style={{ background: `${levelColor[cert.achievementLevel]}22`, boxShadow: levelGlow[cert.achievementLevel], width: 56, height: 56 }}
          >
            <span className="text-2xl">
              {cert.type === "Winner" ? "🏆" : cert.type === "Finalist" ? "🥇" : cert.category === "AI / ML" ? "🧠" : cert.category === "Hackathon" ? "⚔️" : cert.category === "Competition" ? "🎯" : "📜"}
            </span>
          </motion.div>
          <span className="font-pixel text-[8px] px-2 py-1 pixel-border bg-muted uppercase">{cert.category}</span>
        </div>
        <h4 className="font-pixel text-[11px] leading-snug text-foreground mb-2 line-clamp-2">{cert.title}</h4>
        <p className="font-display text-sm text-muted-foreground line-clamp-1">{cert.organization}</p>
        {cert.date && <p className="font-pixel text-[8px] text-accent mt-2">{cert.date}</p>}
        <div className="mt-3 font-pixel text-[8px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">▸ INSPECT ITEM</div>
      </div>
    </motion.button>
  );
}

function TrophyChamber() {
  const trophies = [
    { icon: "🏆", title: "1ST PLACE", subtitle: "CodeShield Hackathon", note: "Cyber Odyssey 2026", color: "var(--gold)" },
    { icon: "🥇", title: "TOP 10 FINALIST", subtitle: "TechSprint 2026", note: "GDG × Hack2Skill", color: "var(--cyan-glow)" },
  ];
  return (
    <div className="mb-20">
      <div className="text-center mb-10">
        <div className="font-pixel text-[10px] text-accent tracking-widest mb-3 animate-blink">▸ PREMIUM ROOM ◂</div>
        <h3 className="font-pixel text-2xl md:text-3xl text-shadow-glow" style={{ color: "var(--gold)" }}>🏰 THE TROPHY CHAMBER</h3>
        <p className="font-display text-base text-muted-foreground mt-2">Winner • Innovation • Problem Solver</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {trophies.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative pixel-border p-8 text-center overflow-hidden"
            style={{
              background: `linear-gradient(180deg, oklch(0.18 0.06 270) 0%, ${t.color}22 100%)`,
              boxShadow: `0 0 40px ${t.color}66, inset 0 0 30px ${t.color}22`,
            }}
          >
            {/* spotlight */}
            <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: `radial-gradient(ellipse at top, ${t.color}44, transparent 70%)` }} />
            {/* confetti */}
            {[...Array(10)].map((_, k) => (
              <motion.div
                key={k}
                className="absolute w-2 h-2"
                style={{ left: `${10 + k * 9}%`, top: 0, background: k % 2 ? t.color : "var(--purple-glow)" }}
                animate={{ y: [0, 220], opacity: [1, 0], rotate: [0, 360] }}
                transition={{ duration: 3 + (k % 3), repeat: Infinity, delay: k * 0.3, ease: "linear" }}
              />
            ))}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-7xl mb-4 relative inline-block"
              style={{ filter: `drop-shadow(0 0 20px ${t.color})` }}
            >
              {t.icon}
            </motion.div>
            <div className="relative">
              <div className="font-pixel text-[10px] tracking-widest text-accent mb-2">ACHIEVEMENT UNLOCKED</div>
              <h4 className="font-pixel text-xl md:text-2xl text-shadow-glow mb-2" style={{ color: t.color }}>{t.title}</h4>
              <p className="font-display text-xl text-foreground">{t.subtitle}</p>
              <p className="font-display text-base text-muted-foreground">{t.note}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function HallOfKnowledge() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Certificate | null>(null);

  const filtered = useMemo(() => {
    return CERTIFICATES.filter((c) => {
      const matchFilter =
        filter === "All" ||
        c.category === filter ||
        (filter === "Achievement" && c.type !== "Participation");
      const q = query.toLowerCase().trim();
      const matchQuery = !q || c.title.toLowerCase().includes(q) || c.organization.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [filter, query]);

  return (
    <section id="achievements" className="relative px-4 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="font-pixel text-[10px] text-primary tracking-widest mb-3">▸ LOCATION 03 ◂</div>
          <h2 className="font-pixel text-2xl md:text-4xl text-shadow-block bg-gradient-to-b from-foreground to-primary bg-clip-text text-transparent">
            🏰 Hall of Knowledge
          </h2>
          <p className="font-display text-lg text-muted-foreground mt-3">Unlocks earned during the journey</p>
        </div>

        <TrophyChamber />

        {/* Search + filter */}
        <div className="pixel-border bg-card/80 backdrop-blur p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex-1 flex items-center gap-2 pixel-border bg-input px-3 py-2">
              <span className="text-base">🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search unlocks..."
                className="flex-1 bg-transparent outline-none font-display text-base"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`font-pixel text-[9px] px-3 py-2 pixel-border transition-colors ${
                    filter === f ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-secondary hover:text-secondary-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 font-pixel text-[9px] text-accent">
            ▸ {filtered.length} / {CERTIFICATES.length} ITEMS UNLOCKED
          </div>
          {/* XP bar */}
          <div className="mt-2 h-2 pixel-border bg-muted overflow-hidden">
            <motion.div
              className="h-full"
              style={{ background: "linear-gradient(90deg, var(--accent), var(--cyan-glow), var(--purple-glow))" }}
              initial={{ width: 0 }}
              animate={{ width: `${(filtered.length / CERTIFICATES.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((c, i) => (
              <CertificateCard key={c.id} cert={c} onClick={() => setActive(c)} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
        {filtered.length === 0 && (
          <div className="text-center py-16 font-pixel text-xs text-muted-foreground">
            ▸ NO ITEMS FOUND IN THIS CHEST ◂
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 backdrop-blur p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateX: -30 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateX: 30 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="pixel-border bg-card max-w-lg w-full p-6 relative overflow-hidden"
              style={{ boxShadow: levelGlow[active.achievementLevel] }}
            >
              {/* unlock burst */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 left-1/2 top-1/2"
                  style={{ background: levelColor[active.achievementLevel] }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((i / 12) * Math.PI * 2) * 200,
                    y: Math.sin((i / 12) * Math.PI * 2) * 200,
                    opacity: 0,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              ))}
              <div className="flex items-start justify-between mb-4 relative">
                <div className="font-pixel text-[9px] text-accent tracking-widest animate-blink">▸ CERTIFICATE UNLOCKED ◂</div>
                <button onClick={() => setActive(null)} className="font-pixel text-xs text-muted-foreground hover:text-destructive">✕</button>
              </div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl text-center mb-4"
                style={{ filter: `drop-shadow(0 0 20px ${levelColor[active.achievementLevel]})` }}
              >
                {active.type === "Winner" ? "🏆" : active.type === "Finalist" ? "🥇" : "📜"}
              </motion.div>
              <h3 className="font-pixel text-base text-primary mb-2 text-center">{active.title}</h3>
              <p className="font-display text-lg text-center text-foreground/90">{active.organization}</p>
              {active.date && <p className="font-pixel text-[9px] text-center text-accent mt-2">{active.date}</p>}
              <div className="grid grid-cols-2 gap-2 mt-5">
                <div className="pixel-border bg-muted p-3 text-center">
                  <div className="font-pixel text-[8px] text-muted-foreground mb-1">CATEGORY</div>
                  <div className="font-pixel text-[10px] text-primary">{active.category}</div>
                </div>
                <div className="pixel-border bg-muted p-3 text-center">
                  <div className="font-pixel text-[8px] text-muted-foreground mb-1">RARITY</div>
                  <div className="font-pixel text-[10px] uppercase" style={{ color: levelColor[active.achievementLevel] }}>
                    {active.achievementLevel}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setActive(null)} className="pixel-btn flex-1 text-center">CLOSE</button>
                {active.pdfLink && (
                  <a href={active.pdfLink} target="_blank" rel="noreferrer" className="pixel-btn pixel-btn-purple flex-1 text-center">VIEW PDF ↗</a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
