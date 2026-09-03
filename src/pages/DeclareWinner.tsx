import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Confetti } from '../components/Confetti'

export function DeclareWinner() {
  const { gameId } = useParams<{ gameId: string }>(); const nav = useNavigate(); const { games, players, declareWinner } = useApp()
  const game = games.find(g => g.id === gameId); const [selected, setSelected] = useState<string | null>(null); const [confirming, setConfirming] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [celebrating, setCelebrating] = useState(false)
  if (!game) return <div className="py-20 text-center text-gray-500">Game not found. <button onClick={() => nav('/')} className="text-brand">Go home</button></div>
  const choose = (id: string) => { setSelected(id); setConfirming(true) }
  const confirm = async () => { if (!selected || busy) return; setBusy(true); try { await declareWinner(game.id, selected); setCelebrating(true); setTimeout(() => nav('/'), 5000) } catch (e:any) { setError(e.message); setBusy(false) } }
  const winnerName = selected ? players.find(p => p.id === selected)?.name ?? '' : ''
  return <div className="space-y-6 pt-2">
    <button onClick={() => nav('/')} className="text-sm text-gray-500">← Cancel game</button>
    <div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand">Game in progress</p><h1 className="mt-2 text-3xl font-black">Who won?</h1><p className="mt-1 text-sm text-gray-500">Tap the winner. That’s it.</p></div>
    <div className="space-y-3">{game.playerIds.map(id => { const p = players.find(x => x.id === id); if (!p) return null; const active = selected === id; return <button key={id} onClick={() => choose(id)} disabled={busy || celebrating} className={`flex min-h-[72px] w-full items-center justify-between rounded-2xl border px-5 text-left transition active:scale-[.98] ${active ? 'animate-glow-pulse border-brand bg-brand/15' : 'border-white/10 bg-panel hover:border-brand/40'}`}><span className="text-xl font-bold">{p.name}</span><span className="text-2xl" aria-hidden="true">{active ? '🏆' : '→'}</span></button> })}</div>
    {error && <p className="rounded-xl bg-red-900/30 px-4 py-3 text-sm text-red-400">{error}</p>}
    {celebrating && <>
      <Confetti />
      <div className="animate-winner-pop rounded-2xl border-2 border-gold/50 bg-gold/10 p-6 text-center shadow-lg">
        <p className="text-5xl">🏆</p>
        <p className="mt-3 text-3xl font-black text-gold">{winnerName} wins!</p>
        <p className="mt-2 text-sm text-gray-400">Returning to dashboard…</p>
      </div>
    </>}
    {!celebrating && confirming && selected && <div className="animate-winner-pop rounded-2xl border border-gold/30 bg-gold/10 p-5 text-center"><p className="text-2xl font-black text-gold">🏆 {winnerName} wins!</p><p className="mt-1 text-sm text-gray-400">Add one win to their record?</p><button onClick={() => void confirm()} disabled={busy} className="mt-4 min-h-[52px] w-full rounded-xl bg-brand font-bold disabled:opacity-50">{busy ? 'Saving…' : 'Confirm winner'}</button></div>}
  </div>
}
