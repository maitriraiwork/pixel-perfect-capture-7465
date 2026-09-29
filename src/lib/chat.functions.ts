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
    const apiKey = process.env["DEEPSEEK_API_KEY"];
    if (!apiKey) {
      return {
        reply:
          "I'm here with you, mama, but my voice isn't connected yet. Please add the chat key and try again.",
      };
    }

    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.8,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
      }),
    });

    if (!res.ok) {
      console.error("DeepSeek error", res.status, await res.text());
      return {
        reply:
          "Something went wrong on my end, mama. Give it another try in a moment — I'm still here.",
      };
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return {
      reply:
        json.choices?.[0]?.message?.content?.trim() ??
        "I'm here, mama. Tell me a little more about how today has felt.",
    };
  });
