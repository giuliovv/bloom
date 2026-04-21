import { useState, useEffect, useCallback, useRef } from 'react'
import { T, PATHWAYS, MILESTONES, getMilestone, getTrim, BODY_DATA, getBodyData, STARS, THOUGHTS, DOCTORS, CONDITIONS } from './data'
import HeroScene from './HeroScene'
import { Card, Lbl, Btn, StreakRing } from './ui'

// ── Persistence ────────────────────────────────────────────────
function loadSaved() {
  try {
    const raw = localStorage.getItem('bloom3')
    if (raw) return JSON.parse(raw)
    // migrate bloom2
    const old = localStorage.getItem('bloom2')
    if (old) {
      const d = JSON.parse(old)
      if (d.name) return { onboarded: true, name: d.name, week: d.currentWeek || 24, pathwayId: 'standard', streakDays: 0, logs: d.logs || [] }
    }
  } catch { }
  return null
}
function save(data) {
  try { localStorage.setItem('bloom3', JSON.stringify(data)) } catch { }
}
function computeStreak(logs) {
  if (!logs?.length) return 0
  const today = new Date(); today.setHours(0, 0, 0, 0)
  let streak = 0
  for (let i = 0; i < 60; i++) {
    const d = new Date(today); d.setDate(today.getDate() - i)
    const ds = d.toISOString().slice(0, 10)
    if (logs.find(l => l.date === ds)) streak++
    else if (i > 0) break
  }
  return streak
}

