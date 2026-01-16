# Sentinelle— Sponsor Tool Setup Guide

> **IMPORTANT:** This document contains the CORRECT tool information based on official documentation.

---

## Tool Overview

| Tool | What It Does | Docs | Use in Sentinelle|
|------|--------------|------|-----------------|
| **Yutori** | Web scraping, research, browser automation | https://docs.yutori.com | Pull clinical data, research literature |
| **TinyFish (Mino)** | Web automation & form filling | https://docs.mino.ai | Auto-fill EHR docs, extract patient data |
| **Macroscope** | Code review, PR summaries | https://docs.macroscope.com | Development tool (NOT runtime) |
| **Retool** | Low-code dashboard builder | https://docs.retool.com | Nurse command center |

---

## 1. Yutori Setup

**Documentation:** https://docs.yutori.com

### APIs Available

| API | Purpose | Use Case |
|-----|---------|----------|
| **n1 API** | Pixels-to-actions LLM | Low-level browser control |
| **Browsing API** | Natural language browser automation | Navigate portals, fill forms |
| **Research API** | Deep web research (100+ MCP tools) | Pull latest sepsis guidelines |
| **Scouting API** | Continuous web monitoring | Monitor for protocol updates |

### Setup

```bash
# Get API key from https://docs.yutori.com/authentication
# Add to .env.local
VITE_YUTORI_API_KEY=your_key_here
```

### Example: Research Clinical Guidelines

```typescript
// POST https://api.yutori.com/v1/research/tasks
const response = await fetch('https://api.yutori.com/v1/research/tasks', {
  method: 'POST',
  headers: {
    'X-API-Key': process.env.VITE_YUTORI_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'Latest sepsis treatment protocols and Surviving Sepsis Campaign 2025 guidelines'
  }),
});
```

### Example: Browser Automation

```typescript
// POST https://api.yutori.com/v1/browsing/tasks
const response = await fetch('https://api.yutori.com/v1/browsing/tasks', {
  method: 'POST',
  headers: {
    'X-API-Key': process.env.VITE_YUTORI_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    task: 'Log into hospital EHR and retrieve lab results for patient ID 12345',
    start_url: 'https://hospital-ehr.example.com',
    require_auth: true
  }),
});

// Check status
const status = await fetch(`https://api.yutori.com/v1/browsing/tasks/${taskId}`, {
  headers: { 'X-API-Key': process.env.VITE_YUTORI_API_KEY }
});
```

---

## 2. TinyFish (Mino) Setup

**Documentation:** https://docs.mino.ai

### What Mino Does

- **Natural language → browser actions** (no CSS selectors needed)
- **Form filling** from plain English descriptions
- **Data extraction** with structured JSON output
- **Real-time streaming** via Server-Sent Events (SSE)
- **Stealth mode** for bot-protected sites

### Setup

```bash
# Get API key from https://mino.ai/api-keys
# Add to .env.local
VITE_MINO_API_KEY=your_key_here
```

### Example: Auto-fill EHR Documentation

```typescript
// POST https://mino.ai/v1/automation/run-sse
const response = await fetch('https://mino.ai/v1/automation/run-sse', {
  method: 'POST',
  headers: {
    'X-API-Key': process.env.VITE_MINO_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://hospital-ehr.example.com/documentation',
    goal: `Fill clinical note form with:
           Patient: John Doe (ID: 12345)
           Chief Complaint: Sepsis suspected
           Vitals: HR 112, BP 88/60, Temp 38.9°C, SpO2 94%
           Assessment: Early sepsis, qSOFA 2/3
           Plan: Initiate sepsis bundle per protocol`
  }),
});
```

### Example: Extract Patient Data

```typescript
const response = await fetch('https://mino.ai/v1/automation/run-sse', {
  method: 'POST',
  headers: {
    'X-API-Key': process.env.VITE_MINO_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://lab-results.example.com/patient/12345',
    goal: 'Extract all lab results. Return JSON with: test_name, value, unit, reference_range, abnormal_flag'
  }),
});

// Response:
// {
//   "type": "COMPLETE",
//   "status": "COMPLETED",  
//   "resultJson": {
//     "labs": [
//       { "test_name": "Lactate", "value": 2.8, "unit": "mmol/L", "reference_range": "0.5-2.0", "abnormal_flag": "HIGH" },
//       { "test_name": "WBC", "value": 14.2, "unit": "K/uL", "reference_range": "4.5-11.0", "abnormal_flag": "HIGH" }
//     ]
//   }
// }
```

### SSE Streaming for Real-Time Progress

```typescript
async function automateWithProgress(url: string, goal: string, onProgress: (event: any) => void) {
  const response = await fetch('https://mino.ai/v1/automation/run-sse', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.VITE_MINO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, goal }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const event = JSON.parse(decoder.decode(value));
    onProgress(event); // Show progress in UI
  }
}
```

---

## 3. Macroscope Setup

**Documentation:** https://docs.macroscope.com/welcome

### What Macroscope Actually Is

> ⚠️ **Macroscope is a CODE REVIEW tool, NOT runtime observability.**

Features:
- AI-powered code review on PRs
- Automatic PR descriptions
- Bug detection in pull requests
- "Ask Macroscope Anything" — natural language codebase queries
- Commit summaries
- Slack notifications for code activity

### Setup

1. Go to https://app.macroscope.com
2. Sign in with GitHub
3. Install the **Macroscope GitHub App** on your repo
4. (Optional) Connect Slack for notifications

### Use During Development

- Get AI reviews on your PRs
- Ask questions like "Where is the vital sign processing logic?"
- Track what's been committed this week
- Get notified in Slack when teammates push code

### NOT For Runtime

For the "watch the AI think" observability in SENTINEL, we build a custom trace viewer in React. Macroscope does NOT provide runtime agent tracing.

---

## 4. Retool Setup

**Documentation:** https://docs.retool.com

### What Retool Does

Retool is a **low-code dashboard builder**. Use the visual editor to build:
- Nurse command center
- Alert management interface
- Patient overview screens
- Admin configuration panels

### Setup

1. Go to https://retool.com
2. Sign up for free account
3. Create new app: "SentinelleCommand Center"

### Building the Dashboard

**Step 1: Add REST API Resource**
- Resources → Create New → REST API
- Name: `SentinelleBackend`
- Base URL: `http://localhost:3000/api`

