import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { EmptyState } from '../components/EmptyState'

export function History() {
  const { games, players, loading, resetAll } = useApp()
  const nav = useNavigate()
  const completed = useMemo(() => [...games].filter(g => g.completedAt && g.winnerId).sort((a,b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? '')), [games])
  const [showReset, setShowReset] = useState(false)
  const [password, setPassword] = useState('')
  const [resetError, setResetError] = useState('')
  const [resetting, setResetting] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  const handleReset = async () => {
    if (!password) return
    setResetError('')
    setResetting(true)
    try {
      await resetAll(password)
      setResetDone(true)
      setTimeout(() => nav('/'), 1500)
    } catch (e: any) {
      setResetError(e.message || 'Incorrect password.')
      setResetting(false)
    }
  }

  if (loading) return <div className="py-20 text-center text-gray-500">Loading history…</div>

  return <div className="space-y-5">
    <div><h1 className="text-2xl font-black">History</h1><p className="mt-1 text-sm text-gray-500">Every game, every winner.</p></div>
    {completed.length ? <>
      <div className="space-y-5">{completed.map((game, i) => { const date = new Date(game.completedAt!); const winner = players.find(p => p.id === game.winnerId)?.name ?? 'Former player'; const names = game.playerIds.map(id => players.find(p => p.id === id)?.name ?? 'Deleted player'); const prev = i > 0 ? new Date(completed[i-1].completedAt!).toDateString() : ''; const heading = date.toDateString() !== prev ? date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : null; return <div key={game.id}>{heading && <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-gray-500">{heading}</h2>}<div className="rounded-2xl border border-white/[.07] bg-panel p-4"><div className="flex items-center justify-between"><div><p className="font-bold text-gold">🏆 {winner} won</p><p className="mt-1 text-xs text-gray-500">{date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p></div><span className="text-xs text-gray-600">Game</span></div><div className="mt-3 flex flex-wrap gap-1.5">{names.map((name, j) => <span key={`${name}-${j}`} className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-400">{name}</span>)}</div></div></div>})}</div>

      {/* Reset All button */}
      <div className="pt-4">
        {!showReset && !resetDone && <button onClick={() => setShowReset(true)} className="w-full rounded-xl border border-red-900/40 py-3 text-sm font-semibold text-red-400/80 transition active:scale-[.98] hover:border-red-500/50 hover:text-red-400">Reset All History</button>}
        {showReset && !resetDone && <div className="space-y-3 rounded-2xl border border-red-900/30 bg-red-950/20 p-4">
          <p className="text-sm text-red-400">Enter password to delete all game history and reset the leaderboard.</p>
          <input type="password" placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); setResetError('') }} onKeyDown={e => e.key === 'Enter' && handleReset()} className="w-full rounded-xl border border-white/10 bg-panel px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-red-500/50 focus:outline-none" />
          {resetError && <p className="text-sm text-red-400">{resetError}</p>}
          <div className="flex gap-3">
            <button onClick={() => { setShowReset(false); setPassword(''); setResetError('') }} className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-gray-400 transition active:scale-[.98]">Cancel</button>
            <button onClick={() => void handleReset()} disabled={resetting || !password} className="flex-1 rounded-xl bg-red-900/80 py-3 text-sm font-bold text-white transition disabled:opacity-40 active:scale-[.98]">{resetting ? 'Resetting…' : 'Delete all'}</button>
          </div>
        </div>}
        {resetDone && <div className="rounded-2xl border border-green-500/30 bg-green-950/20 p-4 text-center"><p className="text-sm font-semibold text-green-400">All cleared! Redirecting…</p></div>}
      </div>
    </> : <EmptyState icon="◷" title="No games played yet" description="Your completed games will appear here." />}
  </div>
}
