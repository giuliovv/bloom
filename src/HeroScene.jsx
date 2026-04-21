import { T, STARS } from './data'

const skin = '#f4c4a8', hair = '#3d1f0e', shoe = '#c8654a'

function WalkChar({ dress, streak, loggedToday, thought }) {
  const lStyle = (name, origin) => ({
    animation: `${name} .58s ease-in-out infinite`,
    transformOrigin: origin,
    transformBox: 'fill-box',
  })
  return (
    <g style={{ animation: 'bodyBob .58s ease-in-out infinite' }}>
      <ellipse cx="0" cy="4" rx="16" ry="4.5" fill="rgba(0,0,0,0.22)" />
      {/* Back leg */}
      <g style={lStyle('legR', '7px -30px')}>
        <rect x="2" y="-30" width="9" height="30" rx="4.5" fill={dress} opacity=".75" />
        <ellipse cx="7" cy="2" rx="7" ry="3.5" fill={shoe} opacity=".75" />
      </g>
      {/* Torso + bump */}
      <rect x="-16" y="-72" width="32" height="44" rx="10" fill={dress} />
      <ellipse cx="13" cy="-50" rx="17" ry="15" fill={dress} />
      <ellipse cx="14" cy="-55" rx="8" ry="6" fill="rgba(255,255,255,0.14)" />
      {/* Back arm */}
      <g style={lStyle('armR', '14px -68px')}>
        <rect x="13" y="-70" width="9" height="24" rx="4.5" fill={skin} opacity=".78" />
      </g>
      {/* Front leg */}
      <g style={lStyle('legL', '-7px -30px')}>
        <rect x="-11" y="-30" width="9" height="30" rx="4.5" fill={dress} />
        <ellipse cx="-7" cy="2" rx="7" ry="3.5" fill={shoe} />
      </g>
      {/* Front arm */}
      <g style={lStyle('armL', '-14px -68px')}>
        <rect x="-22" y="-70" width="9" height="24" rx="4.5" fill={skin} />
      </g>
      {/* Neck */}
      <rect x="-4.5" y="-77" width="9" height="8" rx="3.5" fill={skin} />
      {/* Head */}
      <circle cx="0" cy="-90" r="15" fill={skin} />
      {/* Hair */}
      <ellipse cx="-2" cy="-102" rx="15" ry="8" fill={hair} />
      <ellipse cx="-14" cy="-95" rx="5.5" ry="9" fill={hair} />
      <circle cx="12" cy="-102" r="6" fill={hair} />
      {/* Streak flower */}
      {streak >= 7 && <>
        <circle cx="14" cy="-103" r="5" fill="#ff6b4a" opacity=".9" />
        <circle cx="14" cy="-103" r="2.5" fill="#ffee99" />
      </>}
      {/* Face */}
      <circle cx="6" cy="-90" r="2.8" fill="#2d1a10" />
      <circle cx="7.2" cy="-91.2" r="1.1" fill="white" />
      <path d={loggedToday ? 'M3,-84 Q7,-81 10,-84' : 'M3,-84 Q7,-85 10,-84'} stroke="#2d1a10" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <circle cx="11" cy="-86" r="4" fill="rgba(255,150,100,0.22)" />
      {/* Thought bubble */}
      {thought && (
        <g className="thought-in">
          <ellipse cx="28" cy="-115" rx="44" ry="17" fill="rgba(255,240,230,0.95)" stroke="rgba(255,107,74,0.3)" strokeWidth="1" />
          <circle cx="14" cy="-106" r="3" fill="rgba(255,240,230,0.95)" />
          <circle cx="18" cy="-109" r="2" fill="rgba(255,240,230,0.95)" />
          <text x="28" y="-113" textAnchor="middle" fontSize="7" fill="#2d1a10" fontFamily="Nunito" fontWeight="700">{thought.slice(0, 28)}</text>
          {thought.length > 28 && <text x="28" y="-104" textAnchor="middle" fontSize="7" fill="#2d1a10" fontFamily="Nunito" fontWeight="600">{thought.slice(28, 52)}</text>}
        </g>
      )}
    </g>
  )
}

