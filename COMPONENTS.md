# SENTINEL — Component Specifications

## Overview

This document provides detailed implementation specifications for all React components. Each component includes props interface, styling approach, and behavior requirements.

---

## Directory Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Icon.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Divider.tsx
│   │   └── Tooltip.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── MainLayout.tsx
│   │   ├── Panel.tsx
│   │   └── SplitView.tsx
│   │
│   ├── reasoning/
│   │   ├── ReasoningPanel.tsx
│   │   ├── ReasoningStep.tsx
│   │   ├── StepIcon.tsx
│   │   ├── StepContent.tsx
│   │   ├── StepStatus.tsx
│   │   ├── StreamingText.tsx
│   │   └── ActionSummary.tsx
│   │
│   ├── vitals/
│   │   ├── VitalsPanel.tsx
│   │   ├── VitalCard.tsx
│   │   ├── VitalValue.tsx
│   │   ├── VitalTrend.tsx
│   │   ├── ThresholdBar.tsx
│   │   ├── VitalsChart.tsx
│   │   └── ChartTooltip.tsx
│   │
│   ├── patient/
│   │   ├── PatientContext.tsx
│   │   ├── PatientHeader.tsx
│   │   ├── DiagnosesList.tsx
│   │   ├── MedicationsList.tsx
│   │   └── LabResults.tsx
│   │
│   ├── alerts/
│   │   ├── AlertOverlay.tsx
│   │   ├── AlertToast.tsx
│   │   └── AlertActions.tsx
│   │
│   └── trace/
│       ├── TraceModal.tsx
│       ├── TraceTimeline.tsx
│       └── SpanDetails.tsx
│
├── hooks/
│   ├── useVitalsStream.ts
│   ├── useReasoningStream.ts
│   ├── useAutoScroll.ts
│   ├── useStreamingText.ts
│   └── useAnimatedNumber.ts
│
├── stores/
│   ├── sentinelStore.ts
│   ├── vitalsStore.ts
│   └── alertStore.ts
│
├── services/
│   ├── vitalsSimulator.ts
│   ├── reasoningEngine.ts
│   ├── alertService.ts
│   └── traceService.ts
│
├── types/
│   ├── vitals.ts
│   ├── reasoning.ts
│   ├── patient.ts
│   ├── alerts.ts
│   └── trace.ts
│
├── utils/
│   ├── scoring.ts
│   ├── formatting.ts
│   ├── thresholds.ts
│   └── animations.ts
│
└── data/
    ├── scenarios/
    │   └── sepsisDeterioration.ts
    ├── mockPatients.ts
    └── thresholdDefaults.ts
```

---

## Core Components

### 1. ReasoningStep

The most critical component — renders a single step in the reasoning chain.

```typescript
// types/reasoning.ts

type StepType = 
  | 'observe'
  | 'think'
  | 'search'
  | 'calculate'
  | 'decide'
  | 'action'
  | 'alert'
  | 'document'
  | 'wait'
  | 'success'
  | 'error'
  | 'escalate';

type StepStatus = 'pending' | 'in_progress' | 'complete' | 'error';

interface ReasoningStep {
  id: string;
  type: StepType;
  title: string;
  content?: string;
  children?: ReasoningStep[];
  status: StepStatus;
  timestamp: number;
  duration?: number;
  traceId?: string;
  metadata?: Record<string, unknown>;
}
```

```typescript
// components/reasoning/ReasoningStep.tsx

interface ReasoningStepProps {
  step: ReasoningStep;
  depth?: number;
  isStreaming?: boolean;
  onExpand?: (stepId: string) => void;
  isExpanded?: boolean;
}

/**
 * IMPLEMENTATION REQUIREMENTS:
 * 
 * 1. Layout:
 *    - Indentation: depth * 24px left padding
 *    - Icon aligned with title, content below with connecting line
 *    - Children rendered recursively with depth + 1
 * 
 * 2. Icon mapping (use StepIcon component):
 *    - observe: Activity
 *    - think: Brain
 *    - search: Search
 *    - calculate: Calculator
 *    - decide: GitBranch
 *    - action: Zap
 *    - alert: Bell
 *    - document: FileText
 *    - wait: Clock
 *    - success: CheckCircle
 *    - error: XCircle
 *    - escalate: ArrowUpCircle
 * 
 * 3. Status indicators:
 *    - pending: muted icon, gray text
 *    - in_progress: animated pulse on icon, full opacity
 *    - complete: checkmark badge, full opacity
 *    - error: error badge, muted red tint
 * 
 * 4. Animations:
 *    - Entry: fade + translateX(-8px) -> translateX(0), 200ms
 *    - Content streaming: use StreamingText component
 *    - Status change: cross-fade, 150ms
 * 
 * 5. Interactions:
 *    - Click anywhere on step: trigger onExpand
 *    - Hover: subtle background highlight (bg-elevated)
 */
