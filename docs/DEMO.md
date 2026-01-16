# Sentinelle — Demo Script & Presentation Guide

## Overview

This document outlines the exact sequence, timing, and visual requirements for the 3-minute hackathon demo. The demo is the most important deliverable — it must be polished, rehearsed, and visually impressive.

**Key Story Elements:**
1. 🎭 **The Tragedy**: Prior ER visit where patient was given wrong antibiotic (sulfa allergy not in system)
2. 🔍 **The Missed Signs**: Nursing notes show subtle warnings that weren't escalated
3. 🤖 **The Save**: Sentinelle catches what humans missed and acts autonomously
4. ⏱️ **The Speed**: 4.2 seconds from detection to full response

---

## Patient Profile

| Field | Value |
|-------|-------|
| **Name** | Margaret Chen |
| **Age/Sex** | 67 / Female |
| **Location** | ICU Bed 4, Tower B |
| **MRN** | MRN-2847591 |
| **Admitted** | 3 days ago for UTI |
| **Key History** | Breast cancer survivor, on chemotherapy, neutropenic |
| **The Problem** | Developing septic shock from undertreated UTI |

**Why This Patient is Compelling:**
- She was in the ER 5 days ago and **discharged with the wrong antibiotic** (Bactrim — she's allergic to sulfa)
- Allergy wasn't in the system properly
- She came back 2 days later when oral antibiotics failed
- Now 3 days into IV Ciprofloxacin but still deteriorating
- Nursing notes show subtle signs that **weren't escalated**

---

## Demo Environment Setup

### Screen Layout (Single Monitor)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Sentinelle                   ICU Bed 4: Margaret Chen, 67F       [LIVE]   │
├────────────────────────────────────┬────────────────────────────────────────┤
│                                    │                                        │
│  VITALS                            │  REASONING                             │
│  ┌────────┐ ┌────────┐ ┌────────┐ │                                        │
│  │   HR   │ │   BP   │ │  Temp  │ │  [Reasoning steps will appear here]   │
│  │   78   │ │ 128/78 │ │  37.2  │ │                                        │
│  └────────┘ └────────┘ └────────┘ │                                        │
│  ┌────────┐ ┌────────┐            │                                        │
│  │  SpO2  │ │   RR   │            │                                        │
│  │   97%  │ │   16   │            │                                        │
│  └────────┘ └────────┘            │                                        │
│                                    │                                        │
│  [VITALS CHART - 30 min window]   │                                        │
│                                    │                                        │
│  PATIENT CONTEXT                   │                                        │
│  • UTI (current admission)         │                                        │
│  • Breast cancer (remission)       │                                        │
│  • Neutropenic (ANC 1.2)           │                                        │
│  • Procalcitonin: 1.8 (CRITICAL)  │                                        │
│  • Prior ER visit: Wrong antibiotic│                                        │
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
- Patient context visible with risk factors

---

### ACT 2: ARCHITECTURE FLASH (0:25 - 0:45)

**Presenter speaks (quick cut to architecture slide or overlay):**

> "Sentinelle is built on four sponsor tools:"
>
> "Yutori scrapes the web for the latest clinical guidelines."
> "TinyFish automates documentation in the EHR."  
> "Macroscope keeps our code quality high during development."
> "And Retool powers the nurse command center."
>
> "Combined with Gemini for clinical reasoning. Let me show you what it does."

**Visual state:**
- Brief architecture diagram (5-10 seconds max)
- OR: Keep main UI but highlight tool logos in corner
- Transition back to main demo view

---

### ACT 3: DETERIORATION BEGINS (0:45 - 1:15)

**Presenter speaks (vitals start changing):**

> "Meet Margaret Chen. She's 67, fighting breast cancer, and her immune system is compromised from chemo."
>
> "She came to the ER five days ago with a UTI. They gave her Bactrim — but she's allergic to sulfa. That allergy wasn't in the system."
>
> "She came back two days later, and now she's been here three days on IV antibiotics. Her vitals look fine... for now."

**[TRIGGER: Start deterioration sequence]**

> "But watch what happens over the next 90 seconds..."

**Visual state:**
- Vital cards animate value changes smoothly
- Colors transition: green → yellow → orange → red
- Trend arrows appear showing direction
- Chart lines trending in concerning directions
- At ~40s: HR 98, BP 112/68, Temp 38.1°C

**Presenter speaks:**

> "See that? The nursing notes from 2 AM mentioned a low-grade fever. It wasn't escalated — hospital protocol says don't call for temps under 38. But Sentinelle sees the whole pattern."

---

### ACT 4: THE AGENT AWAKENS (1:15 - 2:15)

**[TRIGGER: Agent activation - vitals cross critical thresholds]**

**Presenter speaks:**

> "And now... watch Sentinelle think."

**(Then STAY QUIET — let judges read the streaming text)**

**Visual state — Reasoning panel comes alive:**

**Step 1: Observe (appears at 1:18)**
```
[Activity icon] Critical vital signs detected
               HR: 116 bpm (↑38 from baseline), BP: 88/56 mmHg (↓40),
               Temp: 39.1°C, SpO2: 93%, RR: 24/min
```

**Step 2: Think (appears at 1:24)**
```
[Brain icon] Pattern analysis initiated
             Multi-system deterioration: compensatory tachycardia with
             concurrent hypotension suggests early distributive shock.
             Fever trajectory indicates acute inflammatory response.
```

**Step 3: Search (appears at 1:32)**
```
[Search icon] Retrieving comprehensive patient context
              └─ [Check] HIGH RISK: Immunocompromised (neutropenia, ANC 1.2)
              └─ [Check] Prior ER visit: Discharged with wrong antibiotic
              └─ [Check] CRITICAL: Procalcitonin 1.8 (normal <0.1)
              └─ [Check] Nursing notes: Subtle warnings not escalated
              └─ [Check] CKD Stage 3, diabetes, indwelling catheter
```

**Step 4: Calculate (appears at 1:42)**
```
[Calculator icon] Computing clinical risk scores
                  └─ [Check] qSOFA Score: 3/3 — MAXIMUM RISK
                  └─ [Check] NEWS2 Score: 11 — CRITICAL
                  └─ [Check] SOFA Score: 4+ — Organ dysfunction confirmed
```

**Step 5: Think (appears at 1:50)**
```
[Brain icon] Clinical synthesis
             DIAGNOSIS: Early septic shock secondary to UTI in
             immunocompromised host. Mortality risk without
             intervention: 30-40% per hour delay.
```

**Step 6: Decide (appears at 1:56)**
```
[GitBranch icon] AUTONOMOUS RESPONSE ACTIVATED
                 Confidence: 97%. Initiating Sepsis Hour-1 Bundle.
                 This is a time-critical emergency.
```

**Step 7: Actions (appears at 2:00, children appear sequentially)**
```
[Zap icon] Executing parallel emergency response
           └─ [Bell] PRIORITY 1: Dr. Sarah Chen paged (555-0147)
                     Rapid Response Team activated
           └─ [Bell] Bedside alert to RN Patricia Williams
                     Actionable checklist: Blood cultures, fluid bolus ready
           └─ [FileText] Sepsis Hour-1 Bundle generated
                     Meropenem 1g IV (adjusted for CKD, penicillin allergy noted)
           └─ [Clock] Escalation armed: 5 min physician, 10 min action
                     ICU bed reservation initiated
```

**[ALERT TOAST APPEARS - top right, slides in]**
```
┌─────────────────────────────────────────────────────┐
│ [AlertTriangle] SEPTIC SHOCK — IMMEDIATE RESPONSE   │
│                                                     │
│ Patient: Margaret Chen (ICU Bed 4)                  │
│ qSOFA: 3/3  •  NEWS2: 11  •  Confidence: 97%       │
│                                                     │
│ [Acknowledge]                           12:34 PM    │
└─────────────────────────────────────────────────────┘
```

**Presenter speaks:**
> "In 4.2 seconds, Sentinelle detected septic shock, found the ER mishap in her history, alerted the entire care team, ordered the right antibiotic — paged Dr. Chen, and started the sepsis protocol."

---

### ACT 5: THE RESPONSE (2:15 - 2:35)

**Presenter speaks:**

> "Now let's see the nurse's view."

**[SWITCH TO RETOOL DASHBOARD - or show split screen]**

**Visual state:**
- Alert visible in queue, highlighted red
- Patient row shows critical status
- Acknowledge button prominent
- Care team response timestamps visible

**Presenter speaks:**

> "Charge Nurse Martinez sees the alert, reviews the AI's reasoning — including that ER visit five days ago — and acknowledges."

**[CLICK ACKNOWLEDGE]**

**Visual state:**
- Alert dismissed
- Reasoning panel updates: "Response received. Margaret Chen entered sepsis protocol."
- Summary appears: "5 actions taken in 4.2 seconds"

---

### ACT 6: OBSERVABILITY (2:35 - 2:45)

**Presenter speaks:**

> "And because this is healthcare, every decision is fully auditable."

**[CLICK ON A REASONING STEP TO EXPAND TRACE]**

**Visual state:**
- Built-in trace view expands
- Shows: inputs (vitals, labs), reasoning chain, outputs (actions)
- Timestamps for compliance
- Full audit trail visible

**Presenter speaks:**

> "Our built-in trace viewer captures every decision. No black boxes. Every step is explainable."

---

### ACT 7: THE CLOSE (2:45 - 3:00)

**[RETURN TO MAIN VIEW - now showing stabilized/acknowledged state]**

**Presenter speaks:**

> "The nursing notes mentioned Margaret felt 'a little off' at 10 PM. By 2 AM she had a low-grade fever. By 9 AM she was in early septic shock."
>
> "Sentinelle caught what humans missed. Not because nurses aren't good at their jobs — they're heroes. But because one person can't see every pattern across every patient."
>
> "270,000 deaths a year. Every hour matters. Sentinelle buys that hour back."
>
> "Questions?"

**Final visual state:**
- Reasoning panel showing completed sequence
- Action summary: "5 actions taken in 4.2 seconds"
- Vitals now stable (post-intervention)
- Overall feeling: calm, resolved, life saved

---

## Visual Polish Requirements

### Animations That Must Work Perfectly

1. **Vital value changes** — Smooth number transitions, not jumps
2. **Vital card color changes** — Fade between green/yellow/orange/red
3. **Reasoning step entry** — Slide in from left with fade
4. **Text streaming** — Character by character with cursor
5. **Child step expansion** — Smooth height animation
6. **Alert toast entry** — Slide from right, urgent but not jarring
7. **Status badge updates** — Cross-fade between states

### Timing Precision

| Event | Timestamp | Tolerance |
|-------|-----------|-----------|
| Deterioration starts | 0:45 | ±2s |
| Threshold crossed | 1:15 | ±2s |
| First reasoning step | 1:18 | ±1s |
| Actions complete | 2:05 | ±3s |
| **Total reasoning time** | **4.2s** | Display this exact number |

### Colors at Key Moments

| Moment | HR Color | BP Color | Temp Color | SpO2 Color |
|--------|----------|----------|------------|------------|
| Baseline | Normal (teal) | Normal | Normal | Normal |
| Early deterioration | Warning (gold) | Normal | Warning | Normal |
| Threshold crossed | Critical (red) | Critical | Critical | Warning |
| Post-alert | Critical | Critical | Critical | Critical |

---

## Fallback Plans

### If demo crashes:
- Have video recording ready as backup
- Smooth transition: "Let me show you a recording of the full sequence..."

### If timing is off:
- Have manual triggers for each phase
- Presenter controls pacing with keyboard shortcuts

### If Retool doesn't load:
- Skip the dashboard section
- Focus on the reasoning panel (the star of the show)
- Mention: "The Retool command center lets nurses respond in real-time"

### If network issues:
- Run entirely locally with mocked API responses
- All demo data is local/embedded — no external calls required for demo

---

## Presenter Notes

### Energy and Pacing
- Start with **gravity** (the deaths statistic)
- Build **tension** ("But watch what happens...")
- **Stay quiet** during the reasoning sequence — let judges read
- End with **purpose and humanity** (nurses are heroes)

### Key Phrases to Hit
- "Every two minutes, someone dies"
- "That allergy wasn't in the system"
- "Watch Sentinelle think" (then GO SILENT)
- "97% confidence"
- "4.2 seconds"
- "Caught what humans missed"
- "Buys that hour back"

### What NOT to Do
- ❌ Don't read the reasoning steps aloud (let judges read)
- ❌ Don't explain implementation details during demo
- ❌ Don't apologize for anything
- ❌ Don't rush the reasoning sequence (it's the money shot)
- ❌ Don't overshadow the UI with talking

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
  'T': 'Toggle trace view',
  'F': 'Toggle fullscreen',
}
```

---

## Post-Demo Q&A Prep

### Likely Questions

**"How does it integrate with real EHRs?"**
> "For the hackathon, we're using simulated data. Production integration would use HL7 FHIR APIs, which most modern EHR systems support. The sponsor tools — Yutori and TinyFish — would handle the actual data extraction and form filling."

**"What about false positives?"**
> "The scoring systems we use — qSOFA, NEWS2, and SOFA — are clinically validated with decades of research. Our confidence threshold is tunable per institution. And the full observability layer means every alert can be reviewed and audited."

**"Which sponsor tools did you use?"**
> "All four: Yutori for web scraping clinical guidelines, TinyFish/Mino for automating EHR documentation, Macroscope for code review during development, and Retool for the nurse command center. Clinical reasoning is powered by Anthropic (actuallyGemini) API."

**"Why did you pick sepsis?"**
> "Sepsis is the perfect use case for autonomous AI because every minute matters. The mortality rate increases 8% per hour of delayed treatment. An AI that can act in 4 seconds instead of waiting 20-30 minutes for a human to notice the pattern — that's lives saved."

**"Could this work for other conditions?"**
> "Absolutely. The architecture is condition-agnostic. The same approach works for cardiac events, respiratory failure, stroke — any time-sensitive deterioration pattern. We focused on sepsis because it's the leading cause of preventable hospital deaths."

**"What happens if the AI is wrong?"**
> "Every action requires human acknowledgment. We don't give the patient medication autonomously — we prepare everything and page the team. The nurse or physician makes the final call. And the full audit trail means we can review any decision."
