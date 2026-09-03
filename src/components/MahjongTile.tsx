export function MahjongTile({ character = '中', size = 40, className = '' }: { character?: string; size?: number; className?: string }) {
  return <svg width={size} height={size * 1.3} viewBox="0 0 48 62" className={className} aria-hidden="true">
    <rect x="1.5" y="1.5" width="45" height="59" rx="9" fill="#1d1d1d" />
    <rect x="3" y="3" width="42" height="56" rx="7.5" fill="#f7f2e7" stroke="#e2dac6" strokeWidth="1" />
    <rect x="6.5" y="6.5" width="35" height="49" rx="5" fill="#fdfaf2" />
    <text x="24" y="43" textAnchor="middle" fontSize="30" fontWeight="700" fill="#ff0000" fontFamily="'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif">{character}</text>
  </svg>
}
