import { useNavigate } from 'react-router-dom'
import { PlayerCard } from '../components/PlayerCard'
import { EmptyState } from '../components/EmptyState'
import { useApp } from '../context/AppContext'

export function Leaderboard() {
  const { leaderboard, loading } = useApp(); const nav = useNavigate()
  if (loading) return <div className="py-20 text-center text-gray-500">Loading leaderboard…</div>
  return <div className="space-y-5"><div><h1 className="text-2xl font-black">Leaderboard</h1><p className="mt-1 text-sm text-gray-500">Wins are the only score that matters.</p></div>{leaderboard.length ? <div className="space-y-3">{leaderboard.map((e, i) => <PlayerCard key={e.player.id} entry={e} rank={i+1} onClick={() => nav(`/players/${e.player.id}`)} />)}</div> : <EmptyState icon="🏆" title="Play your first game to start the leaderboard" />}</div>
}
