// app/api/models/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ModelListSchema } from './contract';
import { BedrockModel } from '@/lib/bedrock-model';
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
    try {
        // Retrieve all models supported by Bedrock
        const bedrockModel = new BedrockModel();
        const models = bedrockModel.list_models();

        return NextResponse.json(ModelListSchema.parse({ models }));
    } catch (error) {
        logger(error);
        return NextResponse.json({ error: 'Unable to retrieve models' }, { status: 500 });
    }
}
