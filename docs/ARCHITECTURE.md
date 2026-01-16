# Sentinelle— Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SentinellePLATFORM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐     ┌─────────────────────────────────────────────────┐  │
│   │   VITALS    │     │              REASONING ENGINE                   │  │
│   │   STREAM    │────▶│            (Claude/OpenAI API)                  │  │
│   │  (Simulated)│     │                                                 │  │
│   └─────────────┘     │  ┌─────────┐  ┌─────────┐  ┌─────────┐        │  │
│                       │  │ DETECT  │─▶│ REASON  │─▶│   ACT   │        │  │
│                       │  └─────────┘  └─────────┘  └─────────┘        │  │
│                       └─────────────────────────────────────────────────┘  │
│                                          │                                  │
│   ┌──────────────────────────────────────┼──────────────────────────────┐  │
│   │                    WEB DATA LAYER    │                              │  │
│   │                                      ▼                              │  │
│   │  ┌─────────────────┐    ┌─────────────────────┐                   │  │
│   │  │     Yutori      │    │   TinyFish (Mino)   │                   │  │
│   │  │                 │    │                     │                   │  │
│   │  │ • Research API  │    │ • Form filling      │                   │  │
│   │  │   (guidelines)  │    │ • Data extraction   │                   │  │
│   │  │ • Browsing API  │    │ • EHR automation    │                   │  │
│   │  │   (web scraping)│    │                     │                   │  │
│   │  └─────────────────┘    └─────────────────────┘                   │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                          │                                  │
│                                          ▼                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                        FRONTEND (React)                             │  │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │  │
│   │  │    VITALS    │  │  REASONING   │  │      PATIENT INFO        │  │  │
│   │  │    PANEL     │  │    PANEL     │  │         PANEL            │  │  │
│   │  │              │  │ (streaming   │  │                          │  │  │
│   │  │              │  │  text + our  │  │                          │  │  │
│   │  │              │  │ observability│  │                          │  │  │
│   │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                     COMMAND CENTER (Retool)                         │  │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │  │
│   │  │  UNIT VIEW   │  │ ALERT QUEUE  │  │     ADMIN PANEL          │  │  │
│   │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                   DEVELOPMENT (Macroscope)                          │  │
│   │  Code review • PR summaries • Bug detection (NOT runtime tracing)   │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### 1. Data Layer

#### Vitals Simulator
Generates realistic patient vital sign data with configurable deterioration patterns.

```typescript
// services/vitalsSimulator.ts

interface VitalSign {
  timestamp: number;
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  temperature: number;
  spO2: number;
  respiratoryRate: number;
}

interface PatientScenario {
  id: string;
  name: string;
  baseline: VitalSign;
  deteriorationCurve: DeteriorationConfig;
  context: PatientContext;
}
```

#### Patient Context Store
Maintains patient information for clinical reasoning.

```typescript
// types/patient.ts

interface PatientContext {
  id: string;
  demographics: {
    age: number;
    sex: 'M' | 'F';
    weight: number;
  };
  diagnoses: Diagnosis[];
  medications: Medication[];
  allergies: string[];
  recentLabs: LabResult[];
  riskFactors: string[];
}
```

---

### 2. Web Data Layer (Yutori + TinyFish/Mino)

> **IMPORTANT:** Yutori and TinyFish are for WEB SCRAPING and WEB AUTOMATION, not agent orchestration or LLM reasoning. Our reasoning engine is built with Claude/OpenAI APIs.

#### Yutori Integration — Web Research & Scraping

Yutori provides 4 APIs for reliable web data extraction:

| API | Purpose | SentinelleUse Case |
|-----|---------|-------------------|
| **Research API** | Deep web research using 100+ MCP tools | Pull latest sepsis treatment guidelines |
| **Browsing API** | Natural language browser automation | Extract patient data from hospital portals |
| **Scouting API** | Continuous web monitoring | Monitor for guideline updates |
| **n1 API** | Pixels-to-actions model | Low-level browser control |

```typescript
// services/yutoriService.ts

interface YutoriResearchTask {
  query: string;  // Natural language research query
}

interface YutoriBrowsingTask {
  task: string;       // Natural language task description
  start_url: string;  // Starting URL
  require_auth?: boolean;  // For auth-heavy flows
}

// Research clinical guidelines
async function researchGuidelines(condition: string): Promise<ResearchResult> {
  const response = await fetch('https://api.yutori.com/v1/research/tasks', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.YUTORI_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `Latest ${condition} treatment protocols and clinical guidelines 2025`,
    }),
  });
  return response.json();
}

// Extract data from hospital portal
async function extractPatientData(patientId: string, portalUrl: string): Promise<BrowsingResult> {
  const response = await fetch('https://api.yutori.com/v1/browsing/tasks', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.YUTORI_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      task: `Retrieve all lab results and medical history for patient ID ${patientId}`,
      start_url: portalUrl,
      require_auth: true,
    }),
  });
  return response.json();
}
```

#### TinyFish/Mino Integration — Form Filling & Automation

Mino turns natural language into browser actions for:
- Auto-filling EHR documentation
- Extracting structured data from web systems
- Automating repetitive clinical workflows

```typescript
// services/minoService.ts

interface MinoAutomationRequest {
  url: string;    // Target URL
  goal: string;   // Natural language goal
}

// Auto-fill clinical documentation
async function fillClinicalNote(
  patientData: PatientContext,
  clinicalNote: string
): Promise<AutomationResult> {
  const response = await fetch('https://mino.ai/v1/automation/run-sse', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.MINO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: 'https://hospital-ehr.example.com/documentation',
      goal: `Fill clinical documentation form:
             Patient: ${patientData.name} (ID: ${patientData.id})
             Assessment: ${clinicalNote}
             Vitals: HR ${patientData.vitals.hr}, BP ${patientData.vitals.bp}`,
    }),
  });
  return response.json();
}

// Extract lab results as structured JSON
async function extractLabResults(labSystemUrl: string, patientId: string): Promise<LabResult[]> {
  const response = await fetch('https://mino.ai/v1/automation/run-sse', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.MINO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: `${labSystemUrl}/patient/${patientId}`,
      goal: 'Extract all lab results. Return JSON: test_name, value, unit, reference_range, flag',
    }),
  });
  return response.json().then(r => r.resultJson.labs);
}
```

#### Reasoning Engine (Gemini API — NOT a sponsor tool)

The clinical reasoning is powered by Google's Gemini API, not by the sponsor tools:

```typescript
// services/reasoningEngine.ts
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY });

interface ReasoningRequest {
  vitals: VitalSign;
  patientContext: PatientContext;
  historicalVitals: VitalSign[];
  clinicalGuidelines?: string;  // From Yutori Research API
}

interface ReasoningResponse {
  assessment: string;
  confidence: number;
  contributingFactors: string[];
  recommendedActions: Action[];
  reasoning_trace: ReasoningStep[];  // For our UI observability
}

// This is where the actual clinical reasoning happens
async function analyzePatient(request: ReasoningRequest): Promise<ReasoningResponse> {
  // Stream for real-time reasoning panel
  const response = await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: buildClinicalPrompt(request),
  });

  // Process streaming chunks for UI
  for await (const chunk of response) {
    emitReasoningStep(chunk.text);  // Send to reasoning panel
  }
  
  return parseReasoningResponse(response);
}
```

---

### 3. Observability Layer (Built into React UI)

> **CRITICAL:** Macroscope is a CODE REVIEW tool for development, NOT runtime observability. 
> Our observability is the REASONING PANEL in the React UI — streaming text showing the AI's thinking process.

#### Built-in Trace Viewer

The "observability" judges will see is our custom React trace viewer:

```typescript
// types/trace.ts

interface ReasoningStep {
  id: string;
  type: StepType;
  content: string;
  children?: ReasoningStep[];
  status: 'pending' | 'in_progress' | 'complete' | 'error';
  timestamp: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

interface Trace {
  traceId: string;
  patientId: string;
  startTime: number;
  endTime?: number;
  steps: ReasoningStep[];
  outcome: 'alert_sent' | 'no_action' | 'error';
}
```

```typescript
// stores/traceStore.ts

interface TraceStore {
  currentTrace: Trace | null;
  traceHistory: Trace[];
  
  startTrace: (patientId: string) => string;  // Returns traceId
  addStep: (step: ReasoningStep) => void;
  updateStep: (stepId: string, updates: Partial<ReasoningStep>) => void;
  endTrace: (outcome: TraceOutcome) => void;
  getTrace: (traceId: string) => Trace | null;
}
```

#### Macroscope (Development Tool Only)

Macroscope helps during DEVELOPMENT, not runtime:

- **PR Descriptions:** Auto-generated summaries for pull requests
- **Code Review:** AI-powered bug detection in PRs
- **Codebase Q&A:** "Where is the vital sign processing logic?"
- **Commit Summaries:** Track what changed across the repo

Setup: Install the Macroscope GitHub App on your repo at https://app.macroscope.com
```

---

### 4. Presentation Layer (React)

#### State Management

```typescript
// stores/sentinelStore.ts

interface SentinelState {
  // Patient data
  currentPatient: PatientContext | null;
  vitals: VitalSign[];
  
  // Reasoning state
  reasoningSteps: ReasoningStep[];
  isAgentActive: boolean;
  currentTraceId: string | null;
  
  // Alert state
  activeAlerts: Alert[];
  alertHistory: Alert[];
  
  // UI state
  selectedStepId: string | null;
  isTraceExpanded: boolean;
  
  // Actions
  addVital: (vital: VitalSign) => void;
  addReasoningStep: (step: ReasoningStep) => void;
  updateStepStatus: (id: string, status: StepStatus) => void;
  acknowledgeAlert: (alertId: string) => void;
  reset: () => void;
}
```

#### Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── PatientSelector
│   └── StatusIndicator
│
├── MainLayout
│   ├── VitalsPanel
│   │   ├── VitalCard (x5)
│   │   │   ├── VitalValue
│   │   │   ├── VitalTrend
│   │   │   └── ThresholdIndicator
│   │   └── VitalsChart
│   │       └── TimeSeriesLine (x5)
│   │
│   ├── ReasoningPanel
│   │   ├── ReasoningHeader
│   │   │   ├── StatusBadge
│   │   │   └── TraceLink
│   │   ├── ReasoningStepList
│   │   │   └── ReasoningStep (recursive)
│   │   │       ├── StepIcon
│   │   │       ├── StepContent
│   │   │       ├── StepTimestamp
│   │   │       ├── StepStatus
│   │   │       └── StepChildren
│   │   └── ReasoningFooter
│   │       └── ActionSummary
│   │
│   └── ContextPanel
│       ├── PatientInfo
│       ├── DiagnosesList
│       ├── MedicationsList
│       └── RecentLabs
│
├── AlertOverlay
│   └── AlertToast
│       ├── AlertIcon
│       ├── AlertContent
│       └── AlertActions
│
└── TraceModal (Built-in)
    ├── TraceTimeline
    ├── StepDetails
    └── RawDataView
```

---

### 5. Integration Layer (Retool)

#### Dashboard Specifications

**Command Center Dashboard**
```
Components:
- Table: Patient list with status
- List: Alert queue (sorted by severity)
- Container: Selected patient detail
- Button Group: Response actions
- Stats: Unit summary metrics

Data Sources:
- REST API: /api/patients
- REST API: /api/alerts
- WebSocket: /ws/vitals

Actions:
- acknowledgeAlert(alertId)
- escalateAlert(alertId)
- dismissAlert(alertId, reason)
```

**Admin Dashboard**
```
Components:
- Form: Threshold configuration
- Table: Audit log
- Chart: Alert volume over time
- Toggle: Feature flags

Data Sources:
- REST API: /api/config
- REST API: /api/audit

Actions:
- updateThresholds(config)
- exportAuditLog(dateRange)
```

---

## Data Flow

### Normal Monitoring Flow

```
1. VitalsSimulator generates data (every 1s)
         │
         ▼
2. Data pushed to frontend via WebSocket
         │
         ▼
3. VitalsPanel updates display
         │
         ▼
4. ReasoningPanel shows "Monitoring..."
```

### Deterioration Detection Flow

```
1. Vitals cross threshold
         │
         ▼
2. Reasoning Engine (Claude API) triggered
         │
         ├──────────────────────────────────────┐
         ▼                                      ▼
3. Frontend receives              4. Yutori Research API pulls
   reasoning steps                   latest treatment guidelines
         │                                 │
         │    ┌────────────────────────────┘
         │    │
         ▼    ▼
5. ReasoningPanel renders         6. TinyFish/Mino extracts
   steps with streaming text         patient history from portal
         │                                 │
         │    ┌────────────────────────────┘
         ▼    ▼
7. Actions executed               8. TinyFish/Mino auto-fills
   (alerts, recommendations)         clinical documentation
         │
         ▼
9. Retool dashboard updated
         │
         ▼
10. Nurse acknowledges
         │
         ▼
11. Agent stands down
```

---

## API Specifications

### REST Endpoints

```typescript
// Patient APIs
GET    /api/patients              // List all patients
GET    /api/patients/:id          // Get patient details
GET    /api/patients/:id/vitals   // Get vital history
GET    /api/patients/:id/context  // Get clinical context

// Alert APIs
GET    /api/alerts                // List active alerts
POST   /api/alerts/:id/ack        // Acknowledge alert
POST   /api/alerts/:id/escalate   // Escalate alert
POST   /api/alerts/:id/dismiss    // Dismiss alert

// Config APIs
GET    /api/config                // Get current config
PUT    /api/config                // Update config
GET    /api/audit                 // Get audit log

// Trace APIs (built-in)
GET    /api/traces/:id            // Get trace details
GET    /api/traces                // Query traces
```

### WebSocket Events

```typescript
// Client -> Server
interface ClientMessage {
  type: 'subscribe' | 'unsubscribe' | 'ack_alert';
  payload: unknown;
}

// Server -> Client
interface ServerMessage {
  type: 'vital_update' | 'reasoning_step' | 'alert' | 'status_change';
  payload: unknown;
  timestamp: number;
}
```

---

## Deployment Architecture

### Development (Hackathon)

```
┌─────────────────────────────────────────┐
│           Local Development             │
│                                         │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │   Vite      │  │   Mock APIs     │  │
│  │   (React)   │  │   (Express)     │  │
│  └─────────────┘  └─────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │    Simulated Vitals Stream      │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│        External Services                │
│                                         │
│  ┌────────────────────────────────────┐│
│  │  Yutori (Web Scraping/Research)    ││
│  │  • Research API: Pull guidelines   ││
│  │  • Browsing API: Extract data      ││
│  └────────────────────────────────────┘│
│                                         │
│  ┌────────────────────────────────────┐│
│  │  TinyFish/Mino (Web Automation)    ││
│  │  • Form filling for EHR            ││
│  │  • Data extraction                 ││
│  └────────────────────────────────────┘│
│                                         │
│  ┌────────────────────────────────────┐│
│  │  Retool (Dashboard Builder)        ││
│  │  • Nurse command center            ││
│  │  • Admin panel                     ││
│  └────────────────────────────────────┘│
│                                         │
│  ┌────────────────────────────────────┐│
│  │  Macroscope (Dev Tool Only)        ││
│  │  • Code review on PRs              ││
│  │  • Bug detection                   ││
│  └────────────────────────────────────┘│
│                                         │
│  ┌────────────────────────────────────┐│
│  │  Claude/OpenAI API (Reasoning)     ││
│  │  • Clinical decision making        ││
│  │  • Risk assessment                 ││
│  └────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

---

## Security Considerations

### Data Handling
- All patient data is synthetic/simulated
- No PHI (Protected Health Information) in demo
- API keys stored in environment variables
- HTTPS for all external communications

### Access Control
- Role-based access in Retool dashboards
- Audit logging for all actions
- Session management for demo users

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Vital update latency | <100ms | WebSocket round-trip |
| Reasoning step render | <50ms | Time to paint |
| Full chain completion | <5s | Trigger to final action |
| UI frame rate | 60fps | During animations |
| Initial load | <2s | First contentful paint |
