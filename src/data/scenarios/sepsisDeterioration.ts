import { DemoScenario, ReasoningStep } from '../../types';

/**
 * Sepsis Deterioration Demo Scenario
 * 
 * This scenario demonstrates a 67-year-old immunocompromised patient
 * with a recent UTI who develops early sepsis. The vitals deteriorate
 * over approximately 75 seconds, triggering the autonomous agent response.
 */

export const sepsisScenario: DemoScenario = {
    id: 'sepsis-demo-001',
    name: 'Sepsis Deterioration',
    description: 'Early sepsis detection in immunocompromised patient with recent UTI',

    patient: {
        id: 'patient-001',
        name: 'John Doe',
        location: 'ICU Bed 4',
        demographics: {
            age: 67,
            sex: 'M',
            weight: 78,
        },
        diagnoses: [
            {
                code: 'N39.0',
                description: 'Urinary tract infection',
                onset: '3 days ago',
            },
            {
                code: 'E11.9',
                description: 'Type 2 Diabetes Mellitus',
                onset: '5 years ago',
            },
            {
                code: 'D70.9',
                description: 'Immunocompromised (chemotherapy)',
                onset: '2 months ago',
            },
        ],
        medications: [
            { name: 'Metformin', dose: '500mg', frequency: 'BID' },
            { name: 'Ciprofloxacin', dose: '500mg', frequency: 'BID' },
            { name: 'Ondansetron', dose: '4mg', frequency: 'PRN' },
        ],
        allergies: ['Penicillin', 'Sulfa drugs'],
        recentLabs: [
            {
                name: 'Lactate',
                value: 2.1,
                unit: 'mmol/L',
                timestamp: 'Yesterday 14:30',
                trend: 'up',
                referenceRange: { low: 0.5, high: 2.0 },
            },
            {
                name: 'WBC',
                value: 14.2,
                unit: 'x10^9/L',
                timestamp: 'Yesterday 14:30',
                trend: 'up',
                referenceRange: { low: 4.5, high: 11.0 },
            },
            {
                name: 'Creatinine',
                value: 1.4,
                unit: 'mg/dL',
                timestamp: 'Yesterday 14:30',
                trend: 'stable',
                referenceRange: { low: 0.7, high: 1.3 },
            },
            {
                name: 'Glucose',
                value: 156,
                unit: 'mg/dL',
                timestamp: 'Yesterday 14:30',
                trend: 'stable',
                referenceRange: { low: 70, high: 100 },
            },
        ],
        riskFactors: [
            'Immunocompromised',
            'Recent infection',
            'Age > 65',
            'Diabetes',
        ],
    },

    baseline: {
        timestamp: Date.now(),
        heartRate: 78,
        bloodPressure: {
            systolic: 120,
            diastolic: 80,
        },
        temperature: 37.0,
        spO2: 98,
        respiratoryRate: 16,
    },

    // Deterioration curve - time in seconds from start
    deterioration: [
        {
            time: 0,
            vitals: { hr: 78, sbp: 120, dbp: 80, temp: 37.0, spo2: 98, rr: 16 },
        },
        {
            time: 15,
            vitals: { hr: 82, sbp: 118, dbp: 78, temp: 37.2, spo2: 98, rr: 17 },
        },
        {
            time: 30,
            vitals: { hr: 88, sbp: 115, dbp: 75, temp: 37.6, spo2: 97, rr: 18 },
        },
        {
            time: 45,
            vitals: { hr: 98, sbp: 108, dbp: 70, temp: 38.0, spo2: 96, rr: 20 },
        },
        {
            time: 55,
            vitals: { hr: 105, sbp: 100, dbp: 65, temp: 38.4, spo2: 95, rr: 21 },
        },
        {
            time: 65,
            vitals: { hr: 110, sbp: 92, dbp: 62, temp: 38.7, spo2: 94, rr: 23 },
        },
        {
            time: 75,
            vitals: { hr: 112, sbp: 88, dbp: 60, temp: 38.9, spo2: 94, rr: 24 },
        },
    ],

    // Reasoning steps template (id, status, timestamp added at runtime)
    reasoningSteps: [
        {
            type: 'observe',
            title: 'New vitals received',
            content: 'HR: 112 bpm, BP: 88/60 mmHg, Temp: 38.9C, SpO2: 94%, RR: 24/min',
        },
        {
            type: 'think',
            title: 'Analyzing vital sign patterns',
            content: 'Detecting concerning trends: tachycardia with HR >100, hypotension with SBP <90, fever >38.3C, tachypnea with RR >22. Multiple parameters outside normal range simultaneously.',
        },
        {
            type: 'search',
            title: 'Pulling patient context',
            content: 'Retrieving medical history, current medications, recent laboratory results...',
            children: [
                {
                    type: 'success',
                    title: 'Active infection identified',
                    content: 'UTI diagnosed 3 days ago, currently on Ciprofloxacin',
                },
                {
                    type: 'success',
                    title: 'Immunocompromised status confirmed',
                    content: 'Chemotherapy-induced immunosuppression, higher risk for severe infection',
                },
                {
                    type: 'success',
                    title: 'Lactate level concerning',
                    content: 'Lactate 2.1 mmol/L yesterday, at upper limit of normal and trending upward',
                },
            ],
        },
        {
            type: 'calculate',
            title: 'Computing clinical risk scores',
            content: 'Applying validated sepsis screening tools...',
            children: [
                {
                    type: 'success',
                    title: 'qSOFA Score: 2/3',
                    content: 'Respiratory rate >= 22 (+1), Systolic BP <= 100 (+1). Score >= 2 indicates high risk.',
                },
                {
                    type: 'success',
                    title: 'NEWS2 Score: 7',
                    content: 'RR: +2, SpO2: +1, Temp: +1, SBP: +2, HR: +1. Score >= 7 indicates urgent clinical response needed.',
                },
            ],
        },
        {
            type: 'think',
            title: 'Clinical assessment complete',
            content: 'Pattern strongly consistent with early sepsis. Known infection source (UTI), systemic inflammatory response (fever, tachycardia, tachypnea), and early organ dysfunction indicators (hypotension, elevated lactate trend). High confidence assessment. Immediate intervention recommended to prevent progression to septic shock.',
        },
        {
            type: 'decide',
            title: 'Initiating autonomous response',
            content: 'High confidence sepsis risk detected. Activating care team alert protocol and generating clinical recommendations per Surviving Sepsis Campaign guidelines.',
        },
        {
            type: 'action',
            title: 'Executing response actions',
            content: 'Running parallel actions...',
            children: [
                {
                    type: 'alert',
                    title: 'Alerting care team',
                    content: 'Primary: Dr. Sarah Chen (Attending) notified via pager. Secondary: Charge Nurse Martinez alerted via mobile. Unit clerk notified for coordination.',
                },
                {
                    type: 'document',
                    title: 'Generating clinical recommendations',
                    content: 'Sepsis Bundle Hour-1 recommendations: Blood cultures x2 (before antibiotics), Serum lactate level STAT, Broad-spectrum IV antibiotics within 1 hour, IV fluid resuscitation 30mL/kg if hypotensive or lactate >= 4',
                },
                {
                    type: 'document',
                    title: 'Documenting in clinical record',
                    content: 'Clinical note generated with timestamp, vital sign assessment, risk scores, and automated actions taken. Ready for physician co-signature.',
                },
                {
                    type: 'wait',
                    title: 'Setting escalation timer',
                    content: '15-minute response window initiated. If no acknowledgment received, will escalate to Rapid Response Team and attending backup.',
                },
            ],
        },
    ],
};

