export const T = {
  bg: '#1a0c06', bgDeep: '#110804',
  card: 'rgba(255,255,255,0.07)', cardGlow: 'rgba(255,107,74,0.13)',
  primary: '#ff6b4a', accent: '#ffaa7a', green: '#4caf7d', amber: '#ffcc66',
  text: '#fef0e6', muted: 'rgba(254,240,230,0.48)',
  border: 'rgba(255,255,255,0.09)', tabBg: 'rgba(14,7,3,0.92)',
}

export const PATHWAYS = {
  standard: {
    id: 'standard', label: 'Standard Pathway', icon: '🌱', color: '#4caf7d',
    badge: 'Standard', desc: 'Low-risk pregnancy — everything on track',
    extraMilestones: [], watchFor: [], reassure: '',
  },
  highBP: {
    id: 'highBP', label: 'Gestational Hypertension', icon: '🫀', color: '#ff9a4a',
    badge: 'BP Monitored', desc: 'Enhanced blood pressure monitoring pathway',
    extraMilestones: [
      { w: 20, title: 'Weekly BP monitoring begins',   desc: 'Check and log blood pressure every 3–4 days',                       urgent: false, icon: '📊' },
      { w: 24, title: 'Preeclampsia screening',        desc: 'Protein in urine test + full BP review with midwife',              urgent: true,  icon: '⚠️' },
      { w: 28, title: 'Maternal medicine review',      desc: 'Specialist review if BP remains above 140/90',                     urgent: false, icon: '🏥' },
      { w: 34, title: 'Delivery planning discussion',  desc: 'Discuss birth timing and options with your consultant',            urgent: false, icon: '📋' },
    ],
    watchFor: [
      { s: "Severe headache that won't go away",                    icon: '🤕' },
      { s: 'Visual disturbances — flashing lights or blurred vision', icon: '👁️' },
      { s: 'Sudden swelling of face, hands or feet',                icon: '🌊' },
      { s: 'Upper belly pain below the ribs',                       icon: '🫁' },
      { s: 'Reduced fetal movement',                                icon: '🦶' },
    ],
    reassure: 'Gestational hypertension is manageable with close monitoring. Most mums on this pathway have healthy babies. We track your BP closely and will alert you if readings need attention from your midwife.',
  },
  gd: {
    id: 'gd', label: 'Gestational Diabetes', icon: '🩸', color: '#5ab4ff',
    badge: 'Glucose Monitored', desc: 'Blood glucose monitoring pathway',
    extraMilestones: [
      { w: 24, title: 'Daily glucose monitoring',   desc: 'Check blood sugar 4× daily — before and 1h after meals',         urgent: false, icon: '📊' },
      { w: 26, title: 'Dietitian appointment',      desc: 'Personalised meal plan to keep glucose in range',                urgent: false, icon: '🥗' },
      { w: 32, title: 'Growth scan + glucose review', desc: 'GD can cause larger babies — we monitor size carefully',       urgent: false, icon: '🔬' },
      { w: 36, title: 'Birth plan review',          desc: 'Discuss timing and delivery method with your team',             urgent: false, icon: '📋' },
    ],
    watchFor: [
      { s: 'Blood sugar above 7.8 mmol/L after meals',            icon: '📈' },
      { s: 'Excessive thirst beyond usual pregnancy',              icon: '💧' },
      { s: 'Blurred vision after eating',                         icon: '👁️' },
      { s: 'Very low energy or shakiness between meals',          icon: '⚡' },
      { s: 'Baby feels significantly more active than usual',     icon: '🦶' },
    ],
    reassure: "Gestational diabetes is well controlled with diet and sometimes medication. Most mums with GD have straightforward pregnancies. Your glucose levels directly affect baby's growth rate — monitoring keeps you both safe.",
  },
}

