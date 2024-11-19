import { z } from '@hono/zod-openapi'
const objectSchema = z
    .object({
        messages: z
            .array(
                z.object({
                    role: z.enum(['system', 'user', 'assistant']),
                    content: z.string(),
                })
            )
            .openapi({
                example: [
                    {
                        role: 'system',
                        content: 'Eres un asistente útil.',
                    },
                ],
            }),
        max_new_tokens: z.number().optional().default(128).openapi({
            example: 128,
        }),
        temperature: z.number().optional().default(0.7).openapi({
            example: 0.7,
        }),
    })
    .openapi('Messages')

export function validateMessagesSchema(object: unknown) {
    return objectSchema.safeParse(object)
}
