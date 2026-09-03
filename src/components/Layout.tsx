import { NavLink, Outlet } from 'react-router-dom'

const items = [
  { to: '/', label: 'Home', icon: '⌂', end: true },
  { to: '/leaderboard', label: 'Rank', icon: '♛' },
  { to: '/players', label: 'Players', icon: '♙' },
  { to: '/history', label: 'History', icon: '◷' },
]
export function Layout() {
  return <div className="min-h-screen bg-ink text-white"><div className="mx-auto min-h-screen max-w-[640px] px-4 pt-5 safe-bottom sm:px-6"><header className="mb-5 flex items-center justify-between"><NavLink to="/" className="group flex items-center gap-2" aria-label="Z Mahjong home"><span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-lg font-black shadow-glow transition-transform group-active:scale-95">Z</span><span className="text-sm font-bold tracking-[.18em]">MAHJONG</span></NavLink></header><main className="animate-soft-in"><Outlet /></main></div><nav className="safe-nav fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b0b0b]/95 backdrop-blur-xl" aria-label="Primary navigation"><div className="mx-auto grid max-w-[640px] grid-cols-4">{items.map(item => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `flex min-h-[62px] flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${isActive ? 'text-brand' : 'text-gray-500 hover:text-gray-200'}`}><span className="text-[23px] leading-6" aria-hidden="true">{item.icon}</span><span>{item.label}</span></NavLink>)}</div></nav></div>
}
