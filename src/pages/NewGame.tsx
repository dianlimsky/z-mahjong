import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { EmptyState } from '../components/EmptyState'
import { TablePreview } from '../components/TablePreview'

export function NewGame() {
  const { players, previousTables, startGame } = useApp()
  const nav = useNavigate()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showManual, setShowManual] = useState(false)
  const [error, setError] = useState('')
  const [starting, setStarting] = useState(false)

  const latest = previousTables[0]
  const allValid = latest && latest.unavailablePlayerIds.length === 0

  const toggle = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }

  const useLatestTable = () => {
    if (!latest || !allValid) return
    setSelectedIds(latest.playerIds)
    setShowManual(false)
  }

  const handleStart = async () => {
    if (selectedIds.length !== 4) return
    setStarting(true)
    setError('')
    try {
      const game = await startGame(selectedIds)
      nav(`/declare-winner/${game.id}`)
    } catch (e: any) {
      setError(e.message)
      setStarting(false)
    }
  }

  const getPlayersById = (ids: string[]) => ids.map(id => players.find(p => p.id === id)).filter(Boolean) as any[]

  if (players.length < 4 && !allValid) {
    return <div className="space-y-6 pt-2">
      <h1 className="text-2xl font-black">New Game</h1>
      <EmptyState icon="👥" title="Need at least 4 players" description="Add more players in the Players tab before starting a game." />
    </div>
  }

  return <div className="space-y-6 pt-2">
    <h1 className="text-2xl font-black">New Game</h1>

    {/* Last Table Quick Start */}
    {allValid && latest && <>
      <button onClick={useLatestTable} className="w-full rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/15 to-panel p-5 text-left shadow-glow transition active:scale-[.98]">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-brand/80">Last Table</p>
        <p className="text-lg font-bold text-white">{getPlayersById(latest.playerIds).map((p: any) => p.name).join(' · ')}</p>
        <p className="mt-2 text-xs text-gray-500">{latest.gameCount} games played</p>
      </button>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] uppercase tracking-wider text-gray-600">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>
    </>}

    {/* Manual Selection Toggle */}
    {!showManual && <button onClick={() => setShowManual(true)} className="w-full rounded-xl border border-white/10 bg-panel py-3 text-sm font-semibold text-gray-300 transition active:scale-[.98]">Choose different players</button>}

    {/* Manual Selection */}
    {showManual && <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[10px] font-bold uppercase tracking-[.18em] text-gray-500">Choose 4 players</h2>
        <span className={`text-xs font-bold ${selectedIds.length === 4 ? 'text-brand' : 'text-gray-500'}`}>{selectedIds.length} / 4</span>
      </div>
      <div className="space-y-1.5">
        {players.map(p => {
          const selected = selectedIds.includes(p.id)
          return <button key={p.id} onClick={() => toggle(p.id)} className={`flex min-h-[52px] w-full items-center justify-between rounded-xl border px-4 text-left transition ${selected ? 'border-brand/50 bg-brand/10' : 'border-white/[.07] bg-panel'}`}>
            <span className={`font-semibold ${selected ? 'text-white' : 'text-gray-400'}`}>{p.name}</span>
            <span className={`grid h-6 w-6 place-items-center rounded-md text-xs font-bold ${selected ? 'bg-brand text-white' : 'bg-white/5 text-gray-500'}`}>{selected ? '✓' : '○'}</span>
          </button>
        })}
      </div>
    </div>}

    {/* Table Preview */}
    {selectedIds.length === 4 && (() => {
      const selPlayers = getPlayersById(selectedIds)
      return <div className="mt-2"><TablePreview players={selPlayers} ready /></div>
    })()}

    {error && <p className="rounded-xl bg-red-900/30 px-4 py-3 text-sm text-red-400">{error}</p>}

    {/* Start Game */}
    <button onClick={handleStart} disabled={selectedIds.length !== 4 || starting} className="w-full min-h-[56px] rounded-2xl bg-brand text-lg font-bold text-white shadow-glow transition disabled:opacity-40 disabled:shadow-none active:scale-[.98]">{starting ? 'Starting…' : 'Start Game'}</button>
  </div>
}
