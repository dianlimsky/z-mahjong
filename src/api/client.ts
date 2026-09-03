import type { Game, LeaderboardEntry, Player, PreviousTable } from '../types'

export interface PlayerStats {
  wins: number
  gamesPlayed: number
  winRate: number
  lastWin: string | null
  winHistory: { gameId: string; date: string; result: 'win' | 'loss' }[]
}

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const localPlayersKey = 'z-mahjong:players'
const localGamesKey = 'z-mahjong:games'

const samplePlayers: Player[] = [
  { id: 'local-john', name: 'John', createdAt: new Date().toISOString() },
  { id: 'local-mike', name: 'Mike', createdAt: new Date().toISOString() },
  { id: 'local-sarah', name: 'Sarah', createdAt: new Date().toISOString() },
  { id: 'local-david', name: 'David', createdAt: new Date().toISOString() },
]

function localRead<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key)
  if (raw) return JSON.parse(raw) as T
  localStorage.setItem(key, JSON.stringify(fallback))
  return fallback
}
function localWrite<T>(key: string, value: T) { localStorage.setItem(key, JSON.stringify(value)) }
function localLeaderboard(players: Player[], games: Game[]): LeaderboardEntry[] {
  const complete = games.filter(g => g.completedAt && g.winnerId); const wins = new Map<string, number>(); const played = new Map<string, number>(); const last = new Map<string, string>()
  complete.forEach(g => { g.playerIds.forEach(id => played.set(id, (played.get(id) ?? 0) + 1)); if (g.winnerId) { wins.set(g.winnerId, (wins.get(g.winnerId) ?? 0) + 1); if (!last.has(g.winnerId) || g.completedAt! > last.get(g.winnerId)!) last.set(g.winnerId, g.completedAt!) } })
  return players.map(player => { const w = wins.get(player.id) ?? 0; const p = played.get(player.id) ?? 0; return { player, wins: w, gamesPlayed: p, winRate: p ? Math.round(w / p * 1000) / 10 : 0, lastWin: last.get(player.id) ?? null } }).sort((a, b) => b.wins - a.wins || b.winRate - a.winRate)
}
function localPreviousTables(players: Player[], games: Game[]): PreviousTable[] { const groups = new Map<string, { ids: string[]; count: number; last: string }>(); const ids = new Set(players.map(p => p.id)); games.filter(g => g.playerIds.length === 4).sort((a,b) => (b.startedAt).localeCompare(a.startedAt)).forEach(g => { const ordered = [...g.playerIds].sort(); const key = ordered.join(':'); const used = g.completedAt ?? g.startedAt; const old = groups.get(key); if (old) { old.count++; if (used > old.last) old.last = used } else groups.set(key, { ids: ordered, count: 1, last: used }) }); return [...groups.values()].sort((a,b) => b.last.localeCompare(a.last)).map(g => ({ groupKey: g.ids.join(':'), playerIds: g.ids, gameCount: g.count, lastUsedAt: g.last, unavailablePlayerIds: g.ids.filter(id => !ids.has(id)) })) }

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) }, ...options })
  const payload = await response.json().catch(() => ({})) as { error?: string } & T
  if (!response.ok) throw new ApiError(payload.error ?? 'Something went wrong.', response.status)
  return payload
}

export const api = {
  getPlayers: async (): Promise<Player[]> => isLocal ? localRead(localPlayersKey, samplePlayers) : request('/api/players'),
  createPlayer: async (name: string): Promise<Player> => { if (!isLocal) return request('/api/players', { method: 'POST', body: JSON.stringify({ name }) }); const players = localRead(localPlayersKey, samplePlayers); const n = name.trim(); if (!n) throw new ApiError('Name is required.', 400); if (players.some(p => p.name.toLowerCase() === n.toLowerCase())) throw new ApiError('A player with this name already exists.', 409); const p = { id: `local-${crypto.randomUUID()}`, name: n, createdAt: new Date().toISOString() }; localWrite(localPlayersKey, [...players, p]); return p },
  updatePlayer: async (id: string, name: string): Promise<Player> => { if (!isLocal) return request(`/api/players/${id}`, { method: 'PUT', body: JSON.stringify({ name }) }); const players = localRead(localPlayersKey, samplePlayers); const i = players.findIndex(p => p.id === id); if (i < 0) throw new ApiError('Player not found.', 404); const updated = { ...players[i], name: name.trim() }; players[i] = updated; localWrite(localPlayersKey, players); return updated },
  deletePlayer: async (id: string) => { if (!isLocal) return request(`/api/players/${id}`, { method: 'DELETE' }); const players = localRead(localPlayersKey, samplePlayers); localWrite(localPlayersKey, players.filter(p => p.id !== id)); return { success: true as const } },
  getGames: async (): Promise<Game[]> => isLocal ? localRead<Game[]>(localGamesKey, []) : request<Game[]>('/api/games'),
  startGame: async (playerIds: string[]): Promise<Game> => { if (!isLocal) return request<Game>('/api/games', { method: 'POST', body: JSON.stringify({ playerIds }) }); const games = localRead<Game[]>(localGamesKey, []); const g: Game = { id: `local-game-${crypto.randomUUID()}`, startedAt: new Date().toISOString(), completedAt: null, playerIds: [...playerIds].sort(), winnerId: null }; localWrite(localGamesKey, [...games, g]); return g },
  declareWinner: async (id: string, winnerId: string): Promise<Game> => { if (!isLocal) return request<Game>(`/api/games/${id}/winner`, { method: 'POST', body: JSON.stringify({ winnerId }) }); const games = localRead<Game[]>(localGamesKey, []); const i = games.findIndex((g: Game) => g.id === id); if (i < 0) throw new ApiError('Game not found.', 404); if (games[i].completedAt) throw new ApiError('This game already has a winner.', 409); games[i] = { ...games[i], completedAt: new Date().toISOString(), winnerId }; localWrite(localGamesKey, games); return games[i] },
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => { if (!isLocal) return request<LeaderboardEntry[]>('/api/leaderboard'); return localLeaderboard(localRead<Player[]>(localPlayersKey, samplePlayers), localRead<Game[]>(localGamesKey, [])) },
  getPreviousTables: async (): Promise<PreviousTable[]> => { if (!isLocal) return request<PreviousTable[]>('/api/previous-tables'); return localPreviousTables(localRead<Player[]>(localPlayersKey, samplePlayers), localRead<Game[]>(localGamesKey, [])) },
  getPlayerStats: async (id: string): Promise<PlayerStats> => { if (!isLocal) return request<PlayerStats>(`/api/players/${id}/stats`); const games = localRead<Game[]>(localGamesKey, []); const complete = games.filter((g: Game) => g.completedAt && g.playerIds.includes(id)).sort((a: Game, b: Game) => b.completedAt!.localeCompare(a.completedAt!)); const ws = complete.filter((g: Game) => g.winnerId === id); return { wins: ws.length, gamesPlayed: complete.length, winRate: complete.length ? Math.round(ws.length / complete.length * 1000) / 10 : 0, lastWin: ws[0]?.completedAt ?? null, winHistory: complete.map((g: Game) => ({ gameId: g.id, date: g.completedAt!, result: g.winnerId === id ? 'win' as const : 'loss' as const })) } },
  resetAll: async (password: string): Promise<void> => { if (!isLocal) { await request('/api/reset', { method: 'POST', body: JSON.stringify({ password }) }); return } if (password !== 'hu') throw new ApiError('Incorrect password.', 403); localWrite(localGamesKey, []) },
}

export { ApiError }
