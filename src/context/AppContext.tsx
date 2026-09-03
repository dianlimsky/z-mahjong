import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import type { Game, LeaderboardEntry, Player, PlayerStats, PreviousTable } from '../types'

interface AppCtx {
  players: Player[]
  leaderboard: LeaderboardEntry[]
  games: Game[]
  previousTables: PreviousTable[]
  playerStats: Record<string, PlayerStats | null>
  loading: boolean
  refreshPlayers: () => Promise<void>
  refreshLeaderboard: () => Promise<void>
  refreshGames: () => Promise<void>
  refreshPreviousTables: () => Promise<void>
  createPlayer: (name: string) => Promise<Player>
  updatePlayer: (id: string, name: string) => Promise<Player>
  deletePlayer: (id: string) => Promise<void>
  startGame: (playerIds: string[]) => Promise<Game>
  declareWinner: (gameId: string, winnerId: string) => Promise<Game>
  resetAll: (password: string) => Promise<void>
  fetchPlayerStats: (id: string) => Promise<PlayerStats>
}

const Ctx = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [previousTables, setPreviousTables] = useState<PreviousTable[]>([])
  const [playerStatsCache, setPlayerStatsCache] = useState<Record<string, PlayerStats>>({})
  const [loading, setLoading] = useState(true)

  const refreshPlayers = useCallback(async () => {
    const result = await api.getPlayers()
    if (Array.isArray(result)) setPlayers(result)
  }, [])
  const refreshLeaderboard = useCallback(async () => {
    const result = await api.getLeaderboard()
    if (Array.isArray(result)) setLeaderboard(result)
  }, [])
  const refreshGames = useCallback(async () => {
    const result = await api.getGames()
    if (Array.isArray(result)) setGames(result)
  }, [])
  const refreshPreviousTables = useCallback(async () => {
    const result = await api.getPreviousTables()
    if (Array.isArray(result)) setPreviousTables(result)
  }, [])

  useEffect(() => {
    ;(async () => {
      try { await Promise.all([refreshPlayers(), refreshLeaderboard(), refreshGames(), refreshPreviousTables()]) }
      catch { /* handled by individual pages */ }
      finally { setLoading(false) }
    })()
  }, [refreshPlayers, refreshLeaderboard, refreshGames, refreshPreviousTables])

  const createPlayer = useCallback(async (name: string) => { const p = await api.createPlayer(name); await Promise.all([refreshPlayers(), refreshLeaderboard()]); return p }, [refreshPlayers, refreshLeaderboard])
  const updatePlayer = useCallback(async (id: string, name: string) => { const p = await api.updatePlayer(id, name); await Promise.all([refreshPlayers(), refreshLeaderboard()]); return p }, [refreshPlayers, refreshLeaderboard])
  const deletePlayer = useCallback(async (id: string) => { await api.deletePlayer(id); await Promise.all([refreshPlayers(), refreshLeaderboard(), refreshGames(), refreshPreviousTables()]) }, [refreshPlayers, refreshLeaderboard, refreshGames, refreshPreviousTables])

  const startGame = useCallback(async (playerIds: string[]) => { const g = await api.startGame(playerIds); await refreshGames(); return g }, [refreshGames])
  const declareWinner = useCallback(async (gameId: string, winnerId: string) => {
    const g = await api.declareWinner(gameId, winnerId)
    await Promise.all([refreshLeaderboard(), refreshGames(), refreshPreviousTables()])
    return g
  }, [refreshLeaderboard, refreshGames, refreshPreviousTables])

  const fetchPlayerStats = useCallback(async (id: string) => {
    const stats = await api.getPlayerStats(id)
    setPlayerStatsCache(prev => ({ ...prev, [id]: stats }))
    return stats
  }, [])

  const resetAll = useCallback(async (password: string) => {
    await api.resetAll(password)
    await Promise.all([refreshGames(), refreshLeaderboard(), refreshPreviousTables()])
  }, [refreshGames, refreshLeaderboard, refreshPreviousTables])

  const value = useMemo(() => ({
    players, leaderboard, games, previousTables, playerStats: playerStatsCache, loading,
    refreshPlayers, refreshLeaderboard, refreshGames, refreshPreviousTables,
    createPlayer, updatePlayer, deletePlayer, startGame, declareWinner, resetAll, fetchPlayerStats,
  }), [players, leaderboard, games, previousTables, playerStatsCache, loading,
       refreshPlayers, refreshLeaderboard, refreshGames, refreshPreviousTables,
       createPlayer, updatePlayer, deletePlayer, startGame, declareWinner, resetAll, fetchPlayerStats])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
