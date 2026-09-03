import type { LeaderboardEntry } from '../types'

const medals = ['🥇', '🥈', '🥉']

export function PlayerCard({ entry, rank, compact = false, onClick }: { entry: LeaderboardEntry; rank: number; compact?: boolean; onClick?: () => void }) {
  const content = <div className={`flex items-center gap-3 ${!compact && rank === 1 ? 'py-1' : ''}`}>
    <div className={`grid shrink-0 place-items-center rounded-xl ${rank === 1 && !compact ? 'h-11 w-11 bg-gold/15 text-xl' : 'h-9 w-9 bg-white/5 text-sm'} font-bold text-gray-400`}>{medals[rank - 1] ?? `#${rank}`}</div>
    <div className="min-w-0 flex-1"><p className="truncate font-semibold text-white">{entry.player.name}</p><p className="mt-0.5 text-xs text-gray-500">{entry.wins} wins · {entry.gamesPlayed} games</p></div>
    <div className="text-right"><p className={`${rank === 1 && !compact ? 'text-2xl' : 'text-lg'} font-bold text-white`}>{entry.winRate.toFixed(1)}%</p><p className="text-[10px] uppercase tracking-wider text-gray-500">win rate</p></div>
  </div>
  const classes = `rounded-2xl border p-4 transition-transform ${rank === 1 && !compact ? 'border-gold/25 bg-gradient-to-br from-gold/10 to-panel shadow-card' : 'border-white/[.07] bg-panel'} ${onClick ? 'cursor-pointer active:scale-[.98]' : ''}`
  return onClick ? <button className={`w-full text-left ${classes}`} onClick={onClick}>{content}</button> : <div className={classes}>{content}</div>
}