/**
 * Generates reasoning steps with unique IDs and timestamps
 * based on the scenario template
 */
export function generateReasoningSteps(
    scenario: DemoScenario,
    startTime: number = Date.now()
): ReasoningStep[] {
    let stepIndex = 0;
    const generateId = () => `step-${++stepIndex}-${Date.now()}`;

    const processStep = (
        template: Omit<ReasoningStep, 'id' | 'status' | 'timestamp'>,
        timestamp: number
    ): ReasoningStep => {
        const step: ReasoningStep = {
            ...template,
            id: generateId(),
            status: 'pending',
            timestamp,
        };

        if (template.children) {
            step.children = template.children.map((child, index) =>
                processStep(child, timestamp + (index + 1) * 200)
            );
        }

        return step;
    };

    return scenario.reasoningSteps.map((template, index) =>
        processStep(template, startTime + index * 1500)
    );
}

/**
 * Vital sign thresholds for the demo
 */
export const vitalThresholds = {
    heartRate: {
        criticalLow: 40,
        warningLow: 50,
        warningHigh: 100,
        criticalHigh: 130,
    },
    bloodPressure: {
        systolic: {
            criticalLow: 80,
            warningLow: 90,
            warningHigh: 160,
            criticalHigh: 180,
        },
        diastolic: {
            criticalLow: 50,
            warningLow: 60,
            warningHigh: 100,
            criticalHigh: 110,
        },
    },
    temperature: {
        criticalLow: 35.0,
        warningLow: 36.0,
        warningHigh: 38.3,
        criticalHigh: 39.5,
    },
    spO2: {
        criticalLow: 88,
        warningLow: 92,
        warningHigh: 100,
        criticalHigh: 100,
    },
    respiratoryRate: {
        criticalLow: 8,
        warningLow: 10,
        warningHigh: 22,
        criticalHigh: 30,
    },
};

/**
 * Interpolates vital signs between two deterioration points
 */
export function interpolateVitals(
    points: DemoScenario['deterioration'],
    currentTime: number
): DemoScenario['deterioration'][0]['vitals'] {
    // Find the two points to interpolate between
    let before = points[0];
    let after = points[points.length - 1];

    for (let i = 0; i < points.length - 1; i++) {
        if (currentTime >= points[i].time && currentTime < points[i + 1].time) {
            before = points[i];
            after = points[i + 1];
            break;
        }
    }

    // If past the last point, return the last point's vitals
    if (currentTime >= points[points.length - 1].time) {
        return points[points.length - 1].vitals;
    }

    // Calculate interpolation factor
    const duration = after.time - before.time;
    const elapsed = currentTime - before.time;
    const t = duration > 0 ? elapsed / duration : 0;

    // Linear interpolation with slight noise
    const lerp = (a: number, b: number) => {
        const base = a + (b - a) * t;
        const noise = (Math.random() - 0.5) * 2; // ±1 noise
        return Math.round((base + noise) * 10) / 10;
    };

    return {
        hr: Math.round(lerp(before.vitals.hr, after.vitals.hr)),
        sbp: Math.round(lerp(before.vitals.sbp, after.vitals.sbp)),
        dbp: Math.round(lerp(before.vitals.dbp, after.vitals.dbp)),
        temp: Math.round(lerp(before.vitals.temp, after.vitals.temp) * 10) / 10,
        spo2: Math.round(lerp(before.vitals.spo2, after.vitals.spo2)),
        rr: Math.round(lerp(before.vitals.rr, after.vitals.rr)),
    };
}

export default sepsisScenario;
