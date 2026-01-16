# SENTINEL — UI/UX Specification

## Design Philosophy

Sentinel's interface must feel **clinical, premium, and trustworthy**. It is a medical-grade tool visualizing life-or-death decisions. Every design choice should reinforce clarity, precision, and calm authority.

**Core Principles:**
1. **Clarity over decoration** — Information hierarchy is paramount
2. **Subtle sophistication** — Premium feel through restraint, not excess
3. **Calm urgency** — Convey criticality without panic-inducing design
4. **Transparency** — The AI's reasoning must feel open and honest

---

## Design System

### Typography

**Primary Font: Crimson Pro**

| Use Case | Weight | Size | Line Height | Letter Spacing |
|----------|--------|------|-------------|----------------|
| Display/Hero | 200 (Extra Light) | 48px | 1.1 | -0.02em |
| Page Title | 200 (Extra Light) | 32px | 1.2 | -0.01em |
| Section Header | 300 (Light) | 24px | 1.3 | 0 |
| Card Title | 400 (Regular) | 18px | 1.4 | 0 |
| Body | 300 (Light) | 16px | 1.6 | 0.01em |
| Body Small | 300 (Light) | 14px | 1.5 | 0.01em |
| Caption | 300 (Light) | 12px | 1.4 | 0.02em |
| Mono/Data | JetBrains Mono 400 | 14px | 1.4 | 0 |

**Font Loading:**
```css
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@200;300;400&family=JetBrains+Mono:wght@400&display=swap');
```

---

### Color Palette

**NO bright, glowing, or saturated colors. All colors are muted, desaturated, and sophisticated.**

#### Base Colors (Dark Theme)

```css
:root {
  /* Backgrounds */
  --bg-primary: #0a0a0b;        /* Near black */
  --bg-secondary: #111113;      /* Slightly lifted */
  --bg-tertiary: #18181b;       /* Card backgrounds */
  --bg-elevated: #1f1f23;       /* Hover states, elevated cards */
  
  /* Borders */
  --border-subtle: #27272a;     /* Subtle dividers */
  --border-default: #3f3f46;    /* Default borders */
  --border-strong: #52525b;     /* Emphasized borders */
  
  /* Text */
  --text-primary: #fafafa;      /* Primary text */
  --text-secondary: #a1a1aa;    /* Secondary text */
  --text-tertiary: #71717a;     /* Muted text */
  --text-disabled: #52525b;     /* Disabled state */
}
```

#### Semantic Colors (Muted, Desaturated)

```css
:root {
  /* Status - All desaturated */
  --status-normal: #4a9f7e;     /* Muted teal-green */
  --status-warning: #c9a227;    /* Muted gold */
  --status-critical: #b85c5c;   /* Muted red */
  --status-info: #6b8cae;       /* Muted blue */
  
  /* Status backgrounds (very subtle) */
  --status-normal-bg: rgba(74, 159, 126, 0.08);
  --status-warning-bg: rgba(201, 162, 39, 0.08);
  --status-critical-bg: rgba(184, 92, 92, 0.08);
  --status-info-bg: rgba(107, 140, 174, 0.08);
  
  /* Status borders */
  --status-normal-border: rgba(74, 159, 126, 0.2);
  --status-warning-border: rgba(201, 162, 39, 0.2);
  --status-critical-border: rgba(184, 92, 92, 0.2);
  --status-info-border: rgba(107, 140, 174, 0.2);
}
```

#### Accent Colors

```css
:root {
  /* Primary accent - Muted blue */
  --accent-primary: #6b8cae;
  --accent-primary-hover: #7d9bba;
  --accent-primary-bg: rgba(107, 140, 174, 0.1);
  
  /* Agent/AI accent - Subtle purple */
  --accent-agent: #8b7fb8;
  --accent-agent-bg: rgba(139, 127, 184, 0.08);
}
```

---

### Spacing Scale

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

---

### Border Radius

```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

---

### Shadows (Subtle, no glow)

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-inner: inset 0 1px 2px rgba(0, 0, 0, 0.2);
}
```

---

### Icons

**ONLY use Lucide React icons. NO emojis anywhere in the application.**

```typescript
// Approved icon imports
import {
  Activity,        // Vitals, monitoring
  Brain,           // Thinking, reasoning
  Search,          // Searching, retrieving
  Calculator,      // Computing scores
  GitBranch,       // Decision points
  Zap,             // Actions, execution
  Bell,            // Alerts
  FileText,        // Documentation
  Clock,           // Waiting, time
  CheckCircle,     // Success
  XCircle,         // Error
  ArrowUpCircle,   // Escalation
  AlertTriangle,   // Warning
  Heart,           // Heart rate
  Thermometer,     // Temperature
  Wind,            // Respiratory
  Droplet,         // SpO2/Blood
  TrendingUp,      // Increasing
  TrendingDown,    // Decreasing
  Minus,           // Stable
  User,            // Patient
  Settings,        // Configuration
  Eye,             // Observability
  ChevronRight,    // Expand
  ChevronDown,     // Collapse
} from 'lucide-react';
```