function SitChar({ dress, streak, loggedToday, thought }) {
  return (
    <g style={{ animation: 'sitBob 3.5s ease-in-out infinite' }}>
      {/* Legs */}
      <rect x="-18" y="-10" width="14" height="20" rx="5" fill={dress} />
      <rect x="4" y="-10" width="14" height="20" rx="5" fill={dress} />
      <ellipse cx="-11" cy="12" rx="9" ry="4" fill={shoe} />
      <ellipse cx="11" cy="12" rx="9" ry="4" fill={shoe} />
      {/* Torso */}
      <rect x="-17" y="-55" width="34" height="48" rx="11" fill={dress}
        style={{ animation: 'breathe 3.2s ease-in-out infinite', transformOrigin: '0 -30px', transformBox: 'fill-box' }} />
      <ellipse cx="0" cy="-32" rx="18" ry="15" fill={dress} />
      <ellipse cx="0" cy="-36" rx="9" ry="7" fill="rgba(255,255,255,0.14)" />
      {/* Arms */}
      <rect x="-26" y="-50" width="10" height="20" rx="5" fill={skin} />
      <rect x="16" y="-50" width="10" height="20" rx="5" fill={skin} />
      {/* Tea cup */}
      <rect x="16" y="-34" width="14" height="12" rx="4" fill="rgba(255,200,150,0.75)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <path d="M30,-31 Q35,-31 35,-27 Q35,-23 30,-23" fill="none" stroke="rgba(255,200,150,0.75)" strokeWidth="1.8" strokeLinecap="round" />
      {[0, 1].map(i => (
        <path key={i} d={`M${20 + i * 4},-36 Q${22 + i * 4},-43 ${20 + i * 4},-49`} fill="none" stroke="rgba(255,220,180,0.5)" strokeWidth="1.3" strokeLinecap="round"
          style={{ animation: `steam ${1.8 + i * .5}s ease-out infinite`, animationDelay: `${i * .6}s` }} />
      ))}
      {/* Neck + head */}
      <rect x="-4" y="-62" width="8" height="9" rx="3.5" fill={skin} />
      <circle cx="0" cy="-74" r="14" fill={skin} />
      <ellipse cx="0" cy="-85" rx="15" ry="7.5" fill={hair} />
      <ellipse cx="-13" cy="-80" rx="5" ry="8" fill={hair} />
      <circle cx="12" cy="-85" r="6" fill={hair} />
      {streak >= 7 && <>
        <circle cx="13" cy="-86" r="5" fill="#ff6b4a" opacity=".9" />
        <circle cx="13" cy="-86" r="2.5" fill="#ffee99" />
      </>}
      {/* Face */}
      <circle cx="-5" cy="-74" r="2.8" fill="#2d1a10" />
      <circle cx="5" cy="-74" r="2.8" fill="#2d1a10" />
      <path d={loggedToday ? 'M-4,-68 Q0,-65 4,-68' : 'M-4,-68 L4,-68'} stroke="#2d1a10" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {thought && (
        <g className="thought-in">
          <ellipse cx="0" cy="-96" rx="44" ry="15" fill="rgba(255,240,230,0.95)" stroke="rgba(255,107,74,0.3)" strokeWidth="1" />
          <circle cx="0" cy="-88" r="3" fill="rgba(255,240,230,0.95)" />
          <text x="0" y="-94" textAnchor="middle" fontSize="7" fill="#2d1a10" fontFamily="Nunito" fontWeight="700">{thought.slice(0, 26)}</text>
        </g>
      )}
    </g>
  )
}

