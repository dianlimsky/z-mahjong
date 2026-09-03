import { useMemo } from 'react'

const COLORS = ['#ff0000', '#d4a94f', '#f7f2e7', '#ff6b6b', '#1e5b4d']

// Inject keyframes once globally — bulletproof, no CSS pipeline dependency
let injected = false
function ensureKeyframes() {
  if (injected) return
  injected = true
  const style = document.createElement('style')
  style.textContent = `
    @keyframes z-confetti-fall {
      0% {
        opacity: 1;
        transform: translateY(-20px) translateX(0) rotate(0deg);
      }
      100% {
        opacity: 0;
        transform: translateY(100vh) translateX(var(--drift, 0px)) rotate(720deg);
      }
    }
  `
  document.head.appendChild(style)
}

export function Confetti({ count = 120 }: { count?: number }) {
  ensureKeyframes()

  const pieces = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 3.0 + Math.random() * 2.5,
      size: 6 + Math.random() * 8,
      color: COLORS[i % COLORS.length],
      drift: Math.round((Math.random() - 0.5) * 180),
      round: Math.random() > 0.4,
    })), [count])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {pieces.map(p => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            top: '-10px',
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : Math.round(p.size * 0.5),
            backgroundColor: p.color,
            borderRadius: p.round ? '50%' : '2px',
            opacity: 1,
            animation: `z-confetti-fall ${p.duration}s cubic-bezier(.23,.86,.6,1) ${p.delay}s both`,
            willChange: 'transform, opacity',
            '--drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
