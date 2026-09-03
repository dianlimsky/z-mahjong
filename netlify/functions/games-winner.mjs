import { declareWinner } from './lib/storage.mjs'
const H = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
const res = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: H })
export default async (request) => {
  try {
    if (request.method !== 'POST') return res({ error: 'Method not allowed' }, 405)
    const gameId = new URL(request.url).pathname.split('/').filter(Boolean).at(-2)
    const game = await declareWinner(gameId, (await request.json()).winnerId)
    return res(game)
  } catch (error) { return res({ error: error.message }, error.status || 500) }
}
export const config = { path: '/api/games/:id/winner' }
