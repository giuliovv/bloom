import { T } from './data'

export function Card({ children, style = {}, onClick, glow, pathwayColor }) {
  const bg = pathwayColor ? `${pathwayColor}18` : glow ? T.cardGlow : T.card
  const border = pathwayColor
    ? `1px solid ${pathwayColor}40`
    : `1px solid ${glow ? 'rgba(255,107,74,0.25)' : T.border}`
  return (
    <div onClick={onClick} style={{
      background: bg, borderRadius: 20, padding: '14px 16px', border,
      cursor: onClick ? 'pointer' : 'default', ...style,
    }}>
      {children}
    </div>
  )
}

export function Lbl({ children, style = {}, color }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, color: color || T.muted,
      letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 9, ...style,
    }}>
      {children}
    </div>
  )
}

export function Btn({ children, onClick, color, style = {}, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '15px', borderRadius: 16, border: 'none',
      cursor: 'pointer', background: color || T.primary, color: '#fff',
      fontSize: 15, fontWeight: 800, ...style,
    }}>
      {children}
    </button>
  )
}

export function StreakRing({ streak, goal = 14, size = 56 }) {
  const r = size / 2 - 4
  const c = 2 * Math.PI * r
  const pct = Math.min(streak / goal, 1)
  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={3.5} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.primary} strokeWidth={3.5}
          strokeDasharray={`${c * pct} ${c}`} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 5px ${T.primary})` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 900, color: T.primary, lineHeight: 1 }}>{streak}</span>
        <span style={{ fontSize: 6.5, fontWeight: 800, color: T.muted, letterSpacing: .8 }}>DAYS</span>
      </div>
    </div>
  )
}
