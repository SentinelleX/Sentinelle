# Sentinelle— Claude Code Initialization

## What This Project Is

Sentinelleis a **hackathon project** for an autonomous clinical intelligence system that:
1. Monitors patient vitals in real-time
2. Detects early signs of sepsis
3. Shows AI reasoning in a beautiful streaming text panel
4. Takes autonomous actions (alerts, documentation, recommendations)

**The "wow factor" is the REASONING PANEL** — a real-time visualization of the AI thinking through clinical decisions with streaming text.

---

## FIRST: Read These Docs

Before writing ANY code, read these files in order:

1. `/docs/TOOL_SETUP.md` — **CRITICAL** — Explains what each sponsor tool actually does
2. `/docs/PRD.md` — Product requirements and features
3. `/docs/UI_SPEC.md` — Colors, fonts, design system (NO EMOJIS, Crimson Pro font)
4. `/docs/COMPONENTS.md` — Component specifications with exact props
5. `/docs/ARCHITECTURE.md` — Technical architecture and data flow
6. `/docs/DEMO.md` — The 3-minute demo script

---

## Sponsor Tool Clarification (IMPORTANT!)

| Tool | What It ACTUALLY Does | NOT This |
|------|----------------------|----------|
| **Yutori** | Web scraping & research API | ~~Agent orchestration~~ |
| **TinyFish/Mino** | Web automation & form filling | ~~LLM reasoning~~ |
| **Macroscope** | Code review (dev tool only) | ~~Runtime observability~~ |
| **Retool** | Dashboard builder | ✓ Correct |

**Clinical reasoning uses Gemini API** — not the sponsor tools.

**Observability is the Reasoning Panel we build in React** — not Macroscope.

---

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (custom design tokens from UI_SPEC.md)
- Zustand for state management
- Framer Motion for animations
- Lucide React for icons (NO EMOJIS)
- Recharts for vital sign charts
- **Font: Crimson Pro** (weights 200, 300, 400) + JetBrains Mono for data

---

## Build Priority

### Phase 1: Project Setup + Design System
```bash
npm create vite@latest . -- --template react-ts
npm install tailwindcss postcss autoprefixer zustand framer-motion lucide-react recharts
npx tailwindcss init -p
```

Then:
1. Configure Tailwind with custom colors from UI_SPEC.md
2. Add Google Fonts (Crimson Pro, JetBrains Mono)
3. Create base layout component

### Phase 2: Core Components (Demo Critical)
Build in this order:
1. `ReasoningStep.tsx` — Single step with streaming text (THE MOST IMPORTANT)
2. `StreamingText.tsx` — Character-by-character text animation
3. `ReasoningPanel.tsx` — Container for all steps
4. `VitalCard.tsx` — Single vital sign display
5. `VitalsPanel.tsx` — All vital cards + chart
6. `AlertToast.tsx` — Alert notification

### Phase 3: Data Layer
1. `stores/sentinelStore.ts` — Zustand store (types already in `/src/types/index.ts`)
2. `services/vitalsSimulator.ts` — Generate deteriorating vitals
3. Wire up the demo scenario from `/src/data/scenarios/sepsisDeterioration.ts`

### Phase 4: Integration Services
1. `services/reasoningEngine.ts` — Gemini API for clinical reasoning (uses `@google/genai` SDK)
2. `services/yutoriService.ts` — Pull clinical guidelines (Research API)
3. `services/minoService.ts` — Form filling automation (optional for demo)

### Phase 5: Retool Dashboard
Build in Retool's UI (not code):
- Patient table
- Alert queue
- Acknowledge button
- Connect to backend API

---

## Critical Design Rules

```
NO EMOJIS — Use Lucide icons only
NO BRIGHT COLORS — Muted, desaturated palette
FONT: Crimson Pro 200/300/400
ANIMATIONS: Subtle, 150-300ms, ease-out
DARK THEME ONLY
```

Color palette (from UI_SPEC.md):
```css
--bg-primary: #0a0a0b
--bg-secondary: #111113
--text-primary: #e8e6e3
--accent-teal: #4a9a8c
--status-critical: #c45c5c
--status-warning: #c49a5c
```

---

## Files Already Created

```
/src/types/index.ts          — All TypeScript types ✓
/src/data/scenarios/         — Demo scenario data ✓
/docs/                       — All documentation ✓
```

---

## Demo Requirements

The demo is 3 minutes showing:
1. Patient vitals degrading (animated number changes)
2. AI detecting the pattern
3. **Reasoning steps streaming in with typewriter effect** ← This is the money shot
4. Autonomous actions being taken
5. Nurse acknowledging in Retool

The reasoning panel with streaming text is THE CENTERPIECE of the demo.

---

## Environment Variables

```bash
# .env.local
VITE_YUTORI_API_KEY=xxx        # Web scraping
VITE_MINO_API_KEY=xxx          # Form filling
VITE_ANTHROPIC_API_KEY=xxx     # Clinical reasoning (Gemini - env var named for demo purposes)
```

---

## Start Here

1. Read `/docs/TOOL_SETUP.md` first
2. Run `npm create vite@latest` to scaffold
3. Install dependencies
4. Set up Tailwind with custom theme
5. Build `ReasoningStep` component with streaming text
6. Then vitals display
7. Then wire up the demo scenario

The streaming text animation in the reasoning panel is the most important visual element. Get that right first.
