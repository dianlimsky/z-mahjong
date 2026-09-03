import { getLeaderboard } from './lib/storage.mjs'
const H = { 'Content-Type': 'application/json' }
export default async () => {
  try { return new Response(JSON.stringify(await getLeaderboard()), { headers: H }) }
  catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: e.status || 500, headers: H }) }
}
export const config = { path: '/api/leaderboard' }
