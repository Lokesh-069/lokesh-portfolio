import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { Loader2, Send, Mail, User, MessageSquare, Tag } from "lucide-react";
import { AmbientParticles } from "./MinecraftFX";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  subject: z.string().trim().min(2, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});

type FormData = z.infer<typeof schema>;
type Errors = Partial<Record<keyof FormData, string>>;

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

export function ContactSection() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const update = (key: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      parsed.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as keyof FormData] = i.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: parsed.data.name,
          from_email: parsed.data.email,
          subject: parsed.data.subject,
          message: parsed.data.message,
          to_email: "lokeshhazraiem28@gmail.com",
          reply_to: parsed.data.email,
        },
        { publicKey: PUBLIC_KEY },
      );
      toast.success("Message sent! Lokesh will reply soon ✨");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send. Please try again or email directly.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (key: keyof FormData) =>
    `w-full bg-white/5 backdrop-blur-md border ${
      errors[key] ? "border-destructive/60" : "border-white/15"
    } rounded-xl px-4 py-3 pl-11 font-display text-lg text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary/60 focus:bg-white/10 focus:shadow-glow`;

  return (
    <section id="contact" className="relative px-4 py-32 overflow-hidden">
      <AmbientParticles count={18} color="#34d399" />
      {/* Glow backdrops */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <div className="font-pixel text-[10px] text-primary tracking-widest mb-3">▸ LOCATION 06 ◂</div>
          <h2 className="font-pixel text-2xl md:text-4xl text-shadow-block bg-gradient-to-b from-foreground to-primary bg-clip-text text-transparent">
            ✉️ Get In Touch
          </h2>
          <p className="font-display text-base md:text-lg text-muted-foreground mt-3">
            Drop a message — it travels straight to Lokesh's inbox.
          </p>
        </div>

        <motion.form
          ref={formRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={onSubmit}
          className="relative rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 md:p-8 space-y-5 shadow-glow"
        >
          {/* Name */}
          <div>
            <label className="font-pixel text-[10px] text-accent block mb-2">▸ FULL NAME</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={fieldClass("name")}
                placeholder="Steve Minecraft"
                maxLength={100}
                disabled={loading}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-destructive font-display">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="font-pixel text-[10px] text-accent block mb-2">▸ EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={fieldClass("email")}
                placeholder="you@domain.com"
                maxLength={255}
                disabled={loading}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-destructive font-display">{errors.email}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="font-pixel text-[10px] text-accent block mb-2">▸ SUBJECT</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                className={fieldClass("subject")}
                placeholder="Let's build something epic"
                maxLength={200}
                disabled={loading}
              />
            </div>
            {errors.subject && <p className="mt-1 text-xs text-destructive font-display">{errors.subject}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="font-pixel text-[10px] text-accent block mb-2">▸ MESSAGE</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className={`${fieldClass("message")} min-h-[150px] resize-y pt-3`}
                placeholder="Hey Lokesh, I'd love to..."
                maxLength={5000}
                disabled={loading}
              />
            </div>
            {errors.message && <p className="mt-1 text-xs text-destructive font-display">{errors.message}</p>}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className="relative w-full overflow-hidden rounded-xl border border-primary/40 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] px-6 py-4 font-pixel text-xs uppercase tracking-wider text-primary-foreground shadow-glow transition-[background-position] duration-500 hover:bg-right disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  SENDING...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  SEND MESSAGE
                </>
              )}
            </span>
          </motion.button>

          <div className="font-pixel text-[9px] text-muted-foreground text-center pt-1">
            Or email directly: <a href="mailto:lokeshhazraiem28@gmail.com" className="text-primary hover:underline">lokeshhazraiem28@gmail.com</a>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
