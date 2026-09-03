import { useNavigate } from 'react-router-dom'
import { PlayerCard } from '../components/PlayerCard'
import { EmptyState } from '../components/EmptyState'
import { useApp } from '../context/AppContext'
import type { Game, LeaderboardEntry } from '../types'

function safeArray<T>(v: unknown): T[] { return Array.isArray(v) ? v as T[] : [] }

export function Home() {
  const { leaderboard, games, players, loading } = useApp(); const nav = useNavigate()
  const safeGames = safeArray<Game>(games)
  const safeLeaderboard = safeArray<LeaderboardEntry>(leaderboard)
  const last = [...safeGames].filter(g => g.completedAt && g.winnerId).sort((a,b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))[0]
  const winner = last ? players.find(p => p.id === last.winnerId) : null
  if (loading) return <div className="py-20 text-center text-gray-500">Loading your table…</div>
  return <div className="space-y-7 pb-3">
    <section><p className="text-sm text-gray-500">Good evening</p><h1 className="mt-1 text-3xl font-black tracking-tight">Ready to play?</h1><p className="mt-2 text-sm text-gray-500">Keep the table moving. Track wins, not points.</p></section>
    <button onClick={() => nav('/new-game')} className="group relative flex min-h-[76px] w-full items-center justify-between overflow-hidden rounded-2xl bg-brand px-5 text-left shadow-glow transition active:scale-[.98]"><span><span className="block text-xs font-bold uppercase tracking-[.2em] text-white/70">Next game</span><span className="mt-1 block text-xl font-black">+ New Game</span></span><span className="text-4xl transition-transform group-active:rotate-12">🀄</span></button>
    <section><div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-bold uppercase tracking-[.18em] text-gray-500">Last win</h2></div>{winner ? <div className="flex items-center gap-4 rounded-2xl border border-gold/20 bg-gradient-to-r from-gold/10 to-panel p-5"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-2xl">🏆</span><div><p className="text-xl font-bold">{winner.name}</p><p className="mt-1 text-sm text-gray-400">Won {new Date(last.completedAt!).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p></div></div> : <EmptyState icon="🀄" title="No games recorded yet" description="Start a game to crown your first winner." />}</section>
    <section><div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-bold uppercase tracking-[.18em] text-gray-500">Leaderboard</h2><button onClick={() => nav('/leaderboard')} className="text-xs font-semibold text-brand">View all</button></div>{safeLeaderboard.length ? <div className="space-y-2.5">{safeLeaderboard.slice(0,3).map((e,i) => <PlayerCard key={e.player.id} entry={e} rank={i+1} compact onClick={() => nav(`/players/${e.player.id}`)} />)}</div> : <EmptyState title={players.length ? 'Play your first game' : 'Add your first player'} description={players.length ? 'Your leaderboard will appear here.' : 'Build your table in Players.'} />}</section>
  </div>
}