function ParkScene({ charState, streak, loggedToday, thought, pathwayColor, onTap }) {
  const isWalk = charState === 'walking'
  const dress = loggedToday ? '#ff8c6a' : '#8a6a58'
  const flowerXs = [48, 76, 112, 148, 198, 228]
  const flowerColors = ['#ff6b4a', '#ffaa7a', '#ff8c6a', '#ffd4aa', '#ffcc66', '#ff9a70']
  return (
    <svg viewBox="0 0 362 255" width="100%" height="100%" style={{ display: 'block', position: 'absolute', inset: 0 }} onClick={onTap}>
      <defs>
        <linearGradient id="psky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#120a30" /><stop offset="65%" stopColor="#2d1520" /><stop offset="100%" stopColor="#6B2e18" />
        </linearGradient>
        <linearGradient id="pgrass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a4a1a" /><stop offset="100%" stopColor="#1a2d0e" />
        </linearGradient>
        <radialGradient id="plamp" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffcc66" stopOpacity=".42" /><stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="pmoon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe8b0" stopOpacity=".3" /><stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="362" height="255" fill="url(#psky)" />
      {/* Moon */}
      <circle cx="310" cy="42" r="44" fill="url(#pmoon)" />
      <circle cx="310" cy="42" r="20" fill="#ffe8b0" opacity=".88" />
      <circle cx="318" cy="37" r="16" fill="#120a30" />
      {/* Stars */}
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x * .88} cy={s.y} r={s.r} fill="white"
          style={{ animation: `starTwinkle ${2 + s.d}s ease-in-out infinite`, animationDelay: `${s.d}s` }} />
      ))}
      {/* Ground */}
      <ellipse cx="181" cy="175" rx="230" ry="38" fill="rgba(200,80,30,0.16)" />
      <path d="M0,165 Q90,130 181,148 Q272,166 362,145 L362,255 L0,255Z" fill="#1a2d10" />
      <rect y="180" width="362" height="75" fill="url(#pgrass)" />
      <ellipse cx="181" cy="202" rx="145" ry="14" fill="rgba(180,130,70,0.22)" />
      {/* Trees */}
      <rect x="20" y="136" width="6" height="46" rx="3" fill="#1a1a0e" />
      <ellipse cx="23" cy="128" rx="20" ry="25" fill="#1e3014" />
      <ellipse cx="23" cy="119" rx="14" ry="18" fill="#243819" />
      <rect x="322" y="140" width="5.5" height="42" rx="2.75" fill="#1a1a0e" />
      <ellipse cx="325" cy="132" rx="17" ry="22" fill="#1e3014" />
      {/* Lamp */}
      <rect x="244" y="140" width="4" height="44" rx="2" fill="#3d3d2a" />
      <ellipse cx="246" cy="138" rx="11" ry="5" fill="#5a5a3a" />
      <ellipse cx="246" cy="138" rx="18" ry="24" fill="url(#plamp)" style={{ animation: 'lampGlow 3s ease-in-out infinite' }} />
      <circle cx="246" cy="138" r="4.5" fill="#ffee99" />
      {/* Flowers */}
      {flowerXs.slice(0, streak >= 3 ? 6 : 2).map(x => (
        <g key={x}>
          <line x1={x} y1="196" x2={x} y2="188" stroke="#2d5a1a" strokeWidth="1.4" />
          <circle cx={x} cy="187" r={streak >= 7 ? 4 : 3.5} fill={flowerColors[x % 6]} />
        </g>
      ))}
      {/* Fireflies */}
      {streak >= 7 && [1,2,3,4,5].map(i => (
        <circle key={i} cx={60 + i * 52} cy={155 + Math.sin(i * 1.3) * 18} r="2.8" fill={T.amber}
          style={{ animation: `firefly ${2.2 + i * .4}s ease-in-out infinite`, animationDelay: `${i * .55}s`, filter: 'drop-shadow(0 0 4px #ffcc66)' }} />
      ))}
      {/* Rainbow */}
      {streak >= 14 && (
        <g opacity=".25">
          {['#e74c3c','#f39c12','#2ecc71','#3498db','#9b59b6'].map((c, i) => (
            <path key={i} d={`M${30 + i*8},200 Q181,${100 - i*10} ${332 - i*8},200`} fill="none" stroke={c} strokeWidth="4" />
          ))}
        </g>
      )}
      {/* Pathway tint */}
      {pathwayColor && <rect width="362" height="255" fill={pathwayColor} opacity=".04" />}
      {/* Character */}
      <g style={isWalk ? { animation: 'charWalk 7s ease-in-out infinite' } : { transform: 'translateX(130px)' }}>
        <g transform="translate(0,195)">
          <WalkChar dress={dress} streak={streak} loggedToday={loggedToday} thought={thought} />
        </g>
      </g>
      {!loggedToday && <rect width="362" height="255" fill="rgba(0,0,0,0.28)" />}
    </svg>
  )
}

