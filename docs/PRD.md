# Sentinelle— Product Requirements Document

## Executive Summary

Sentinelleis an autonomous clinical intelligence platform that monitors patient vitals in real-time, detects early signs of clinical deterioration (specifically sepsis), and takes immediate autonomous action. The core differentiator is a transparent reasoning interface that visualizes the AI's decision-making process in real-time.

---

## Problem Statement

- 270,000 Americans die from sepsis annually
- Every hour of delayed treatment increases mortality by 8%
- Early warning signs get buried in the noise of busy clinical environments
- Current monitoring systems generate alerts but don't take action
- AI decision-making in healthcare lacks transparency and trust

---

## Solution

An autonomous agent system that:
1. Continuously monitors patient vital signs
2. Detects early deterioration patterns
3. Reasons through clinical context transparently
4. Takes autonomous actions (alerts, documentation, recommendations)
5. Provides full observability into every decision

---

## Target Users

| User | Role | Primary Interface |
|------|------|-------------------|
| ICU Nurse | Responds to alerts, acknowledges actions | Mobile/Tablet view |
| Charge Nurse | Oversees unit, manages escalations | Command center dashboard |
| Physician | Reviews recommendations, approves interventions | Detailed patient view |
| Hospital Admin | Configures thresholds, audits decisions | Admin/Governance panel |

---

## Core Features

### 1. Real-Time Vital Sign Monitoring

**Description:** Continuous ingestion and visualization of patient vital signs.

**Requirements:**
- Display heart rate, blood pressure, temperature, SpO2, respiratory rate
- Real-time line charts with 30-minute rolling window
- Color-coded threshold indicators (normal, warning, critical)
- Smooth animations for value changes
- Support for multiple patients simultaneously

**Data Points:**
- Heart Rate (HR): bpm
- Blood Pressure (BP): systolic/diastolic mmHg
- Temperature (Temp): °C
- Oxygen Saturation (SpO2): %
- Respiratory Rate (RR): breaths/min
- Lactate: mmol/L (when available)

---

### 2. Reasoning Panel (Primary Feature)

**Description:** Real-time visualization of the AI agent's decision-making process. This is the core demo feature and primary differentiator.

**Requirements:**
- Streaming text display with typewriter effect
- Hierarchical step structure (parent steps with child details)
- Step status indicators (pending, in-progress, complete, error)
- Expandable/collapsible step details
- Timestamps for each step
- Lucide icons for each step type
- Smooth enter/exit animations
- Auto-scroll to latest step with manual scroll override

**Step Types:**
| Type | Icon (Lucide) | Description |
|------|---------------|-------------|
| observe | `activity` | New data received |
| think | `brain` | Analyzing/reasoning |
| search | `search` | Retrieving context |
| calculate | `calculator` | Computing scores |
| decide | `git-branch` | Making decision |
| action | `zap` | Executing action |
| alert | `bell` | Sending notification |
| document | `file-text` | Creating documentation |
| wait | `clock` | Waiting/monitoring |
| success | `check-circle` | Step completed |
| error | `x-circle` | Step failed |
| escalate | `arrow-up-circle` | Escalating issue |

**Animation Specifications:**
- Step entry: fade in + slide from left (200ms, ease-out)
- Text streaming: 30ms per character
- Status change: cross-fade (150ms)
- Expand/collapse: height animation (250ms, ease-in-out)

---

### 3. Autonomous Action Engine

**Description:** System that executes clinical actions without human intervention.

**Actions:**
| Action | Trigger | Output |
|--------|---------|--------|
| Alert Care Team | Risk score exceeds threshold | Push notification to assigned staff |
| Pull Patient Context | Anomaly detected | Retrieve history, meds, allergies, recent labs |
| Calculate Risk Scores | Context retrieved | qSOFA, NEWS2, custom ML prediction |
| Generate Recommendations | High risk confirmed | Sepsis bundle protocol steps |
| Document Event | Actions complete | Clinical note in EHR format |
| Set Escalation Timer | Alert sent | Countdown for response, escalate if no ack |

---

### 4. Clinical Scoring

**Description:** Validated clinical scoring systems for sepsis risk assessment.

**Scores Implemented:**
- **qSOFA (Quick SOFA):** Respiratory rate ≥22, altered mentation, systolic BP ≤100
- **NEWS2 (National Early Warning Score 2):** Comprehensive vital sign scoring
- **Custom Risk Model:** ML-based prediction using vital trends

**Display Requirements:**
- Numerical score with max value (e.g., "2/3")
- Risk category label (Low, Medium, High, Critical)
- Color coding consistent with severity
- Breakdown of contributing factors

---

### 5. Command Center Dashboard (Retool)

**Description:** Central interface for clinical staff to monitor all patients and respond to alerts.

**Views:**
1. **Unit Overview:** All patients in grid/list with status indicators
2. **Alert Queue:** Prioritized list of active alerts requiring response
3. **Patient Detail:** Deep dive into single patient with full history
4. **Response Panel:** Actions available (acknowledge, dismiss, escalate)

**Requirements:**
- Real-time updates without page refresh
- Mobile-responsive for bedside tablets
- Role-based access control
- Audit log of all actions taken

---

### 6. Observability Layer (Built-in React UI)

**Description:** Full tracing and debugging for every agent decision. This is built into the React frontend as the "Reasoning Panel" — NOT a separate tool.