```

---

### 2. StreamingText

Renders text character by character with a cursor effect.

```typescript
// components/reasoning/StreamingText.tsx

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  speed?: number; // ms per character, default 30
  onComplete?: () => void;
  className?: string;
}

/**
 * IMPLEMENTATION REQUIREMENTS:
 * 
 * 1. Streaming behavior:
 *    - If isStreaming=true, render characters one at a time
 *    - Show blinking cursor at end while streaming
 *    - Call onComplete when all characters rendered
 * 
 * 2. If isStreaming=false:
 *    - Render full text immediately (no animation)
 * 
 * 3. Cursor:
 *    - 2px wide, text-secondary color
 *    - Blink animation: 800ms interval
 *    - Hide cursor when complete
 * 
 * 4. Hook: useStreamingText
 *    - Manages character index state
 *    - Uses requestAnimationFrame for smooth updates
 *    - Handles cleanup on unmount
 */
```

---

### 3. VitalCard

Displays a single vital sign with value, trend, and threshold visualization.

```typescript
// components/vitals/VitalCard.tsx

interface VitalCardProps {
  type: 'heartRate' | 'bloodPressure' | 'temperature' | 'spO2' | 'respiratoryRate';
  value: number | { systolic: number; diastolic: number };
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue?: number;
  thresholds: {
    criticalLow?: number;
    warningLow?: number;
    warningHigh?: number;
    criticalHigh?: number;
  };
  timestamp?: number;
  onClick?: () => void;
}

/**
 * IMPLEMENTATION REQUIREMENTS:
 * 
 * 1. Layout (vertical stack):
 *    - Icon (top-left, 20px)
 *    - Value (center, large: 36px Crimson Pro 200)
 *    - Unit (below value, 14px, text-secondary)
 *    - Trend indicator (below unit)
 *    - Threshold bar (bottom)
 * 
 * 2. Color logic:
 *    - Value color based on threshold breach
 *    - Trend arrow: up=TrendingUp, down=TrendingDown, stable=Minus
 *    - Trend color: contextual (rising HR = warning, falling = normal)
 * 
 * 3. Threshold bar:
 *    - Horizontal bar showing normal/warning/critical zones
 *    - Marker indicating current value position
 *    - Gradient: status-normal -> status-warning -> status-critical
 * 
 * 4. Animation:
 *    - Value changes: use useAnimatedNumber hook
 *    - Border color transition on threshold change: 400ms
 * 
 * 5. Icon mapping:
 *    - heartRate: Heart
 *    - bloodPressure: Activity
 *    - temperature: Thermometer
 *    - spO2: Droplet
 *    - respiratoryRate: Wind
 */
```

---

### 4. VitalsChart

Time-series visualization of vital signs.

```typescript
// components/vitals/VitalsChart.tsx

interface VitalsChartProps {
  data: VitalSign[];
  visibleVitals: ('heartRate' | 'bloodPressure' | 'temperature' | 'spO2' | 'respiratoryRate')[];
  timeWindow?: number; // minutes, default 30
  thresholds?: ThresholdConfig;
  highlightedTime?: number;
  onTimeSelect?: (timestamp: number) => void;
}

/**
 * IMPLEMENTATION REQUIREMENTS:
 * 
 * 1. Chart library: Recharts
 *    - ResponsiveContainer for auto-sizing
 *    - LineChart with multiple Line components
 *    - XAxis: time (formatted HH:mm)
 *    - YAxis: auto-scaled per vital (or normalized)
 * 
 * 2. Styling:
 *    - Line strokeWidth: 2
 *    - No dots, but activeDot on hover (r=4)
 *    - Grid: dashed, border-subtle color
 *    - Axis text: 11px, text-tertiary
 * 
 * 3. Threshold bands:
 *    - ReferenceArea for warning/critical zones
 *    - Very subtle fill (0.1 opacity)
 * 
 * 4. Tooltip:
 *    - Custom ChartTooltip component
 *    - Shows all values at hovered time
 *    - Dark background (bg-elevated)
 * 
 * 5. Animation:
 *    - New data points: smooth line extension
 *    - Use animationDuration={200}
 * 
 * 6. Color per vital:
 *    - heartRate: #b85c5c (muted red)
 *    - bloodPressure: #6b8cae (muted blue)
 *    - temperature: #c9a227 (muted gold)
 *    - spO2: #4a9f7e (muted teal)
 *    - respiratoryRate: #8b7fb8 (muted purple)
 */
