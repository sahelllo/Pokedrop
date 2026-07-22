"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Msg {
  id: number;
  from: "bot" | "user";
  text: string;
}

// Kleiner, skript-basierter Support-Assistent (kein Backend nötig).
const QUICK: { q: string; a: string }[] = [
  {
    q: "Wie funktioniert der Radius?",
    a: "Stell oben deinen Standort und den Umkreis (5–500 km) ein. Der Feed und die Karte zeigen dann nur Deals & Events, deren teilnehmende Filiale innerhalb deines Radius liegt.",
  },
  {
    q: "Wie lege ich einen Preisalarm an?",
    a: "Öffne ein Produkt und tippe auf den Button Benachrichtige mich. Du kannst bei UVP, unter einem Wunschpreis oder bei jedem Restock alarmiert werden – lokal oder deutschlandweit.",
  },
  {
    q: "Was bringt Premium?",
    a: "Sofortige Push-Alerts (statt bis 15 Min. verzögert), PokéRadar-Auto-Suche, Kalender-Integration, Preisverlauf und Deal Intelligence. 4,99 €/Monat, jederzeit kündbar.",
  },
  {
    q: "Wie funktioniert der Scanner?",
    a: "Der Karten-Scanner nutzt deine Handykamera, um eine Karte zu erkennen und direkt Preis & Angebote anzuzeigen. (Die Erkennung ist aktuell eine Demo auf Basis der Beispiel-Datenbank.)",
  },
];

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Msg[]>([
    { id: 0, from: "bot", text: "Hi! 👋 Ich bin der PokeDrop-Assistent. Wobei kann ich helfen?" },
  ]);
  const [input, setInput] = React.useState("");
  const nextId = React.useRef(1);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function botReply(userText: string) {
    const found = QUICK.find((q) => q.q === userText);
    const answer =
      found?.a ??
      "Danke für deine Nachricht! Für die Demo antworte ich auf die Vorschläge oben. Schau sonst in die Bereiche Deals, Live, Scanner, Portfolio & Premium – oder frag konkret nach Radius, Alerts oder Premium.";
    setTimeout(() => {
      setMessages((m) => [...m, { id: nextId.current++, from: "bot", text: answer }]);
    }, 500);
  }

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { id: nextId.current++, from: "user", text: t }]);
    setInput("");
    botReply(t);
  }

  return (
    <>
      {/* Floating-Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Support-Chat"
        className={cn(
          "fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-glow-blue transition-transform hover:scale-105 active:scale-95 lg:bottom-6",
          "bg-gradient-to-br from-primary to-secondary text-white",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "chat"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400" />
          </span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed bottom-40 right-4 z-50 flex h-[460px] w-[min(92vw,360px)] flex-col overflow-hidden rounded-3xl border border-border glass shadow-glow lg:bottom-24"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 border-b border-border bg-surface/70 p-3.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold leading-tight">PokeDrop-Support</p>
                <p className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Meist in Minuten hier
                </p>
              </div>
            </div>

            {/* Verlauf */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3.5">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                      m.from === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-2 text-foreground",
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Schnellfragen */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK.map((q) => (
                  <button
                    key={q.q}
                    onClick={() => send(q.q)}
                    className="rounded-full border border-border bg-surface/60 px-2.5 py-1 text-[11px] text-muted-foreground transition hover:text-foreground"
                  >
                    {q.q}
                  </button>
                ))}
              </div>
            </div>

            {/* Eingabe */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border p-2.5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Frag etwas…"
                className="h-9 flex-1 rounded-full border border-input bg-surface/60 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:brightness-110"
                aria-label="Senden"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
