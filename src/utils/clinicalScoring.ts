/**
 * Clinical Scoring Utilities for Sentinelle
 * 
 * Implements validated clinical scoring systems for sepsis detection:
 * - qSOFA (Quick Sequential Organ Failure Assessment)
 * - NEWS2 (National Early Warning Score 2)
 * - SIRS (Systemic Inflammatory Response Syndrome)
 * 
 * References:
 * - Surviving Sepsis Campaign Guidelines 2021
 * - Royal College of Physicians NEWS2 (2017)
 */

import { VitalSign } from '../types'

// ============================================================================
// Types
// ============================================================================

export interface QSOFAResult {
  score: number
  maxScore: 3
  criteria: {
    respiratoryRate: boolean  // RR >= 22
    alteredMentation: boolean // GCS < 15
    systolicBP: boolean       // SBP <= 100
  }
  interpretation: 'low_risk' | 'high_risk'
  recommendation: string
}

export interface NEWS2Result {
  score: number
  maxScore: 20
  components: {
    respiratoryRate: number
    spO2: number
    airOrOxygen: number
    systolicBP: number
    pulse: number
    consciousness: number
    temperature: number
  }
  clinicalRisk: 'low' | 'low_medium' | 'medium' | 'high'
  responseRequired: string
}

export interface SIRSResult {
  score: number
  maxScore: 4
  criteria: {
    temperature: boolean      // >38°C or <36°C
    heartRate: boolean        // >90 bpm
    respiratoryRate: boolean  // >20 or PaCO2 <32
    wbc: boolean              // >12k or <4k or >10% bands
  }
  meetsSIRS: boolean
}

export interface ClinicalScoresSummary {
  qsofa: QSOFAResult
  news2: NEWS2Result
  sirs: SIRSResult
  sepsisLikelihood: 'unlikely' | 'possible' | 'probable' | 'likely'
  urgencyLevel: 1 | 2 | 3 | 4 | 5
}

// ============================================================================
// qSOFA Calculator
// ============================================================================

/**
 * Calculate qSOFA (Quick Sequential Organ Failure Assessment) score
 * 
 * qSOFA is a bedside prompt for clinicians to identify patients with
 * suspected infection who are at greater risk for poor outcomes.
 * 
 * Score >= 2 indicates high risk of poor outcome.
 * 
 * @param vitals - Current vital signs
 * @param gcs - Glasgow Coma Scale (default 15 = fully alert)
 */
export function calculateQSOFA(
  vitals: VitalSign,
  gcs: number = 15
): QSOFAResult {
  const criteria = {
    respiratoryRate: vitals.respiratoryRate >= 22,
    alteredMentation: gcs < 15,
    systolicBP: vitals.bloodPressure.systolic <= 100,
  }

  const score = Object.values(criteria).filter(Boolean).length

  return {
    score,
    maxScore: 3,
    criteria,
    interpretation: score >= 2 ? 'high_risk' : 'low_risk',
    recommendation: score >= 2
      ? 'High risk of poor outcome. Consider ICU admission and initiate sepsis workup.'
      : 'Continue monitoring. Re-assess if clinical status changes.',
  }
}

// ============================================================================
// NEWS2 Calculator
// ============================================================================

const NEWS2_TABLES = {
  respiratoryRate: [
    { range: [25, Infinity], score: 3 },
    { range: [21, 24], score: 2 },
    { range: [12, 20], score: 0 },
    { range: [9, 11], score: 1 },
    { range: [-Infinity, 8], score: 3 },
  ],
  spO2Scale1: [
    { range: [96, Infinity], score: 0 },
    { range: [94, 95], score: 1 },
    { range: [92, 93], score: 2 },
    { range: [-Infinity, 91], score: 3 },
  ],
  systolicBP: [
    { range: [220, Infinity], score: 3 },
    { range: [111, 219], score: 0 },
    { range: [101, 110], score: 1 },
    { range: [91, 100], score: 2 },
    { range: [-Infinity, 90], score: 3 },
  ],
  pulse: [
    { range: [131, Infinity], score: 3 },
    { range: [111, 130], score: 2 },
    { range: [91, 110], score: 1 },
    { range: [51, 90], score: 0 },
    { range: [41, 50], score: 1 },
    { range: [-Infinity, 40], score: 3 },
  ],
  temperature: [
    { range: [39.1, Infinity], score: 2 },
    { range: [38.1, 39.0], score: 1 },
    { range: [36.1, 38.0], score: 0 },
    { range: [35.1, 36.0], score: 1 },
    { range: [-Infinity, 35.0], score: 3 },
  ],
} as const

function getNews2Score(value: number, table: readonly { readonly range: readonly [number, number]; readonly score: number }[]): number {
  for (const entry of table) {
    if (value >= entry.range[0] && value <= entry.range[1]) {
      return entry.score
    }
  }
  return 0
}

/**
 * Calculate NEWS2 (National Early Warning Score 2)
 * 
 * NEWS2 is validated to detect clinical deterioration and trigger
 * appropriate clinical response.
 * 
 * @param vitals - Current vital signs
 * @param isOnOxygen - Whether patient is on supplemental oxygen
 * @param isAlert - Whether patient is alert (AVPU = A)
 */
