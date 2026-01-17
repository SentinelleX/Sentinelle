// =============================================================================
// SENTINELLE — Type Definitions
// =============================================================================

// -----------------------------------------------------------------------------
// Vital Signs
// -----------------------------------------------------------------------------

export interface VitalSign {
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

export type VitalType =
    | 'heartRate'
    | 'bloodPressure'
    | 'temperature'
    | 'spO2'
    | 'respiratoryRate';

export interface VitalThresholds {
    criticalLow?: number;
    warningLow?: number;
    warningHigh?: number;
    criticalHigh?: number;
}

export type VitalStatus = 'normal' | 'warning' | 'critical';

export type TrendDirection = 'up' | 'down' | 'stable';

// -----------------------------------------------------------------------------
// Reasoning
// -----------------------------------------------------------------------------

export type StepType =
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

export type StepStatus = 'pending' | 'in_progress' | 'complete' | 'error';

export interface ReasoningStep {
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

export interface ReasoningSummary {
    totalSteps: number;
    totalDuration: number;
    actionsCount: number;
    traceId: string;
}

// -----------------------------------------------------------------------------
// Patient
// -----------------------------------------------------------------------------

export interface PatientDemographics {
    age: number;
    sex: 'M' | 'F';
    weight: number;
    height?: number;
    bmi?: number;
    ethnicity?: string;
}

export interface Diagnosis {
    code: string;
    description: string;
    onset: string;
    severity?: 'mild' | 'moderate' | 'severe';
}

export interface Medication {
    name: string;
    dose: string;
    frequency: string;
    route?: string;
    startDate?: string;
}

export interface LabResult {
    name: string;
    value: number;
    unit: string;
    timestamp: string;
    trend: TrendDirection;
    referenceRange?: {
        low: number;
        high: number;
    };
    critical?: boolean;
}

export interface NursingNote {
    timestamp: string;
    author: string;
    content: string;
    category: 'assessment' | 'intervention' | 'observation' | 'concern';
}

export interface CareTeamMember {
    role: string;
    name: string;
    pager?: string;
    phone?: string;
    onDuty: boolean;
}

export interface PriorVisit {
    date: string;
    department: string;
    chiefComplaint: string;
    disposition: string;
    relevantFindings?: string;
}

export interface PatientContext {
    id: string;
    mrn: string;
    name: string;
    location: string;
    admissionDate: string;
    codeStatus: 'Full Code' | 'DNR' | 'DNI' | 'Comfort Care';
    demographics: PatientDemographics;
    diagnoses: Diagnosis[];
    medications: Medication[];
    allergies: string[];
    recentLabs: LabResult[];
    riskFactors: string[];
    nursingNotes?: NursingNote[];
    careTeam?: CareTeamMember[];
    priorVisits?: PriorVisit[];
    insurance?: string;
}

// -----------------------------------------------------------------------------
// Alerts
// -----------------------------------------------------------------------------

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Alert {
    id: string;
    severity: AlertSeverity;
    title: string;
    message: string;
    patientId: string;
    patientName: string;
    location: string;
    scores?: {
        qsofa: number;
        news2: number;
    };
    timestamp: number;
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: number;
}

// -----------------------------------------------------------------------------
// Clinical Scores
// -----------------------------------------------------------------------------

export interface QSOFAScore {
    total: number;
    maxScore: 3;
    components: {
        respiratoryRate: boolean; // RR >= 22
        alteredMentation: boolean;
        systolicBP: boolean; // SBP <= 100
    };
    riskLevel: 'low' | 'high';
}

export interface NEWS2Score {
    total: number;
    maxScore: 20;
    components: {
        respiratoryRate: number;
        spO2: number;
        supplementalO2: number;
        temperature: number;
        systolicBP: number;
        heartRate: number;
        consciousness: number;
    };
    riskLevel: 'low' | 'medium' | 'high';
}

// -----------------------------------------------------------------------------
// Demo / Simulation
// -----------------------------------------------------------------------------

export interface DeteriorationPoint {
    time: number; // seconds from start
    vitals: {
        hr: number;
        sbp: number;
        dbp: number;
        temp: number;
        spo2: number;
        rr: number;
    };
}

// Template step without runtime fields (id, status, timestamp)
export interface ReasoningStepTemplate {
    type: StepType;
    title: string;
    content?: string;
    children?: ReasoningStepTemplate[];
    duration?: number;
    traceId?: string;
    metadata?: Record<string, unknown>;
}

export interface DemoScenario {
    id: string;
    name: string;
    description: string;
    patient: PatientContext;
    baseline: VitalSign;
    deterioration: DeteriorationPoint[];
    reasoningSteps: ReasoningStepTemplate[];
}

// -----------------------------------------------------------------------------
// Observability / Tracing
// -----------------------------------------------------------------------------

export interface TraceSpan {
    spanId: string;
    parentSpanId?: string;
    operationName: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    status: 'ok' | 'error';
    attributes: Record<string, unknown>;
    events: TraceEvent[];
}

export interface TraceEvent {
    name: string;
    timestamp: number;
    attributes: Record<string, unknown>;
}

export interface Trace {
    traceId: string;
    spans: TraceSpan[];
    startTime: number;
    endTime?: number;
    status: 'ok' | 'error';
}

// -----------------------------------------------------------------------------
// Store
// -----------------------------------------------------------------------------

export interface SentinelleState {
    // Patient
    currentPatient: PatientContext | null;

