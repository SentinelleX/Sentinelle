# SENTINEL — Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SENTINEL PLATFORM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐     ┌─────────────────────────────────────────────────┐  │
│   │   VITALS    │     │              AGENT ORCHESTRATION                │  │
│   │   STREAM    │────▶│                  (Yutori)                       │  │
│   │  (Simulated)│     │                                                 │  │
│   └─────────────┘     │  ┌─────────┐  ┌─────────┐  ┌─────────┐        │  │
│                       │  │ DETECT  │─▶│ REASON  │─▶│   ACT   │        │  │
│                       │  └─────────┘  └─────────┘  └─────────┘        │  │
│                       │       │            │            │              │  │
│                       │       ▼            ▼            ▼              │  │
│                       │  ┌─────────────────────────────────────────┐  │  │
│                       │  │         OBSERVABILITY (Macroscope)      │  │  │
│                       │  └─────────────────────────────────────────┘  │  │
│                       └─────────────────────────────────────────────────┘  │
│                                          │                                  │
│                                          ▼                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                        FRONTEND (React)                             │  │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │  │
│   │  │    VITALS    │  │  REASONING   │  │      PATIENT INFO        │  │  │
│   │  │    PANEL     │  │    PANEL     │  │         PANEL            │  │  │
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

### 2. Agent Layer (Yutori Integration)

#### Agent Workflow Definition

```yaml
# yutori/sepsis-detection-workflow.yaml

name: sepsis-detection-agent
description: Autonomous sepsis detection and response workflow

triggers:
  - type: vital_threshold
    conditions:
      - hr > 100 OR hr < 50
      - sbp < 100
      - temp > 38.3 OR temp < 36
      - spo2 < 95
      - rr > 22

steps:
  - id: observe
    action: receive_vitals
    output: current_vitals

  - id: detect
    action: analyze_trends
    input: current_vitals
    output: anomaly_detected

  - id: retrieve_context
    action: pull_patient_data
    condition: anomaly_detected == true
    output: patient_context

  - id: reason
    action: clinical_assessment
    agent: tinyfish
    input: 
      - current_vitals
      - patient_context
    output: clinical_reasoning

  - id: calculate_scores
    action: compute_risk_scores
    input: current_vitals
    output: risk_scores

  - id: decide
    action: determine_actions
    input:
      - clinical_reasoning
      - risk_scores
    output: action_plan

  - id: execute
    action: run_actions
    input: action_plan
    parallel: true
    sub_steps:
      - alert_team
      - generate_recommendations
      - document_event
      - set_escalation

  - id: monitor
    action: await_response
    timeout: 15m
    escalation: true
```

#### Reasoning Agent (TinyFish Integration)

```typescript
// services/reasoningAgent.ts

interface ReasoningRequest {
  vitals: VitalSign;
  patientContext: PatientContext;
  historicalVitals: VitalSign[];
}

interface ReasoningResponse {
  assessment: string;
  confidence: number;
  contributingFactors: string[];
  recommendedActions: Action[];
  reasoning_trace: ReasoningStep[];
}

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
```

---

### 3. Observability Layer (Macroscope Integration)

#### Trace Structure

```typescript
// services/observability.ts

interface Trace {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: number;
  endTime?: number;
  status: 'ok' | 'error';
  attributes: Record<string, unknown>;
  events: TraceEvent[];
}

interface TraceEvent {
  name: string;
  timestamp: number;
  attributes: Record<string, unknown>;
}

// Integration points
const macroscope = {
  startTrace: (name: string) => Trace,
  addSpan: (traceId: string, span: Span) => void,
  endTrace: (traceId: string, status: 'ok' | 'error') => void,
  getTrace: (traceId: string) => Trace,
  queryTraces: (filter: TraceFilter) => Trace[],
};
```

---

### 4. Presentation Layer (React)

#### State Management

```typescript
// stores/sentinelStore.ts

interface SentinelleState {
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
└── TraceModal (Macroscope)
    ├── TraceTimeline
    ├── SpanDetails
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
2. Yutori workflow triggered
         │
         ├──────────────────────────────────────┐
         ▼                                      ▼
3. Frontend receives              4. Macroscope trace started
   reasoning steps                        │
         │                                 │
         ▼                                 ▼
5. ReasoningPanel renders         6. Each step logged
   steps with animation                   │
         │                                 │
         ▼                                 ▼
7. Actions executed               8. Trace completed
   (alerts, docs, etc.)
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

// Trace APIs (Macroscope proxy)
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
│  ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │  Yutori  │ │ TinyFish │ │Retool  │  │
│  └──────────┘ └──────────┘ └────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │          Macroscope              │  │
│  └──────────────────────────────────┘  │
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
