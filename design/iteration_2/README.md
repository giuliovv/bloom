# Handoff: Bloom — Pregnancy Companion App (v6)

## Overview
Bloom is a pregnancy companion app built around three pillars:

1. **Sim protagonist** — An animated pregnant woman character (tamagotchi-style) whose state, environment, and world richness are driven by daily data logging and streak. She is the emotional core of the app.
2. **Predictive reassurance** — Week-by-week body forecast, body map, and "when you feel this — don't worry" copy. The app tells mums what's coming *before* it happens so nothing catches them off guard.
3. **Clinical pathways** — Pregnancy isn't one journey. The app supports multiple clinical tracks (Standard, Gestational Hypertension, Gestational Diabetes) with pathway-specific milestones, monitoring cards, and warning signs. Pathways are declared at onboarding and updated dynamically via logged data.

## About the Design Files
The files in this bundle are **high-fidelity design prototypes written in HTML/React** — not production code to copy directly. The task is to **recreate these designs in your target codebase** (React Native, Expo, SwiftUI, etc.) using its established patterns, applying the exact colors, typography, spacing, and interactions documented below.

**Run `Bloom Bold v6.html` in a browser** to interact with the full prototype before implementing.

## Fidelity
**High-fidelity.** Recreate pixel-accurately. All colors, spacing, type sizes, and animations are specified below.

---

## Design Tokens

### Colors
```
Background:          #1a0c06
Background deep:     #110804
Card surface:        rgba(255, 255, 255, 0.07)
Card glow (active):  rgba(255, 107, 74, 0.13)
Primary (coral):     #ff6b4a
Accent (peach):      #ffaa7a
Success (green):     #4caf7d
Amber (streak):      #ffcc66
Text primary:        #fef0e6
Text muted:          rgba(254, 240, 230, 0.48)
Border:              rgba(255, 255, 255, 0.09)
Tab bar bg:          rgba(14, 7, 3, 0.92)

Pathway — Gestational Hypertension:  #ff9a4a  (warm orange)
Pathway — Gestational Diabetes:      #5ab4ff  (cool blue)
Pathway — Standard:                  #4caf7d  (green)
```

### Typography
- **Font**: Nunito (Google Fonts), weights 400/500/600/700/800/900
- **Fallback**: system-ui, sans-serif

| Role              | Size   | Weight | Notes                  |
|-------------------|--------|--------|------------------------|
| Screen title      | 24px   | 900    |                        |
| Greeting          | 19–22px| 900    |                        |
| Onboarding hero   | 26–32px| 900    |                        |
| Card title        | 13–15px| 800    |                        |
| Body              | 12–13.5px| 500–600|                      |
| Label (caps)      | 10px   | 800    | letter-spacing 1.2     |
| Tab label         | 9.5px  | 800    | letter-spacing 0.4     |

### Spacing
- Screen horizontal padding: **20px** (Journey tab: **14px** for scene/cards)
- Status bar offset (iOS): **58px** top padding on all screens
- Card border-radius: **20px**; card padding: **14px 16px**
- Gap between cards: **10–12px**
- Button border-radius: **16px**; button padding: **15px** vertical
- Scene container border-radius: **18px**

### Card styles
```
Standard card:    background rgba(255,255,255,0.07), border rgba(255,255,255,0.09)
Glow card:        background rgba(255,107,74,0.13), border rgba(255,107,74,0.25)
Pathway card:     background {pathwayColor}18, border {pathwayColor}40
Past milestone:   opacity 0.6
```

---

## App Architecture

### Navigation (4 tabs)
```
🌸 Journey   — Sim protagonist + timeline (default/home tab)
📋 Log       — Daily health logging
🤰 Body      — 7-day body forecast + body map
🩺 Doctors   — Telemedicine specialists flow
```

Tab bar: fixed bottom, `backdrop-filter: blur(24px)`, 22px bottom padding (iOS home indicator). Active tab: coral label + 18×3px coral dot with `drop-shadow(0 0 6px #ff6b4a)`.

---

## Onboarding Flow (4 screens)

Shown once on first launch. Progress dots (3 dots for steps 0–2) at top.

### Screen 1 — Welcome + Name
- 🌸 large emoji (52px)
- Headline: "Hello, I'm Bloom" (32px, 900)
- Subtext: "Your gentle guide through every week of pregnancy." (16px, muted, line-height 1.7)
- Name input: centered, 18px, 700, border turns coral when non-empty
- CTA: "Hello, {name} →" (or "Continue →" if empty)

### Screen 2 — Week selector
- Headline: "How many weeks pregnant are you?" (26px, 900)
- Large number display: **72px, 900, coral** flanked by − and + buttons (52×52px circles)
- Below number: "Trimester X · {size} {emoji}" (14px, muted)
- Trimester progress bar (3 segments, coral fill)
- Back button below CTA

