import { T, STARS } from './data'

const skin = '#f4c4a8', skinShadow = 'rgba(180,100,60,0.22)'
const hair = '#3d1f0e', hairMid = '#5a2e10'
const shoe = '#c8654a', shoeDark = '#a04030'

// Dress colour shifts with energy + loggedToday — always warm, never gray
function dressColor(energy, loggedToday) {
  if (energy >= 4) return loggedToday ? '#ff5c38' : '#c86848'   // vivid coral
  if (energy >= 3) return loggedToday ? '#ff8c6a' : '#8a6a58'   // normal
  if (energy >= 2) return loggedToday ? '#e8826a' : '#b87858'   // soft warm peach
  return loggedToday ? '#d87868' : '#a86858'                     // cozy dusty rose
}
function dressDarkColor(energy, loggedToday) {
  if (energy >= 4) return '#b03c20'
  if (energy >= 3) return loggedToday ? '#d45a3a' : '#6b4a38'
  return loggedToday ? '#b05a48' : '#886048'                     // warm dark, not gray
}
function dressLightColor(energy, loggedToday) {
  if (energy >= 4) return '#ff8060'
  if (energy >= 3) return loggedToday ? '#ffaa8a' : '#a07a68'
  return loggedToday ? '#f0a088' : '#c89070'                     // warm light
}

