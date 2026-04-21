# Handoff: Bloom — Pregnancy Companion App Redesign

## Overview
Bloom is a pregnancy companion app that gives expectant mothers contextual, week-by-week guidance before symptoms and milestones happen. The redesign has three core pillars:

1. **Baby tab (hero)** — A tamagotchi-style animated blob character that reflects how mum's body is feeling this week. The character is the emotional heart of the app and the primary data-collection hook (mood, energy, kicks).
2. **Tracking tab** — Daily logging of vitals (BP, weight, sleep) with sparkline trend charts.
3. **Specialists tab** — Telemedicine flow: browse doctors → view profile → review shared context → live call. The doctor always has full context from logged data.

## About the Design Files
The files in this bundle are **high-fidelity design prototypes written in HTML/React**. They are not production code to copy directly. The task is to **recreate these designs in your target codebase** (React Native, SwiftUI, Expo, etc.) using its established patterns and libraries, applying the exact colors, typography, spacing, and interactions documented below.

The prototype (`Bloom Bold.html`) is fully interactive — run it in a browser to experience every tab, flow, and animation before implementing.

## Fidelity
**High-fidelity.** Pixel-perfect mockups with final colors, typography, spacing, and interactions. Recreate the UI pixel-accurately using your codebase's component system.

---

## Design Tokens

### Colors
```
Background (deep):     #1a0c06
Background (deeper):   #110804
Card surface:          rgba(255, 255, 255, 0.07)
Card surface (glow):   rgba(255, 107, 74, 0.13)
Primary (coral):       #ff6b4a
Accent (peach):        #ffaa7a
Success (green):       #4caf7d
Text (primary):        #fef0e6
Text (muted):          rgba(254, 240, 230, 0.48)
Border:                rgba(255, 255, 255, 0.09)
Tab bar bg:            rgba(14, 7, 3, 0.92)

Blob gradient:
  Highlight:           #ffd4aa
  Mid:                 #ff9a70
  Shadow:              #ff3d1a
```

### Typography
- **Font family**: Nunito (Google Fonts) — weights 400, 500, 600, 700, 800, 900
- **Fallback**: system-ui, sans-serif

| Role              | Size  | Weight | Letter-spacing |
|-------------------|-------|--------|---------------|
| Screen title      | 24px  | 900    | 0             |
| Section header    | 22px  | 900    | 0             |
| Greeting          | 22px  | 900    | 0             |
| Card title        | 14.5px| 800    | 0             |
| Body              | 13.5px| 500    | 0             |
| Label (caps)      | 10px  | 800    | 1.2px         |
| Tab label         | 9.5px | 800    | 0.4px         |
| Muted note        | 11.5px| 500    | 0             |

### Spacing
- Screen horizontal padding: **20px**
- Status bar offset: **58px** top padding on all screens
- Card border radius: **20px**
- Card padding: **14px 16px**
- Gap between cards: **12px**
- Button border radius: **16px**
- Button padding: **15px** vertical
- Pill/tag border radius: **20px** (symptoms), **9px** (badges)

### Shadows & Borders
- Card border: `1px solid rgba(255,255,255,0.09)`
- Card glow border: `1px solid rgba(255,107,74,0.25)`
- Blob glow: `box-shadow: 0 0 40px rgba(255,100,60,0.35), 0 16px 40px rgba(0,0,0,0.5)`
- Blob outer glow: `radial-gradient(circle, rgba(255,107,74,0.28) 0%, transparent 70%)`
- Streak ring glow: `filter: drop-shadow(0 0 6px #ff6b4a)`
- Active tab indicator glow: `box-shadow: 0 0 6px #ff6b4a`
- Primary button: no shadow (rely on color contrast)
- Call screen avatar: `animation: callRing pulse`

---

## Screens / Views

### 1. Baby Tab (Hero)
The default/home tab. Opens on app launch. Scrollable.

**Layout (top → bottom):**