export const MILESTONES = [
  { w:  8, e: '🫐', size: 'blueberry',   g:    1, energy: 2, charState: 'resting',     feel: ['Morning sickness', 'Extreme fatigue', 'Tender breasts'],          reassure: 'Morning sickness is a sign of strong hormone levels — actually reassuring. Peaks at weeks 8–10 then fades for most mums.',                                                                                scan: null },
  { w: 12, e: '🍋', size: 'lime',         g:   58, energy: 3, charState: 'sitting',     feel: ['Nausea easing', 'Still tired', 'Mood swings'],                     reassure: 'Your body has been building the placenta from scratch. Energy returns soon.',                                                                                                                                         scan: 'First trimester scan' },
  { w: 16, e: '🥑', size: 'avocado',      g:  100, energy: 4, charState: 'walking',     feel: ['Energy returning', 'Round ligament pain', 'Glowing skin'],          reassure: "Round ligament pain is the ligaments supporting your uterus stretching. Completely normal — not a warning sign.",                                                                                                    scan: null },
  { w: 20, e: '🍌', size: 'banana',       g:  300, energy: 4, charState: 'walking',     feel: ['First flutters', 'Heartburn starting', 'Good energy'],              reassure: "Those first little flutters are baby moving. If you don't feel them yet, position of the placenta may delay it. They'll come.",                                                                                         scan: 'Anomaly scan (20 weeks)' },
  { w: 24, e: '🌽', size: 'ear of corn',  g:  600, energy: 3, charState: 'walking',     feel: ['Braxton Hicks', 'Round ligament pain', 'Heartburn'],                reassure: "Braxton Hicks are painless, irregular, and stop if you change position. Your uterus is simply practising for birth.",                                                                                                 scan: 'Glucose screening (24–28w)' },
  { w: 28, e: '🍆', size: 'aubergine',    g: 1000, energy: 3, charState: 'sitting',     feel: ['Back ache', 'Breathlessness', 'Leg cramps'],                        reassure: 'Breathlessness is baby pressing on your diaphragm. Sleeping on your left side gives your lungs more room.',                                                                                                       scan: 'Whooping cough vaccine (27–36w)' },
  { w: 32, e: '🥥', size: 'coconut',      g: 1700, energy: 2, charState: 'sitting',     feel: ['Swollen ankles', 'Frequent wees', 'Pelvic pressure'],               reassure: 'Swollen ankles are very common — fluid pools due to gravity. Elevate feet for 20 minutes and it improves.',                                                                                                          scan: 'Growth scan (32 weeks)' },
  { w: 36, e: '🍈', size: 'honeydew',     g: 2600, energy: 2, charState: 'resting',     feel: ['Baby dropping', 'Pelvic heaviness', 'Nesting energy'],              reassure: 'Pelvic pressure means baby is moving down — called engagement. Uncomfortable, but it means your body is preparing perfectly.',                                                                                       scan: 'Group B Strep test (36w)' },
  { w: 40, e: '🍉', size: 'watermelon',   g: 3400, energy: 3, charState: 'contracting', feel: ['Irregular tightenings', 'Everything feels significant', 'Restlessness'], reassure: "Real contractions come in a regular pattern, build in intensity, and don't stop with movement. If tightenings are 5+ min apart for an hour, call your midwife.", scan: 'Due date 🎉' },
]

export function getMilestone(w) {
  return MILESTONES.reduce((a, b) => Math.abs(b.w - w) < Math.abs(a.w - w) ? b : a)
}
export const getTrim = w => w <= 13 ? 1 : w <= 26 ? 2 : 3

