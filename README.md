# SENTINEL

**Autonomous Clinical Intelligence That Thinks Out Loud**

An AI-powered patient monitoring system that detects early signs of sepsis, reasons through clinical context in real-time, and takes autonomous action to save lives.

---

## Quick Start for Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Access to sponsor tool APIs (Yutori, TinyFish, Macroscope)
- Retool account for dashboard development

### Installation

```bash
# Clone and install
cd sentinel
npm install

# Start development server
npm run dev
```

### Project Structure

```
sentinel/
├── docs/                    # Documentation (READ THESE FIRST)
│   ├── PRD.md              # Product requirements
│   ├── ARCHITECTURE.md     # Technical architecture
│   ├── UI_SPEC.md          # UI/UX specifications
│   ├── COMPONENTS.md       # Component specifications
│   └── DEMO.md             # Demo script and presentation guide
│
├── src/
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # State management (Zustand)
│   ├── services/           # Business logic and API clients
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── data/               # Mock data and demo scenarios
│
├── public/                 # Static assets
└── retool/                 # Retool dashboard exports
```

---

## Development Priorities

### Phase 1: Core UI (First)
1. Set up React + Vite + TypeScript + Tailwind
2. Implement design system (colors, typography, spacing)
3. Build ReasoningStep component with streaming text
4. Build VitalCard components
5. Create main layout

### Phase 2: Data Layer
1. Implement vitals simulator
2. Create demo scenario data
3. Set up state management (Zustand store)
4. Wire up vital streaming to UI

### Phase 3: Agent Integration
1. Integrate Yutori for workflow orchestration
2. Integrate TinyFish for reasoning
3. Implement reasoning engine service
4. Wire reasoning steps to UI

### Phase 4: Supporting Features
1. Alert toast system
2. Patient context panel
3. Macroscope trace integration
4. Retool dashboard

### Phase 5: Polish
1. Animation refinement
2. Demo mode with keyboard controls
3. Fallback/error states
4. Final visual polish

---

## Critical Design Rules

### Typography
- **Font:** Crimson Pro (weights: 200, 300, 400)
- **Mono:** JetBrains Mono (for data values)
- Load from Google Fonts

### Colors
- **NO bright, glowing, or saturated colors**
- Use muted, desaturated palette (see UI_SPEC.md)
- Dark theme only

### Icons
- **Lucide React ONLY**
- **NO EMOJIS ANYWHERE**
- See COMPONENTS.md for icon mapping

### Animations
- Subtle and purposeful
- 150-300ms for UI transitions
- No bouncing, overshooting, or flashy effects

---

## Sponsor Tool Integration

| Tool | Purpose | Integration Point |
|------|---------|-------------------|
| **Yutori** | Agent orchestration | Multi-step reasoning workflow |
| **TinyFish** | LLM reasoning | Clinical assessment and decisions |
| **Macroscope** | Observability | Tracing, debugging, audit |
| **Retool** | Dashboards | Command center, admin panel |

---

## Demo Requirements

The demo is a **3-minute live presentation** showing:

1. Patient vitals degrading in real-time
2. AI agent detecting the pattern
3. Reasoning steps appearing with streaming text
4. Autonomous actions being taken
5. Nurse acknowledging via Retool dashboard

**The reasoning panel with streaming text is the centerpiece.**

See `docs/DEMO.md` for the complete demo script.

---

## Key Files to Implement

### Must Have (Demo Critical)
- `src/components/reasoning/ReasoningPanel.tsx`
- `src/components/reasoning/ReasoningStep.tsx`
- `src/components/reasoning/StreamingText.tsx`
- `src/components/vitals/VitalCard.tsx`
- `src/components/vitals/VitalsChart.tsx`
- `src/components/alerts/AlertToast.tsx`
- `src/services/vitalsSimulator.ts`
- `src/services/reasoningEngine.ts`
- `src/stores/sentinelStore.ts`
- `src/data/scenarios/sepsisDeterioration.ts`

### Nice to Have
- `src/components/patient/PatientContext.tsx`
- `src/components/trace/TraceModal.tsx`
- Full Retool dashboard integration
- Mobile responsive layout

---

## Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# Demo
npm run demo         # Start in demo mode with controls
```

---

## Environment Variables

```env
# .env.local
VITE_YUTORI_API_KEY=your_key_here
VITE_TINYFISH_API_KEY=your_key_here
VITE_MACROSCOPE_API_KEY=your_key_here
```

---

## Notes for Claude Code

1. **Read the docs folder first** — especially UI_SPEC.md and COMPONENTS.md
2. **Start with the ReasoningStep component** — it's the most important
3. **Use the exact color values** from UI_SPEC.md
4. **No emojis** — use Lucide icons only
5. **Font is Crimson Pro** — weight 200 for headers, 300 for body
6. **Animations should be subtle** — ease-out, 200ms typical
7. **The streaming text effect is critical** — character by character with blinking cursor
8. **Demo scenario data is in** `src/data/scenarios/sepsisDeterioration.ts`

---

## Success Criteria

- [ ] Vitals display with real-time updates
- [ ] Reasoning panel with streaming text
- [ ] Step-by-step agent visualization
- [ ] Alert toast system
- [ ] Demo runs smoothly for 3 minutes
- [ ] Visual design feels premium, not cheap
- [ ] All four sponsor tools integrated
