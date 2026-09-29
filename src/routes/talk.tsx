import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";

import { TabBar } from "@/components/TabBar";
import { sendChat } from "@/lib/chat.functions";

export const Route = createFileRoute("/talk")({
  head: () => ({
    meta: [
      { title: "Talk — MamaCare" },
      {
        name: "description",
        content: "A warm, judgement-free chat companion for new mothers, any time of day or night.",
      },
      { property: "og:title", content: "Talk — MamaCare" },
      {
        property: "og:description",
        content: "A warm, judgement-free chat companion for new mothers.",
      },
    ],
  }),
  component: Talk,
});

type Message = { role: "user" | "assistant"; content: string };

const QUICK_REPLIES = ["I'm exhausted", "I feel alone", "I can't stop worrying"];

function Talk() {
  const chat = useServerFn(sendChat);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi mama. I'm here, and I've got time. What's been sitting heavy on you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setTyping(true);
    try {
      const res = await chat({ data: { messages: next.slice(-20) } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "I couldn't reach you just then, mama. Try sending that once more?",
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TabBar />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-6 pt-6">
        <div className="flex-1 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-2xl bg-card px-4 py-4 shadow-sm">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="sticky bottom-0 mt-6 bg-background pt-3">
          <div className="flex flex-wrap gap-2 pb-3">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="rounded-full border border-primary bg-primary-soft px-4 py-2 text-xs text-accent-foreground"
              >
                {q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Say anything, mama…"
              className="h-12 flex-1 rounded-full border border-border bg-card px-5 text-sm text-card-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <button
              type="submit"
              disabled={typing || !input.trim()}
              className="h-12 rounded-full bg-primary px-6 text-sm text-primary-foreground disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
