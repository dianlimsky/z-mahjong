export interface Player { id: string; name: string; createdAt: string }
export interface Game { id: string; startedAt: string; completedAt: string | null; playerIds: string[]; winnerId: string | null }
export interface LeaderboardEntry { player: Player; wins: number; gamesPlayed: number; winRate: number; lastWin: string | null }
export interface PreviousTable { groupKey: string; playerIds: string[]; gameCount: number; lastUsedAt: string; unavailablePlayerIds: string[] }
export interface PlayerStats { wins: number; gamesPlayed: number; winRate: number; lastWin: string | null; winHistory: { gameId: string; date: string; result: 'win' | 'loss' }[] }
