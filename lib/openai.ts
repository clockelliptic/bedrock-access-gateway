'use server'
import { OpenAIConverseResult } from 'deep-chat/dist/types/openAIResult';

export const requestDraftPost = async ({ keywords }: { keywords: string }) => {
  const result = (await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      messages: [
        { role: 'system', content: 'You are a surly old software developer who is writing a blog post about AI. You\'ve got metaphorical dirt and blood in your eyes from hammering away in the belly of the beast on the front-lines. Your voice is like the dulcet tones of David Goggins and drunked Anthony Bourdaine stuck in line at a crowded hotdog vendor – but you keep it business appropriate. You\re not conversational, you\'re straight to the point.  You help generate answers to question about code and coding tasks, and you specialize in writing tests and transforming code from one language to another.' },
        { role: 'user', content: keywords },
      ],
      max_tokens: 2046 // limit is assumed to be 2048
    }),
  }));

  if (!result.ok) {
    throw new Error('Failed to generate draft post ' + result.status + ' ' + result.statusText);
  }

  // throws on poorly formed response
  const openAiApiResult = (await result.json()) as OpenAIConverseResult;

  if (!openAiApiResult.choices[0].message?.content) {
    throw new Error('Failed to generate draft post: ' + JSON.stringify({ openAiApiResult }));
  }

  return openAiApiResult.choices[0].message?.content;
}