function HomeScene({ charState, streak, loggedToday, thought, pathwayColor, onTap }) {
  const dress = loggedToday ? '#ff8c6a' : '#8a6a58'
  return (
    <svg viewBox="0 0 362 255" width="100%" height="100%" style={{ display: 'block', position: 'absolute', inset: 0 }} onClick={onTap}>
      <defs>
        <linearGradient id="hwall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1a10" /><stop offset="100%" stopColor="#3d2416" />
        </linearGradient>
        <linearGradient id="hfloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a2e1a" /><stop offset="100%" stopColor="#3a2210" />
        </linearGradient>
        <radialGradient id="hlamp" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffcc66" stopOpacity=".45" /><stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="362" height="255" fill="url(#hwall)" />
      {pathwayColor && <rect width="362" height="255" fill={pathwayColor} opacity=".05" />}
      <rect y="192" width="362" height="63" fill="url(#hfloor)" />
      {/* Window */}
      <rect x="14" y="28" width="56" height="72" rx="4" fill="#0c1824" stroke="#5a3a20" strokeWidth="2.5" />
      <rect x="39" y="28" width="2" height="72" fill="#5a3a20" />
      <rect x="14" y="63" width="56" height="2" fill="#5a3a20" />
      <circle cx="28" cy="46" r="11" fill="#ffe8b0" opacity=".42" />
      <circle cx="33" cy="41" r="8.5" fill="#0c1824" />
      {/* Floor lines */}
      {[215, 230, 245].map(y => <line key={y} x1="0" y1={y} x2="362" y2={y} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />)}
      {/* Lamp */}
      <rect x="302" y="102" width="5" height="92" rx="2.5" fill="#5a3a1a" />
      <ellipse cx="305" cy="100" rx="16" ry="9" fill="#7a5a2a" />
      <ellipse cx="305" cy="100" rx="28" ry="34" fill="url(#hlamp)" style={{ animation: 'lampGlow 4s ease-in-out infinite' }} />
      <circle cx="305" cy="100" r="5" fill="#ffee99" />
      {/* Plant */}
      <rect x="334" y="168" width="10" height="26" rx="3" fill="#5a3a1a" />
      <ellipse cx="340" cy="155" rx="9" ry="16" fill="#2d5a1a" />
      <ellipse cx="348" cy="152" rx="7" ry="12" fill="#3d7a22" />
      {/* Sofa */}
      <rect x="72" y="184" width="210" height="26" rx="13" fill="#5a2a1a" />
      <rect x="64" y="168" width="226" height="22" rx="11" fill="#6a3420" />
      <rect x="64" y="168" width="18" height="42" rx="9" fill="#5a2a1a" />
      <rect x="272" y="168" width="18" height="42" rx="9" fill="#5a2a1a" />
      <rect x="142" y="164" width="70" height="20" rx="9" fill="#7a3a22" />
      {/* Character */}
      <g transform="translate(175,188)">
        <SitChar dress={dress} streak={streak} loggedToday={loggedToday} thought={thought} />
      </g>
      {!loggedToday && <rect width="362" height="255" fill="rgba(0,0,0,0.28)" />}
    </svg>
  )
}

export default function HeroScene({ charState, streak, loggedToday, thought, pathwayColor, onTap }) {
  const isHome = charState === 'resting' || charState === 'sitting' || charState === 'contracting'
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer' }}>
      {isHome
        ? <HomeScene charState={charState} streak={streak} loggedToday={loggedToday} thought={thought} pathwayColor={pathwayColor} onTap={onTap} />
        : <ParkScene charState={charState} streak={streak} loggedToday={loggedToday} thought={thought} pathwayColor={pathwayColor} onTap={onTap} />
      }
    </div>
  )
}
