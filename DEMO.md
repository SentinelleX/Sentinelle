# Sentinelle— Demo Script & Presentation Guide

## Overview

This document outlines the exact sequence, timing, and visual requirements for the 3-minute hackathon demo. The demo is the most important deliverable — it must be polished, rehearsed, and visually impressive.

---

## Demo Environment Setup

### Screen Layout (Single Monitor)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Sentinelle                       ICU Bed 4: John Doe, 67M        [LIVE]    │
├────────────────────────────────────┬────────────────────────────────────────┤
│                                    │                                        │
│  VITALS                            │  REASONING                             │
│  ┌────────┐ ┌────────┐ ┌────────┐ │                                        │
│  │   HR   │ │   BP   │ │  Temp  │ │  [Reasoning steps will appear here]   │
│  │   78   │ │ 120/80 │ │  37.0  │ │                                        │
│  └────────┘ └────────┘ └────────┘ │                                        │
│  ┌────────┐ ┌────────┐            │                                        │
│  │  SpO2  │ │   RR   │            │                                        │
│  │   98%  │ │   16   │            │                                        │
│  └────────┘ └────────┘            │                                        │
│                                    │                                        │
│  [VITALS CHART - 30 min window]   │                                        │
│                                    │                                        │
│  PATIENT CONTEXT                   │                                        │
│  • UTI (3 days ago)               │                                        │
│  • Immunocompromised              │                                        │
│  • Lactate: 2.1 (trending up)     │                                        │
│                                    │                                        │
└────────────────────────────────────┴────────────────────────────────────────┘
```

### Pre-Demo Checklist

- [ ] Application loaded and stable
- [ ] Patient scenario reset to baseline
- [ ] Reasoning panel cleared
- [ ] Demo mode enabled (controlled timing)
- [ ] Browser in fullscreen (F11)
- [ ] Audio ready for alert sound (optional)
- [ ] Retool dashboard open in separate tab (for quick switch)
- [ ] Timer visible to presenter (phone or secondary display)

---

## Demo Script (3:00 Total)

### ACT 1: THE HOOK (0:00 - 0:25)

**Presenter speaks (screen shows baseline vitals):**

> "Every two minutes, someone dies from sepsis. That's 270,000 Americans every year — more than breast cancer, prostate cancer, and AIDS combined."
>
> "The tragedy? Most of these deaths are preventable. The difference between life and death often comes down to a single hour."
>
> "This is Sentinelle."

**Visual state:**
- Vitals panel showing normal values (green indicators)
- Reasoning panel showing: "Monitoring patient vitals..."
- Subtle pulsing dot to show system is active
- Patient context visible with relevant history

---

### ACT 2: ARCHITECTURE FLASH (0:25 - 0:45)

**Presenter speaks (quick cut to architecture slide or overlay):**

> "Sentinelle is built on four pillars:"
>
> "Yutori orchestrates our autonomous agent workflow."
> "TinyFish powers clinical reasoning."  
> "Macroscope gives us full observability."
> "And Retool provides the command center."
>
> "But enough about how it's built. Let me show you what it does."

**Visual state:**
- Brief architecture diagram (5-10 seconds max)
- OR: Keep main UI but highlight tool logos in corner
- Transition back to main demo view

---

### ACT 3: DETERIORATION BEGINS (0:45 - 1:15)

**Presenter speaks (vitals start changing):**

> "Meet John Doe, 67 years old. He came in three days ago with a urinary tract infection. He's immunocompromised from chemotherapy."
>
> "Right now, his vitals look fine. But watch what happens..."

**[TRIGGER: Start deterioration sequence]**

> "Heart rate climbing... blood pressure dropping... temperature rising..."

**Visual state:**
- Vital cards animate value changes smoothly
- Colors transition: green → yellow → orange
- Trend arrows appear showing direction
- Chart lines start trending in concerning directions
- Values at ~30 second mark: HR 98, BP 105/70, Temp 38.0

**Presenter speaks:**

> "A busy nurse might not catch this pattern for another 20, 30 minutes. But Sentinelle sees it immediately."

---

### ACT 4: THE AGENT AWAKENS (1:15 - 2:15)

**[TRIGGER: Agent activation - vitals cross threshold]**

**Presenter speaks:**

> "And now, watch Sentinelle think."

**Visual state — Reasoning panel comes alive:**

**Step 1: Observe (appears at 1:18)**
```
[Activity icon] New vitals received
               HR: 112 bpm, BP: 88/60 mmHg, Temp: 38.9°C