**Icon Sizing:**
| Context | Size | Stroke Width |
|---------|------|--------------|
| Inline with text | 16px | 1.5 |
| Card headers | 20px | 1.5 |
| Feature icons | 24px | 1.5 |
| Hero/Display | 32px | 1 |

---

## Component Specifications

### 1. Reasoning Step Component

The most important component — must feel alive and intelligent.

```
┌─────────────────────────────────────────────────────────────────┐
│ [Icon]  Step Title                               [Status] 12:34 │
│         │                                                       │
│         └─ Supporting detail text that streams in character     │
│            by character with a subtle cursor effect...          │
│                                                                 │
│         ┌─ [Child Icon]  Child step                    [Done]  │
│         │               └─ Child detail                        │
│         │                                                       │
│         └─ [Child Icon]  Another child step         [Loading]  │
│                         └─ Still processing...                 │
└─────────────────────────────────────────────────────────────────┘
```

**States:**
- `pending` — Muted, waiting to start
- `in_progress` — Active, content streaming
- `complete` — Checkmark, full opacity
- `error` — Error icon, muted red highlight

**Animation:**
```css
/* Step entry */
.step-enter {
  opacity: 0;
  transform: translateX(-8px);
}
.step-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 200ms ease-out;
}

/* Content streaming */
.streaming-text {
  border-right: 2px solid var(--text-secondary);
  animation: blink 800ms infinite;
}

@keyframes blink {
  0%, 100% { border-color: var(--text-secondary); }
  50% { border-color: transparent; }
}

/* Status transition */
.status-indicator {
  transition: all 150ms ease-out;
}
```

**Spacing:**
- Left padding for tree structure: 24px per level
- Vertical gap between steps: 8px
- Internal padding: 12px 16px

---

### 2. Vital Card Component

```
┌─────────────────────────────────┐
│  [Heart Icon]                   │
│                                 │
│         112                     │  ← Large value
│         bpm                     │  ← Unit (smaller)
│                                 │
│  ▲ +15 from baseline           │  ← Trend indicator
│                                 │
│  [━━━━━━━━━━━━━━━━━━━━━━━━━━━] │  ← Threshold bar
│        ↑ current                │
└─────────────────────────────────┘
```

**Visual Specifications:**
- Card: `bg-tertiary`, `border-subtle`, `radius-lg`
- Value: `Crimson Pro 200`, 36px
- Unit: `Crimson Pro 300`, 14px, `text-secondary`
- Trend: 12px, color based on direction + severity
- Threshold bar: 4px height, gradient from normal to critical

**Color Logic:**
```typescript
const getVitalColor = (value: number, thresholds: Thresholds): string => {
  if (value >= thresholds.criticalHigh || value <= thresholds.criticalLow) {
    return 'var(--status-critical)';
  }
  if (value >= thresholds.warningHigh || value <= thresholds.warningLow) {
    return 'var(--status-warning)';
  }
  return 'var(--status-normal)';
};
```

---

### 3. Vitals Chart Component

**Requirements:**
- 30-minute rolling window
- Smooth line interpolation (monotone curve)
- Subtle grid lines
- Threshold bands (shaded regions)
- Animated line drawing on new data
- Tooltip on hover showing exact values

**Visual Style:**
```typescript
const chartConfig = {
  line: {
    strokeWidth: 2,
    dot: false,
    activeDot: { r: 4, strokeWidth: 0 },
  },
  grid: {
    stroke: 'var(--border-subtle)',
    strokeDasharray: '2 4',
  },
  axis: {
    stroke: 'var(--border-subtle)',
    tick: { fill: 'var(--text-tertiary)', fontSize: 11 },
  },
  thresholdBand: {
    fill: 'var(--status-warning-bg)',
    fillOpacity: 0.5,
  },
};
```

---

### 4. Alert Toast Component

```
┌─────────────────────────────────────────────────────────────────┐
│  [AlertTriangle]  SEPSIS RISK DETECTED                    [X]  │
│                                                                 │
│  Patient: John Doe (ICU Bed 4)                                 │
│  qSOFA: 2/3  •  NEWS2: 7 (High)                                │
│                                                                 │
│  [Acknowledge]                              12:34:56 PM        │
└─────────────────────────────────────────────────────────────────┘
```

**Animation:**
- Slide in from top-right
- Subtle pulse on critical alerts (not flashy, just gentle)
- Smooth exit on dismiss

**Styling:**
- Border-left: 3px solid `--status-critical`
- Background: `--bg-elevated`
- Max-width: 400px

---

### 5. Patient Context Panel

