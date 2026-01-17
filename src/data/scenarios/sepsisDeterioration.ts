import { DemoScenario, ReasoningStep, ReasoningStepTemplate } from '../../types';

/**
 * Sepsis Deterioration Demo Scenario
 * 
 * ENHANCED VERSION with rich clinical detail for maximum demo impact.
 * 
 * Patient: Margaret "Maggie" Chen, 67-year-old immunocompromised patient
 * admitted 3 days ago for UTI, now developing early sepsis.
 * 
 * Key Features:
 * - Realistic patient data with MRN, insurance, code status
 * - Complete care team with pager numbers
 * - Nursing notes showing subtle warning signs that were missed
 * - Prior ER visit 5 days ago (discharged too early)
 * - Comprehensive lab panel including sepsis-specific markers
 * - Detailed medication list with routes and start dates
 * - Multiple comorbidities creating complex clinical picture
 */

export const sepsisScenario: DemoScenario = {
    id: 'sepsis-demo-001',
    name: 'Sepsis Deterioration',
    description: 'Early sepsis detection in immunocompromised patient with recent UTI - demonstrating AI catching what humans missed',

    patient: {
        id: 'patient-001',
        mrn: 'MRN-2847591',
        name: 'Margaret Chen',
        location: 'ICU Bed 4, Tower B',
        admissionDate: '3 days ago',
        codeStatus: 'Full Code',
        insurance: 'Medicare + Blue Cross Supplemental',

        demographics: {
            age: 67,
            sex: 'F',
            weight: 68,
            height: 165,
            bmi: 25.0,
            ethnicity: 'Asian',
        },

        diagnoses: [
            {
                code: 'N39.0',
                description: 'Urinary tract infection, unspecified',
                onset: '3 days ago',
                severity: 'moderate',
            },
            {
                code: 'C50.912',
                description: 'Breast cancer, right side (in remission)',
                onset: '18 months ago',
            },
            {
                code: 'D70.1',
                description: 'Chemotherapy-induced neutropenia',
                onset: '2 months ago',
                severity: 'moderate',
            },
            {
                code: 'E11.9',
                description: 'Type 2 Diabetes Mellitus',
                onset: '8 years ago',
            },
            {
                code: 'I10',
                description: 'Essential hypertension',
                onset: '12 years ago',
            },
            {
                code: 'N18.3',
                description: 'Chronic kidney disease, Stage 3',
                onset: '4 years ago',
            },
        ],

        medications: [
            { name: 'Ciprofloxacin', dose: '400mg', frequency: 'Q12H', route: 'IV', startDate: '3 days ago' },
            { name: 'Metformin', dose: '500mg', frequency: 'BID', route: 'PO', startDate: '8 years ago' },
            { name: 'Lisinopril', dose: '10mg', frequency: 'Daily', route: 'PO', startDate: '12 years ago' },
            { name: 'Ondansetron', dose: '4mg', frequency: 'Q8H PRN', route: 'IV', startDate: '3 days ago' },
            { name: 'Heparin', dose: '5000 units', frequency: 'Q8H', route: 'SubQ', startDate: '3 days ago' },
            { name: 'Normal Saline', dose: '100mL/hr', frequency: 'Continuous', route: 'IV', startDate: 'Today' },
            { name: 'Filgrastim (Neupogen)', dose: '300mcg', frequency: 'Daily', route: 'SubQ', startDate: '5 days ago' },
        ],

        allergies: [
            'Penicillin (anaphylaxis)',
            'Sulfa drugs (rash)',
            'Shellfish (GI upset)',
        ],

        recentLabs: [
            {
                name: 'Lactate',
                value: 2.1,
                unit: 'mmol/L',
                timestamp: 'Today 06:00',
                trend: 'up',
                referenceRange: { low: 0.5, high: 2.0 },
                critical: true,
            },
            {
                name: 'Procalcitonin',
                value: 1.8,
                unit: 'ng/mL',
                timestamp: 'Today 06:00',
                trend: 'up',
                referenceRange: { low: 0, high: 0.1 },
                critical: true,
            },
            {
                name: 'WBC',
                value: 14.2,
                unit: 'x10^9/L',
                timestamp: 'Today 06:00',
                trend: 'up',
                referenceRange: { low: 4.5, high: 11.0 },
            },
            {
                name: 'ANC (Absolute Neutrophil Count)',
                value: 1.2,
                unit: 'x10^9/L',
                timestamp: 'Today 06:00',
                trend: 'stable',
                referenceRange: { low: 1.5, high: 8.0 },
                critical: true,
            },
            {
                name: 'CRP (C-Reactive Protein)',
                value: 145,
                unit: 'mg/L',
                timestamp: 'Today 06:00',
                trend: 'up',
                referenceRange: { low: 0, high: 10 },
                critical: true,
            },
            {
                name: 'Creatinine',
                value: 1.6,
                unit: 'mg/dL',
                timestamp: 'Today 06:00',
                trend: 'up',
                referenceRange: { low: 0.6, high: 1.2 },
            },
            {
                name: 'BUN',
                value: 28,
                unit: 'mg/dL',
                timestamp: 'Today 06:00',
                trend: 'up',
                referenceRange: { low: 7, high: 20 },
            },
            {
                name: 'Platelets',
                value: 142,
                unit: 'x10^9/L',
                timestamp: 'Today 06:00',
                trend: 'down',
                referenceRange: { low: 150, high: 400 },
            },
            {
                name: 'Glucose',
                value: 178,
                unit: 'mg/dL',
                timestamp: 'Today 06:00',
                trend: 'up',
                referenceRange: { low: 70, high: 100 },
            },
            {
                name: 'Blood Culture',
                value: 0,
                unit: 'pending',
                timestamp: 'Today 06:00',
                trend: 'stable',
            },
        ],

        riskFactors: [
            'Immunocompromised (chemotherapy)',
            'Active infection',
            'Age > 65',
            'Diabetes Mellitus',
            'Chronic kidney disease',
            'Recent hospitalization',
            'Indwelling catheter',
        ],

        nursingNotes: [
            {
                timestamp: 'Yesterday 22:00',
                author: 'RN Patricia Williams',
                content: 'Patient reports feeling "a little off" this evening. Vital signs within normal limits. Encouraged rest. Will continue to monitor.',
                category: 'observation',
            },
            {
                timestamp: 'Today 02:00',
                author: 'RN Marcus Johnson',
                content: 'Patient restless, requested extra blanket. Temp 37.4°C - low-grade. MD not notified per protocol (temp <38°C). Patient has history of running slightly warm.',
                category: 'assessment',
            },
            {
                timestamp: 'Today 06:00',
                author: 'RN Patricia Williams',
                content: 'Morning assessment: Patient appears more fatigued than yesterday. Skin slightly flushed. Responding appropriately but slower than baseline. Urine output adequate. Labs drawn.',
                category: 'assessment',
            },
            {
                timestamp: 'Today 08:30',
                author: 'RN Patricia Williams',
                content: 'Patient now complaining of mild chills. HR noted to be elevated at 95 bpm. Will recheck vitals in 30 minutes.',
                category: 'concern',
            },
        ],

        careTeam: [
            {
                role: 'Attending Physician',
                name: 'Dr. Sarah Chen',
                pager: '555-0147',
                onDuty: true,
            },
            {
                role: 'Oncologist',
                name: 'Dr. Michael Rodriguez',
                pager: '555-0183',
                onDuty: true,
            },
            {
                role: 'Charge Nurse',
                name: 'Maria Martinez, RN',
                phone: '555-0192',
                onDuty: true,
            },
            {
                role: 'Primary Nurse',
                name: 'Patricia Williams, RN',
                phone: '555-0194',
                onDuty: true,
            },
            {
                role: 'Pharmacist',
                name: 'Dr. James Park',
                pager: '555-0156',
                onDuty: true,
            },
            {
                role: 'Rapid Response Team Lead',
                name: 'Dr. Emily Watson',
                pager: '555-0199',
                onDuty: true,
            },
        ],

        priorVisits: [
            {
                date: '5 days ago',
                department: 'Emergency Department',
                chiefComplaint: 'Dysuria and urinary frequency x 2 days',
                disposition: 'Discharged with oral antibiotics (Bactrim)',
                relevantFindings: 'UTI confirmed on UA. Patient initially prescribed Bactrim but returned 2 days later with worsening symptoms - discovered sulfa allergy not in system. Admitted for IV antibiotics.',
            },
            {
                date: '2 months ago',
                department: 'Oncology Infusion Center',
                chiefComplaint: 'Scheduled chemotherapy cycle 4 of 6',
                disposition: 'Completed without complications',
            },
            {
                date: '3 months ago',
                department: 'Oncology Infusion Center',
                chiefComplaint: 'Scheduled chemotherapy cycle 3 of 6',
                disposition: 'Mild nausea, managed with ondansetron',
            },
        ],
    },

    baseline: {
        timestamp: Date.now(),
        heartRate: 78,
        bloodPressure: {
            systolic: 128,
            diastolic: 78,
        },
        temperature: 37.2,
        spO2: 97,
        respiratoryRate: 16,
    },

    // Deterioration curve - time in seconds from demo start
    // Compressed to ~18 seconds for demo impact
    deterioration: [
        { time: 0, vitals: { hr: 78, sbp: 128, dbp: 78, temp: 37.2, spo2: 97, rr: 16 } },
        { time: 3, vitals: { hr: 84, sbp: 124, dbp: 76, temp: 37.4, spo2: 97, rr: 17 } },
        { time: 6, vitals: { hr: 92, sbp: 118, dbp: 72, temp: 37.8, spo2: 96, rr: 18 } },
        { time: 9, vitals: { hr: 100, sbp: 110, dbp: 68, temp: 38.2, spo2: 95, rr: 20 } },
        { time: 12, vitals: { hr: 108, sbp: 100, dbp: 62, temp: 38.6, spo2: 94, rr: 22 } },
        { time: 15, vitals: { hr: 114, sbp: 92, dbp: 58, temp: 38.9, spo2: 93, rr: 24 } },
        { time: 18, vitals: { hr: 118, sbp: 86, dbp: 54, temp: 39.2, spo2: 92, rr: 26 } },
    ],

    // Reasoning steps template (id, status, timestamp added at runtime)
    reasoningSteps: [
        {
            type: 'observe',
            title: 'Critical vital signs detected',
            content: 'HR: 116 bpm (↑38 from baseline), BP: 88/56 mmHg (↓40 systolic), Temp: 39.1°C (↑1.9°C), SpO2: 93%, RR: 24/min. Multiple parameters crossing critical thresholds simultaneously.',
        },
        {
            type: 'think',
            title: 'Pattern analysis initiated',
            content: 'Detecting multi-system deterioration pattern: Compensatory tachycardia with concurrent hypotension suggests early distributive shock. Fever trajectory (37.2→39.1°C over 90 minutes) indicates acute inflammatory response. Tachypnea may represent metabolic compensation for developing lactic acidosis.',
        },
        {
            type: 'search',
            title: 'Retrieving comprehensive patient context',
            content: 'Querying EHR for medical history, recent clinical notes, laboratory trends, and active orders...',
            children: [
                {
                    type: 'success',
                    title: 'HIGH RISK: Immunocompromised status',
                    content: 'Patient on chemotherapy for breast cancer with documented neutropenia (ANC 1.2). Severely impaired immune response to infection.',
                },
                {
                    type: 'success',
                    title: 'Active infection confirmed',
                    content: 'UTI diagnosed 3 days ago. Prior ER visit 5 days ago resulted in discharge with contraindicated antibiotic (sulfa allergy). Delayed appropriate treatment by 48 hours.',
                },
                {
                    type: 'success',
                    title: 'CRITICAL: Sepsis biomarkers elevated',
                    content: 'Procalcitonin 1.8 ng/mL (normal <0.1) - strongly suggests bacterial sepsis. Lactate 2.1 mmol/L at 06:00, likely higher now. CRP 145 mg/L indicates severe inflammation.',
                },
                {
                    type: 'success',
                    title: 'Subtle early warnings in nursing notes',
                    content: 'Pattern identified: Patient reported feeling "off" at 22:00, low-grade fever at 02:00 (not escalated per protocol), increased fatigue and flushing noted at 06:00. Classic prodromal sepsis presentation.',
                },
                {
                    type: 'success',
                    title: 'Additional risk factors identified',
                    content: 'CKD Stage 3 (Cr trending up to 1.6), diabetes (glucose 178), age 67, indwelling catheter. Multiple organ systems at risk.',
                },
            ],
        },
        {
            type: 'calculate',
            title: 'Computing validated clinical risk scores',
            content: 'Applying sepsis screening algorithms per Surviving Sepsis Campaign 2021 guidelines...',
            children: [
                {
                    type: 'success',
                    title: 'qSOFA Score: 3/3 — MAXIMUM RISK',
                    content: 'Respiratory rate ≥ 22 (+1), Systolic BP ≤ 100 (+1), Altered mentation suspected (+1). Score ≥ 2 indicates high mortality risk. Full score indicates likely organ dysfunction.',
                },
                {
                    type: 'success',
                    title: 'NEWS2 Score: 11 — CRITICAL',
                    content: 'RR 24: +3, SpO2 93%: +2, Temp 39.1: +2, SBP 88: +3, HR 116: +1. Score ≥ 7 mandates emergent clinical response. Score 11 indicates immediate life threat.',
                },
                {
                    type: 'success',
                    title: 'SOFA Score: Estimated 4+ — Sepsis confirmed',
                    content: 'Cardiovascular: MAP ~67 (+1), Renal: Cr 1.6 with baseline 1.2 (+1), Respiratory: SpO2/FiO2 declining (+1), Coagulation: Platelets 142 (+1). Organ dysfunction confirmed.',
                },
            ],
        },
        {
            type: 'think',
            title: 'Clinical synthesis complete',
            content: 'DIAGNOSIS: Early septic shock secondary to urinary tract infection in immunocompromised host. Contributing factors: neutropenia, delayed antibiotic therapy, chronic kidney disease progression. This patient has progressed from SIRS → Sepsis → Early Septic Shock in approximately 12 hours. Mortality risk without intervention: 30-40% per hour delay. Window for optimal intervention is NOW.',
        },
        {
            type: 'decide',
            title: 'AUTONOMOUS RESPONSE ACTIVATED',
            content: 'Confidence level: 97%. Initiating Sepsis Hour-1 Bundle per SSC guidelines. This is a time-critical emergency. Engaging care team and pre-staging interventions.',
        },
        {
            type: 'action',
            title: 'Executing parallel emergency response',
            content: 'Launching coordinated multi-channel alerts and clinical decision support...',
            children: [
                {
                    type: 'alert',
                    title: 'PRIORITY 1: Care team mobilization',
                    content: 'STAT page to Dr. Sarah Chen (Attending) - Pager 555-0147. Alert to Charge Nurse Maria Martinez. Rapid Response Team Lead Dr. Emily Watson activated. Pharmacy notified for antibiotic preparation.',
                },
                {
                    type: 'alert',
                    title: 'Bedside nurse notification',
                    content: 'Direct alert to RN Patricia Williams with actionable checklist: 1) Obtain blood cultures x2 (different sites), 2) Prepare for fluid bolus, 3) Have vasopressors available, 4) Prepare for central line if needed.',
                },
                {
                    type: 'document',
                    title: 'Sepsis Hour-1 Bundle recommendations generated',
                    content: '1) BLOOD CULTURES x2 before antibiotics (STAT), 2) LACTATE level STAT (expect >4), 3) MEROPENEM 1g IV (renally adjusted for CKD) — covers resistant organisms, penicillin allergy noted, 4) CRYSTALLOID 30mL/kg = 2L bolus over 30 min, 5) Vasopressors if MAP <65 after fluids.',
                },
                {
                    type: 'document',
                    title: 'Clinical documentation generated',
                    content: 'Comprehensive clinical note created: Timestamp, vital trends, risk scores (qSOFA 3, NEWS2 11, SOFA 4+), reasoning chain, actions taken. Flagged for Dr. Chen co-signature. Audit trail preserved for quality review.',
                },
                {
                    type: 'wait',
                    title: 'Escalation protocol armed',
                    content: 'Response window: 5 minutes for physician acknowledgment, 10 minutes for bedside action. Auto-escalation to: Medical Director, then Hospital Administrator if no response. ICU bed reservation initiated.',
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
        template: ReasoningStepTemplate,
        timestamp: number
    ): ReasoningStep => {
        const step: ReasoningStep = {
            ...template,
            id: generateId(),
            status: 'pending',
            timestamp,
            children: undefined,
        };

        if (template.children) {
            step.children = template.children.map((child, index) =>
                processStep(child, timestamp + (index + 1) * 300)
            );
        }

        return step;
    };

    return scenario.reasoningSteps.map((template, index) =>
        processStep(template, startTime + index * 2000)
    );
}

/**
 * Vital sign thresholds for the demo
 * Color coding: normal (green) -> warning (yellow) -> critical (red)
 */
export const vitalThresholds = {
    heartRate: {
        criticalLow: 40,
        warningLow: 50,
        warningHigh: 100,
        criticalHigh: 120,
    },
    bloodPressure: {
        systolic: {
            criticalLow: 85,
            warningLow: 95,
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
        warningHigh: 38.0,
        criticalHigh: 39.0,
    },
    spO2: {
        criticalLow: 90,
        warningLow: 94,
        warningHigh: 100,
        criticalHigh: 100,
    },
    respiratoryRate: {
        criticalLow: 8,
        warningLow: 12,
        warningHigh: 20,
        criticalHigh: 25,
    },
};

/**
 * Interpolates vital signs between two deterioration points
 * with realistic physiological noise
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

    // If past the last point, return the last point's vitals with some variation
    if (currentTime >= points[points.length - 1].time) {
        const lastVitals = points[points.length - 1].vitals;
        return {
            hr: lastVitals.hr + Math.floor(Math.random() * 4 - 2),
            sbp: lastVitals.sbp + Math.floor(Math.random() * 4 - 2),
            dbp: lastVitals.dbp + Math.floor(Math.random() * 3 - 1),
            temp: Math.round((lastVitals.temp + (Math.random() * 0.2 - 0.1)) * 10) / 10,
            spo2: lastVitals.spo2 + Math.floor(Math.random() * 2 - 1),
            rr: lastVitals.rr + Math.floor(Math.random() * 2 - 1),
        };
    }

    // Calculate interpolation factor with easing
    const duration = after.time - before.time;
    const elapsed = currentTime - before.time;
    const t = duration > 0 ? elapsed / duration : 0;

    // Ease-in-out for more natural progression
    const eased = t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // Linear interpolation with physiological noise
    const lerp = (a: number, b: number, noise: number = 1) => {
        const base = a + (b - a) * eased;
        const variation = (Math.random() - 0.5) * noise;
        return base + variation;
    };

    return {
        hr: Math.round(lerp(before.vitals.hr, after.vitals.hr, 2)),
        sbp: Math.round(lerp(before.vitals.sbp, after.vitals.sbp, 2)),
        dbp: Math.round(lerp(before.vitals.dbp, after.vitals.dbp, 1)),
        temp: Math.round(lerp(before.vitals.temp, after.vitals.temp, 0.1) * 10) / 10,
        spo2: Math.round(lerp(before.vitals.spo2, after.vitals.spo2, 0.5)),
        rr: Math.round(lerp(before.vitals.rr, after.vitals.rr, 1)),
    };
}

/**
 * Get formatted time string for display
 */
export function formatVitalTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
}

export default sepsisScenario;