```

---

### 5. AlertToast

Notification component for critical alerts.

```typescript
// components/alerts/AlertToast.tsx

interface AlertToastProps {
  alert: Alert;
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
  onExpand?: (alertId: string) => void;
}

interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  patientId: string;
  patientName: string;
  location: string;
  scores?: { qsofa: number; news2: number };
  timestamp: number;
  acknowledged: boolean;
}

/**
 * IMPLEMENTATION REQUIREMENTS:
 * 
 * 1. Layout:
 *    - Left border: 3px, color based on severity
 *    - Header: icon + title + close button
 *    - Body: patient info, location, scores
 *    - Footer: acknowledge button + timestamp
 * 
 * 2. Position:
 *    - Fixed, top-right corner
 *    - Stack multiple alerts vertically (8px gap)
 *    - Max 3 visible, "+N more" indicator
 * 
 * 3. Animation:
 *    - Entry: slide from right + fade, 250ms
 *    - Exit: fade + slide up, 200ms
 *    - Use framer-motion AnimatePresence
 * 
 * 4. Severity colors:
 *    - low: status-info
 *    - medium: status-warning
 *    - high: status-critical
 *    - critical: status-critical + subtle pulse animation
 * 
 * 5. Interactions:
 *    - Acknowledge button: primary action
 *    - X button: dismiss without ack
 *    - Click body: expand to detail view
 */
```

---

### 6. ReasoningPanel

Container for the full reasoning visualization.

```typescript
// components/reasoning/ReasoningPanel.tsx

interface ReasoningPanelProps {
  steps: ReasoningStep[];
  isActive: boolean;
  traceId?: string;
  onStepClick?: (stepId: string) => void;
}

/**
 * IMPLEMENTATION REQUIREMENTS:
 * 
 * 1. Header:
 *    - Title: "SENTINEL REASONING"
 *    - Status badge: "Monitoring" | "Active" | "Complete"
 *    - Trace link (if traceId): click to open Macroscope
 * 
 * 2. Step list:
 *    - Scrollable container
 *    - Auto-scroll to bottom on new steps
 *    - Disable auto-scroll if user scrolls up
 *    - "Jump to latest" button when not at bottom
 * 
 * 3. Empty state (no steps, isActive=false):
 *    - Subtle message: "Monitoring patient vitals..."
 *    - Pulsing dot indicator
 * 
 * 4. Footer:
 *    - ActionSummary component when complete
 *    - Shows: "N actions taken in X.Xs"
 * 
 * 5. Hook: useAutoScroll
 *    - Tracks scroll position
 *    - Manages auto-scroll state
 *    - Provides scrollToBottom function
 */
```

---

### 7. PatientContext

Displays patient information panel.

```typescript
// components/patient/PatientContext.tsx

interface PatientContextProps {
  patient: PatientContext;
  isLoading?: boolean;
}

/**
 * IMPLEMENTATION REQUIREMENTS:
 * 
 * 1. Sections (each with subtle divider):
 *    - Patient header (name, age, sex, weight)
 *    - Active diagnoses (bulleted list)
 *    - Current medications (bulleted list with dosage)
 *    - Recent labs (table with trend indicators)
 *    - Risk factors (tags/badges)
 * 
 * 2. Styling:
 *    - Section titles: 12px, text-tertiary, uppercase, letter-spacing
 *    - Content: 14px, text-secondary
 *    - Highlight relevant items when referenced in reasoning
 * 
 * 3. Loading state:
 *    - Skeleton loaders for each section
 *    - Subtle shimmer animation
 * 
 * 4. Interactions:
 *    - Hover on diagnosis: show ICD code tooltip
 *    - Hover on medication: show full details
 *    - Click lab value: show historical trend
 */
```

---

## Hooks

### useStreamingText

```typescript
// hooks/useStreamingText.ts

interface UseStreamingTextOptions {
  text: string;
  speed?: number;
  enabled?: boolean;
  onComplete?: () => void;
}

interface UseStreamingTextReturn {
  displayedText: string;
  isComplete: boolean;
  reset: () => void;
}