#### 1a. Header row
- Flex row, space-between, padding `0 20px`
- **Left:** Week label (10.5px, 800, muted, uppercase, letter-spacing 1.3) + greeting (22px, 900, `#fef0e6`)
- **Right:** Streak ring (64×64px)

**Streak ring:**
- SVG circle, radius 27px, stroke-width 4
- Background track: `rgba(255,255,255,0.08)`
- Progress arc: `#ff6b4a` with drop-shadow glow, rotated -90°
- Center: streak number (15px, 900, `#ff6b4a`) + "DAYS" label (7.5px, 800, muted)
- Goal = 14 days (arc fills to 100% at 14)

#### 1b. Trimester progress
- Flex row of 3 bars + T1/T2/T3 labels
- Each bar: height 4px, flex 1, border-radius 2, `rgba(255,255,255,0.08)` background
- Completed trimester bar: solid `#ff6b4a`
- Current trimester bar: gradient `#ff6b4a → #ffaa7a` with glow, width = % through that trimester
- Future bars: 0% fill
- Labels: 10px, 800, primary color if ≤ current trimester else muted

#### 1c. Blob character (hero element)
- Centered, 162×162px container, floats vertically (−11px to 0, 5.5s ease-in-out loop)
- **Outer glow:** absolute div, inset −24px, radial-gradient with `rgba(255,107,74,0.28)`, pulsing opacity (0.6–1, 3s loop)
- **Blob body:** CSS border-radius morph animation (10s loop), gradient:
  `radial-gradient(ellipse at 36% 30%, #ffd4aa, #ff9a70 46%, #ff3d1a)`
  `box-shadow: 0 0 40px rgba(255,100,60,0.35), 0 16px 40px rgba(0,0,0,0.5)`
- **Face (SVG overlay, same size):** eyes + mouth + optional cheeks
- **Tap:** blob scales to 0.88 + rotates −7° instantly, springs back (0.15s)
- **Tap action:** toggles weekly fact card below

**Blob face by mood:**
| Mood    | Eye shape         | Pupils | Mouth       | Cheeks |
|---------|-------------------|--------|-------------|--------|
| happy   | ellipse ry=5.5    | yes    | wide curve  | yes    |
| calm    | ellipse ry=4.2    | yes    | gentle curve| yes    |
| tired   | ellipse ry=3      | yes    | small curve | no     |
| anxious | ellipse ry=7      | yes    | flat line   | no     |

Eye positions: cx ± 14.8% of blob size from center, cy = 40% from top
Mouth y: 59% from top
Eyes blink: scaleY 1→0.06→1, cycle 5s, offset 0.14s between L/R
Cheek circles: radius 6.5% of size, opacity 0.18, white

**Size label below blob:**
- "About the size of a [emoji]" — 15px, 800, `#fef0e6`
- "[X] cm · [Y]g · tap me!" — 11.5px, muted

#### 1d. Weekly fact card (revealed on blob tap)
- Slides up with fadeIn animation (0.3s)
- `background: rgba(255,107,74,0.14)`, border `rgba(255,107,74,0.3)`, radius 18px, padding 13×15
- Title: "✨ THIS WEEK'S FACT" — 11px, 800, `#ff6b4a`, letter-spacing 0.5
- Body: 13.5px, `#fef0e6`, line-height 1.55

#### 1e. "How you might feel" card
Card with 3 feel items, each:
- 36×36px icon container: `rgba(255,255,255,0.07)` bg, radius 11, emoji inside
- Label: 13.5px, 700, `#fef0e6`
- Note: 11.5px, muted, margin-top 1
- Intensity dots (right): 3 dots, 6×6px each, radius 3, filled = `#ff6b4a`, empty = `rgba(255,255,255,0.1)`
  - Item 1: 3 filled, Item 2: 2 filled, Item 3: 1 filled (decreasing intensity)

#### 1f. Mood + Energy row (flex, gap 10)