```
┌─────────────────────────────────────────────────────────────────┐
│  PATIENT CONTEXT                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [User] John Doe                                               │
│         67 y/o Male • 78 kg                                    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ACTIVE DIAGNOSES                                              │
│  • Urinary tract infection (3 days ago)                        │
│  • Type 2 Diabetes Mellitus                                    │
│  • Immunocompromised (chemotherapy)                            │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  CURRENT MEDICATIONS                                           │
│  • Metformin 500mg BID                                         │
│  • Ciprofloxacin 500mg BID                                     │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  RECENT LABS                                                   │
│  Lactate: 2.1 mmol/L (yesterday)           [TrendingUp]       │
│  WBC: 14.2 x10^9/L (yesterday)             [TrendingUp]       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layout Specifications

### Main Application Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER (56px)                                                              │
│  [Logo]  SENTINEL               ICU Bed 4: John Doe          [Status]      │
├───────────────────────────────────┬─────────────────────────────────────────┤
│                                   │                                         │
│  VITALS PANEL (400px)             │  REASONING PANEL (flex: 1)              │
│                                   │                                         │
│  ┌───────┐ ┌───────┐ ┌───────┐   │  ┌─────────────────────────────────────┐│
│  │  HR   │ │  BP   │ │ Temp  │   │  │                                     ││
│  └───────┘ └───────┘ └───────┘   │  │  Reasoning steps appear here        ││
│                                   │  │  with streaming text and            ││
│  ┌───────┐ ┌───────┐             │  │  animations...                      ││
│  │ SpO2  │ │  RR   │             │  │                                     ││
│  └───────┘ └───────┘             │  │                                     ││
│                                   │  │                                     ││
│  ┌───────────────────────────┐   │  │                                     ││
│  │                           │   │  │                                     ││
│  │     VITALS CHART          │   │  │                                     ││
│  │                           │   │  │                                     ││
│  │                           │   │  │                                     ││
│  └───────────────────────────┘   │  │                                     ││
│                                   │  │                                     ││
│  ┌───────────────────────────┐   │  └─────────────────────────────────────┘│
│  │                           │   │                                         │
│  │   PATIENT CONTEXT         │   │  ┌─────────────────────────────────────┐│
│  │                           │   │  │  ACTION SUMMARY                     ││
│  │                           │   │  │  3 actions taken • 4.2s             ││
│  └───────────────────────────┘   │  └─────────────────────────────────────┘│
│                                   │                                         │
└───────────────────────────────────┴─────────────────────────────────────────┘
```

**Responsive Breakpoints:**
- Desktop (>1200px): Side-by-side layout as shown
- Tablet (768-1200px): Stack reasoning below vitals
- Mobile (<768px): Single column, collapsible sections

---

## Animation Guidelines

### Principles

1. **Purposeful** — Every animation should convey meaning
2. **Quick** — Durations between 150-300ms for UI, up to 500ms for emphasis
3. **Smooth** — Use ease-out for entries, ease-in-out for morphs
4. **Subtle** — No bouncing, no overshooting, no flashy effects

### Specific Animations

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Reasoning step | Entry | Fade + slide left | 200ms | ease-out |
| Step content | Streaming | Character by character | 30ms/char | linear |
| Status badge | Change | Cross-fade | 150ms | ease-out |
| Vital value | Update | Number morph | 300ms | ease-out |
| Vital card | Threshold crossed | Border color change | 400ms | ease-in-out |
| Alert toast | Entry | Slide from top | 250ms | ease-out |
| Alert toast | Exit | Fade + slide up | 200ms | ease-in |
| Expand/collapse | Toggle | Height + fade | 250ms | ease-in-out |
| Chart line | New point | Extend path | 200ms | ease-out |

---

## Interaction Patterns

### Reasoning Panel

- **Click step**: Expand to show Macroscope trace details
- **Hover step**: Subtle background highlight
- **Auto-scroll**: Scroll to newest step, but stop if user scrolls manually
- **Resume auto-scroll**: Button appears "Jump to latest"

### Vital Cards

- **Hover**: Show exact value, timestamp, threshold info
- **Click**: Focus that vital in the chart

### Alert Toast

- **Click Acknowledge**: Dismiss and log response
- **Click X**: Dismiss without acknowledging
- **Click body**: Expand to full alert detail view

---

## Accessibility

- Minimum contrast ratio: 4.5:1 for text
- Focus indicators: 2px solid `--accent-primary`
- Keyboard navigation: Full support for all interactive elements
- Screen reader: ARIA labels for all icons and status indicators
- Reduced motion: Respect `prefers-reduced-motion` media query

---

## Dark Theme Only

This application is dark theme only. No light theme variant.

The dark theme is essential for:
1. Clinical environments (often dimly lit)
2. Reducing eye strain during long monitoring sessions
3. Premium, sophisticated aesthetic
4. Better visibility of color-coded status indicators

---

## Do's and Don'ts

### DO:
- Use muted, desaturated colors
- Maintain generous whitespace
- Keep animations subtle and purposeful
- Use Lucide icons consistently
- Prioritize readability over decoration

### DON'T:
- Use emojis (ever)
- Use bright, saturated, or glowing colors
- Add unnecessary animations or transitions
- Use multiple font families (stick to Crimson Pro + JetBrains Mono)
- Overcrowd the interface with information
- Use shadows for "glow" effects
