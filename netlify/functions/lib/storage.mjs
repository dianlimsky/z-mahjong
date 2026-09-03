import { getStore } from '@netlify/blobs'
import { randomUUID } from 'node:crypto'

function store() { return getStore({ name: 'z-mahjong' }) }
const playersKey = 'players.json'; const gamesKey = 'games.json'
const readPlayers = async () => await store().get(playersKey, { type: 'json' }) || []
const writePlayers = async (v) => await store().setJSON(playersKey, v)
const readGames = async () => await store().get(gamesKey, { type: 'json' }) || []
const writeGames = async (v) => await store().setJSON(gamesKey, v)
const error = (message, status) => { throw Object.assign(new Error(message), { status }) }

export async function getPlayers() { return readPlayers() }
export async function createPlayer(name) {
  const players = await readPlayers(); const trimmed = String(name || '').trim()
  if (!trimmed) error('Name is required.', 400); if (trimmed.length > 40) error('Name is too long (max 40 characters).', 400)
  if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) error('A player with this name already exists.', 409)
  const player = { id: randomUUID(), name: trimmed, createdAt: new Date().toISOString() }; await writePlayers([...players, player]); return player
}
export async function updatePlayer(id, name) {
  const players = await readPlayers(); const idx = players.findIndex(p => p.id === id); if (idx < 0) error('Player not found.', 404)
  const trimmed = String(name || '').trim(); if (!trimmed) error('Name is required.', 400)
  if (players.some((p, i) => i !== idx && p.name.toLowerCase() === trimmed.toLowerCase())) error('A player with this name already exists.', 409)
  players[idx] = { ...players[idx], name: trimmed }; await writePlayers(players); return players[idx]
}
export async function deletePlayer(id) { const players = await readPlayers(); const next = players.filter(p => p.id !== id); if (next.length === players.length) error('Player not found.', 404); await writePlayers(next) }
export async function getGames() { return readGames() }
export async function startGame(playerIds) {
  if (!Array.isArray(playerIds) || playerIds.length !== 4) error('Exactly 4 players are required.', 400)
  if (new Set(playerIds).size !== 4) error('All 4 players must be unique.', 400)
  const players = await readPlayers(); const ids = new Set(players.map(p => p.id)); if (!playerIds.every(id => ids.has(id))) error('One or more players do not exist.', 400)
  const game = { id: randomUUID(), startedAt: new Date().toISOString(), completedAt: null, playerIds: [...playerIds].sort(), winnerId: null }; await writeGames([...(await readGames()), game]); return game
}
export async function declareWinner(gameId, winnerId) {
  const games = await readGames(); const idx = games.findIndex(g => g.id === gameId); if (idx < 0) error('Game not found.', 404)
  const game = games[idx]; if (game.completedAt) error('This game already has a winner.', 409); if (!game.playerIds.includes(winnerId)) error('Winner must be in this game.', 400)
  games[idx] = { ...game, completedAt: new Date().toISOString(), winnerId }; await writeGames(games); return games[idx]
}
export async function getLeaderboard() {
  const [players, games] = await Promise.all([readPlayers(), readGames()]); const completed = games.filter(g => g.completedAt && g.winnerId); const wc = new Map(), gc = new Map(), lw = new Map()
  completed.forEach(g => { g.playerIds.forEach(id => gc.set(id, (gc.get(id) || 0) + 1)); wc.set(g.winnerId, (wc.get(g.winnerId) || 0) + 1); if (!lw.has(g.winnerId) || g.completedAt > lw.get(g.winnerId)) lw.set(g.winnerId, g.completedAt) })
  return players.map(player => { const wins = wc.get(player.id) || 0; const gamesPlayed = gc.get(player.id) || 0; return { player, wins, gamesPlayed, winRate: gamesPlayed ? Math.round(wins / gamesPlayed * 1000) / 10 : 0, lastWin: lw.get(player.id) || null } }).sort((a, b) => b.wins - a.wins || b.winRate - a.winRate)
}
export function normalizePlayerIds(ids) { return [...ids].sort().join(':') }
export async function getPreviousTables() {
  const [players, games] = await Promise.all([readPlayers(), readGames()]); const ids = new Set(players.map(p => p.id)); const groups = new Map()
  ;[...games].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt)).forEach(g => { if (g.playerIds.length !== 4) return; const key = normalizePlayerIds(g.playerIds); const used = g.completedAt || g.startedAt; const e = groups.get(key); if (!e) groups.set(key, { ids: key.split(':'), count: 1, last: used }); else { e.count++; if (used > e.last) e.last = used } })
  return [...groups.values()].sort((a, b) => new Date(b.last) - new Date(a.last)).slice(0, 20).map(g => ({ groupKey: g.ids.join(':'), playerIds: g.ids, gameCount: g.count, lastUsedAt: g.last, unavailablePlayerIds: g.ids.filter(id => !ids.has(id)) }))
}
export async function getPlayerStats(id) {
  const [players, games] = await Promise.all([readPlayers(), readGames()]); if (!players.some(p => p.id === id)) error('Player not found.', 404)
  const complete = games.filter(g => g.completedAt && g.playerIds.includes(id)); const wins = complete.filter(g => g.winnerId === id).sort((a, b) => b.completedAt.localeCompare(a.completedAt))
  return { wins: wins.length, gamesPlayed: complete.length, winRate: complete.length ? Math.round(wins.length / complete.length * 1000) / 10 : 0, lastWin: wins[0]?.completedAt || null, winHistory: complete.sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 30).map(g => ({ gameId: g.id, date: g.completedAt, result: g.winnerId === id ? 'win' : 'loss' })) }
}
