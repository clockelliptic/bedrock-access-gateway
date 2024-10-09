// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ChatRequestSchema, ChatResponseSchema } from './contract';
import { BedrockModel } from '../../../utils/bedrock-model';
import { logger } from '../../../utils/logger';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const chatRequest = ChatRequestSchema.parse(body);

        // Use BedrockModel to handle chat request
        const bedrockModel = new BedrockModel();
        const chatResponse = bedrockModel.chat(chatRequest);

        return NextResponse.json(ChatResponseSchema.parse(chatResponse));
    } catch (error) {
        logger(error);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