const blink = (delay = 0, energy = 3) => ({
  animation: `eyeBlink ${energy >= 4 ? 3.5 : energy <= 1 ? 7 : 4.5}s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  transformBox: 'fill-box',
  transformOrigin: '50% 50%',
})

// ── Eyes (energy-aware) ────────────────────────────────────────────
function Eyes({ cx = 0, cy = 0, energy = 3 }) {
  const tired = energy <= 2
  const veryTired = energy <= 1
  const happy = energy >= 4
  // ry shrinks a bit when tired/happy (half-close or squint)
  const ry = happy ? 2.5 : tired ? 2.6 : 3.4
  const droopY = veryTired ? 2.5 : tired ? 1.2 : 0   // how far eyelid droops into eye
  const irisOffset = tired ? 0.6 : 0                   // iris drifts down when heavy

  return (
    <>
      {/* Left eye */}
      <g style={blink(0, energy)}>
        <ellipse cx={cx - 6} cy={cy} rx={3.6} ry={ry} fill="white" />
        <circle cx={cx - 6} cy={cy + irisOffset} r={happy ? 1.9 : 2.1} fill="#2d1a10" />
        <circle cx={cx - 5.1} cy={cy - 0.9 + irisOffset} r={0.9} fill="white" />
      </g>
      {/* Left eyelid droop */}
      {tired && (
        <path
          d={`M${cx - 10},${cy - 2} Q${cx - 6},${cy - 3.4 + droopY} ${cx - 2},${cy - 2}`}
          fill={skin} />
      )}

      {/* Right eye */}
      <g style={blink(0.08, energy)}>
        <ellipse cx={cx + 6} cy={cy} rx={3.6} ry={ry} fill="white" />
        <circle cx={cx + 6} cy={cy + irisOffset} r={happy ? 1.9 : 2.1} fill="#2d1a10" />
        <circle cx={cx + 6.9} cy={cy - 0.9 + irisOffset} r={0.9} fill="white" />
      </g>
      {/* Right eyelid droop */}
      {tired && (
        <path
          d={`M${cx + 2},${cy - 2} Q${cx + 6},${cy - 3.4 + droopY} ${cx + 10},${cy - 2}`}
          fill={skin} />
      )}

      {/* Happy squint line under eyes */}
      {happy && (
        <>
          <path d={`M${cx-10},${cy+2} Q${cx-6},${cy+5} ${cx-2},${cy+2}`} fill={skin} />
          <path d={`M${cx+2},${cy+2} Q${cx+6},${cy+5} ${cx+10},${cy+2}`} fill={skin} />
        </>
      )}
    </>
  )
}

// ── Face (energy-aware) ────────────────────────────────────────────
function Face({ hx = 0, hy = 0, energy = 3 }) {
  const happy = energy >= 4
  const tired = energy <= 2
  const veryTired = energy <= 1

  // Eyebrow position: raised when happy, slightly lower/relaxed when tired (not furrowed)
  const browY = happy ? hy - 9.5 : tired ? hy - 8 : hy - 9
  const browCurve = happy ? -12 : tired ? -8.5 : -9.5

  return (
    <>
      {/* Cheeks — brighter when happy, duller when tired */}
      <ellipse cx={hx - 9} cy={hy + 5} rx={happy ? 7 : 5.5} ry={happy ? 4 : 3.5}
        fill={happy ? 'rgba(255,110,80,0.38)' : tired ? 'rgba(200,110,90,0.18)' : 'rgba(255,130,100,0.28)'}
        style={{ animation: 'blushPulse 3s ease-in-out infinite' }} />
      <ellipse cx={hx + 9} cy={hy + 5} rx={happy ? 7 : 5.5} ry={happy ? 4 : 3.5}
        fill={happy ? 'rgba(255,110,80,0.38)' : tired ? 'rgba(200,110,90,0.18)' : 'rgba(255,130,100,0.28)'}
        style={{ animation: 'blushPulse 3s ease-in-out infinite', animationDelay: '.4s' }} />

      {/* Eyebrows */}
      <path d={`M${hx-10},${browY} Q${hx-7},${browCurve + hy} ${hx-3},${browY}`}
        stroke={hair} strokeWidth={tired ? 1.3 : 1.7} fill="none" strokeLinecap="round" />
      <path d={`M${hx+3},${browY} Q${hx+7},${browCurve + hy} ${hx+10},${browY}`}
        stroke={hair} strokeWidth={tired ? 1.3 : 1.7} fill="none" strokeLinecap="round" />

      {/* Eyes */}
      <Eyes cx={hx} cy={hy} energy={energy} />

      {/* Nose */}
      <circle cx={hx} cy={hy + 5.5} r={1.6} fill={skinShadow} />

      {/* Mouth */}
      {happy && (
        // Big open smile
        <>
          <path d={`M${hx-6},${hy+10} Q${hx},${hy+16} ${hx+6},${hy+10}`}
            stroke="#2d1a10" strokeWidth="1.8" fill="rgba(180,80,60,0.25)" strokeLinecap="round" />
          <path d={`M${hx-5},${hy+10} Q${hx},${hy+15} ${hx+5},${hy+10}`}
            fill="rgba(180,80,60,0.18)" />
        </>
      )}
      {/* Mouth — sleepy-relaxed when tired, never sad */}
      {!happy && (
        <path d={`M${hx-4},${hy+11} Q${hx},${hy+12.5} ${hx+4},${hy+11}`}
          stroke="#2d1a10" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      )}
    </>
  )
}

// ── Hair ───────────────────────────────────────────────────────────
function Hair({ hx = 0, hy = 0, flower = false, ponytail = false }) {
  return (
    <g>
      <ellipse cx={hx} cy={hy - 12} rx={17} ry={9} fill={hair} />
      <ellipse cx={hx - 16} cy={hy - 5} rx={6} ry={11} fill={hair} />
      <circle cx={hx + 13} cy={hy - 13} r={7} fill={hair} />
      {ponytail && (
        <g style={{ animation: 'tailWag 3.5s ease-in-out infinite', transformOrigin: `${hx + 13}px ${hy - 13}px`, transformBox: 'fill-box' }}>
          <path d={`M${hx+12},${hy-13} Q${hx+26},${hy-18} ${hx+28},${hy-5} Q${hx+26},${hy+4} ${hx+18},${hy+6}`}
            fill="none" stroke={hair} strokeWidth={8} strokeLinecap="round" />
          <path d={`M${hx+12},${hy-13} Q${hx+26},${hy-18} ${hx+28},${hy-5} Q${hx+26},${hy+4} ${hx+18},${hy+6}`}
            fill="none" stroke={hairMid} strokeWidth={4} strokeLinecap="round" opacity=".4" />
        </g>
      )}
      {flower && (
        <g>
          <circle cx={hx + 14} cy={hy - 14} r={6} fill="#ff6b4a" opacity=".92" />
          <circle cx={hx + 14} cy={hy - 14} r={2.5} fill="#ffee99" />
          <circle cx={hx + 11} cy={hy - 17} r={1.6} fill="#ffee99" opacity=".7" />
          <circle cx={hx + 17} cy={hy - 17} r={1.6} fill="#ffee99" opacity=".7" />
        </g>
      )}
    </g>
  )
}

// ── ZZZ bubbles (very tired) ───────────────────────────────────────
function TiredZs({ hx, hy }) {
  return (
    <>
      {['z', 'Z', 'Z'].map((z, i) => (
        <text key={i} x={hx + 20 + i * 8} y={hy - 18 - i * 10}
          fontSize={8 + i * 2} fill={T.muted} fontFamily="Nunito" fontWeight="900" opacity={0.5 + i * 0.15}
          style={{ animation: `steam ${1.8 + i * .5}s ease-out infinite`, animationDelay: `${i * .7}s` }}>
          {z}
        </text>
      ))}
    </>
  )
}

// ── Energy sparkles (very energized) ──────────────────────────────
function Sparkles({ hx, hy }) {
  const pts = [[22, -22], [32, -8], [28, -35], [18, -40], [36, -26]]
  return (
    <>
      {pts.map(([dx, dy], i) => (
        <g key={i} style={{ animation: `firefly ${1.6 + i * .3}s ease-in-out infinite`, animationDelay: `${i * .4}s` }}>
          <circle cx={hx + dx} cy={hy + dy} r={1.8} fill={T.amber} opacity=".9"
            style={{ filter: 'drop-shadow(0 0 3px #ffcc66)' }} />
        </g>
      ))}
    </>
  )
}

// ── Walking character ──────────────────────────────────────────────
function WalkChar({ dress, dressDark, dressLight, streak, loggedToday, thought, energy }) {
  const bobSpeed = energy >= 4 ? '.45s' : energy <= 1 ? '.75s' : '.58s'
  const lStyle = (name, origin) => ({
    animation: `${name} ${bobSpeed} ease-in-out infinite`,
    transformOrigin: origin,
    transformBox: 'fill-box',
  })
  const hx = 0, hy = -94

  return (
    <g style={{ animation: `bodyBob ${bobSpeed} ease-in-out infinite` }}>
      <ellipse cx="3" cy="5" rx="20" ry="5.5" fill="rgba(0,0,0,0.25)" />

      {/* Back leg */}
      <g style={lStyle('legR', '7px -32px')}>
        <rect x="3" y="-34" width="11" height="34" rx="5.5" fill={dressDark} opacity=".75" />
        <ellipse cx="8" cy="3" rx="9" ry="4" fill={shoeDark} opacity=".75" />
        <ellipse cx="6" cy="1" rx="8" ry="3.2" fill={shoe} opacity=".75" />
      </g>

      {/* Dress A-line */}
      <path d="M-14,-42 Q-20,-2 -23,3 L26,3 Q22,-2 16,-42Z" fill={dress} />
      <path d="M-23,3 Q-10,8 0,5 Q10,8 26,3" fill="none" stroke={dressLight} strokeWidth="1.5" opacity=".5" />
      {/* Bodice */}
      <rect x="-15" y="-76" width="30" height="36" rx="9" fill={dress} />
      <path d="M-8,-76 Q0,-72 8,-76" fill="none" stroke={dressLight} strokeWidth="1.5" opacity=".6" />

      {/* Belly */}
      <ellipse cx="17" cy="-55" rx="21" ry="19" fill={dress} />
      <ellipse cx="14" cy="-61" rx="9.5" ry="7" fill="rgba(255,255,255,0.2)" />
      <circle cx="20" cy="-51" r="2" fill={dressLight} opacity=".55" />

      {/* Back arm */}
      <g style={lStyle('armR', '14px -68px')}>
        <rect x="13" y="-70" width="10" height="28" rx="5" fill={skin} opacity=".8" />
        <circle cx="18" cy="-41" r="5.5" fill={skin} opacity=".8" />
      </g>

      {/* Front leg */}
      <g style={lStyle('legL', '-6px -32px')}>
        <rect x="-11" y="-34" width="11" height="34" rx="5.5" fill={dressDark} />
        <ellipse cx="-6" cy="3" rx="9" ry="4" fill={shoeDark} />
        <ellipse cx="-8" cy="1" rx="8" ry="3.2" fill={shoe} />
      </g>

      {/* Front arm */}
      <g style={lStyle('armL', '-14px -68px')}>
        <rect x="-23" y="-70" width="10" height="28" rx="5" fill={skin} />
        <circle cx="-18" cy="-41" r="5.5" fill={skin} />
      </g>

      {/* Neck */}
      <rect x="-4.5" y="-81" width="9" height="8" rx="3.5" fill={skin} />
      <ellipse cx={hx - 16} cy={hy} rx="3.5" ry="4.5" fill={skin} />
      <ellipse cx={hx + 16} cy={hy} rx="3.5" ry="4.5" fill={skin} />

      {/* Head */}
      <circle cx={hx} cy={hy} r="16.5" fill={skin} />
      <ellipse cx={hx - 4} cy={hy - 4} rx="10" ry="9" fill="rgba(255,255,255,0.08)" />

      {/* Face */}
      <Face hx={hx} hy={hy} energy={energy} />
      <Hair hx={hx} hy={hy} flower={streak >= 7 || energy >= 4} ponytail />

      {/* Energy states */}
      {energy <= 1 && <TiredZs hx={hx} hy={hy} />}
      {energy >= 4 && <Sparkles hx={hx} hy={hy} />}

      {/* Thought bubble */}
      {thought && (
        <g className="thought-in">
          <circle cx="20" cy="-113" r="3" fill="rgba(255,240,230,0.94)" />
          <circle cx="26" cy="-118" r="4.5" fill="rgba(255,240,230,0.94)" />
          <rect x="-16" y="-138" width="88" height="32" rx="14" fill="rgba(255,240,230,0.94)" stroke="rgba(255,107,74,0.25)" strokeWidth="1" />
          <text x="28" y="-128" textAnchor="middle" fontSize="7.5" fill="#2d1a10" fontFamily="Nunito" fontWeight="700">{thought.slice(0, 26)}</text>
          {thought.length > 26 && <text x="28" y="-119" textAnchor="middle" fontSize="7" fill="#2d1a10" fontFamily="Nunito" fontWeight="600">{thought.slice(26, 50)}</text>}
        </g>
      )}
    </g>
  )
}

// ── Sitting character ──────────────────────────────────────────────
function SitChar({ dress, dressDark, dressLight, streak, loggedToday, thought, energy }) {
  const hx = 0, hy = -78

  return (
    <g style={{ animation: `sitBob ${energy >= 4 ? '2.8s' : energy <= 1 ? '5s' : '3.8s'} ease-in-out infinite` }}>
      {/* Legs */}
      <rect x="-21" y="-14" width="16" height="24" rx="7" fill={dressDark} />
      <rect x="5" y="-14" width="16" height="24" rx="7" fill={dressDark} />
      <ellipse cx="-13" cy="14" rx="11" ry="5" fill={shoeDark} />
      <ellipse cx="-15" cy="12" rx="10" ry="4" fill={shoe} />
      <ellipse cx="13" cy="14" rx="11" ry="5" fill={shoeDark} />
      <ellipse cx="11" cy="12" rx="10" ry="4" fill={shoe} />
      <ellipse cx="0" cy="4" rx="24" ry="11" fill={dress} opacity=".7" />

      {/* Torso */}
      <rect x="-17" y="-60" width="34" height="50" rx="12" fill={dress}
        style={{ animation: `breathe ${energy >= 4 ? '2.2s' : energy <= 1 ? '4.5s' : '3.2s'} ease-in-out infinite`, transformOrigin: '0px -35px', transformBox: 'fill-box' }} />
      <path d="M-8,-60 Q0,-56 8,-60" fill="none" stroke={dressLight} strokeWidth="1.5" opacity=".6" />

      {/* Belly */}
      <ellipse cx="3" cy="-35" rx="21" ry="18" fill={dress}
        style={{ animation: 'breathe 3.2s ease-in-out infinite', transformOrigin: 'center', transformBox: 'fill-box' }} />
      <ellipse cx="1" cy="-40" rx="10" ry="8" fill="rgba(255,255,255,0.18)" />
      <circle cx="6" cy="-30" r="2" fill={dressLight} opacity=".55" />

      {/* Left arm — hand on belly when energized/logged, hanging when tired */}
      {energy <= 2 ? (
        <>
          <rect x="-28" y="-52" width="11" height="30" rx="5.5" fill={skin} />
          <circle cx="-22" cy="-20" r="6" fill={skin} />
        </>
      ) : (
        <>
          <rect x="-27" y="-54" width="11" height="26" rx="5.5" fill={skin} />
          <circle cx="0" cy="-28" r="6" fill={skin} />
          <path d="M-22,-30 Q-8,-22 0,-28" fill="none" stroke={skin} strokeWidth="9" strokeLinecap="round" />
        </>
      )}

      {/* Right arm with tea cup or phone (energized) */}
      <rect x="16" y="-54" width="11" height="24" rx="5.5" fill={skin} />
      <circle cx="21" cy="-28" r="6" fill={skin} />

      {/* Tea cup or book depending on energy */}
      {energy <= 2 ? (
        // Just holding cup, slumped
        <>
          <rect x="14" y="-36" width="17" height="14" rx="5" fill="rgba(200,160,120,0.7)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <path d="M31,-33 Q37,-33 37,-28 Q37,-23 31,-23" fill="none" stroke="rgba(200,160,120,0.7)" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        // Cute tea cup with steam
        <>
          <rect x="14" y="-38" width="17" height="14" rx="5" fill="rgba(255,205,155,0.88)" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
          <rect x="14" y="-38" width="17" height="5" rx="5" fill="rgba(255,225,180,0.4)" />
          <path d="M31,-35 Q38,-35 38,-29 Q38,-23 31,-23" fill="none" stroke="rgba(255,205,155,0.88)" strokeWidth="2.2" strokeLinecap="round" />
          {[0, 1, 2].map(i => (
            <path key={i} d={`M${17 + i * 5},-40 Q${19 + i * 5},-49 ${17 + i * 5},-57`}
              fill="none" stroke="rgba(255,225,190,0.5)" strokeWidth="1.4" strokeLinecap="round"
              style={{ animation: `steam ${1.6 + i * .45}s ease-out infinite`, animationDelay: `${i * .55}s` }} />
          ))}
        </>
      )}

      {/* Neck + head */}
      <rect x="-4.5" y="-65" width="9" height="8" rx="3.5" fill={skin} />
      <ellipse cx={hx - 15} cy={hy} rx="3.5" ry="4.5" fill={skin} />
      <ellipse cx={hx + 15} cy={hy} rx="3.5" ry="4.5" fill={skin} />
      <circle cx={hx} cy={hy} r="16.5" fill={skin} />
      <ellipse cx={hx - 4} cy={hy - 4} rx="10" ry="9" fill="rgba(255,255,255,0.08)" />

      <Face hx={hx} hy={hy} energy={energy} />
      <Hair hx={hx} hy={hy} flower={streak >= 7 || energy >= 4} />

      {energy <= 1 && <TiredZs hx={hx} hy={hy} />}
      {energy >= 4 && <Sparkles hx={hx} hy={hy} />}

      {thought && (
        <g className="thought-in">
          <circle cx="-4" cy="-97" r="3" fill="rgba(255,240,230,0.94)" />
          <circle cx="4" cy="-103" r="4.5" fill="rgba(255,240,230,0.94)" />
          <rect x="-46" y="-122" width="92" height="26" rx="13" fill="rgba(255,240,230,0.94)" stroke="rgba(255,107,74,0.25)" strokeWidth="1" />
          <text x="0" y="-107" textAnchor="middle" fontSize="7.5" fill="#2d1a10" fontFamily="Nunito" fontWeight="700">{thought.slice(0, 26)}</text>
          {thought.length > 26 && <text x="0" y="-99" textAnchor="middle" fontSize="7" fill="#2d1a10" fontFamily="Nunito" fontWeight="600">{thought.slice(26, 50)}</text>}
        </g>
      )}
    </g>
  )
}

// ── Contracting character ──────────────────────────────────────────
function ContractChar({ dress, dressDark, streak, loggedToday, thought, energy }) {
  const hx = 0, hy = -96
  return (
    <g>
      <ellipse cx="0" cy="4" rx="18" ry="4.5" fill="rgba(0,0,0,0.2)" />
      <rect x="-10" y="-36" width="11" height="36" rx="5.5" fill={dressDark} />
      <rect x="2" y="-36" width="11" height="36" rx="5.5" fill={dressDark} />
      <ellipse cx="-5" cy="3" rx="9" ry="4" fill={shoe} />
      <ellipse cx="7" cy="3" rx="9" ry="4" fill={shoe} />
      <path d="M-14,-40 Q-17,0 -18,3 L18,3 Q17,0 14,-40Z" fill={dress} />
      <rect x="-14" y="-78" width="28" height="40" rx="8" fill={dress} />
      {/* Big belly */}
      <ellipse cx="15" cy="-57" rx="23" ry="21" fill={dress}
        style={{ animation: 'contractPulse 2.2s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }} />
      <ellipse cx="12" cy="-63" rx="10" ry="8" fill="rgba(255,255,255,0.2)" />
      {/* Arms wrapping belly */}
      <path d="M-15,-65 Q-24,-48 -12,-40 Q0,-34 14,-38 Q26,-42 28,-56 Q28,-66 18,-72"
        fill="none" stroke={skin} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-15,-65 Q-24,-48 -12,-40 Q0,-34 14,-38 Q26,-42 28,-56 Q28,-66 18,-72"
        fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="-15" cy="-65" r="5.5" fill={skin} />
      <circle cx="18" cy="-72" r="5.5" fill={skin} />
      <rect x="-4.5" y="-83" width="9" height="7" rx="3.5" fill={skin} />
      <ellipse cx={hx - 16} cy={hy} rx="3.5" ry="4.5" fill={skin} />
      <ellipse cx={hx + 16} cy={hy} rx="3.5" ry="4.5" fill={skin} />
      <circle cx={hx} cy={hy} r="16.5" fill={skin} />
      <Face hx={hx} hy={hy} energy={2} />
      <Hair hx={hx} hy={hy} flower={streak >= 7} />
      {thought && (
        <g className="thought-in">
          <circle cx="4" cy="-115" r="3" fill="rgba(255,240,230,0.94)" />
          <circle cx="10" cy="-120" r="4.5" fill="rgba(255,240,230,0.94)" />
          <rect x="-36" y="-138" width="88" height="26" rx="13" fill="rgba(255,240,230,0.94)" stroke="rgba(255,107,74,0.25)" strokeWidth="1" />
          <text x="8" y="-125" textAnchor="middle" fontSize="7.5" fill="#2d1a10" fontFamily="Nunito" fontWeight="700">{thought?.slice(0, 26)}</text>
        </g>
      )}
    </g>
  )
}

// ── Park scene ─────────────────────────────────────────────────────
function ParkScene({ charState, streak, loggedToday, thought, pathwayColor, onTap, energy }) {
  const isWalk = charState === 'walking'
  const dress = dressColor(energy, loggedToday)
  const dressDk = dressDarkColor(energy, loggedToday)
  const dressLt = dressLightColor(energy, loggedToday)
  const walkSpeed = energy >= 4 ? '5.5s' : energy <= 1 ? '10s' : '7s'
  const flowerXs = [48, 76, 112, 148, 198, 228]
  const flowerColors = ['#ff6b4a', '#ffaa7a', '#ff8c6a', '#ffd4aa', '#ffcc66', '#ff9a70']

  return (
    <svg viewBox="0 0 362 255" width="100%" height="100%"
      style={{ display: 'block', position: 'absolute', inset: 0 }} onClick={onTap}>
      <defs>
        <linearGradient id="psky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={energy >= 4 ? '#1a0840' : '#0e0620'} />
          <stop offset="55%" stopColor={energy >= 4 ? '#3a1838' : '#2a1228'} />
          <stop offset="100%" stopColor={energy >= 4 ? '#8a3e22' : '#6B2e18'} />
        </linearGradient>
        <linearGradient id="pgrass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={energy >= 4 ? '#306020' : '#2a4a1a'} />
          <stop offset="100%" stopColor="#1a2d0e" />
        </linearGradient>
        <radialGradient id="plamp" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffcc66" stopOpacity={energy >= 4 ? '.65' : '.48'} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="pmoon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe8b0" stopOpacity=".35" /><stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8e0" stopOpacity=".5" /><stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <rect width="362" height="255" fill="url(#psky)" />

      {/* Moon */}
      <circle cx="308" cy="44" r="58" fill="url(#pmoon)" />
      <circle cx="308" cy="44" r="22" fill="#ffe8b0" opacity=".9" />
      <circle cx="308" cy="44" r="14" fill="url(#moonGlow)" />
      <circle cx="317" cy="38" r="17.5" fill={energy >= 4 ? '#1a0840' : '#0e0620'} />
      <circle cx="302" cy="52" r="3" fill="rgba(255,220,140,0.35)" />
      <circle cx="315" cy="56" r="2" fill="rgba(255,220,140,0.25)" />

      {/* Stars — more/brighter when energized */}
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x * .86} cy={s.y} r={energy >= 4 ? s.r * 1.4 : s.r} fill="white"
          style={{ animation: `starTwinkle ${energy >= 4 ? 1.5 + s.d : 2.2 + s.d}s ease-in-out infinite`, animationDelay: `${s.d}s` }} />
      ))}
      {[30, 80, 135, 190, 245, 280, 340].map((x, i) => (
        <circle key={`s2-${i}`} cx={x} cy={20 + i * 8} r={0.6} fill="rgba(255,255,255,0.5)"
          style={{ animation: `starTwinkle ${3 + i * .4}s ease-in-out infinite`, animationDelay: `${i * .3}s` }} />
      ))}

      {/* Ground */}
      <ellipse cx="181" cy="170" rx="235" ry="40" fill="rgba(200,80,30,0.14)" />
      <path d="M0,162 Q90,128 181,146 Q272,164 362,143 L362,255 L0,255Z" fill="#1a2d10" />
      <rect y="178" width="362" height="77" fill="url(#pgrass)" />

      {/* Stone walkway */}
      <ellipse cx="181" cy="200" rx="130" ry="8" fill="rgba(180,130,70,0.2)" />
      {[140, 165, 195, 220, 248].map((x, i) => (
        <ellipse key={i} cx={x} cy="200" rx="12" ry="5" fill="rgba(200,160,100,0.18)" />
      ))}

      {/* Left tree */}
      <rect x="20" y="134" width="7" height="48" rx="3.5" fill="#1a1a0e" />
      <ellipse cx="24" cy="126" rx="22" ry="27"
        style={{ animation: 'treeWave 5s ease-in-out infinite', transformOrigin: '24px 145px', transformBox: 'fill-box' }}
        fill={energy >= 4 ? '#286020' : '#1e3014'} />
      <ellipse cx="24" cy="116" rx="15" ry="19"
        style={{ animation: 'treeWave 5s ease-in-out infinite', animationDelay: '.2s', transformOrigin: '24px 145px', transformBox: 'fill-box' }}
        fill={energy >= 4 ? '#307025' : '#253c18'} />
      <ellipse cx="24" cy="108" rx="10" ry="13" fill="#2d4a1c" />
      {/* Right tree */}
      <rect x="322" y="138" width="6" height="44" rx="3" fill="#1a1a0e" />
      <ellipse cx="325" cy="130" rx="18" ry="24"
        style={{ animation: 'treeWave 6s ease-in-out infinite', animationDelay: '.7s', transformOrigin: '325px 148px', transformBox: 'fill-box' }}
        fill="#1e3014" />
      <ellipse cx="325" cy="122" rx="12" ry="16" fill="#253c18" />

      {/* Lamp */}
      <rect x="245" y="136" width="4.5" height="50" rx="2.25" fill="#3d3d2a" />
      <rect x="238" y="130" width="18" height="8" rx="4" fill="#5a5a3a" />
      <ellipse cx="247" cy="136" rx="20" ry="28" fill="url(#plamp)"
        style={{ animation: 'lampGlow 3.2s ease-in-out infinite' }} />
      <circle cx="247" cy="135" r="5" fill="#ffee99" />
      <circle cx="247" cy="135" r="3" fill="white" opacity=".8" />

      {/* Bench */}
      <rect x="50" y="168" width="50" height="6" rx="3" fill="#3d2a10" opacity=".7" />
      <rect x="53" y="174" width="5" height="10" rx="2.5" fill="#3d2a10" opacity=".7" />
      <rect x="92" y="174" width="5" height="10" rx="2.5" fill="#3d2a10" opacity=".7" />

      {/* Flowers — more when energized */}
      {flowerXs.slice(0, energy >= 4 ? 6 : streak >= 3 ? 6 : 2).map((x, fi) => (
        <g key={x}>
          <path d={`M${x},197 Q${x + 2},192 ${x},188`} stroke="#2d5a1a" strokeWidth="1.5" fill="none" />
          <circle cx={x} cy="187" r={energy >= 4 ? 5.5 : streak >= 7 ? 4.5 : 3.5}
            fill={energy >= 4 ? flowerColors[fi % 6] : flowerColors[(fi + 2) % 6]} />
          {(streak >= 7 || energy >= 4) && <>
            <circle cx={x - 4} cy="186" r="2.5" fill={flowerColors[(fi + 1) % 6]} opacity=".7" />
            <circle cx={x + 4} cy="186" r="2.5" fill={flowerColors[(fi + 2) % 6]} opacity=".7" />
          </>}
        </g>
      ))}

      {/* Fireflies */}
      {(streak >= 7 || energy >= 4) && [1, 2, 3, 4, 5, 6].map(i => (
        <g key={i}>
          <circle cx={55 + i * 44} cy={152 + Math.sin(i * 1.3) * 20} r={energy >= 4 ? 4 : 3.2} fill={T.amber}
            style={{ animation: `firefly ${energy >= 4 ? 1.6 + i * .28 : 2.2 + i * .35}s ease-in-out infinite`, animationDelay: `${i * .5}s`, filter: 'drop-shadow(0 0 5px #ffcc66)' }} />
          <circle cx={55 + i * 44} cy={152 + Math.sin(i * 1.3) * 20} r="1.4" fill="white" opacity=".8"
            style={{ animation: `firefly ${2.2 + i * .35}s ease-in-out infinite`, animationDelay: `${i * .5}s` }} />
        </g>
      ))}

      {/* Rainbow — energy 4 OR streak 14 */}
      {(streak >= 14 || energy >= 4) && (
        <g opacity={energy >= 4 ? .35 : .22}>
          {['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6'].map((c, i) => (
            <path key={i} d={`M${28 + i * 9},205 Q181,${95 - i * 12} ${334 - i * 9},205`}
              fill="none" stroke={c} strokeWidth="4.5" />
          ))}
        </g>
      )}

      {pathwayColor && <rect width="362" height="255" fill={pathwayColor} opacity=".04" />}

      {/* Character */}
      <g style={isWalk
        ? { animation: `charWalk ${walkSpeed} ease-in-out infinite` }
        : { transform: 'translateX(128px)' }}>
        <g transform="translate(0,193)">
          <WalkChar dress={dress} dressDark={dressDk} dressLight={dressLt}
            streak={streak} loggedToday={loggedToday} thought={thought} energy={energy} />
        </g>
      </g>

      {/* Dim overlay when tired */}
      {energy <= 1 && <rect width="362" height="255" fill="rgba(0,0,0,0.18)" />}
      {!loggedToday && <rect width="362" height="255" fill="rgba(0,0,0,0.22)" />}
    </svg>
  )
}

// ── Home scene ─────────────────────────────────────────────────────
function HomeScene({ charState, streak, loggedToday, thought, pathwayColor, onTap, energy }) {
  const dress = dressColor(energy, loggedToday)
  const dressDk = dressDarkColor(energy, loggedToday)
  const dressLt = dressLightColor(energy, loggedToday)
  const isContracting = charState === 'contracting'

  return (
    <svg viewBox="0 0 362 255" width="100%" height="100%"
      style={{ display: 'block', position: 'absolute', inset: 0 }} onClick={onTap}>
      <defs>
        <linearGradient id="hwall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={energy >= 4 ? '#301808' : '#251408'} />
          <stop offset="100%" stopColor={energy >= 4 ? '#4a2818' : '#3a2010'} />
        </linearGradient>
        <linearGradient id="hfloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a2e18" /><stop offset="100%" stopColor="#3a2210" />
        </linearGradient>
        <radialGradient id="hlamp" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffcc66" stopOpacity={energy >= 4 ? '.65' : energy <= 1 ? '.3' : '.5'} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="hrug" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8a3a20" stopOpacity=".45" /><stop offset="100%" stopColor="#6a2a14" stopOpacity=".2" />
        </radialGradient>
      </defs>

      <rect width="362" height="255" fill="url(#hwall)" />
      {pathwayColor && <rect width="362" height="255" fill={pathwayColor} opacity=".05" />}
      <rect y="192" width="362" height="63" fill="url(#hfloor)" />
      {[210, 225, 240].map(y => (
        <line key={y} x1="0" y1={y} x2="362" y2={y} stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
      ))}
      <rect y="148" width="362" height="3" rx="1.5" fill="rgba(255,255,255,0.06)" />

      {/* Window */}
      <rect x="14" y="22" width="58" height="78" rx="5" fill="#0b1520" stroke="#5a3a1e" strokeWidth="2.5" />
      <rect x="40" y="22" width="2.5" height="78" fill="#5a3a1e" />
      <rect x="14" y="60" width="58" height="2.5" fill="#5a3a1e" />
      <circle cx="25" cy="44" r="12" fill="#ffe8b0" opacity=".35" />
      <circle cx="30" cy="40" r="9.5" fill="#0b1520" />
      {[[55, 35], [48, 50], [62, 70], [28, 75]].map(([wx, wy], i) => (
        <circle key={i} cx={wx} cy={wy} r="1.2" fill="rgba(255,255,255,0.4)"
          style={{ animation: `starTwinkle ${2 + i * .5}s ease-in-out infinite` }} />
      ))}

      {/* Bookshelf */}
      <rect x="282" y="40" width="68" height="108" rx="4" fill="#3a2214" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      {[60, 82, 104, 126].map((y, ri) => (
        <rect key={ri} x="282" y={y} width="68" height="1.5" fill="rgba(255,255,255,0.08)" />
      ))}
      {[[286, 42, 8, 16, '#8a3a20'], [295, 42, 6, 16, '#3a6a8a'], [302, 42, 10, 16, '#4a7a3a'], [313, 42, 7, 16, '#7a5a2a'],
        [286, 62, 9, 17, '#5a3a8a'], [296, 62, 7, 17, '#8a6a20'], [304, 62, 11, 17, '#3a5a6a'],
        [286, 84, 8, 15, '#6a3a3a'], [295, 84, 10, 15, '#4a6a4a'], [306, 84, 7, 15, '#7a4a2a'],
        [286, 106, 12, 14, '#5a6a3a'], [299, 106, 8, 14, '#6a3a5a'],
      ].map(([x, y, w, h, c], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill={c} opacity=".85" />
      ))}

      {/* Floor lamp */}
      <rect x="304" y="100" width="5" height="94" rx="2.5" fill="#5a3a1a" />
      <ellipse cx="307" cy="98" rx="17" ry="10" fill="#7a5a2a" />
      <ellipse cx="307" cy="98" rx="30" ry="38" fill="url(#hlamp)"
        style={{ animation: `lampGlow ${energy >= 4 ? '2.5s' : '4.2s'} ease-in-out infinite` }} />
      <circle cx="307" cy="98" r="5.5" fill="#ffee99" />
      <circle cx="307" cy="98" r="3" fill="white" opacity={energy >= 4 ? '.95' : '.7'} />

      {/* Plant */}
      <rect x="336" y="170" width="10" height="24" rx="3" fill="#5a3a1a" />
      <ellipse cx="342" cy="156" rx="10" ry="18" fill={energy >= 4 ? '#357020' : '#2d5a1a'} />
      <ellipse cx="350" cy="153" rx="7" ry="13" fill={energy >= 4 ? '#488a28' : '#3d7a22'} />
      <ellipse cx="334" cy="160" rx="6" ry="10" fill="#256018" />

      {/* Rug */}
      <ellipse cx="181" cy="205" rx="110" ry="12" fill="url(#hrug)" />
      <ellipse cx="181" cy="205" rx="90" ry="9" fill="rgba(120,40,20,0.18)" />
      <ellipse cx="181" cy="205" rx="70" ry="7" fill="rgba(160,60,20,0.12)" />

      {/* Sofa */}
      <rect x="68" y="185" width="218" height="28" rx="14" fill="#5a2a1a" />
      <rect x="60" y="167" width="234" height="24" rx="12" fill="#6a3420" />
      <rect x="60" y="167" width="19" height="46" rx="10" fill="#5a2a1a" />
      <rect x="275" y="167" width="19" height="46" rx="10" fill="#5a2a1a" />
      <rect x="140" y="162" width="76" height="22" rx="10" fill="#7a3a22" />
      <rect x="82" y="172" width="64" height="16" rx="8" fill="rgba(255,255,255,0.05)" />
      <rect x="154" y="172" width="64" height="16" rx="8" fill="rgba(255,255,255,0.05)" />

      {/* Picture frame */}
      <rect x="170" y="28" width="60" height="48" rx="4" fill="#3a2214" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      <rect x="175" y="33" width="50" height="38" rx="2" fill="#0b0a18" />
      <circle cx="200" cy="52" r="12" fill="#ff6b4a" opacity={energy >= 4 ? '.4' : '.22'} />
      <circle cx="212" cy="47" r="8" fill="#ffcc66" opacity={energy >= 4 ? '.35' : '.18'} />
      <circle cx="194" cy="58" r="6" fill="#4caf7d" opacity={energy >= 4 ? '.4' : '.22'} />

      {/* Character */}
      {isContracting
        ? <g transform="translate(181,192)">
            <ContractChar dress={dress} dressDark={dressDk} streak={streak}
              loggedToday={loggedToday} thought={thought} energy={energy} />
          </g>
        : <g transform="translate(178,188)">
            <SitChar dress={dress} dressDark={dressDk} dressLight={dressLt}
              streak={streak} loggedToday={loggedToday} thought={thought} energy={energy} />
          </g>
      }

      {energy <= 1 && <rect width="362" height="255" fill="rgba(0,0,0,0.2)" />}
      {!loggedToday && <rect width="362" height="255" fill="rgba(0,0,0,0.22)" />}
    </svg>
  )
}

// ── Root export ────────────────────────────────────────────────────
export default function HeroScene({ charState, streak, loggedToday, thought, pathwayColor, onTap, energy = 3 }) {
  const isHome = charState === 'resting' || charState === 'sitting' || charState === 'contracting'
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer' }}>
      {isHome
        ? <HomeScene charState={charState} streak={streak} loggedToday={loggedToday}
            thought={thought} pathwayColor={pathwayColor} onTap={onTap} energy={energy} />
        : <ParkScene charState={charState} streak={streak} loggedToday={loggedToday}
            thought={thought} pathwayColor={pathwayColor} onTap={onTap} energy={energy} />
      }
    </div>
  )
}
