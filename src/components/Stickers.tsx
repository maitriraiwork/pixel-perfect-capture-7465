import type { CSSProperties } from "react";

type Sticker = { emoji: string; pos: string; rotate: number; size: string; delay: number };

const PAGES: Record<"home" | "talk" | "support", Sticker[]> = {
  home: [
    { emoji: "🌸", pos: "right-4 top-1", rotate: -8, size: "text-2xl", delay: 0 },
    { emoji: "🍼", pos: "left-1 top-28", rotate: 10, size: "text-xl", delay: 1.3 },
    { emoji: "☁️", pos: "right-8 top-72", rotate: 6, size: "text-2xl", delay: 0.6 },
    { emoji: "✨", pos: "left-5 top-[30rem]", rotate: -6, size: "text-lg", delay: 2 },
  ],
  talk: [
    { emoji: "🌸", pos: "right-4 top-1", rotate: -6, size: "text-2xl", delay: 0 },
    { emoji: "🤍", pos: "left-2 top-16", rotate: 8, size: "text-xl", delay: 1.1 },
    { emoji: "🧸", pos: "right-8 top-64", rotate: -8, size: "text-2xl", delay: 1.8 },
  ],
  support: [
    { emoji: "🌷", pos: "right-4 top-1", rotate: 8, size: "text-2xl", delay: 0 },
    { emoji: "🤍", pos: "left-2 top-20", rotate: -8, size: "text-xl", delay: 0.9 },
    { emoji: "💐", pos: "left-1 top-[22rem]", rotate: -6, size: "text-xl", delay: 1.6 },
    { emoji: "☁️", pos: "right-12 top-[34rem]", rotate: 6, size: "text-2xl", delay: 2.4 },
  ],
};

export function Stickers({ page }: { page: keyof typeof PAGES }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 select-none">
      {PAGES[page].map((s) => (
        <span
          key={`${s.emoji}-${s.pos}`}
          className={`sticker-float absolute ${s.pos} ${s.size} opacity-70`}
          style={
            {
              animationDelay: `${s.delay}s`,
              "--sticker-rotate": `${s.rotate}deg`,
            } as CSSProperties
          }
        >
          {s.emoji}
        </span>
      ))}
    </div>
  );
}
