import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { PlayerStats } from '../types'

export function PlayerDetail() {
  const { id } = useParams<{ id: string }>(); const nav = useNavigate()
  const { players, fetchPlayerStats } = useApp()
  const [stats, setStats] = useState<PlayerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const player = players.find(p => p.id === id)
  useEffect(() => { if (!id) return; fetchPlayerStats(id).then(setStats).catch(() => {}).finally(() => setLoading(false)) }, [id, fetchPlayerStats])
  if (loading) return <div className="py-20 text-center text-gray-500">Loading…</div>
  if (!player) return <div className="py-20 text-center text-gray-500">Player not found.</div>
  const s = stats
  return <div className="space-y-6 pb-4">
    <button onClick={() => nav(-1)} className="text-sm text-gray-500 hover:text-white">← Back</button>
    <div className="text-center"><h1 className="text-3xl font-black uppercase tracking-tight">{player.name}</h1><div className="mt-2 text-5xl font-black text-brand">{s?.wins ?? 0}</div><p className="text-xs uppercase tracking-[.2em] text-gray-500">wins</p></div>
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-white/[.07] bg-panel p-4 text-center"><p className="text-2xl font-bold">{s?.gamesPlayed ?? 0}</p><p className="text-[10px] uppercase tracking-wider text-gray-500">Games Played</p></div>
      <div className="rounded-2xl border border-white/[.07] bg-panel p-4 text-center"><p className="text-2xl font-bold">{s?.winRate ?? 0}%</p><p className="text-[10px] uppercase tracking-wider text-gray-500">Win Rate</p></div>
    </div>
    {s?.lastWin && <div className="rounded-2xl border border-gold/20 bg-gradient-to-r from-gold/10 to-panel p-4 text-center"><p className="text-xs text-gray-500">Last Win</p><p className="mt-1 font-semibold">{new Date(s.lastWin).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p></div>}
    {s && s.winHistory.length > 0 && <div>
      <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-gray-500">Recent History</h2>
      <div className="space-y-1.5">{s.winHistory.map(h => <div key={h.gameId} className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm ${h.result === 'win' ? 'bg-gold/10 text-gold' : 'bg-white/[.03] text-gray-500'}`}><span>{new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span><span className="font-medium">{h.result === 'win' ? '🏆 Win' : 'Loss'}</span></div>)}</div>
    </div>}
  </div>
}
