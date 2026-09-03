import { getPlayers, createPlayer, updatePlayer, deletePlayer, getPlayerStats } from './lib/storage.mjs'
const H = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
const res = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: H })
export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: H })
  try {
    const url = new URL(request.url)
    const segments = url.pathname.split('/').filter(Boolean) // ['api', 'players', ...]
    const id = segments[2] || null
    const sub = segments[3] || null // 'stats' or undefined

    // /api/players (no id)
    if (!id) {
      if (request.method === 'GET') return res(await getPlayers())
      if (request.method === 'POST') return res(await createPlayer((await request.json()).name), 201)
      return res({ error: 'Not found' }, 404)
    }

    // /api/players/:id/stats
    if (id && sub === 'stats') {
      if (request.method === 'GET') return res(await getPlayerStats(id))
      return res({ error: 'Method not allowed' }, 405)
    }

    // /api/players/:id
    if (id && !sub) {
      if (request.method === 'PUT') return res(await updatePlayer(id, (await request.json()).name))
      if (request.method === 'DELETE') { await deletePlayer(id); return res({ success: true }) }
      return res({ error: 'Method not allowed' }, 405)
    }

    return res({ error: 'Not found' }, 404)
  } catch (error) { return res({ error: error.message }, error.status || 500) }
}
export const config = { path: '/api/players*' }