export function calculateNEWS2(
  vitals: VitalSign,
  isOnOxygen: boolean = false,
  isAlert: boolean = true
): NEWS2Result {
  const components = {
    respiratoryRate: getNews2Score(vitals.respiratoryRate, NEWS2_TABLES.respiratoryRate),
    spO2: getNews2Score(vitals.spO2, NEWS2_TABLES.spO2Scale1),
    airOrOxygen: isOnOxygen ? 2 : 0,
    systolicBP: getNews2Score(vitals.bloodPressure.systolic, NEWS2_TABLES.systolicBP),
    pulse: getNews2Score(vitals.heartRate, NEWS2_TABLES.pulse),
    consciousness: isAlert ? 0 : 3,
    temperature: getNews2Score(vitals.temperature, NEWS2_TABLES.temperature),
  }

  const score = Object.values(components).reduce((sum, val) => sum + val, 0)

  let clinicalRisk: NEWS2Result['clinicalRisk']
  let responseRequired: string

  // Check for any single parameter scoring 3
  const hasExtremeValue = Object.values(components).some(v => v === 3)

  if (score >= 7 || hasExtremeValue) {
    clinicalRisk = 'high'
    responseRequired = 'Emergency response. Urgent clinical review by critical care team.'
  } else if (score >= 5) {
    clinicalRisk = 'medium'
    responseRequired = 'Urgent response. Clinical review within 1 hour.'
  } else if (score >= 1) {
    clinicalRisk = 'low_medium'
    responseRequired = 'Increase monitoring frequency. Inform registered nurse.'
  } else {
    clinicalRisk = 'low'
    responseRequired = 'Continue routine monitoring.'
  }

  return {
    score,
    maxScore: 20,
    components,
    clinicalRisk,
    responseRequired,
  }
}

// ============================================================================
// SIRS Calculator
// ============================================================================

/**
 * Calculate SIRS (Systemic Inflammatory Response Syndrome) criteria
 * 
 * While qSOFA has replaced SIRS for sepsis screening, SIRS remains
 * useful for identifying systemic inflammation.
 * 
 * @param vitals - Current vital signs
 * @param wbc - White blood cell count (K/uL), optional
 */
export function calculateSIRS(
  vitals: VitalSign,
  wbc?: number
): SIRSResult {
  const criteria = {
    temperature: vitals.temperature > 38 || vitals.temperature < 36,
    heartRate: vitals.heartRate > 90,
    respiratoryRate: vitals.respiratoryRate > 20,
    wbc: wbc !== undefined ? (wbc > 12 || wbc < 4) : false,
  }

  const score = Object.values(criteria).filter(Boolean).length

  return {
    score,
    maxScore: 4,
    criteria,
    meetsSIRS: score >= 2,
  }
}

// ============================================================================
// Combined Assessment
// ============================================================================

/**
 * Generate comprehensive clinical scores summary
 * 
 * Combines qSOFA, NEWS2, and SIRS to provide overall sepsis risk
 * assessment and urgency level.
 * 
 * @param vitals - Current vital signs
 * @param options - Additional clinical context
 */
export function calculateClinicalScores(
  vitals: VitalSign,
  options: {
    gcs?: number
    isOnOxygen?: boolean
    isAlert?: boolean
    wbc?: number
  } = {}
): ClinicalScoresSummary {
  const { gcs = 15, isOnOxygen = false, isAlert = true, wbc } = options

  const qsofa = calculateQSOFA(vitals, gcs)
  const news2 = calculateNEWS2(vitals, isOnOxygen, isAlert)
  const sirs = calculateSIRS(vitals, wbc)

  // Determine sepsis likelihood based on combined scores
  let sepsisLikelihood: ClinicalScoresSummary['sepsisLikelihood']
  if (qsofa.score >= 2 && sirs.meetsSIRS) {
    sepsisLikelihood = 'likely'
  } else if (qsofa.score >= 2 || (sirs.meetsSIRS && news2.clinicalRisk === 'high')) {
    sepsisLikelihood = 'probable'
  } else if (sirs.meetsSIRS || news2.clinicalRisk === 'medium') {
    sepsisLikelihood = 'possible'
  } else {
    sepsisLikelihood = 'unlikely'
  }

  // Map to urgency level (1 = highest urgency)
  const urgencyMap: Record<NEWS2Result['clinicalRisk'], 1 | 2 | 3 | 4 | 5> = {
    'high': 1,
    'medium': 2,
    'low_medium': 3,
    'low': 5,
  }
  let urgencyLevel = urgencyMap[news2.clinicalRisk]
  
  // Escalate if qSOFA is high risk
  if (qsofa.interpretation === 'high_risk' && urgencyLevel > 2) {
    urgencyLevel = 2
  }

  return {
    qsofa,
    news2,
    sirs,
    sepsisLikelihood,
    urgencyLevel,
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format clinical score for display
 */
export function formatScoreDisplay(score: number, maxScore: number): string {
  return `${score}/${maxScore}`
}

/**
 * Get severity color class for a clinical risk level
 */
export function getRiskColorClass(risk: NEWS2Result['clinicalRisk']): string {
  const colors: Record<NEWS2Result['clinicalRisk'], string> = {
    'low': 'text-emerald-400',
    'low_medium': 'text-amber-400',
    'medium': 'text-orange-400',
    'high': 'text-red-400',
  }
  return colors[risk]
}

/**
 * Get severity color class for sepsis likelihood
 */
export function getSepsisColorClass(likelihood: ClinicalScoresSummary['sepsisLikelihood']): string {
  const colors: Record<ClinicalScoresSummary['sepsisLikelihood'], string> = {
    'unlikely': 'text-emerald-400',
    'possible': 'text-amber-400',
    'probable': 'text-orange-400',
    'likely': 'text-red-400',
  }
  return colors[likelihood]
}