export const BODY_DATA = {
   8: { e: '🫐', feel: [{ i: '🤢', l: 'Morning sickness', z: 'chest', tip: 'Try ginger tea' },       { i: '😴', l: 'Fatigue',         z: 'head',   tip: 'Rest is productive' },      { i: '💛', l: 'Tender breasts',  z: 'chest', tip: 'Supportive bra helps' }],   energy: 2, fact: "Baby's heart beats 160× a minute." },
  12: { e: '🍋', feel: [{ i: '🌤', l: 'Nausea easing',    z: 'chest', tip: 'Keep eating little and often' }, { i: '😴', l: 'Tiredness',    z: 'head',   tip: 'Energy picks up soon' }, { i: '💭', l: 'Mood swings',     z: 'head',  tip: 'Progesterone levelling out' }], energy: 3, fact: 'All major organs formed.' },
  16: { e: '🥑', feel: [{ i: '⚡', l: 'Energy returning',  z: 'head',  tip: 'The golden trimester!' }, { i: '🫀', l: 'Round lig. pain', z: 'pelvis', tip: 'Move slowly' },           { i: '😊', l: 'Glowing skin',    z: 'head',  tip: 'Increased blood flow' }],    energy: 4, fact: 'Baby can hear. Your voice is their favourite.' },
  20: { e: '🍌', feel: [{ i: '🦋', l: 'Baby flutters',     z: 'belly', tip: 'Note first movement' },  { i: '🔥', l: 'Heartburn',       z: 'chest',  tip: 'Sit upright after meals' }, { i: '⚡', l: 'Good energy',     z: 'head',  tip: 'Great for exercise' }],       energy: 4, fact: 'Halfway there!' },
  24: { e: '🌽', feel: [{ i: '💨', l: 'Braxton Hicks',     z: 'belly', tip: 'Stay hydrated' },        { i: '🫀', l: 'Round lig. pain', z: 'pelvis', tip: 'Move slowly' },           { i: '🔥', l: 'Heartburn',       z: 'chest', tip: 'Smaller meals' }],            energy: 3, fact: 'Baby can hear your voice clearly.' },
  28: { e: '🍆', feel: [{ i: '🛌', l: 'Back ache',         z: 'back',  tip: 'Pregnancy pillow helps' },{ i: '😤', l: 'Breathlessness', z: 'chest',  tip: 'Sleep on left side' },    { i: '🦵', l: 'Leg cramps',      z: 'legs',  tip: 'Stretch calves before bed' }], energy: 3, fact: 'Baby opens their eyes!' },
  32: { e: '🥥', feel: [{ i: '🌊', l: 'Swollen ankles',    z: 'legs',  tip: 'Elevate feet' },         { i: '🚽', l: 'Frequent wees',   z: 'pelvis', tip: 'Stay hydrated' },          { i: '😤', l: 'Breathlessness',  z: 'chest', tip: 'Sleep propped up' }],          energy: 2, fact: 'Baby gaining ~200g/week.' },
  36: { e: '🍈', feel: [{ i: '⬇️', l: 'Baby dropping',     z: 'pelvis', tip: 'Breathing easier' },   { i: '😰', l: 'Pelvic pressure', z: 'pelvis', tip: 'Warm baths help' },        { i: '🌊', l: 'More discharge',  z: 'pelvis', tip: 'Body preparing' }],           energy: 2, fact: 'Baby practices breathing.' },
  40: { e: '🍉', feel: [{ i: '⚡', l: 'Nesting energy',    z: 'head',  tip: 'Channel into rest' },    { i: '😰', l: 'Pelvic discomfort', z: 'pelvis', tip: 'Walking helps' },        { i: '🤰', l: 'Restlessness',   z: 'belly',  tip: "You've got this" }],            energy: 2, fact: 'Full term!' },
}
export function getBodyData(w) {
  const keys = Object.keys(BODY_DATA).map(Number).sort((a, b) => a - b)
  return BODY_DATA[keys.reduce((a, b) => Math.abs(b - w) < Math.abs(a - w) ? b : a)]
}

export const STARS = Array.from({ length: 20 }, (_, i) => ({
  x: Math.sin(i * 137.5) * 140 + 181,
  y: Math.cos(i * 89.3) * 50 + 38,
  r: Math.sin(i * 23) * .7 + .9,
  d: i * .38,
}))

export const THOUGHTS = [
  w => `Baby can hear you right now at week ${w} 🎵`,
  () => 'Stay hydrated — it helps with Braxton Hicks 💧',
  () => "You're doing amazingly. Really. 🌸",
  () => 'A short walk can ease back ache 🚶‍♀️',
  w => `Only ${40 - w} weeks to go!`,
  () => 'Tap the kick counter each time you feel movement 🦶',
]

export const DOCTORS = [
  { id: 1, name: 'Dr. Sarah Mitchell',  role: 'Midwife & Consultant',     rating: 4.9, wait: '~5 min',  avail: true,  e: '👩‍⚕️' },
  { id: 2, name: 'Dr. James Okafor',    role: 'Obstetric Specialist',      rating: 4.8, wait: '~12 min', avail: true,  e: '👨‍⚕️' },
  { id: 3, name: 'Dr. Priya Sharma',    role: 'Maternal–Fetal Medicine',   rating: 4.9, wait: '~20 min', avail: false, e: '👩‍⚕️' },
]

export const CONDITIONS = [
  { id: 'highBP',  icon: '🫀', label: 'High blood pressure',           sub: 'Gestational hypertension or pre-existing' },
  { id: 'gd',      icon: '🩸', label: 'Gestational diabetes',           sub: 'Diagnosed or at risk' },
  { id: 'thyroid', icon: '🦋', label: 'Thyroid condition',              sub: 'Hypothyroid, hyperthyroid or Hashimoto\'s' },
  { id: 'twins',   icon: '👥', label: 'Twin or multiple pregnancy',     sub: 'Two or more babies' },
  { id: 'none',    icon: '✨', label: 'All good — standard pregnancy',  sub: 'No known conditions' },
]
