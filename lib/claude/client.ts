import Groq from 'groq-sdk';

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export const MODEL = 'llama-3.3-70b-versatile';

export type MessageContent =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export function buildMessage(
  text: string,
  imageBase64?: string,
  mediaType: string = 'image/jpeg',
): MessageContent[] {
  const content: MessageContent[] = [];
  if (imageBase64) {
    content.push({
      type: 'image_url',
      image_url: {
        url: `data:${mediaType};base64,${imageBase64}`,
      },
    });
  }
  content.push({ type: 'text', text });
  return content;
}

export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  imageBase64?: string,
  mediaType?: string,
): Promise<string> {
  const messages: any[] = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: buildMessage(userMessage, imageBase64, mediaType) as any,
    },
  ];

  const response = await groq.chat.completions.create({
    model: MODEL,
    max_tokens: 4096,
    messages,
  });

  const message = response.choices[0]?.message;
  return message?.content ?? '';
}

export async function callClaudeJSON<T>(
  systemPrompt: string,
  userMessage: string,
  imageBase64?: string,
  mediaType?: string,
): Promise<T> {
  const raw = await callClaude(systemPrompt, userMessage, imageBase64, mediaType);
  const match = raw.match(/```json\s*([\s\S]*?)```/) ?? raw.match(/\{[\s\S]*\}/);
  const jsonStr = match ? (match[1] ?? match[0]) : raw;
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(raw.slice(start, end + 1)) as T;
    }
    throw new Error('Failed to parse LLM response as JSON');
  }
}

export { callClaude };
