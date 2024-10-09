// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ChatRequestSchema, ChatResponseSchema } from './contract';
import { logger } from '@/lib/utils/logger';
import { BedrockModel } from '@/lib/bedrock-model';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const chatRequest = ChatRequestSchema.parse(body);

        // TODO: add streaming support
        // const encoder = new TextEncoder();
        // const decoder = new TextDecoder();

        // Use BedrockModel to handle chat request
        const bedrockModel = new BedrockModel();
        const chatResponse = bedrockModel.chat(chatRequest);

        return NextResponse.json(ChatResponseSchema.parse(chatResponse));
    } catch (error) {
        logger(error);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
