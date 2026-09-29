import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SYSTEM_PROMPT =
  "You are a warm, gentle companion for new mothers. You are NOT a therapist and you NEVER diagnose. You NEVER give medical advice. You always validate feelings first before anything else. You speak like a kind older sister who has been through it. You use casual, warm language. You occasionally say 'mama'. You never sound clinical or robotic. If the user mentions self-harm or harming the baby, you gently urge them to call a helpline immediately. Keep responses short: 2-4 sentences.";

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
});

export const sendChat = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const msgs = [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages];
    const attempts: { url: string; key?: string; model: string }[] = [
      {
        url: "https://api.deepseek.com/chat/completions",
        key: process.env["DEEPSEEK_API_KEY"],
        model: "deepseek-chat",
      },
      {
        url: "https://ai.gateway.lovable.dev/v1/chat/completions",
        key: process.env["LOVABLE_API_KEY"],
        model: "google/gemini-3-flash-preview",
      },
    ];
    for (const a of attempts) {
      if (!a.key) continue;
      try {
        const res = await fetch(a.url, {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${a.key}` },
          body: JSON.stringify({ model: a.model, temperature: 0.8, messages: msgs }),
        });
        if (!res.ok) {
          console.error("Chat provider error", a.url, res.status, await res.text());
          continue;
        }
        const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const reply = json.choices?.[0]?.message?.content?.trim();
        if (reply) return { reply };
      } catch (e) {
        console.error("Chat provider failed", a.url, e);
      }
    }
    return {
      reply: "Something went wrong on my end, mama. Give it another try in a moment — I'm still here.",
    };
  });