    // Vitals
    vitals: VitalSign[];
    latestVitals: VitalSign | null;

    // Reasoning
    reasoningSteps: ReasoningStep[];
    isAgentActive: boolean;
    currentTraceId: string | null;

    // Alerts
    activeAlerts: Alert[];
    alertHistory: Alert[];

    // UI
    selectedStepId: string | null;
    isTraceModalOpen: boolean;
    isDemoMode: boolean;

    // Actions
    setPatient: (patient: PatientContext) => void;
    addVital: (vital: VitalSign) => void;
    clearVitals: () => void;
    addReasoningStep: (step: ReasoningStep) => void;
    updateStepStatus: (id: string, status: StepStatus) => void;
    appendStepContent: (id: string, content: string) => void;
    clearReasoningSteps: () => void;
    setAgentActive: (active: boolean) => void;
    addAlert: (alert: Alert) => void;
    acknowledgeAlert: (alertId: string, acknowledgedBy?: string) => void;
    dismissAlert: (alertId: string) => void;
    setSelectedStep: (stepId: string | null) => void;
    openTraceModal: () => void;
    closeTraceModal: () => void;
    setDemoMode: (enabled: boolean) => void;
    reset: () => void;
}

// -----------------------------------------------------------------------------
// Component Props
// -----------------------------------------------------------------------------

export interface ReasoningStepProps {
    step: ReasoningStep;
    depth?: number;
    isStreaming?: boolean;
    onExpand?: (stepId: string) => void;
    isExpanded?: boolean;
}

export interface StreamingTextProps {
    text: string;
    isStreaming: boolean;
    speed?: number;
    onComplete?: () => void;
    className?: string;
}

export interface VitalCardProps {
    type: VitalType;
    value: number | { systolic: number; diastolic: number };
    unit: string;
    trend: TrendDirection;
    trendValue?: number;
    thresholds: VitalThresholds;
    timestamp?: number;
    onClick?: () => void;
}

export interface AlertToastProps {
    alert: Alert;
    onAcknowledge: (alertId: string) => void;
    onDismiss: (alertId: string) => void;
    onExpand?: (alertId: string) => void;
}

export interface VitalsChartProps {
    data: VitalSign[];
    visibleVitals: VitalType[];
    timeWindow?: number;
    thresholds?: Record<VitalType, VitalThresholds>;
    highlightedTime?: number;
    onTimeSelect?: (timestamp: number) => void;
}

export interface PatientContextProps {
    patient: PatientContext;
    isLoading?: boolean;
    highlightedItems?: string[];
}

// -----------------------------------------------------------------------------
// Icon Mapping
// -----------------------------------------------------------------------------

export const STEP_ICON_MAP: Record<StepType, string> = {
    observe: 'Activity',
    think: 'Brain',
    search: 'Search',
    calculate: 'Calculator',
    decide: 'GitBranch',
    action: 'Zap',
    alert: 'Bell',
    document: 'FileText',
    wait: 'Clock',
    success: 'CheckCircle',
    error: 'XCircle',
    escalate: 'ArrowUpCircle',
} as const;

export const VITAL_ICON_MAP: Record<VitalType, string> = {
    heartRate: 'Heart',
    bloodPressure: 'Activity',
    temperature: 'Thermometer',
    spO2: 'Droplet',
    respiratoryRate: 'Wind',
} as const;

// -----------------------------------------------------------------------------
// Utility Types
// -----------------------------------------------------------------------------

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ValueOf<T> = T[keyof T];
