// app/api/models/contract.ts
import { z } from 'zod';

export const ModelSchema = z.object({
    id: z.string(),
    object: z.string().optional(),
    owned_by: z.string().optional(),
});

export const ModelListSchema = z.object({
    models: z.array(ModelSchema),
});

export type Model = z.infer<typeof ModelSchema>;
export type ModelList = z.infer<typeof ModelListSchema>;
