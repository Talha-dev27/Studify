import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const MODEL = 'claude-sonnet-4-5';

export type MessageContent =
  | { type: 'text'; text: string }
  | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } };

export function buildMessage(
  text: string,
  imageBase64?: string,
  mediaType: string = 'image/jpeg',
): MessageContent[] {
  const content: MessageContent[] = [];
  if (imageBase64) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: mediaType, data: imageBase64 },
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
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: buildMessage(userMessage, imageBase64, mediaType) as any,
      },
    ],
  });

  const textBlock = message.content.find((b: any) => b.type === 'text');
  return (textBlock as any)?.text ?? '';
}

export async function callClaudeJSON<T>(
  systemPrompt: string,
  userMessage: string,
  imageBase64?: string,
  mediaType?: string,
): Promise<T> {
  const raw = await callClaude(systemPrompt, userMessage, imageBase64, mediaType);
  // Try to extract JSON from response (handles markdown ```json blocks)
  const match = raw.match(/```json\s*([\s\S]*?)```/) ?? raw.match(/\{[\s\S]*\}/);
  const jsonStr = match ? (match[1] ?? match[0]) : raw;
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    // Attempt a relaxed parse - find first { to last }
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(raw.slice(start, end + 1)) as T;
    }
    throw new Error('Failed to parse Claude response as JSON');
  }
}