// ── Onboarding ─────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [week, setWeek] = useState(24)
  const [selected, setSelected] = useState([])
  const [finalizing, setFinalizing] = useState(false)

  const toggleCondition = id => {
    if (id === 'none') { setSelected(['none']); return }
    setSelected(prev => {
      const wo = prev.filter(x => x !== 'none')
      return wo.includes(id) ? wo.filter(x => x !== id) : [...wo, id]
    })
  }

  const finish = () => {
    setFinalizing(true)
    const pathway = selected.includes('highBP') ? 'highBP' : selected.includes('gd') ? 'gd' : 'standard'
    setTimeout(() => onComplete({ name: name || 'Sophia', week, pathway }), 600)
  }

  const m = getMilestone(week)
  const trim = getTrim(week)

  return (
    <div style={{ width: '100%', height: '100%', background: T.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Progress dots */}
      {step < 3 && (
        <div style={{ height: 58, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6, paddingBottom: 12 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: i === step ? 24 : 6, height: 6, borderRadius: 3, background: i === step ? T.primary : 'rgba(255,255,255,0.15)', transition: 'all 0.3s' }} />
          ))}
        </div>
      )}

      {/* Step 0 – Name */}
      {step === 0 && (
        <div className="onboard-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 28px', gap: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 52 }}>🌸</div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: T.text, lineHeight: 1.2, marginBottom: 10 }}>Hello, I'm Bloom</div>
            <div style={{ fontSize: 16, color: T.muted, lineHeight: 1.7 }}>Your gentle guide through every week of pregnancy. I'll tell you what's coming before it happens.</div>
          </div>
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 8, fontWeight: 700 }}>What's your first name?</div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Sophia"
              style={{ width: '100%', padding: '14px 18px', borderRadius: 16, border: `1.5px solid ${name ? T.primary : T.border}`, background: 'rgba(255,255,255,0.07)', color: T.text, fontSize: 18, fontWeight: 700, outline: 'none', textAlign: 'center', marginBottom: 16 }} />
            <Btn onClick={() => setStep(1)} color={name ? T.primary : 'rgba(255,255,255,0.15)'}>
              {name ? `Hello, ${name} →` : 'Continue →'}
            </Btn>
          </div>
        </div>
      )}

      {/* Step 1 – Week */}
      {step === 1 && (
        <div className="onboard-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 28px', gap: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: T.text, marginBottom: 8 }}>How many weeks pregnant are you?</div>
            <div style={{ fontSize: 14, color: T.muted }}>We'll build your personal journey from here</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <button onClick={() => setWeek(w => Math.max(4, w - 1))}
              style={{ width: 52, height: 52, borderRadius: 26, background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', fontSize: 24, color: T.text }}>−</button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 72, fontWeight: 900, color: T.primary, lineHeight: 1 }}>{week}</div>
              <div style={{ fontSize: 14, color: T.muted, fontWeight: 700, marginTop: 4 }}>Trimester {trim} · {m.size} {m.e}</div>
            </div>
            <button onClick={() => setWeek(w => Math.min(40, w + 1))}
              style={{ width: 52, height: 52, borderRadius: 26, background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', fontSize: 24, color: T.text }}>+</button>
          </div>
          {/* Trimester bar */}
          <div style={{ width: '100%', display: 'flex', gap: 8, alignItems: 'center' }}>
            {[1, 2, 3].map(n => {
              const filled = n < trim ? '100%' : n === trim ? `${((week - (trim === 1 ? 0 : trim === 2 ? 13 : 26)) / 13) * 100}%` : '0%'
              return (
                <>
                  <div key={`bar-${n}`} style={{ height: 5, flex: 1, borderRadius: 3, overflow: 'hidden', background: 'rgba(255,255,255,0.08)' }}>
                    <div style={{ height: '100%', background: n < trim ? T.primary : n === trim ? `linear-gradient(90deg,${T.primary},${T.accent})` : 'transparent', width: filled }} />
                  </div>
                  <span key={`lbl-${n}`} style={{ fontSize: 9.5, fontWeight: 800, color: n <= trim ? T.primary : T.muted }}>T{n}</span>
                </>
              )
            })}
          </div>
          <div style={{ width: '100%' }}>
            <Btn onClick={() => setStep(2)}>Continue →</Btn>
            <button onClick={() => setStep(0)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontWeight: 700, fontSize: 13, padding: '12px 0' }}>← Back</button>
          </div>
        </div>
      )}

      {/* Step 2 – Conditions */}
      {step === 2 && (
        <div className="onboard-in" style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: T.text, marginBottom: 6 }}>Anything we should know?</div>
            <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.6 }}>We'll personalise your pathway and monitoring. You can update this anytime.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
            {CONDITIONS.map(c => {
              const on = selected.includes(c.id)
              const pc = c.id === 'none' ? T.green : (PATHWAYS[c.id]?.color || T.primary)
              return (
                <button key={c.id} onClick={() => toggleCondition(c.id)} style={{
                  width: '100%', padding: '14px 16px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                  background: on ? `${pc}18` : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${on ? `${pc}60` : T.border}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{c.label}</div>
                    <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>{c.sub}</div>
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${on ? pc : T.border}`, background: on ? pc : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {on && <span style={{ fontSize: 12, color: '#fff', fontWeight: 800 }}>✓</span>}
                  </div>
                </button>
              )
            })}
          </div>
          <div>
            <Btn onClick={() => setStep(3)} color={selected.length ? T.primary : 'rgba(255,255,255,0.15)'}>Continue →</Btn>
            <button onClick={() => setStep(1)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontWeight: 700, fontSize: 13, padding: '12px 0' }}>← Back</button>
          </div>
        </div>
      )}

      {/* Step 3 – Meet companion */}
      {step === 3 && (
        <div className="onboard-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 362 440" width="100%" height="100%" style={{ display: 'block', position: 'absolute', inset: 0 }} preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="obsky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#120a30" /><stop offset="70%" stopColor="#2d1520" /><stop offset="100%" stopColor="#6B2e18" />
                </linearGradient>
                <linearGradient id="obgrass" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2a4a1a" /><stop offset="100%" stopColor="#1a2d0e" />
                </linearGradient>
              </defs>
              <rect width="362" height="440" fill="url(#obsky)" />
              {STARS.map((s, i) => (
                <circle key={i} cx={s.x * .88} cy={s.y} r={s.r + .4} fill="white"
                  style={{ animation: `starTwinkle ${2 + s.d}s ease-in-out infinite`, animationDelay: `${s.d}s` }} />
              ))}
              <circle cx="310" cy="55" r="22" fill="#ffe8b0" opacity=".85" />
              <circle cx="318" cy="50" r="17" fill="#120a30" />
              <path d="M0,290 Q90,250 181,268 Q272,290 362,268 L362,440 L0,440Z" fill="#1a2d10" />
              <rect y="305" width="362" height="135" fill="url(#obgrass)" />
              {[48,76,112,148,198,228].map(x => (
                <g key={x}>
                  <line x1={x} y1="316" x2={x} y2="306" stroke="#2d5a1a" strokeWidth="1.4" />
                  <circle cx={x} cy="305" r="4" fill={['#ff6b4a','#ffaa7a','#ff8c6a','#ffd4aa','#ffcc66','#ff9a70'][x % 6]} />
                </g>
              ))}
              {[1,2,3,4,5].map(i => (
                <circle key={i} cx={60+i*52} cy={260+Math.sin(i*1.3)*18} r="2.8" fill={T.amber}
                  style={{ animation: `firefly ${2.2+i*.4}s ease-in-out infinite`, animationDelay: `${i*.55}s`, filter: 'drop-shadow(0 0 4px #ffcc66)' }} />
              ))}
              {/* Simple inline walking character */}
              <g style={{ animation: 'charWalk 7s ease-in-out infinite' }}>
                <g transform="translate(0,308) scale(1.3)">
                  <ellipse cx="0" cy="4" rx="16" ry="4.5" fill="rgba(0,0,0,0.22)" />
                  <rect x="-16" y="-72" width="32" height="44" rx="10" fill="#ff8c6a" />
                  <ellipse cx="13" cy="-50" rx="17" ry="15" fill="#ff8c6a" />
                  <rect x="-4.5" y="-77" width="9" height="8" rx="3.5" fill="#f4c4a8" />
                  <circle cx="0" cy="-90" r="15" fill="#f4c4a8" />
                  <ellipse cx="-2" cy="-102" rx="15" ry="8" fill="#3d1f0e" />
                  <ellipse cx="-14" cy="-95" rx="5.5" ry="9" fill="#3d1f0e" />
                  <circle cx="12" cy="-102" r="6" fill="#3d1f0e" />
                  <circle cx="14" cy="-103" r="5" fill="#ff6b4a" opacity=".9" />
                  <circle cx="14" cy="-103" r="2.5" fill="#ffee99" />
                  <circle cx="6" cy="-90" r="2.8" fill="#2d1a10" />
                  <path d="M3,-84 Q7,-81 10,-84" stroke="#2d1a10" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                </g>
              </g>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '28px 28px', background: 'linear-gradient(transparent 50%, rgba(10,4,2,0.85))' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: T.text, marginBottom: 8 }}>
                {name ? `${name}, meet your companion` : 'Meet your companion'}
              </div>
              <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, marginBottom: 24 }}>
                She grows and changes with you every week. Log daily and watch her world come alive.
              </div>
              <Btn onClick={finish} color={finalizing ? T.green : T.primary}>
                {finalizing ? '✓ Setting up your journey...' : 'Begin my journey →'}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Pathway card ───────────────────────────────────────────────
function PathwayCard({ pathway }) {
  const [showWatchFor, setShowWatchFor] = useState(false)
  if (!pathway || pathway.id === 'standard') return null
  const pc = pathway.color
  return (
    <div style={{ margin: '10px 14px 0' }}>
      <div style={{ background: `${pc}18`, borderRadius: 16, padding: '12px 15px', border: `1px solid ${pc}40`, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${pc}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
            {pathway.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: pc, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Clinical Pathway</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: T.text }}>{pathway.label}</div>
            <div style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>{pathway.desc}</div>
          </div>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: pc, boxShadow: `0 0 0 4px ${pc}30`, flexShrink: 0, animation: 'pathwayPulse 2s ease-in-out infinite' }} />
        </div>
        <div style={{ fontSize: 12, color: T.text, lineHeight: 1.55, padding: '8px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>
          {pathway.reassure}
        </div>
      </div>
      <div style={{ background: `${pc}10`, borderRadius: 14, overflow: 'hidden', border: `1px solid ${pc}30` }}>
        <button onClick={() => setShowWatchFor(v => !v)}
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <span style={{ flex: 1, textAlign: 'left', fontSize: 12.5, fontWeight: 800, color: T.text }}>Signs to contact your midwife</span>
          <span style={{ fontSize: 12, color: T.muted, fontWeight: 700 }}>{showWatchFor ? '▲' : '▼'}</span>
        </button>
        {showWatchFor && (
          <div style={{ padding: '0 14px 12px' }}>
            {pathway.watchFor.map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{w.icon}</span>
                <span style={{ fontSize: 12.5, color: T.text, lineHeight: 1.4 }}>{w.s}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, padding: '8px 10px', background: `${pc}15`, borderRadius: 9, fontSize: 11.5, color: pc, fontWeight: 700 }}>
              If you experience any of these — call your midwife now, or use the Doctors tab.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Journey tab ────────────────────────────────────────────────
function JourneyTab({ week, streak, name, pathway }) {
  const m = getMilestone(week)
  const [bouncing, setBouncing] = useState(false)
  const [thought, setThought] = useState(null)
  const [mood, setMood] = useState('happy')
  const [energy, setEnergy] = useState(m.energy)
  const [kicks, setKicks] = useState(0)
  const [kickAnim, setKickAnim] = useState(false)
  const [expandedWeek, setExpandedWeek] = useState(null)

  const charState = mood === 'tired' || energy <= 1 ? 'resting'
    : energy <= 2 ? 'sitting'
    : energy >= 4 && (mood === 'happy' || mood === 'calm') ? m.charState
    : 'sitting'

  const captions = {
    walking: `${name} is on her evening walk 🌙`,
    sitting: `${name} is resting with tea 🍵`,
    resting: `${name} is taking it easy 💤`,
    contracting: `${name} is having Braxton Hicks 💨`,
  }

  const handleTap = () => {
    if (bouncing) return
    setBouncing(true)
    const msg = THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)](week)
    setThought(msg)
    setTimeout(() => setThought(null), 3200)
    setTimeout(() => setBouncing(false), 500)
  }

  const addKick = () => {
    setKicks(k => k + 1)
    setKickAnim(true)
    setTimeout(() => setKickAnim(false), 400)
  }

  const moodOpts = [{ id: 'happy', e: '😊', l: 'Great' }, { id: 'calm', e: '😌', l: 'Calm' }, { id: 'tired', e: '😴', l: 'Tired' }, { id: 'anxious', e: '😟', l: 'Worried' }]
  const ec = e => e >= 4 ? T.green : e >= 3 ? T.accent : T.primary
  const futureMilestones = MILESTONES.filter(mi => mi.w > week)
  const nextMilestone = futureMilestones[0]
  const nextScan = futureMilestones.find(mi => mi.scan)
  const pc = pathway?.id !== 'standard' ? pathway?.color : null

  const badges = [{ days: 3, e: '🌱', l: '3 days' }, { days: 7, e: '🌸', l: '1 week' }, { days: 14, e: '🔥', l: '2 weeks' }, { days: 21, e: '✨', l: '3 weeks' }, { days: 30, e: '🏅', l: '1 month' }]
  const earned = badges.filter(b => streak >= b.days)
  const nextBadge = badges.find(b => streak < b.days)

  return (
    <div className="screen tab-scroll">
      <div style={{ height: 58, flexShrink: 0 }} />

      {/* Header */}
      <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: T.muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>
            Week {week} · Trimester {getTrim(week)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: 19, fontWeight: 900, color: T.text }}>{name} 🌸</span>
            {pathway?.id !== 'standard' && (
              <span style={{ fontSize: 10, fontWeight: 800, color: pathway.color, background: `${pathway.color}20`, padding: '3px 8px', borderRadius: 8, border: `1px solid ${pathway.color}40` }}>
                {pathway.icon} {pathway.badge}
              </span>
            )}
          </div>
        </div>
        <StreakRing streak={streak} />
      </div>

      {/* Hero scene */}
      <div style={{
        margin: '0 14px', borderRadius: 18, overflow: 'hidden', height: 255, flexShrink: 0,
        boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)',
        position: 'relative',
        transform: bouncing ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 0.18s',
      }}>
        <HeroScene charState={charState} streak={streak} loggedToday={true} thought={thought} pathwayColor={pc} onTap={handleTap} />
        {streak >= 7 && (
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(14,7,3,0.75)', borderRadius: 10, padding: '4px 10px', backdropFilter: 'blur(8px)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 12 }}>🔥</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: T.accent }}>{streak}-day streak</span>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 10, right: 12, fontSize: 9, fontWeight: 800, color: 'rgba(254,240,230,0.38)', letterSpacing: .6 }}>TAP TO INTERACT</div>
      </div>

      {/* Caption */}
      <div style={{ margin: '10px 14px 0', padding: '9px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12.5, color: T.text, fontWeight: 600 }}>{captions[charState] || captions.sitting}</div>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{m.e} {m.size}</div>
      </div>

      <PathwayCard pathway={pathway} week={week} />

      {/* Streak badges */}
      <div style={{ margin: '10px 14px 0', display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
        {earned.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,107,74,0.15)', borderRadius: 10, padding: '4px 10px', border: '1px solid rgba(255,107,74,0.28)' }}>
            <span style={{ fontSize: 14 }}>{b.e}</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: T.primary }}>{b.l}</span>
          </div>
        ))}
        {nextBadge && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '4px 10px', border: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 14, filter: 'grayscale(1)', opacity: .5 }}>{nextBadge.e}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.muted }}>{nextBadge.days - streak}d to {nextBadge.l}</span>
          </div>
        )}
      </div>

      {/* Today card */}
      <div style={{ margin: '12px 14px 0' }}>
        <Card glow>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Lbl style={{ marginBottom: 0 }}>How are you feeling?</Lbl>
            <span style={{ fontSize: 10, color: T.muted, fontWeight: 700 }}>Updates {name.split(' ')[0]}</span>
          </div>
          {/* Mood */}
          <div style={{ display: 'flex', gap: 7, marginBottom: 12 }}>
            {moodOpts.map(mo => {
              const on = mood === mo.id
              return (
                <button key={mo.id} onClick={() => setMood(mo.id)} style={{
                  flex: 1, border: `1.5px solid ${on ? T.primary : 'transparent'}`, borderRadius: 13, padding: '9px 0',
                  cursor: 'pointer', background: on ? 'rgba(255,107,74,0.2)' : 'rgba(255,255,255,0.05)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  transition: 'all .16s', transform: on ? 'scale(1.06)' : 'scale(1)',
                }}>
                  <span style={{ fontSize: 19 }}>{mo.e}</span>
                  <span style={{ fontSize: 8.5, fontWeight: 800, color: on ? T.primary : T.muted, fontFamily: 'Nunito' }}>{mo.l}</span>
                </button>
              )
            })}
          </div>
          {/* Energy */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: T.muted, letterSpacing: .8, minWidth: 54 }}>ENERGY</span>
            <div style={{ flex: 1, display: 'flex', gap: 5 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setEnergy(n)} style={{
                  flex: 1, height: 18, borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: n <= energy ? ec(energy) : 'rgba(255,255,255,0.08)',
                  boxShadow: n <= energy && n === energy ? `0 0 6px ${ec(energy)}` : 'none',
                  transition: 'all .15s',
                }} />
              ))}
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, color: ec(energy), minWidth: 34, textAlign: 'right' }}>
              {['', 'Low', 'Low', 'Okay', 'Good', 'Great'][energy]}
            </span>
          </div>
          {/* Kick counter */}
          <button onClick={addKick} className={kickAnim ? 'kick-pop' : ''} style={{
            width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`,
            borderRadius: 14, cursor: 'pointer', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 22 }}>🦶</span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: T.text }}>Count kicks</div>
              <div style={{ fontSize: 10.5, color: T.muted }}>Tap each time you feel movement</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: T.primary, lineHeight: 1 }}>{kicks}</div>
              <div style={{ fontSize: 9, color: T.muted, fontWeight: 700 }}>today</div>
            </div>
          </button>
        </Card>
      </div>

      {/* Symptoms + reassurance */}
      <div style={{ margin: '10px 14px 0' }}>
        <Card>
          <Lbl>What you might feel today</Lbl>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 12 }}>
            {m.feel.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: T.primary, opacity: 1 - i * .25, flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: T.text }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 12px', border: '.5px solid rgba(255,107,74,0.2)' }}>
            <div style={{ fontSize: 9.5, fontWeight: 800, color: T.primary, letterSpacing: .8, marginBottom: 5 }}>💡 WHEN YOU FEEL THIS — DON'T WORRY</div>
            <div style={{ fontSize: 12, color: T.text, lineHeight: 1.6 }}>{m.reassure}</div>
          </div>
        </Card>
      </div>

      {/* Coming up */}
      {nextMilestone && (
        <div style={{ margin: '10px 14px 0' }}>
          <Card>
            <Lbl>Coming up — Week {nextMilestone.w}</Lbl>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,107,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{nextMilestone.e}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: T.text }}>Size of a {nextMilestone.size}</div>
                <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>{nextMilestone.feel[0]} · {nextMilestone.feel[1]}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.primary, flexShrink: 0 }}>{nextMilestone.w - week}w →</div>
            </div>
          </Card>
        </div>
      )}

      {nextScan && (
        <div style={{ margin: '10px 14px 0' }}>
          <Card glow style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(255,107,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📅</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: T.primary, letterSpacing: .8, marginBottom: 3 }}>NEXT APPOINTMENT</div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: T.text }}>{nextScan.scan}</div>
                <div style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>Week {nextScan.w} · in {nextScan.w - week} weeks</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Full journey timeline */}
      <div style={{ margin: '12px 14px 4px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: T.muted, letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 10 }}>Full journey</div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 17, top: 18, bottom: 18, width: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MILESTONES.map(mi => {
              const isPast = mi.w < week, isCurr = mi.w === m.w, isExp = expandedWeek === mi.w
              const pathwayExtra = pathway?.extraMilestones?.find(pm => pm.w === mi.w)
              return (
                <div key={mi.w}>
                  <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }} onClick={() => setExpandedWeek(isExp ? null : mi.w)}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 18, flexShrink: 0, zIndex: 1,
                      background: isPast ? T.primary : isCurr ? 'rgba(255,107,74,0.25)' : 'rgba(255,255,255,0.06)',
                      border: isCurr ? `2px solid ${T.primary}` : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: isPast ? 13 : 17,
                      boxShadow: isCurr ? '0 0 0 4px rgba(255,107,74,0.2)' : 'none',
                    }}>
                      {isPast ? '✓' : mi.e}
                    </div>
                    <div style={{
                      flex: 1, background: isCurr ? T.cardGlow : isPast ? 'rgba(255,255,255,0.03)' : T.card,
                      borderRadius: 14, padding: '10px 13px', opacity: isPast ? .6 : 1,
                      border: `1px solid ${isCurr ? 'rgba(255,107,74,0.35)' : T.border}`, cursor: 'pointer',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: isCurr ? T.primary : T.muted, letterSpacing: .8 }}>
                          WEEK {mi.w}{isCurr ? ' · NOW' : ''}
                        </div>
                        {!isPast && !isCurr && <span style={{ fontSize: 10, color: T.muted }}>in {mi.w - week}w</span>}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: T.text, marginTop: 2 }}>{mi.feel[0]}, {mi.feel[1]}</div>
                      {(isExp || isCurr) && <div style={{ marginTop: 8, fontSize: 11.5, color: T.muted, lineHeight: 1.55 }}>{mi.reassure}</div>}
                      {mi.scan && (isExp || isCurr) && <div style={{ marginTop: 6, fontSize: 11, color: T.accent, fontWeight: 700 }}>📅 {mi.scan}</div>}
                    </div>
                  </div>
                  {pathwayExtra && (
                    <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginTop: 7 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 18, flexShrink: 0, zIndex: 1, background: `${pathway.color}25`, border: `2px solid ${pathway.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                        {pathwayExtra.icon}
                      </div>
                      <div style={{ flex: 1, background: `${pathway.color}12`, borderRadius: 14, padding: '10px 13px', border: `1px solid ${pathway.color}35` }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: pathway.color, letterSpacing: .8, marginBottom: 3 }}>
                          {pathway.label.toUpperCase()} · WEEK {pathwayExtra.w}
                          {pathwayExtra.urgent && <span style={{ marginLeft: 6, background: `${pathway.color}30`, padding: '1px 6px', borderRadius: 6 }}>IMPORTANT</span>}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>{pathwayExtra.title}</div>
                        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>{pathwayExtra.desc}</div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div style={{ height: 24, flexShrink: 0 }} />
    </div>
  )
}

// ── Log tab ────────────────────────────────────────────────────
function LogTab({ onSave }) {
  const [bp, setBp] = useState({ s: '', d: '' })
  const [kg, setKg] = useState('')
  const [sleep, setSleep] = useState(7)
  const [syms, setSyms] = useState([])
  const [saved, setSaved] = useState(false)

  const toggle = s => setSyms(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])
  const inp = { padding: '10px 12px', borderRadius: 11, fontSize: 14, fontWeight: 700, outline: 'none', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${T.border}`, color: T.text, width: '100%' }

  const handleSave = () => {
    setSaved(true)
    onSave({ bp: { ...bp }, weight: kg, sleep, symptoms: [...syms] })
    setTimeout(() => setSaved(false), 2200)
  }

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="screen tab-scroll" style={{ padding: '0 20px 24px' }}>
      <div style={{ height: 58, flexShrink: 0 }} />
      <div style={{ fontSize: 24, fontWeight: 900, color: T.text }}>Daily log</div>
      <div style={{ fontSize: 13, color: T.muted, marginTop: 2, marginBottom: 18 }}>{today}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* BP */}
        <Card>
          <Lbl>Blood pressure</Lbl>
          <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            {[['Systolic', 's', '120'], ['Diastolic', 'd', '80']].map(([l, k, ph]) => (
              <div key={k} style={{ flex: 1 }}>
                <div style={{ fontSize: 10.5, color: T.muted, marginBottom: 4, fontWeight: 700 }}>{l}</div>
                <input style={inp} type="number" placeholder={ph} value={bp[k]} onChange={e => setBp(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
          </div>
          {parseInt(bp.s) >= 140 && (
            <div style={{ padding: '7px 10px', background: 'rgba(255,100,50,0.15)', borderRadius: 9, fontSize: 11.5, color: T.primary, fontWeight: 700 }}>
              ⚠️ Systolic ≥140 — log this and mention to your midwife
            </div>
          )}
        </Card>
        {/* Weight + sleep */}
        <div style={{ display: 'flex', gap: 10 }}>
          <Card style={{ flex: 1, padding: 13 }}>
            <Lbl>Weight kg</Lbl>
            <input style={{ ...inp, textAlign: 'center', fontSize: 20, fontWeight: 900 }} type="number" placeholder="—" value={kg} onChange={e => setKg(e.target.value)} />
          </Card>
          <Card style={{ flex: 1, padding: 13 }}>
            <Lbl>Sleep</Lbl>
            <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 900, color: T.text }}>{sleep}<span style={{ fontSize: 12, color: T.muted }}>h</span></div>
            <input type="range" min="3" max="12" step=".5" value={sleep} onChange={e => setSleep(+e.target.value)} style={{ width: '100%', accentColor: T.primary, marginTop: 6 }} />
          </Card>
        </div>
        {/* Symptoms */}
        <Card>
          <Lbl>Symptoms today</Lbl>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {['Nausea', 'Headache', 'Swelling', 'Fatigue', 'Back pain', 'Braxton Hicks'].map(s => {
              const on = syms.includes(s)
              return (
                <button key={s} onClick={() => toggle(s)} style={{
                  padding: '7px 13px', borderRadius: 20, border: `1.5px solid ${on ? T.primary : 'transparent'}`,
                  cursor: 'pointer', background: on ? 'rgba(255,107,74,0.22)' : 'rgba(255,255,255,0.06)',
                  color: on ? T.primary : T.text, fontSize: 12.5, fontWeight: 700, transition: 'all 0.15s',
                }}>{s}</button>
              )
            })}
          </div>
        </Card>
        <Btn onClick={handleSave} color={saved ? T.green : T.primary}>
          {saved ? '✓ Saved' : "Save today's entry"}
        </Btn>
      </div>
    </div>
  )
}

// ── Body tab ───────────────────────────────────────────────────
const ZONES = {
  chest:  { cx: 70, cy: 108, rx: 26, ry: 20, label: 'Chest',       lx: 108, ly: 104 },
  belly:  { cx: 70, cy: 178, rx: 44, ry: 48, label: 'Belly',        lx: 122, ly: 170 },
  pelvis: { cx: 70, cy: 228, rx: 28, ry: 14, label: 'Lower belly',  lx: 106, ly: 228 },
  back:   { cx: 70, cy: 158, rx: 18, ry: 26, label: 'Lower back',   lx: 4,   ly: 154 },
  head:   { cx: 70, cy: 28,  rx: 22, ry: 24, label: 'Head',         lx: 100, ly: 24  },
  legs:   { cx: 70, cy: 252, rx: 22, ry: 10, label: 'Legs',         lx: 100, ly: 252 },
}

function BodyTab({ week, streak }) {
  const b = getBodyData(week)
  const EV = [0, -1, 1, 0, -1, 0, 1]
  const now = new Date()
  const forecast = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now); d.setDate(now.getDate() + i)
    return {
      dayLabel: i === 0 ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'short' }),
      dateLabel: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      energy: Math.max(1, Math.min(5, b.energy + EV[i])),
      symptom: b.feel[i % b.feel.length],
      isToday: i === 0,
    }
  })
  const today = forecast[0]
  const ec = e => e >= 4 ? T.green : e >= 3 ? T.accent : T.primary
  const az = [...new Set(b.feel.map(f => f.z).filter(Boolean))]

  return (
    <div className="screen tab-scroll">
      <div style={{ height: 58, flexShrink: 0 }} />
      <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 800, color: T.muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>Week {week} · Your body</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: T.text, marginTop: 2 }}>Body forecast</div>
        </div>
        <StreakRing streak={streak} />
      </div>

      {/* Today card */}
      <div style={{ padding: '0 20px 14px' }}>
        <Card glow style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: T.primary, letterSpacing: 1 }}>TODAY</div>
              <div style={{ fontSize: 13, color: T.muted, marginTop: 1 }}>{today.dateLabel}</div>
            </div>
            <div style={{ display: 'flex', gap: 3 }}>
              {[1,2,3,4,5].map(n => <div key={n} style={{ width: 10, height: 10, borderRadius: 2, background: n <= today.energy ? ec(today.energy) : 'rgba(255,255,255,0.1)' }} />)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {today.symptom.i}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: T.text }}>{today.symptom.l}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2, lineHeight: 1.5 }}>{today.symptom.tip}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* 7-day strip */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: T.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, padding: '0 20px' }}>Next 7 days</div>
        <div style={{ display: 'flex', gap: 9, overflowX: 'auto', padding: '4px 20px' }}>
          {forecast.map((day, i) => (
            <div key={i} style={{ flexShrink: 0, width: day.isToday ? 74 : 64, background: day.isToday ? T.cardGlow : T.card, borderRadius: 16, padding: '11px 8px', border: `1px solid ${day.isToday ? 'rgba(255,107,74,0.3)' : T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: day.isToday ? T.primary : T.muted }}>{day.dayLabel}</div>
              <div style={{ fontSize: day.isToday ? 22 : 18, lineHeight: 1 }}>{day.symptom.i}</div>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(n => <div key={n} style={{ width: 4, height: 4, borderRadius: 1, background: n <= day.energy ? ec(day.energy) : 'rgba(255,255,255,0.1)' }} />)}
              </div>
              <div style={{ fontSize: 8.5, fontWeight: 700, color: T.muted, textAlign: 'center', lineHeight: 1.2 }}>{day.symptom.l.split(' ')[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body map + info */}
      <div style={{ padding: '0 20px 24px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Card style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 168 }}>
          <Lbl style={{ alignSelf: 'flex-start' }}>Where you'll feel it</Lbl>
          <svg viewBox="0 0 160 280" width="140" height="245" style={{ overflow: 'visible', flexShrink: 0 }}>
            <defs>
              <filter id="bmbf"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {az.map(z => { const g = ZONES[z]; if (!g) return null; return <ellipse key={`glow-${z}`} cx={g.cx} cy={g.cy} rx={g.rx + 14} ry={g.ry + 14} fill="rgba(255,107,74,0.18)" className="zone-pulse" style={{ filter: 'url(#bmbf)' }} /> })}
            {/* Silhouette */}
            <ellipse cx="70" cy="28" rx="21" ry="23" fill="rgba(255,154,112,0.12)" stroke="#ff9a70" strokeWidth="1.5" />
            <path d="M62,50 L62,62 M78,50 L78,62" stroke="#ff9a70" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M62,62 Q44,66 30,82 L26,120" fill="none" stroke="#ff9a70" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M78,62 Q96,66 110,82 L110,120" fill="none" stroke="#ff9a70" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M26,120 Q20,150 20,175 Q20,205 28,225 Q38,248 70,255" fill="none" stroke="#ff9a70" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M110,120 Q116,150 116,175 Q116,205 108,225 Q98,248 70,255" fill="none" stroke="#ff9a70" strokeWidth="1.4" strokeLinecap="round" />
            <ellipse cx="70" cy="178" rx="46" ry="52" fill="rgba(255,107,74,0.07)" stroke="#ff6b4a" strokeWidth="2" />
            {/* Active zones */}
            {az.map(z => { const g = ZONES[z]; if (!g) return null; return <g key={`zone-${z}`}><ellipse cx={g.cx} cy={g.cy} rx={g.rx} ry={g.ry} fill="rgba(255,107,74,0.22)" className="zone-pulse" /><circle cx={g.cx} cy={g.cy} r="4" fill={T.primary} opacity=".9" /></g> })}
            {/* Labels */}
            {az.map(z => { const g = ZONES[z]; if (!g) return null; const il = g.lx < 70; return <g key={`lbl-${z}`}><line x1={g.cx + (il ? -g.rx : g.rx)} y1={g.cy} x2={g.lx + (il ? -2 : 2)} y2={g.ly} stroke={T.primary} strokeWidth=".8" opacity=".5" /><text x={il ? g.lx - 2 : g.lx + 2} y={g.ly + 1} textAnchor={il ? 'end' : 'start'} fontSize="8.5" fill={T.primary} fontFamily="Nunito" fontWeight="700">{g.label}</text></g> })}
          </svg>
        </Card>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
          <Card style={{ padding: '12px 14px' }}>
            <Lbl>Baby this week</Lbl>
            <div style={{ fontSize: 22, lineHeight: 1, marginBottom: 4 }}>{b.e}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>Week {week}</div>
          </Card>
          <Card style={{ padding: '12px 14px' }}>
            <Lbl>Fact</Lbl>
            <div style={{ fontSize: 12, color: T.text, lineHeight: 1.55 }}>{b.fact}</div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ── Doctors tab ────────────────────────────────────────────────
function DoctorsTab({ week, streak, bp, pathway }) {
  const [view, setView] = useState('list')
  const [docId, setDocId] = useState(null)
  const [secs, setSecs] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (view !== 'call') { clearInterval(timerRef.current); setSecs(0); return }
    timerRef.current = setInterval(() => setSecs(s => s + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [view])

  const doc = DOCTORS.find(d => d.id === docId)
  const fmt = x => `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`

  if (view === 'call') return (
    <div className="screen tab-scroll" style={{ alignItems: 'center', justifyContent: 'space-between', background: `radial-gradient(ellipse at 50% 30%,rgba(76,175,125,0.12),${T.bgDeep})`, padding: '58px 20px 40px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.3, fontWeight: 800 }}>CONNECTED</div>
        <div style={{ fontSize: 16, color: T.green, fontWeight: 900, marginTop: 4 }}>{fmt(secs)}</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 116, height: 116, borderRadius: 58, background: `linear-gradient(135deg,${T.primary},${T.accent})`, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, animation: 'callRing 2.4s ease-in-out infinite' }}>
          {doc?.e}
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: T.text }}>{doc?.name}</div>
      </div>
      <Card style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1.1, fontWeight: 800, marginBottom: 6 }}>SHARED WITH DOCTOR</div>
        <div style={{ fontSize: 13, color: 'rgba(254,240,230,0.75)', lineHeight: 1.6 }}>
          Week {week} · BP {bp.s || '—'}/{bp.d || '—'} · {pathway?.label} · 🔥 {streak}-day streak
        </div>
      </Card>
      <button onClick={() => setView('list')} style={{ width: 64, height: 64, borderRadius: 32, background: '#e53935', border: 'none', cursor: 'pointer', fontSize: 24 }}>📵</button>
    </div>
  )

  if (view === 'profile' && doc) return (
    <div className="screen tab-scroll" style={{ padding: '0 20px 24px' }}>
      <div style={{ height: 58, flexShrink: 0 }} />
      <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.primary, fontWeight: 800, fontSize: 13.5, padding: 0, marginBottom: 14 }}>← Specialists</button>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: `linear-gradient(135deg,${T.primary},${T.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, flexShrink: 0, boxShadow: '0 0 24px rgba(255,107,74,0.35)' }}>
          {doc.e}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: T.text }}>{doc.name}</div>
          <div style={{ fontSize: 13, color: T.primary, fontWeight: 800, marginTop: 4 }}>⭐ {doc.rating}</div>
        </div>
      </div>
      <Btn onClick={() => setView('call')}>Begin consult →</Btn>
    </div>
  )

  return (
    <div className="screen tab-scroll" style={{ padding: '0 20px 24px' }}>
      <div style={{ height: 58, flexShrink: 0 }} />
      <div style={{ fontSize: 24, fontWeight: 900, color: T.text }}>Specialists</div>
      <div style={{ fontSize: 13, color: T.muted, marginTop: 2, marginBottom: 18 }}>UK-based · doctor sees your full picture</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {DOCTORS.map(d => (
          <Card key={d.id} onClick={d.avail ? () => { setDocId(d.id); setView('profile') } : undefined} style={{ opacity: d.avail ? 1 : 0.5, cursor: d.avail ? 'pointer' : 'default' }}>
            <div style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 28, background: `linear-gradient(135deg,${T.primary},${T.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{d.e}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: T.text }}>{d.name}</div>
                <div style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>{d.role}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 5, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: T.primary, fontWeight: 800 }}>⭐ {d.rating}</span>
                  <span style={{ fontSize: 10, background: d.avail ? 'rgba(76,175,125,0.18)' : 'rgba(255,255,255,0.06)', color: d.avail ? T.green : T.muted, padding: '2px 8px', borderRadius: 9, fontWeight: 800 }}>{d.avail ? 'Available' : 'Busy'}</span>
                  <span style={{ fontSize: 10, color: T.muted, fontWeight: 700 }}>{d.wait}</span>
                </div>
              </div>
              {d.avail && <div style={{ color: T.muted, fontSize: 20 }}>›</div>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ── Tab bar ────────────────────────────────────────────────────
function TabBar({ active, onTab }) {
  const tabs = [{ id: 'journey', e: '🌸', l: 'Journey' }, { id: 'log', e: '📋', l: 'Log' }, { id: 'body', e: '🤰', l: 'Body' }, { id: 'doctors', e: '🩺', l: 'Doctors' }]
  return (
    <div style={{ display: 'flex', flexShrink: 0, background: T.tabBg, borderTop: `.5px solid ${T.border}`, backdropFilter: 'blur(24px)', paddingBottom: 22, paddingTop: 8 }}>
      {tabs.map(tab => {
        const on = tab.id === active
        return (
          <button key={tab.id} onClick={() => onTab(tab.id)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '4px 0' }}>
            <span style={{ fontSize: 20, lineHeight: 1, filter: on ? 'none' : 'grayscale(1)', opacity: on ? 1 : .38, transition: 'all .2s' }}>{tab.e}</span>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: on ? T.primary : T.muted, letterSpacing: .4, transition: 'color .2s' }}>{tab.l}</span>
            {on && <div style={{ width: 18, height: 3, borderRadius: 2, background: T.primary, boxShadow: `0 0 6px ${T.primary}` }} />}
          </button>
        )
      })}
    </div>
  )
}

// ── Root App ───────────────────────────────────────────────────
export default function App() {
  const saved = loadSaved()
  const [onboarded, setOnboarded] = useState(saved?.onboarded || false)
  const [name, setName] = useState(saved?.name || '')
  const [week, setWeek] = useState(saved?.week || 24)
  const [pathwayId, setPathwayId] = useState(saved?.pathwayId || 'standard')
  const [streak, setStreak] = useState(saved ? computeStreak(saved.logs || []) : 0)
  const [logs, setLogs] = useState(saved?.logs || [])
  const [tab, setTab] = useState('journey')
  const [lastBp, setLastBp] = useState({ s: '', d: '' })

  const pathway = PATHWAYS[pathwayId] || PATHWAYS.standard

  useEffect(() => {
    save({ onboarded, name, week, pathwayId, streakDays: streak, logs })
  }, [onboarded, name, week, pathwayId, streak, logs])

  const handleOnboardComplete = ({ name: n, week: w, pathway: p }) => {
    setName(n); setWeek(w); setPathwayId(p); setOnboarded(true)
  }

  const handleLogSave = (entry) => {
    const date = new Date().toISOString().slice(0, 10)
    const newLogs = [...logs, { date, ...entry }]
    setLogs(newLogs)
    setStreak(computeStreak(newLogs))
    if (entry.bp) setLastBp(entry.bp)
  }

  if (!onboarded) return <Onboarding onComplete={handleOnboardComplete} />

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: T.bg, overflow: 'hidden' }}>
      <div key={tab} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {tab === 'journey' && <JourneyTab week={week} streak={streak} name={name} pathway={pathway} />}
        {tab === 'log'     && <LogTab onSave={handleLogSave} />}
        {tab === 'body'    && <BodyTab week={week} streak={streak} />}
        {tab === 'doctors' && <DoctorsTab week={week} streak={streak} bp={lastBp} pathway={pathway} />}
      </div>
      <TabBar active={tab} onTab={setTab} />
    </div>
  )
}
