// app/api/embeddings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { EmbeddingsRequestSchema, EmbeddingsResponseSchema } from './contract';
import { BedrockEmbeddingsModel } from '../../../utils/bedrock-model';
import { logger } from '../../../utils/logger';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const embeddingsRequest = EmbeddingsRequestSchema.parse(body);

        // Use BedrockEmbeddingsModel to handle embeddings request
        const embeddingsModel = new BedrockEmbeddingsModel();
        const embeddingsResponse = embeddingsModel.embed(embeddingsRequest);

        return NextResponse.json(EmbeddingsResponseSchema.parse(embeddingsResponse));
    } catch (error) {
        logger(error);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
