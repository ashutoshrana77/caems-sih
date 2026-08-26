import { ENV } from "./_core/env";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function askCAEMS(messages: ChatMessage[]): Promise<string> {
  if (!ENV.googleAiStudioApiKey) throw new Error("Google AI Studio API key is not configured");
  const contents = messages.slice(-12).map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content.slice(0, 4000) }],
  }));
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(ENV.googleAiStudioApiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: "You are CAEMS Assist, a calm emergency-management guide for citizens, volunteers, and district authorities. Give concise, practical preparedness and response guidance. Never invent live alerts, locations, rescue availability, or official instructions. For immediate danger, tell the user to contact local emergency services and follow official authorities. Explain that you are a demo assistant when relevant. Respond in the language used by the user." }] },
      contents,
      generationConfig: { temperature: 0.25, maxOutputTokens: 500 },
    }),
  });
  if (!response.ok) throw new Error(`Gemini request failed with status ${response.status}`);
  const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
  if (!text) throw new Error("Gemini returned an empty response");
  return text;
}

export type { ChatMessage };
