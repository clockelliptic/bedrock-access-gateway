// lib/bedrock-model.ts
import { BedrockRuntimeClient, ConverseCommand, InvokeModelCommand, Message } from '@aws-sdk/client-bedrock-runtime';
import { ChatRequest, ChatResponse } from '@/app/api/chat/contract';
import { EmbeddingsRequest, EmbeddingsResponse } from '@/app/api/embeddings/contract';
import { logger } from '@/lib/utils/logger';
import { transformOpenAIMessage } from './contract';
import { randomUUID } from 'crypto';

const AWS_REGION = process.env.AWS_REGION || 'us-west-2';
const DEBUG = process.env.DEBUG === 'true';

// Initialize Bedrock Client
const bedrockClient = new BedrockRuntimeClient({ region: AWS_REGION });

export class BedrockModel {
    private supportedModels: Record<string, any> = {
        // Add supported model configurations here, similar to the original file
        "us.meta.llama3-2-90b-instruct-v1:0": { system: true, multimodal: true, tool_call: true },
        // Additional models...
    };

    list_models(): string[] {
        return Object.keys(this.supportedModels);
    }

    validate(chatRequest: ChatRequest): void {
        if (!(chatRequest.model in this.supportedModels)) {
            throw new Error(`Unsupported model ${chatRequest.model}`);
        }
    }

    async chat(chatRequest: ChatRequest): Promise<ChatResponse> {
        try {
            const command = new ConverseCommand({
                modelId: chatRequest.model,
                messages: chatRequest.messages.map(transformOpenAIMessage),
                // stream: chatRequest.stream, // always true?
            });

            const response = await bedrockClient.send(command);
            if (DEBUG) logger('Bedrock Response: ', response);
            
            return {
                id: response.$metadata.requestId ?? `randomUUID-${randomUUID()}`,
                model: chatRequest.model,
                choices: [
                    {
                        index: 0,
                        message: {
                            role: 'assistant',
                            content: response.output?.message?.content?.[0].text || '',
                        },
                        finish_reason: response.stopReason || '',
                    }
                ],
                usage: {
                    prompt_tokens: response.usage?.inputTokens || 0,
                    completion_tokens: response.usage?.outputTokens || 0,
                    total_tokens: (response.usage?.inputTokens || 0) + (response.usage?.outputTokens || 0),
                },
                object: 'chat.completion',
            };
        } catch (error) {
            logger(error);
            throw new Error('Failed to process chat request');
        }
    }
}

export class BedrockEmbeddingsModel {
    async embed(embeddingsRequest: EmbeddingsRequest): Promise<EmbeddingsResponse> {
        try {
            const command = new InvokeModelCommand({
                modelId: embeddingsRequest.model,
                body: JSON.stringify({
                    texts: Array.isArray(embeddingsRequest.input) ? embeddingsRequest.input : [embeddingsRequest.input],
                }),
                accept: 'application/json',
            });

            const response = await bedrockClient.send(command);
            const responseBody = JSON.parse(response.body?.toString() || '{}');

            if (DEBUG) logger('Bedrock Embeddings Response: ', responseBody);

            return {
                model: embeddingsRequest.model,
                data: responseBody.embeddings.map((embedding: number[], index: number) => ({
                    object: 'embedding',
                    embedding,
                    index,
                })),
                usage: {
                    prompt_tokens: responseBody.inputTextTokenCount || 0,
                    total_tokens: responseBody.inputTextTokenCount || 0,
                },
            };
        } catch (error) {
            logger(error);
            throw new Error('Failed to process embedding request');
        }
    }
}