/**
 * IMPLEMENTATION:
 * 
 * - Use useState for character index
 * - Use useEffect with setInterval for timing
 * - Clean up interval on unmount or text change
 * - Call onComplete when index reaches text.length
 */
```

### useAnimatedNumber

```typescript
// hooks/useAnimatedNumber.ts

interface UseAnimatedNumberOptions {
  value: number;
  duration?: number;
  decimals?: number;
}

interface UseAnimatedNumberReturn {
  displayValue: string;
  isAnimating: boolean;
}

/**
 * IMPLEMENTATION:
 * 
 * - Animate from previous value to new value
 * - Use requestAnimationFrame for smooth updates
 * - Easing: ease-out
 * - Format with specified decimal places
 */
```

### useAutoScroll

```typescript
// hooks/useAutoScroll.ts

interface UseAutoScrollOptions {
  containerRef: RefObject<HTMLElement>;
  dependency: unknown; // triggers scroll check
  threshold?: number; // pixels from bottom to consider "at bottom"
}

interface UseAutoScrollReturn {
  isAtBottom: boolean;
  scrollToBottom: () => void;
  enableAutoScroll: () => void;
  disableAutoScroll: () => void;
}

/**
 * IMPLEMENTATION:
 * 
 * - Track scroll position with scroll event listener
 * - Auto-scroll when new content added AND user is at bottom
 * - Disable auto-scroll when user scrolls up
 * - Provide manual scrollToBottom function
 */
```

---

## Services

### vitalsSimulator

```typescript
// services/vitalsSimulator.ts

interface VitalsSimulatorConfig {
  patient: PatientContext;
  scenario: 'stable' | 'deterioration' | 'custom';
  customCurve?: DeteriorationCurve;
  updateInterval?: number; // ms, default 1000
}

interface VitalsSimulator {
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setScenario: (scenario: string) => void;
  onVitalUpdate: (callback: (vital: VitalSign) => void) => void;
  getCurrentVitals: () => VitalSign;
}

/**
 * IMPLEMENTATION:
 * 
 * 1. Generate realistic vital sign data
 * 2. Support multiple scenarios:
 *    - stable: minor fluctuations around baseline
 *    - deterioration: gradual worsening over time
 * 
 * 3. Deterioration curve for sepsis demo:
 *    - 0-30s: baseline
 *    - 30-60s: HR rises, BP starts dropping
 *    - 60-90s: Temp rises, SpO2 drops
 *    - 90-120s: All vitals in warning/critical
 * 
 * 4. Add realistic noise/variability
 * 5. Emit updates via callback
 */
```

### reasoningEngine

```typescript
// services/reasoningEngine.ts

interface ReasoningEngine {
  start: (trigger: VitalSign) => void;
  onStep: (callback: (step: ReasoningStep) => void) => void;
  onComplete: (callback: (summary: ReasoningSummary) => void) => void;
  getTraceId: () => string;
}

/**
 * IMPLEMENTATION:
 * 
 * 1. Orchestrate the reasoning sequence
 * 2. Emit steps with appropriate timing:
 *    - observe: immediate
 *    - think: 500ms delay, 1s duration
 *    - search: 300ms delay, 800ms duration
 *    - calculate: 200ms delay, 500ms duration
 *    - decide: 300ms delay, 600ms duration
 *    - actions: parallel, 200ms each
 * 
 * 3. Generate realistic content for each step
 * 4. Create trace ID for Macroscope integration
 * 5. Track total duration for summary
 */
```

---

## Data

### Demo Scenario

```typescript
// data/scenarios/sepsisDeterioration.ts

