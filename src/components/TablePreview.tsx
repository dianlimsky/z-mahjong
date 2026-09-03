import type { Player } from '../types'

const TABLE = 208 // jade table size in px
const CARD_OVERHANG = 24 // how far left/right cards stick out

export function TablePreview({ players, wins = {}, ready = false }: { players: Player[]; wins?: Record<string, number>; ready?: boolean }) {
  const [top, left, right, bottom] = players

  return (
    <div className="mx-auto w-fit pt-8 pb-1">
      <div className="relative" style={{ width: TABLE, height: TABLE }}>
        {/* red outer ring (ready state) */}
        {ready && (
          <>
            <div className="pointer-events-none absolute -inset-4 rounded-[44%] border border-brand/60" aria-hidden="true" />
            <div className="pointer-events-none absolute -inset-4 animate-glow-pulse rounded-[44%]" aria-hidden="true" />
          </>
        )}

        {/* jade table */}
        <div
          className={`relative h-full w-full rounded-[44%] border shadow-inner transition-shadow duration-500 ${ready ? 'shadow-glow' : ''}`}
          style={{ backgroundColor: '#1e5b4d', borderColor: 'rgba(255,255,255,.12)' }}
        >
          <div className="pointer-events-none absolute inset-5 rounded-[40%] border border-gold/20 bg-[#184b40]" />
          <div className="pointer-events-none absolute inset-x-12 top-1/2 h-px bg-gold/10" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-gold/30 bg-[#153e35] text-2xl shadow-lg" aria-hidden="true">🀄</div>
        </div>

        {/* player cards — positioned by wrappers (no transforms, so nothing conflicts) */}
        <div className="absolute inset-x-0 flex justify-center" style={{ top: -18 }}>
          <PlayerBadge player={top} winCount={wins[top?.id] ?? 0} />
        </div>
        <div className="absolute inset-x-0 flex justify-center" style={{ bottom: -18 }}>
          <PlayerBadge player={bottom} winCount={wins[bottom?.id] ?? 0} />
        </div>
        <div className="absolute inset-y-0 flex flex-col justify-center" style={{ left: -CARD_OVERHANG }}>
          <PlayerBadge player={left} winCount={wins[left?.id] ?? 0} />
        </div>
        <div className="absolute inset-y-0 flex flex-col justify-center" style={{ right: -CARD_OVERHANG }}>
          <PlayerBadge player={right} winCount={wins[right?.id] ?? 0} />
        </div>
      </div>

      {ready && (
        <div className="mt-8 flex justify-center">
          <span className="rounded-full bg-brand px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-glow">Table ready ✓</span>
        </div>
      )}
    </div>
  )
}

function PlayerBadge({ player, winCount }: { player: Player | undefined; winCount: number }) {
  if (!player) return null
  return (
    <div className="flex min-w-[72px] animate-soft-in flex-col items-center rounded-xl border border-white/10 bg-[#0a1917] px-3 py-1.5 text-center shadow-lg">
      <span className="max-w-[88px] truncate text-xs font-bold text-white">{player.name}</span>
      <span className="text-[10px] text-gray-400">{winCount} wins</span>
    </div>
  )
}