### Screen 3 — Conditions checklist
- Headline: "Anything we should know?" (24px, 900)
- 5 condition cards (tappable toggles):
  - 🫀 High blood pressure / Gestational hypertension
  - 🩸 Gestational diabetes
  - 🦋 Thyroid condition
  - 👥 Twin or multiple pregnancy
  - ✨ All good — standard pregnancy (deselects others)
- Selected state: pathway-color background + border + checkmark
- "None / all good" deselects all others; selecting any condition deselects "none"

### Screen 4 — Meet your companion
- Full-bleed animated park scene with the walking character
- Bottom overlay gradient (transparent → dark): "Meet your companion" (28px, 900)
- Subtext about logging + streak
- "Begin my journey →" CTA
- On complete → set name, week, pathway, navigate to main app

---

## Sim Character

### Visual design
Side-profile, walking or front-facing seated. Built from SVG primitives.

**Colour palette:**
- Skin: `#f4c4a8`
- Hair: `#3d1f0e` (dark brown)
- Dress: `#ff8c6a` (coral — or `#8a6a58` when not logged today)
- Shoes: `#c8654a`

**Proportions (character height ~95px in scene):**
- Head: circle r=15
- Hair: ellipses behind + bun circle
- Neck: rounded rect
- Torso/dress: rounded rect 32×44px with belly bump ellipse (rx=17, ry=15)
- Arms: rounded rects, rotating from shoulder
- Legs: rounded rects, rotating from hip
- Bump highlight: semi-transparent white ellipse on bump

**Streak accessories:**
- 7+ days: coral flower + gold centre on hair (circle r=5 + r=2.5)

**Expressions (by mood):**
- Happy/logged: curved smile path
- Not logged: flat line mouth

### Character states
| State        | Trigger                            | Scene    | Animation      |
|--------------|------------------------------------|----------|----------------|
| `walking`    | Mood happy/calm + energy ≥4        | Park     | charWalk + limb swing |
| `sitting`    | Energy 2–3 or mood tired           | Home     | sitBob + breathe |
| `resting`    | Energy ≤1                          | Home     | sitBob + zzz   |
| `contracting`| Symptom: Braxton Hicks             | Home     | wince + hand on belly |

### CSS Animations (character)
```css
charWalk: translateX 18→224px + scaleX flip at 50%, 7s infinite
bodyBob: translateY 0→-3px, 0.58s infinite (walk cadence)
armL/armR: rotate ±30deg, 0.58s infinite (opposite phase)
legL/legR: rotate ±26deg, 0.58s infinite (opposite phase)
breathe: scaleY 1→1.04, 3.2s infinite (sitting)
sitBob: translateY 0→-1.5px, 3.5s infinite
zzz: opacity + translateY + scale, staggered (resting)
```

### Scene environments

