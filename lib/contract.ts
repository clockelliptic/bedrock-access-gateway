import { z } from 'zod';

// Define the OpenAI Message schema
export const OpenAIMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

// Define the TextMember schema
export const TextMemberSchema = z.object({
  text: z.string(),
  image: z.never().optional(),
  document: z.never().optional(),
  toolUse: z.never().optional(),
  toolResult: z.never().optional(),
  guardContent: z.never().optional(),
  $unknown: z.never().optional(),
});

// Define the Message schema
export const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: TextMemberSchema,
});

// Transformation function to convert OpenAI message to the desired Message type
export const transformOpenAIMessage = (openAIMessage: unknown) => {
  const parsed = OpenAIMessageSchema.parse(openAIMessage);

  // Transform the parsed OpenAI message into the desired Message structure
  return {
    role: parsed.role,
    content: [{
      text: parsed.content,
    }],
  };
};
