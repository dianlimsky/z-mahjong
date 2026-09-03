import { getGames, startGame } from './lib/storage.mjs'
const H = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
const res = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: H })
export default async (request) => {
  try {
    if (request.method === 'GET') return res(await getGames())
    if (request.method === 'POST') return res(await startGame((await request.json()).playerIds), 201)
    return res({ error: 'Method not allowed' }, 405)
  } catch (error) { return res({ error: error.message }, error.status || 500) }
}
export const config = { path: '/api/games' }