**Mood picker (flex 1.6):** Card with 4 mood buttons in a row
- Active state: border `1.5px solid #ff6b4a`, bg `rgba(255,107,74,0.2)`, scale 1.07
- Inactive: transparent border, `rgba(255,255,255,0.05)` bg, scale 1
- Each: emoji (18px) + label (8.5px, 800, primary if active else muted)
- Transition: all 0.16s

**Energy meter (flex 1):** Card with 5 horizontal bars (tap to set level)
- Bar size: full width × 8px, radius 4
- Filled bars: `rgba(255, 107+lvl×10, 74, 0.5+lvl×0.1)` — gets more opaque/warm at higher levels
- Top filled bar has glow: `drop-shadow(0 0 6px #ff6b4a)`
- Label below: "Low / Low / Okay / Good / Great" (10px, muted, centered)

#### 1g. Kick counter card
Glow card (full-width, padding 0, overflow hidden):
- Large tap target (entire card is tappable): flex row
- Left: 52×52px icon box (`rgba(255,107,74,0.18)` bg, radius 16, 🦶 emoji 28px, border `rgba(255,107,74,0.35)`)
- Middle: "Count kicks" label (13px, 800) + "Tap each time you feel movement" (11.5px, muted)
- Right: kick count (26px, 900, `#ff6b4a`) + "today" (9.5px, muted)
- **Tap animation:** scale 1→1.14→0.96→1 over 0.35s
- At 10+ kicks: green confirmation strip appears below (border-top `T.border`): "✓ Great! 10+ kicks logged — baby is active and healthy" (12px, `#4caf7d`, 700)

#### 1h. Streak banner card
Glow card:
- Flex row: 🔥 (28px emoji) + text block
- Title: "[N]-day streak!" (14.5px, 900, `#fef0e6`)
- Subtitle: "X more days for your 2-week badge" or "You've unlocked the 2-week badge 🏅"
- Progress bar: height 4, `rgba(255,255,255,0.08)` track, `linear-gradient(90deg, #ff6b4a, #ffaa7a)` fill + glow

---

### 2. Timeline Tab
Scrollable list of pregnancy milestones.

**Header:** "Your journey" (24px, 900) + "Week X of 40 · Y% complete" (13px, muted)

**Progress bar:** 6px tall, `rgba(255,255,255,0.07)` track, gradient fill + glow, border-radius 3

**Milestone list:**
- Vertical connector line: absolute, left 19px, 2px wide, `rgba(255,255,255,0.07)`
- Each milestone = flex row (gap 14):
  - **Dot (40×40px, radius 20):**
    - Done: solid `#ff6b4a` bg, "✓" text
    - Current: `rgba(255,107,74,0.25)` bg, `2px solid #ff6b4a` border, glow ring `0 0 0 5px rgba(255,107,74,0.2)`
    - Future: `rgba(255,255,255,0.06)` bg, emoji
  - **Card (flex 1):**
    - Done: opacity 0.55
    - Current: border `1.5px solid rgba(255,107,74,0.4)`
    - Special (due date): bg `rgba(255,107,74,0.12)`
    - Week badge: 10px, 800, primary if current else muted, uppercase, letter-spacing 0.9
    - "NOW" badge: 9.5px, 800, `#ff6b4a`, bg `rgba(255,107,74,0.18)`, padding `2px 8px`, radius 8
    - "In Xw" badge (future): 10px, muted
    - Title: 14px, 800, `#fef0e6`
    - Subtitle: 11.5px, muted

**Week data per milestone:** 12, 16, 20, 24, 28, 32, 36, 40

---

### 3. Tracking Tab
Daily log entry form. Scrollable.

**Header:** "Daily log" (24px, 900) + date (13px, muted)

**Blood pressure card:**
- Two inputs side by side (Systolic / Diastolic)
- Input style: padding `10px 12px`, radius 11, bg `rgba(255,255,255,0.06)`, border `1.5px solid rgba(255,255,255,0.09)`, text `#fef0e6`, font Nunito 14px 700
- Below inputs: sparkline chart (SVG polyline, last 7 readings)
  - Polyline: stroke `#ff6b4a`, stroke-width 2.5, rounded joins
  - End-point dot: radius 3.5, fill `#ff6b4a`
  - Label: "LAST 7 DAYS — SYSTOLIC" (10px, 800, muted)