**Park (twilight):** Sky gradient (#120a30 → #6B2e18), moon + crescent, 20 twinkling stars, dark hill silhouette, green ground, amber path, 2 silhouette trees, streetlamp with radial glow.

**Home (cosy):** Warm wall gradient, wooden floor (3 plank lines), window with moon, side lamp with radial glow, plant (right), sofa with cushion.

### Streak world evolution
| Streak | Scene change                         |
|--------|--------------------------------------|
| 3+     | Extra flowers along park path (6 total) |
| 7+     | Fireflies (5 animated amber dots), flower in character's hair |
| 14+    | Rainbow arc (5 coloured paths, opacity 0.25) |
| 21+    | Warm golden overlay tint on scene    |

### Pathway scene tint
When a clinical pathway is active (non-standard), apply `fill={pathwayColor}` at opacity 0.04–0.05 as a full-scene rect overlay.

### Tap interaction
- Character bounces (scale 0.88 → 1.06, 0.45s cubic-bezier)
- Thought bubble SVG appears (ellipse + text, white fill, coral border)
- Random message from pool: week fact, tip, streak encouragement
- Bubble disappears after 3.2s

### Not-logged-today state
- Dress becomes `#8a6a58` (desaturated)
- Dark overlay on scene (rgba 0,0,0,0.28)
- "Log today →" badge in header
- Caption: "{name} is waiting to hear from you... 💭"

---

## Screens

### 1. Journey Tab (Hero)

**Layout (top → bottom, scrollable):**
1. Status bar spacer (58px)
2. Header row: week/trimester label + name + pathway badge + streak ring
3. **Hero scene** — 255px tall, margin 14px, border-radius 18, overflow hidden, explicit height
4. Character caption strip (12.5px, 600)
5. **Pathway card** (if non-standard pathway)
6. Streak badges row
7. Today card (mood picker + energy bar + kick counter)
8. "What you might feel today" card + reassurance
9. "Coming up — Week X" card
10. "Next appointment" card (glow)
11. Full journey timeline (collapsed week cards)

#### Streak ring
SVG circle ring, size 56×56px. Track: rgba(255,255,255,0.1), stroke-width 3.5. Arc: coral with drop-shadow glow, rotated -90°. Center: streak number (13px, 900, coral) + "DAYS" (6.5px, 800, muted).

#### Pathway badge (in header)
`{icon} {badge}` — 10px, 800, pathway color. Background: `{pathwayColor}20`, border: `{pathwayColor}40`, border-radius 8, padding 3px 8px.

#### Pathway card
Shown when `pathway.id !== 'standard'`:
- Header row: 36×36 icon box (pathway color, radius 10) + label + pulsing dot
- Reassure text in semi-transparent box
- Expandable "Signs to contact your midwife" section (tap to toggle)
  - Each sign: emoji + text (12.5px, T.text)
  - Footer warning in pathway-color

**Pulsing dot animation:**
```css
@keyframes pathwayPulse { 0%,100%{opacity:.7} 50%{opacity:1} }
width: 10px, height: 10px, border-radius: 5px
box-shadow: 0 0 0 4px {pathwayColor}30
```

#### Today card
- Label "How are you feeling?" + "Updates {name}" right-aligned
- 4 mood buttons (emoji + label), selected: coral border + scaled 1.06 + coral bg
- Energy bar: 5 rectangular segments, fills with green/amber/coral based on level, last filled has glow
- Kick counter: full-width tap target, left emoji box + label + large number right, `kickPop` animation on tap

#### Full journey timeline
- Vertical spine line (absolute, left: 17px, 2px, rgba(255,255,255,0.06))
- Each week: dot (36×36, radius 18) + card
  - Past: coral fill, "✓"
  - Current: coral bg 25%, 2px coral border, glow ring
  - Future: white/6% bg
- Collapsed: shows 2 symptoms + "in Xw" badge
- Expanded (tap): full reassurance text + scan label
- **Pathway extra milestone** below standard card for same week:
  - Dot: pathway-color bg 25%, 2px pathway-color border
  - Card: pathway-color bg + border
  - Week label in pathway color
  - "IMPORTANT" badge for urgent items

### 2. Log Tab

Fields: Blood pressure (systolic/diastolic inputs), Weight (kg), Sleep (range slider), Symptoms (pill toggles). Sparkline SVG chart for BP (last 7 values). Save button turns green on save, reverts after 2.2s.

**BP alert:** if systolic ≥ 140, show inline warning card below BP inputs: orange background, "⚠️ Systolic ≥140 — log this and mention to your midwife."

### 3. Body Tab (7-day forecast)

**Today card:** date + primary symptom (44×44 icon box + title + tip) + secondary badge + energy dots.

**7-day strip:** horizontal scroll, 7 cards. Today: 74px wide, cardGlow bg, coral border. Others: 64px. Each: day label, symptom emoji, 5 energy dots, short symptom name.

**Body map:** SVG pregnant silhouette (head, shoulders, body, bump). Active zones (from current week's feel array) show as pulsing ellipses with radial glow filter and connecting label lines. Zones: `chest`, `belly`, `pelvis`, `back`, `head`, `legs`.

### 4. Doctors Tab

Flow: List → Profile → (Brief) → Call.

**Call screen:** radial gradient green bg. Doctor avatar (116px circle, coral gradient, callRing pulse animation). Duration timer (live seconds). Shared context card showing week, BP, pathway, streak. Red end-call button (64px circle).

---

## Clinical Pathways

### Data model
```typescript
interface Pathway {
  id: 'standard' | 'highBP' | 'gd'
  label: string
  icon: string  // emoji
  color: string // hex
  badge: string // short label for header chip
  desc: string
  extraMilestones: PathwayMilestone[]
  watchFor: { s: string; icon: string }[]
  reassure: string
}

interface PathwayMilestone {
  w: number     // week number
  title: string
  desc: string
  urgent: boolean
  icon: string  // emoji
}
```

### Standard pathway
No extra milestones, no watchFor signs, no pathway card shown.

### Gestational Hypertension (`highBP`)
Color: `#ff9a4a`
Extra milestones: weeks 20, 24 (urgent), 28, 34
Watch for: severe headache, visual disturbances, sudden swelling, upper belly pain, reduced movement

### Gestational Diabetes (`gd`)
Color: `#5ab4ff`
Extra milestones: weeks 24, 26, 32, 36
Watch for: glucose >7.8 mmol/L, excessive thirst, blurred vision, shakiness, excess fetal movement

### How pathway is determined
1. Declared at onboarding (conditions checklist)
2. Can be updated mid-pregnancy via settings (not yet designed)
3. Log tab shows alerts when BP ≥ 140 that suggest pathway switch (future: auto-suggest)

---

## Week-by-week Data

Each milestone week needs: `emoji`, `size` (fruit/veg), `weight in grams`, `trimester`, `energy (1-5)`, `charState`, `feel[3]` (icon, label, body zone, reassurance tip), `reassure` text, `scan` label (or null).

Key weeks: 8, 12, 16, 20, 24, 28, 32, 36, 40. Interpolate for in-between.

**Body zones:** `chest`, `belly`, `pelvis`, `back`, `head`, `legs`

---

## Wearables Integration (designed, not yet implemented)

The Body tab's "wearables strip" shows data source cards: Apple Watch (heart rate, activity), Oura Ring (HRV, sleep score), Bloom log (BP, updated date).

In production, connect via HealthKit (iOS) or Health Connect (Android). The character state should be derivable from wearable data without manual mood input — suggest mood based on sleep score + HRV.

---

## State Management

### Global app state
```
name: string
week: number (4–40)
pathway: 'standard' | 'highBP' | 'gd'
streakDays: number
onboarded: boolean
```

### Journey tab state
```
mood: 'happy' | 'calm' | 'tired' | 'anxious'
energy: 1–5
kicks: number (resets daily)
expandedWeek: number | null
pathwayWatchForOpen: boolean
```

### Log tab state
```
bp: { systolic: string, diastolic: string }
weight: string
sleep: number (3–12h)
symptoms: string[]
saved: boolean (resets after 2.2s)
```

### Character state derivation
```typescript
function deriveCharState(mood, energy, symptoms, milestoneCharState) {
  if (symptoms.includes('Braxton Hicks')) return 'contracting'
  if (energy <= 1) return 'resting'
  if (energy <= 2 || mood === 'tired') return 'sitting'
  if (energy >= 4 && (mood === 'happy' || mood === 'calm')) return milestoneCharState
  return 'sitting'
}
```

Scene (park vs home):
```typescript
const isHome = charState === 'resting' || charState === 'sitting' || charState === 'contracting' || week >= 32
```

---

## Animations Reference

| Name           | Element                | Duration | Easing              |
|----------------|------------------------|----------|---------------------|
| `charWalk`     | Character wrapper      | 7s       | ease-in-out ∞       |
| `bodyBob`      | Character body         | 0.58s    | ease-in-out ∞       |
| `armL/armR`    | Arms (opposite phase)  | 0.58s    | ease-in-out ∞       |
| `legL/legR`    | Legs (opposite phase)  | 0.58s    | ease-in-out ∞       |
| `breathe`      | Torso (sitting)        | 3.2s     | ease-in-out ∞       |
| `sitBob`       | Whole seated char      | 3.5s     | ease-in-out ∞       |
| `zzz`          | Z letters (resting)    | 1.5–2.3s | ease-out ∞, staggered |
| `starTwinkle`  | Stars                  | 2–4s     | ease-in-out ∞       |
| `lampGlow`     | Lamp glow ellipse      | 3–4s     | ease-in-out ∞       |
| `firefly`      | Firefly dots           | 2.2–4s   | ease-in-out ∞       |
| `tapBounce`    | Scene on tap           | 0.45s    | cubic-bezier(.2,1.4,.4,1) |
| `thoughtIn`    | Thought bubble         | 0.25s    | ease-out             |
| `pathwayPulse` | Pathway active dot     | 2s       | ease-in-out ∞       |
| `screenIn`     | Tab content swap       | 0.28s    | cubic-bezier(.2,.8,.3,1) |
| `kickPop`      | Kick counter tap       | 0.38s    | ease-out             |

---

## Assets
No external image assets. All visuals CSS + SVG + emoji.

**Font:** `https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900`

---

## Files in this package
- `Bloom Bold v6.html` — **definitive** hi-fi prototype (open in browser). All 4 tabs, onboarding, all 3 pathways, sim character, streak evolution.
- `Bloom Bold v5.html` — previous iteration (sim without pathways)
- `Bloom Bold v4.html` — journey timeline iteration
- `Bloom Redesign.html` — original two-direction exploration canvas
- `README.md` — this document

---

## Not yet designed (next up)
- Settings / profile screen (update week, pathway, name)
- Push notifications (weekly milestone preview, daily log reminder)
- Wearable data connection screens (HealthKit permission flow)
- Weekly shareable report (PDF/image)
- Onboarding for "already have a condition" vs "just diagnosed"
- Accessibility: VoiceOver labels on all interactive elements
