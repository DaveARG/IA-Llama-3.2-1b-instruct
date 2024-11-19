import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { pipeline } from '@huggingface/transformers'
import { validateMessagesSchema } from './validates/validate-login.js'

const app = new Hono()

console.log('🚀 ~ generator init')
const generator = await pipeline(
    'text-generation',
    'onnx-community/Llama-3.2-1B-Instruct'
)
console.log('🚀 ~ generator end')

app.post('/', async c => {
    const body = await c.req.json()
    const result = validateMessagesSchema(body)
    if (result.error) return c.json(result.error, 400)
    const { messages, max_new_tokens, temperature } = result.data

    try {
        const hora = new Date()
        const output = await generator(messages, {
            max_new_tokens,
            temperature,
        })
        const diff = new Date().getTime() - hora.getTime()
        return c.json({
            output: (output[0] as any).generated_text, //.at(-1).content
            time: `${Math.floor(diff / 1000 / 60)} minutos, ${
                Math.floor(diff / 1000) % 60
            } segundos, ${diff % 1000} milisegundos`,
        })
    } catch (e) {
        console.error(e)
        return c.json(e as {}, 417)
    }
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port,
})