**Weight + Sleep row (flex, gap 10):**
- Weight card: large centred number input (20px, 900)
- Sleep card: display number (20px, 900) + range slider (`accentColor: #ff6b4a`) + small sparkline (height 24)

**Symptoms card:** flex-wrap row of pill buttons
- Active: border `1.5px solid #ff6b4a`, bg `rgba(255,107,74,0.22)`, text `#ff6b4a`
- Inactive: transparent border, `rgba(255,255,255,0.06)` bg, text `#fef0e6`
- Padding `7px 13px`, radius 20, font Nunito 12.5px 700

**Save button:**
- Default: `#ff6b4a` bg
- Saved state: `#4caf7d` bg, label "✓ Saved to your record"
- Reverts after 2.2s

---

### 4. Specialists Tab

#### 4a. List view
Header: "Specialists" (24px, 900) + "UK-based · doctor sees your full picture" (13px, muted)

Doctor card (tappable if available):
- Avatar: 56×56px circle, gradient `#ff6b4a → #ffaa7a`, emoji inside (28px)
- Name: 14.5px, 800
- Role: 11.5px, muted
- Rating + wait + availability badge in a flex row
- Badge: "Available" = bg `rgba(76,175,125,0.18)`, text `#4caf7d` / "Busy" = dimmed
- Unavailable doctor: card opacity 0.5, cursor default
- Chevron "›" on right for available doctors

#### 4b. Profile view
Back button (← Specialists, `#ff6b4a`, 13.5px, 800)

Doctor header: 72×72px avatar with glow `box-shadow: 0 0 24px rgba(255,107,74,0.35)` + name/role/rating

Cards:
- "About" — bio text (13.5px, line-height 1.6)
- "Speciality" — text (14.5px, 700)
- "Wait time" — glow card with large time (20px, 900, `#ff6b4a`) + green availability dot

CTA: "Review context & start →"

#### 4c. Pre-call briefing view
Header: "Before your call"

7 data rows (card each): label (12.5px, muted) + value (13.5px, 800) in a space-between flex
Data shown: Current week, Blood pressure, Weight this week, Avg mood, Symptoms, Sleep average, Logging streak

CTA: "📞 Begin call with Dr. [surname]" — `#4caf7d` bg

#### 4d. Active call view
Full dark screen, bg: `radial-gradient(ellipse at 50% 30%, rgba(76,175,125,0.12), #110804)`

- Connected label (10.5px, 800, 0.4 opacity white, uppercase, letter-spacing 1.3)
- Timer (16px, 900, `#4caf7d`) — live seconds counter
- Avatar circle (116px): gradient bg + emoji, pulsing ring animation (`callRing`)
- Doctor name (20px, 900) + role (13px, 0.45 opacity white)
- Context card (dark glass): what was shared with doctor — week, BP, sleep, symptoms, streak
- End call button: 64×64px red circle (`#e53935`), `box-shadow: 0 4px 20px rgba(229,57,53,0.5)`, 📵 emoji

---

## Animations & Transitions

| Name | Element | Details |
|------|---------|---------|
| `blobMorph` | Blob body | border-radius keyframe morph, 10s infinite, ease-in-out |
| `blobFloat` | Blob wrapper | translateY 0→−11px→−5px→0 + slight rotate, 5.5s infinite |
| `blink` | Eyes | scaleY 1→0.06→1 at 90% of cycle, 5s, 0.14s offset on right eye |
| `glowPulse` | Blob outer glow | opacity 0.6→1, 3s ease-in-out infinite |
| `kickPop` | Kick counter | scale 1→1.14→0.96→1, 0.35s ease-out |
| `callRing` | Call avatar | box-shadow pulse (0→16px→0), 2.4s infinite |
| `screenIn` | Tab content swap | opacity 0→1 + translateY 10px→0, 0.28s cubic-bezier(0.2,0.8,0.3,1) |
| `slideUp` | Fact card reveal | opacity 0→1 + translateY 14px→0, 0.3s ease-out |

