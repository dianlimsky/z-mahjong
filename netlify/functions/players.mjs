import { getPlayers, createPlayer, updatePlayer, deletePlayer } from './lib/storage.mjs'
const H = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
const res = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: H })
export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: H })
  try {
    const path = new URL(request.url).pathname
    if (request.method === 'GET' && path === '/api/players') return res(await getPlayers())
    if (request.method === 'POST' && path === '/api/players') return res(await createPlayer((await request.json()).name), 201)
    const id = path.split('/').filter(Boolean).pop()
    if (request.method === 'PUT' && id) return res(await updatePlayer(id, (await request.json()).name))
    if (request.method === 'DELETE' && id) { await deletePlayer(id); return res({ success: true }) }
    return res({ error: 'Not found' }, 404)
  } catch (error) { return res({ error: error.message }, error.status || 500) }
}
export const config = { path: '/api/players' }
