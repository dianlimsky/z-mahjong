import { getStore } from '@netlify/blobs'

const H = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
const res = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: H })

export default async (request) => {
  if (request.method === 'OPTIONS') return res(null, 204)
  if (request.method !== 'POST') return res({ error: 'Method not allowed' }, 405)

  const { password } = await request.json().catch(() => ({}))
  if (password !== 'hu') return res({ error: 'Incorrect password.' }, 403)

  const store = getStore({ name: 'z-mahjong' })
  await store.set('games.json', JSON.stringify([]), { contentType: 'application/json' })
  return res({ success: true })
}

export const config = { path: '/api/reset' }