---

## Tab Bar
Fixed to bottom. 4 tabs: Timeline 🗓 / Log 📋 / Baby 🌸 / Doctors 🩺

- Background: `rgba(14,7,3,0.92)` + `backdrop-filter: blur(24px)`
- Border-top: `0.5px solid rgba(255,255,255,0.09)`
- Padding: 8px top, 22px bottom (home indicator space on iOS)
- Each tab: emoji (20px, grayscale + 0.38 opacity when inactive), label (9.5px, 800), active indicator dot (18×3px, `#ff6b4a`, `drop-shadow 0 0 6px #ff6b4a`)

---

## State Management

### Global app state
```
week: number (4–40)        — current pregnancy week
streakDays: number          — consecutive days logged
name: string                — user's first name
```

### Baby tab state
```
mood: 'happy' | 'calm' | 'tired' | 'anxious'
kicks: number               — kick count for today
energy: 1–5                 — energy level selection
factOpen: boolean           — blob fact card visible
kickAnim: boolean           — kick bounce animation playing
```

### Tracking tab state
```
bp: { s: string, d: string }
kg: string
sleep: number (3–12, step 0.5)
syms: string[]
saved: boolean              — save confirmation (auto-resets after 2.2s)
```

### Specialists tab state
```
view: 'list' | 'profile' | 'brief' | 'call'
docId: number | null
secs: number                — live call duration counter (interval)
```

---

## Week-by-Week Baby Data
The app should include data for at minimum these weeks (interpolate for in-between):

| Week | Emoji | Size            | cm  | Weight | Trimester | Energy | Fact |
|------|-------|-----------------|-----|--------|-----------|--------|------|
| 8    | 🫐    | blueberry       | 1.6 | 1g     | 1         | 2      | Baby's heart beats 160× per minute |
| 12   | 🍋    | lime            | 5.4 | 58g    | 1         | 3      | All major organs formed. Baby can yawn and hiccup. |
| 16   | 🥑    | avocado         | 11.6| 100g   | 2         | 4      | Baby can hear sounds. Your voice is their favourite. |
| 20   | 🍌    | banana          | 25  | 300g   | 2         | 4      | Baby's gender may be visible at scan. Halfway! |
| 24   | 🌽    | ear of corn     | 30  | 600g   | 2         | 3      | Baby can hear your voice clearly. Try singing. |
| 28   | 🍆    | aubergine       | 37  | 1000g  | 3         | 3      | Baby opens their eyes for the first time! |
| 32   | 🥥    | coconut         | 42  | 1700g  | 3         | 2      | Baby gaining ~200g/week — mainly fat and muscle. |
| 36   | 🍈    | honeydew        | 47  | 2600g  | 3         | 2      | Baby is almost ready. They practice breathing daily. |
| 40   | 🍉    | watermelon      | 51  | 3400g  | 3         | 2      | Full term! Every hour counts now. |

Each week also has 3 "how you might feel" entries with icon, label, note, and intensity (1–3).

---

## Assets
No external image assets. All visuals are CSS + SVG + emoji. Font loaded from Google Fonts CDN:
```
https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900
```

---

## Files in this package
- `Bloom Bold.html` — fully interactive hi-fi prototype (open in any browser)
- `Bloom Redesign.html` — design exploration canvas comparing both directions (Cocoon vs Bold)
- `README.md` — this document

## Not yet designed (suggested next)
- Onboarding / first-run flow (name + week entry)
- Push notification patterns (milestone alerts, daily log reminders)
- Weekly report screen (shareable PDF)
- Settings / profile screen
- Error states and empty states
- Responsive / tablet layout
