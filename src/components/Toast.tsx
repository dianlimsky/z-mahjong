import { useEffect } from 'react'

export function Toast({ message, onDone, tone = 'success' }: { message: string; onDone: () => void; tone?: 'success' | 'error' }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t) }, [message, onDone])
  return <div className="fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 mx-auto w-fit max-w-[92vw] animate-soft-in" role="status" aria-live="polite"><div className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-card ${tone === 'success' ? 'border-brand/40 bg-[#2a1214] text-white' : 'border-white/10 bg-[#231f1f] text-gray-200'}`}><span aria-hidden="true">{tone === 'success' ? '🏆' : '⚠️'}</span>{message}</div></div>
}