export const sepsisScenario = {
  patient: {
    id: 'demo-patient-001',
    demographics: {
      age: 67,
      sex: 'M',
      weight: 78,
    },
    diagnoses: [
      { code: 'N39.0', description: 'Urinary tract infection', onset: '3 days ago' },
      { code: 'E11.9', description: 'Type 2 Diabetes Mellitus', onset: '5 years ago' },
      { code: 'D70.9', description: 'Immunocompromised (chemotherapy)', onset: '2 months ago' },
    ],
    medications: [
      { name: 'Metformin', dose: '500mg', frequency: 'BID' },
      { name: 'Ciprofloxacin', dose: '500mg', frequency: 'BID' },
    ],
    allergies: ['Penicillin'],
    recentLabs: [
      { name: 'Lactate', value: 2.1, unit: 'mmol/L', timestamp: 'yesterday', trend: 'up' },
      { name: 'WBC', value: 14.2, unit: 'x10^9/L', timestamp: 'yesterday', trend: 'up' },
      { name: 'Creatinine', value: 1.4, unit: 'mg/dL', timestamp: 'yesterday', trend: 'stable' },
    ],
    riskFactors: ['Immunocompromised', 'Recent infection', 'Age > 65'],
  },
  
  baseline: {
    heartRate: 78,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 37.0,
    spO2: 98,
    respiratoryRate: 16,
  },
  
  deterioration: [
    // Each entry is a target at a specific time
    { time: 0, vitals: { hr: 78, sbp: 120, dbp: 80, temp: 37.0, spo2: 98, rr: 16 } },
    { time: 30, vitals: { hr: 88, sbp: 115, dbp: 75, temp: 37.4, spo2: 97, rr: 18 } },
    { time: 45, vitals: { hr: 98, sbp: 105, dbp: 70, temp: 38.0, spo2: 96, rr: 20 } },
    { time: 60, vitals: { hr: 108, sbp: 95, dbp: 65, temp: 38.5, spo2: 95, rr: 22 } },
    { time: 75, vitals: { hr: 112, sbp: 88, dbp: 60, temp: 38.9, spo2: 94, rr: 24 } },
  ],
  
  reasoningSteps: [
    {
      type: 'observe',
      title: 'New vitals received',
      content: 'HR: 112 bpm, BP: 88/60 mmHg, Temp: 38.9°C, SpO2: 94%, RR: 24/min',
    },
    {
      type: 'think',
      title: 'Analyzing vital sign patterns',
      content: 'Detecting concerning trends: tachycardia, hypotension, fever, tachypnea',
    },
    {
      type: 'search',
      title: 'Pulling patient context',
      content: 'Retrieving medical history, current medications, recent labs...',
      children: [
        { type: 'success', title: 'UTI diagnosis 3 days ago', content: 'Active infection source identified' },
        { type: 'success', title: 'Immunocompromised status', content: 'Chemotherapy-induced, higher infection risk' },
        { type: 'success', title: 'Lactate trending up', content: 'Was 2.1 mmol/L yesterday, concerning trend' },
      ],
    },
    {
      type: 'calculate',
      title: 'Computing risk scores',
      content: 'Applying validated clinical scoring systems...',
      children: [
        { type: 'success', title: 'qSOFA Score: 2/3', content: 'RR ≥22 (+1), SBP ≤100 (+1)' },
        { type: 'success', title: 'NEWS2 Score: 7', content: 'High clinical risk category' },
      ],
    },
    {
      type: 'think',
      title: 'Clinical assessment',
      content: 'Pattern consistent with early sepsis: known infection source, systemic inflammatory response, and organ dysfunction indicators. Immediate intervention recommended.',
    },
    {
      type: 'decide',
      title: 'Initiating autonomous response',
      content: 'High confidence sepsis risk detected. Triggering care team alert and sepsis protocol recommendations.',
    },
    {
      type: 'action',
      title: 'Executing response actions',
      children: [
        { type: 'alert', title: 'Alerting care team', content: 'Dr. Chen notified via pager. Charge nurse alerted.' },
        { type: 'document', title: 'Generating recommendations', content: 'Sepsis bundle: Blood cultures x2, Lactate level STAT, Broad-spectrum antibiotics within 1 hour' },
        { type: 'document', title: 'Documenting in EHR', content: 'Clinical note created with assessment and actions taken' },
        { type: 'wait', title: 'Setting escalation timer', content: '15-minute countdown. Will escalate if no response.' },
      ],
    },
  ],
};
```

---

## Tailwind Configuration

```javascript
// tailwind.config.js

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Crimson Pro', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        extralight: 200,
        light: 300,
        normal: 400,
      },
      colors: {
        bg: {
          primary: '#0a0a0b',
          secondary: '#111113',
          tertiary: '#18181b',
          elevated: '#1f1f23',
        },
        border: {
          subtle: '#27272a',
          default: '#3f3f46',
          strong: '#52525b',
        },
        text: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          tertiary: '#71717a',
          disabled: '#52525b',
        },
        status: {
          normal: '#4a9f7e',
          warning: '#c9a227',
          critical: '#b85c5c',
          info: '#6b8cae',
        },
        accent: {
          primary: '#6b8cae',
          agent: '#8b7fb8',
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'blink': 'blink 800ms infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'blink': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
```
