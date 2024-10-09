// app/api/embeddings/contract.ts
import { z } from 'zod';

export const EmbeddingsRequestSchema = z.object({
    model: z.string(),
    input: z.union([z.string(), z.array(z.string())]),
    encoding_format: z.enum(['float', 'base64']).optional(),
});

export const EmbeddingsResponseSchema = z.object({
    model: z.string(),
    data: z.array(
        z.object({
            object: z.string(),
            embedding: z.union([z.array(z.number()), z.string()]),
            index: z.number(),
        })
    ),
    usage: z.object({
        prompt_tokens: z.number(),
        total_tokens: z.number(),
    }),
});

export type EmbeddingsRequest = z.infer<typeof EmbeddingsRequestSchema>;
export type EmbeddingsResponse = z.infer<typeof EmbeddingsResponseSchema>;