```

**Step 2: Think (appears at 1:22)**
```
[Brain icon] Analyzing vital sign patterns
             Detecting concerning trends: tachycardia,
             hypotension, fever, tachypnea...
```

**Presenter speaks:**
> "First, it recognizes the pattern..."

**Step 3: Search (appears at 1:28)**
```
[Search icon] Pulling patient context
              └─ [Check] UTI diagnosis 3 days ago
              └─ [Check] Immunocompromised status  
              └─ [Check] Lactate trending up
```

**Presenter speaks:**
> "Then it pulls everything relevant about this patient..."

**Step 4: Calculate (appears at 1:38)**
```
[Calculator icon] Computing risk scores
                  └─ [Check] qSOFA Score: 2/3
                  └─ [Check] NEWS2 Score: 7 (High)
```

**Presenter speaks:**
> "Calculates validated clinical risk scores..."

**Step 5: Think (appears at 1:45)**
```
[Brain icon] Clinical assessment
             Pattern consistent with early sepsis: known
             infection source, systemic inflammatory
             response, organ dysfunction indicators.
```

**Presenter speaks:**
> "And reaches a clinical conclusion — this looks like early sepsis."

**Step 6: Decide (appears at 1:52)**
```
[GitBranch icon] Initiating autonomous response
                 High confidence. Triggering immediate
                 care team alert and protocol.
```

**Presenter speaks:**
> "Now here's where it gets interesting. Sentinelle doesn't just alert. It acts."

**Step 7: Actions (appears at 1:58, children appear sequentially)**
```
[Zap icon] Executing response actions
           └─ [Bell] Alerting care team
              Dr. Chen notified. Charge nurse paged.
           └─ [FileText] Generating recommendations
              Sepsis bundle: Blood cultures, Lactate STAT...
           └─ [FileText] Documenting in EHR
              Clinical note created
           └─ [Clock] Setting escalation timer
              15-minute countdown started
