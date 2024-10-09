// app/api/chat/contract.ts
import { z } from 'zod';

// Define schemas using zod
export const ChatRequestSchema = z.object({
    model: z.string(),
    messages: z.array(
        z.object({
            role: z.enum(['system', 'user', 'assistant']),
            content: z.string(),
        })
    ),
    stream: z.boolean().optional(),
});

export const ChatResponseSchema = z.object({
    id: z.string(),
    object: z.string(),
    model: z.string(),
    choices: z.array(
        z.object({
            index: z.number(),
            message: z.object({
                role: z.enum(['assistant']),
                content: z.string(),
            }),
            finish_reason: z.string().optional(),
        })
    ),
    usage: z.object({
        prompt_tokens: z.number(),
        completion_tokens: z.number(),
        total_tokens: z.number(),
    }),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