> **Note:** Macroscope is a CODE REVIEW tool for development (PR summaries, bug detection), NOT runtime observability. Our observability is the Reasoning Panel itself.

**Requirements:**
- Trace ID for every reasoning chain
- Expandable view showing raw inputs/outputs
- Latency metrics for each step
- Error capture with stack traces
- Exportable audit logs for compliance

**Access Points:**
- Click any step in reasoning panel to view trace details
- Dedicated "Debug View" toggle for developers
- Admin panel for historical trace search

---

### 7. Governance & Configuration (Retool Admin)

**Description:** Administrative controls for hospital staff to configure system behavior.

**Configurable Parameters:**
- Alert thresholds per vital sign
- Escalation timing
- Staff notification preferences
- Enabled/disabled action types
- Risk score weights

**Audit Features:**
- Complete history of configuration changes
- Decision audit trail
- Compliance reporting

---

## Technical Requirements

### Sponsor Tool Integration

| Tool | Integration Point | Purpose |
|------|------------------|---------|
| **Yutori** | Web data extraction | Research API for pulling clinical guidelines; Browsing API for extracting patient data from hospital portals; quality web scraping with noise filtering |
| **TinyFish (Mino)** | Web automation | Form filling for EHR documentation; data extraction from legacy systems; natural language → browser actions |
| **Macroscope** | Development tool | Code review during development; PR summaries; bug detection (NOT runtime observability) |
| **Retool** | Dashboards | Command center for nurses; admin panel; governance interface |

> **IMPORTANT:** The "observability" in our demo is the REASONING PANEL we build in React (streaming text showing AI thinking). Macroscope is only for code review during development.

### Tech Stack

- **Frontend:** React 18+ with TypeScript
- **Styling:** Tailwind CSS with custom design tokens
- **State Management:** Zustand or React Context
- **Real-time:** WebSocket connections for vital streaming
- **Charts:** Recharts or similar for vital sign visualization
- **Icons:** Lucide React (NO emoji anywhere)
- **Fonts:** Crimson Pro (weights: 200, 300, 400)
- **Animation:** Framer Motion

### Performance Requirements

- Vital sign update latency: <100ms
- Reasoning step render: <50ms
- Full reasoning chain: <5 seconds
- Dashboard load time: <2 seconds
- Support 20+ simultaneous patient monitors

---

## Demo Scenario

### Setup
- Single patient view (ICU Bed 4)
- Patient: 67-year-old with recent UTI, immunocompromised
- Initial vitals: normal range

### Sequence (Timed for 3-minute demo)

**0:00-0:30 — Baseline**
- Vitals displaying normally
- Reasoning panel idle: "Monitoring... No anomalies detected"

**0:30-1:00 — Deterioration Begins**
- HR rises: 78 → 95 → 112
- BP drops: 120/80 → 100/70 → 88/60
- Temp rises: 37.0 → 38.2 → 38.9
- SpO2 drops: 98% → 96% → 94%

**1:00-2:00 — Agent Activates**
Reasoning panel comes alive:
1. "New vitals received" (observe)
2. "Detecting concerning trends" (think)
3. "Pulling patient context..." (search)
   - UTI diagnosis 3 days ago
   - Immunocompromised status
   - Lactate trending up
4. "Calculating risk scores" (calculate)
   - qSOFA: 2/3
   - NEWS2: 7 (High)
5. "Clinical picture suggests early sepsis" (think)
6. "Initiating autonomous response" (decide)

**2:00-2:30 — Autonomous Actions**
7. "Alerting care team" (action)
   - Dr. Chen notified
   - Charge nurse paged
8. "Generating recommendations" (action)
   - Sepsis bundle protocol
   - Blood cultures x2
   - Lactate level STAT
9. "Documenting in EHR" (document)
   - clinical_note.md created
10. "Setting escalation timer: 15 minutes" (wait)

**2:30-2:45 — Response**
- Alert appears on Retool dashboard
- Nurse acknowledges
- Reasoning panel: "Response received. Standing down."

**2:45-3:00 — Wrap**
- Show Macroscope trace (click to expand)
- Flash admin configuration panel
- End state: "Patient entered sepsis protocol in 4.2 seconds"

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Time from anomaly to action | <5 seconds |
| Reasoning chain visibility | 100% of steps shown |
| Alert acknowledgment tracking | Full audit trail |
| Demo "wow factor" | Judges understand immediately |

---

## Out of Scope (v1)

- Actual EHR integration (simulated)
- Real patient data (synthetic only)
- Multi-hospital deployment
- Regulatory compliance (FDA, HIPAA)
- Mobile native apps (web responsive only)

---

## File Structure

```
sentinel/
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── UI_SPEC.md
│   └── COMPONENTS.md
├── src/
│   ├── components/
│   │   ├── reasoning/
│   │   ├── vitals/
│   │   ├── alerts/
│   │   └── common/
│   ├── hooks/
│   ├── stores/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── data/
├── public/
└── retool/
    └── dashboards/
```

---

## References

- qSOFA Score: https://www.mdcalc.com/calc/2654/qsofa-quick-sofa-score-sepsis
- NEWS2: https://www.rcplondon.ac.uk/projects/outputs/national-early-warning-score-news-2
- Sepsis Bundle: https://www.sccm.org/SurvivingSepsisCampaign/Guidelines/Adult-Patients