```

**[ALERT TOAST APPEARS - top right, slides in]**
```
┌─────────────────────────────────────────────┐
│ [AlertTriangle] SEPSIS RISK DETECTED        │
│                                             │
│ Patient: John Doe (ICU Bed 4)              │
│ qSOFA: 2/3  •  NEWS2: 7                    │
│                                             │
│ [Acknowledge]                    12:34 PM   │
└─────────────────────────────────────────────┘
```

**Presenter speaks:**
> "In 4.2 seconds, Sentinelle detected sepsis, alerted the team, recommended the sepsis bundle, documented everything, and set an escalation timer."

---

### ACT 5: THE RESPONSE (2:15 - 2:35)

**Presenter speaks:**

> "Now let's see the nurse's view."

**[SWITCH TO RETOOL DASHBOARD - or show split screen]**

**Visual state:**
- Alert visible in queue, highlighted
- Patient row shows elevated status
- Acknowledge button prominent

**Presenter speaks:**

> "The charge nurse sees the alert, reviews the AI's reasoning, and acknowledges."

**[CLICK ACKNOWLEDGE]**

**Visual state:**
- Alert dismissed
- Reasoning panel updates: "Response received. Patient entered sepsis protocol."
- Summary appears: "3 actions taken in 4.2 seconds"

---

### ACT 6: OBSERVABILITY (2:35 - 2:45)

**Presenter speaks:**

> "And because this is healthcare, every decision is fully auditable."

**[CLICK ON A REASONING STEP TO EXPAND TRACE]**

**Visual state:**
- Macroscope trace view expands
- Shows raw inputs, outputs, timing
- Full audit trail visible

**Presenter speaks:**

> "Macroscope captures every decision for compliance and debugging. No black boxes."

---

### ACT 7: THE CLOSE (2:45 - 3:00)

**[RETURN TO MAIN VIEW - now showing stable/acknowledged state]**

**Presenter speaks:**

> "Sentinelle doesn't replace clinicians. It makes sure no early warning ever gets missed."
>
> "270,000 deaths a year. One hour makes the difference. Sentinelle buys that hour back."
>
> "Questions?"

**Final visual state:**
- Reasoning panel showing completed sequence
- Action summary: "3 actions taken in 4.2 seconds"
- Vitals still showing (patient now in protocol)
- Overall feeling: calm, resolved, system worked

---

## Visual Polish Requirements

### Animations That Must Work Perfectly

1. **Vital value changes** — Smooth number transitions, not jumps
2. **Vital card color changes** — Fade between green/yellow/red
3. **Reasoning step entry** — Slide in from left with fade
4. **Text streaming** — Character by character with cursor
5. **Child step expansion** — Smooth height animation
6. **Alert toast entry** — Slide from right, not jarring
7. **Status badge updates** — Cross-fade between states

### Timing Precision

| Event | Timestamp | Tolerance |
|-------|-----------|-----------|
| Deterioration starts | 0:45 | ±2s |
| Threshold crossed | 1:15 | ±2s |
| First reasoning step | 1:18 | ±1s |
| Actions complete | 2:10 | ±3s |
| Total reasoning time | 4.2s | Display this exact number |

### Colors at Key Moments

| Moment | HR Color | BP Color | Temp Color |
|--------|----------|----------|------------|
| Baseline | Normal (teal) | Normal | Normal |
| Early deterioration | Warning (gold) | Normal | Normal |
| Threshold crossed | Critical (red) | Critical | Warning |
| Post-alert | Critical | Critical | Critical |

---

## Fallback Plans

### If demo crashes:
- Have video recording ready as backup
- Practice smooth transition: "Let me show you a recording of the full sequence..."

### If timing is off:
- Have manual triggers for each phase
- Presenter can control pacing with keyboard shortcuts

### If Retool doesn't load:
- Skip the dashboard section
- Focus on the reasoning panel (the star of the show)
- Mention: "The Retool command center lets nurses respond in real-time"

### If network issues:
- Run entirely locally with mocked API responses
- All demo data should be local/embedded

---

## Presenter Notes

### Energy and Pacing
- Start with gravity (the deaths statistic)
- Build excitement as the agent activates
- Let the UI do the talking during the reasoning sequence
- End with confidence and purpose

### Key Phrases to Hit
- "Every two minutes, someone dies"
- "Watch Sentinelle think"
- "It doesn't just alert — it acts"
- "4.2 seconds"
- "No black boxes"
- "Buys that hour back"

### What NOT to Do
- Don't read the reasoning steps aloud (let judges read)
- Don't explain implementation details during demo
- Don't apologize for anything
- Don't rush the reasoning sequence (it's the money shot)

---

## Technical Demo Controls

```typescript
// Demo control interface (keyboard shortcuts)

interface DemoControls {
  'Space': 'Start/pause demo sequence',
  'R': 'Reset to baseline',
  '1': 'Skip to deterioration start',
  '2': 'Skip to threshold breach',
  '3': 'Skip to actions complete',
  'A': 'Trigger alert toast manually',
  'K': 'Acknowledge alert',
  'M': 'Toggle Macroscope trace view',
  'F': 'Toggle fullscreen',
}
```

---

## Post-Demo Q&A Prep

### Likely Questions

**"How does it integrate with real EHRs?"**
> "For the hackathon, we're using simulated data. Production integration would use HL7 FHIR APIs, which most modern EHR systems support."

**"What about false positives?"**
> "The scoring systems we use — qSOFA and NEWS2 — are clinically validated. Thresholds are configurable per institution, and the full observability layer lets clinicians review any decision."

**"Which sponsor tools did you use?"**
> "All four: Yutori for agent orchestration, TinyFish for clinical reasoning, Macroscope for observability, and Retool for the command center."

**"How long did this take to build?"**
> "We built the core system in [X hours] during the hackathon. The architecture is designed to be extensible for other clinical use cases."

**"Could this work for other conditions?"**
> "Absolutely. The agent architecture is condition-agnostic. We focused on sepsis because the time-sensitivity makes the autonomy argument compelling, but the same system could detect cardiac events, respiratory failure, or other deterioration patterns."
