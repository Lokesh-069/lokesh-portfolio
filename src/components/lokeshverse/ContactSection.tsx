import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AmbientParticles } from "./MinecraftFX";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message required").max(5000),
});

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setStatus("sending");
    const { error: dbError } = await supabase.from("contact_messages").insert(parsed.data);
    if (dbError) {
      setStatus("error");
      setError("Failed to send. Try again.");
      return;
    }
    setStatus("sent");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="relative px-4 py-32 overflow-hidden">
      <AmbientParticles count={18} color="#34d399" />
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <div className="font-pixel text-[10px] text-primary tracking-widest mb-3">▸ LOCATION 06 ◂</div>
          <h2 className="font-pixel text-2xl md:text-4xl text-shadow-block bg-gradient-to-b from-foreground to-primary bg-clip-text text-transparent">
            ✉️ Sender Chest
          </h2>
          <p className="font-display text-base text-muted-foreground mt-3">
            Drop a message into the chest — it travels straight to Lokesh.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onSubmit={onSubmit}
          className="pixel-border bg-card p-6 space-y-4 relative"
        >
          <div>
            <label className="font-pixel text-[10px] text-accent block mb-2">▸ NAME</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-input px-3 py-2 font-display text-base pixel-border outline-none focus:ring-2 ring-primary"
              placeholder="Steve"
              maxLength={100}
            />
          </div>
          <div>
            <label className="font-pixel text-[10px] text-accent block mb-2">▸ EMAIL</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-input px-3 py-2 font-display text-base pixel-border outline-none focus:ring-2 ring-primary"
              placeholder="you@domain.com"
              maxLength={255}
            />
          </div>
          <div>
            <label className="font-pixel text-[10px] text-accent block mb-2">▸ MESSAGE</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-input px-3 py-2 font-display text-base pixel-border outline-none focus:ring-2 ring-primary min-h-[140px] resize-y"
              placeholder="Hey Lokesh, I'd love to..."
              maxLength={5000}
            />
          </div>

          {error && (
            <div className="font-pixel text-[10px] text-destructive">⚠ {error}</div>
          )}
          {status === "sent" && (
            <div className="font-pixel text-[10px] text-primary animate-blink">
              ✓ MESSAGE DELIVERED — Lokesh will reply soon!
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="pixel-btn flex-1 text-center disabled:opacity-60"
            >
              {status === "sending" ? "SENDING..." : "📦 SEND MESSAGE"}
            </button>
            <a
              href="mailto:lokeshhazraiem28@gmail.com"
              className="pixel-btn pixel-btn-purple flex-1 text-center"
            >
              ✉ DIRECT EMAIL ↗
            </a>
          </div>

          <div className="font-pixel text-[9px] text-muted-foreground text-center pt-2">
            Or reach me directly at <span className="text-primary">lokeshhazraiem28@gmail.com</span>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