**Step 2: Add Components**

| Component | Purpose |
|-----------|---------|
| **Table** | Patient list with status indicators |
| **Listview** | Alert queue sorted by severity |
| **Container** | Patient detail side panel |
| **Button** | Acknowledge, Escalate, Dismiss actions |
| **Statistic** | Metrics (active alerts count, etc.) |
| **Modal** | Detailed patient popup |

**Step 3: Create Queries**

```javascript
// getActiveAlerts
GET {{SENTINEL_Backend.baseUrl}}/alerts?status=active

// acknowledgeAlert  
POST {{SENTINEL_Backend.baseUrl}}/alerts/{{alertsTable.selectedRow.id}}/acknowledge
Body: { "userId": "{{current_user.id}}", "timestamp": "{{new Date().toISOString()}}" }

// getPatients
GET {{SENTINEL_Backend.baseUrl}}/patients?unit=icu

// getPatientDetails
GET {{SENTINEL_Backend.baseUrl}}/patients/{{patientsTable.selectedRow.id}}
```

**Step 4: Wire Up Events**
- Table row click → Update patient detail panel
- Acknowledge button onClick → Run acknowledgeAlert query → Refresh alerts

### Note on Retool API

The Retool REST API (`https://api.retool.com/api/v2/`) is for **managing your organization** (users, resources), NOT for the dashboards. It requires Business/Enterprise plans.

For the hackathon, focus on the **dashboard builder UI**.

---

## Environment Variables

```bash
# .env.local

# Yutori - Web research and browser automation
VITE_YUTORI_API_KEY=your_yutori_key

# TinyFish/Mino - Form filling and web automation  
VITE_MINO_API_KEY=your_mino_key

# Macroscope - Uses GitHub OAuth, no API key needed

# Retool - Uses web dashboard, no API key needed

# LLM for reasoning (Gemini - env var named ANTHROPIC for demo purposes)
VITE_ANTHROPIC_API_KEY=your_gemini_key
```

---

## Revised Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Sentinelle                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │   Yutori    │    │   Mino      │    │  Reasoning Engine   │ │
│  │             │    │  (TinyFish) │    │  (Gemini API)       │ │
│  │ Research    │    │             │    │                     │ │
│  │ clinical    │    │ Form fill   │    │ Clinical reasoning  │ │
│  │ guidelines  │    │ EHR docs    │    │ Risk calculation    │ │
│  │             │    │             │    │ Decision making     │ │
│  │ Pull patient│    │ Extract     │    │                     │ │
│  │ data from   │    │ patient     │    │                     │ │
│  │ portals     │    │ history     │    │                     │ │
│  └─────────────┘    └─────────────┘    └─────────────────────┘ │
│         │                  │                     │              │
│         └──────────────────┼─────────────────────┘              │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 React Frontend                            │  │
│  │                                                          │  │
│  │  • Reasoning panel (streaming text) ← OUR OBSERVABILITY  │  │
│  │  • Vital sign displays                                   │  │
│  │  • Alert toasts                                          │  │
│  │  • Built-in trace viewer                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 Retool Command Center                     │  │
│  │                                                          │  │
│  │  • Nurse dashboard                                       │  │
│  │  • Alert queue                                           │  │
│  │  • Response actions                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 Macroscope (Dev Only)                     │  │
│  │                                                          │  │
│  │  • PR reviews while building                             │  │
│  │  • Bug detection in code                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Verification Checklist

### Yutori
- [ ] Got API key from docs.yutori.com
- [ ] Added `VITE_YUTORI_API_KEY` to .env.local
- [ ] Tested Research API call
- [ ] Tested Browsing API call

### TinyFish/Mino
- [ ] Got API key from mino.ai/api-keys
- [ ] Added `VITE_MINO_API_KEY` to .env.local
- [ ] Tested automation endpoint
- [ ] SSE streaming works

### Macroscope
- [ ] Installed GitHub App on repo
- [ ] Can see PR reviews
- [ ] (Optional) Slack connected

### Retool
- [ ] Created account at retool.com
- [ ] Created "SentinelleCommand Center" app
- [ ] Added REST API resource
- [ ] Built basic patient table + alert list

---

## Common Mistakes

| ❌ Don't | ✅ Do |
|----------|-------|
| Use Macroscope for runtime tracing | Build trace viewer in React UI |
| Expect Mino to do LLM reasoning | Use Gemini API for reasoning |
| Expect Yutori to orchestrate agents | Use Yutori for web scraping/research |
| Use Retool API for dashboards | Use Retool's visual dashboard builder |
