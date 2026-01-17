import { GoogleGenerativeAI } from '@google/generative-ai'
import { PatientContext, VitalSign } from '../types'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')

const CLINICAL_SYSTEM_PROMPT = `You are Sentinelle, an AI monitoring ICU patients for sepsis.

Analyze this patient BRIEFLY. Use this EXACT format with short responses (2-3 sentences max per section):

[OBSERVE]
Current vitals summary. What's abnormal?

[THINK]
Pattern analysis. What does this suggest?

[CALCULATE]
qSOFA score (RR>=22, SBP<=100, altered mental = 1 point each). NEWS2 estimate.

[SYNTHESIZE]
Clinical assessment in 1-2 sentences.

[DECIDE]
Actions: who to alert, what to order.

BE CONCISE. No lengthy explanations.`

export interface StreamCallbacks {
  onChunk: (text: string, section: string) => void
  onSectionStart: (section: string) => void
  onSectionEnd: (section: string) => void
  onComplete: () => void
  onError: (error: Error) => void
}

export async function analyzePatientWithStreaming(
  patient: PatientContext,
  vitals: VitalSign,
  _vitalHistory: VitalSign[],
  callbacks: StreamCallbacks
): Promise<void> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `${CLINICAL_SYSTEM_PROMPT}

Patient: ${patient.name}, ${patient.demographics.age}${patient.demographics.sex}, ${patient.location}
Chief complaint: ${patient.diagnoses[0]?.description || 'Unknown'}

VITALS NOW:
HR: ${vitals.heartRate} | BP: ${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic} | Temp: ${vitals.temperature}C | SpO2: ${vitals.spO2}% | RR: ${vitals.respiratoryRate}

Recent labs: ${patient.recentLabs.slice(0, 3).map(l => `${l.name}:${l.value}`).join(', ')}

Analyze now. Keep each section to 2-3 sentences MAX.`

  try {
    const result = await model.generateContentStream(prompt)

    let currentSection = ''
    let fullText = ''
    const sections = ['OBSERVE', 'THINK', 'CALCULATE', 'SYNTHESIZE', 'DECIDE']

    for await (const chunk of result.stream) {
      const text = chunk.text()
      fullText += text

      // Check for new section markers
      for (const section of sections) {
        const marker = `[${section}]`
        const markerIndex = fullText.lastIndexOf(marker)

        if (markerIndex !== -1 && currentSection !== section) {
          // End previous section
          if (currentSection) {
            callbacks.onSectionEnd(currentSection)
          }
          // Start new section
          currentSection = section
          callbacks.onSectionStart(section)
        }
      }

      // Send chunk to current section
      if (currentSection && text) {
        // Clean out section markers from the text
        let cleanText = text
        for (const s of sections) {
          cleanText = cleanText.replace(`[${s}]`, '')
        }
        if (cleanText.trim()) {
          callbacks.onChunk(cleanText, currentSection)
        }
      }
    }

    // End final section
    if (currentSection) {
      callbacks.onSectionEnd(currentSection)
    }

    callbacks.onComplete()
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)))
  }
}

export function sectionToStepType(section: string): string {
  const map: Record<string, string> = {
    'OBSERVE': 'observe',
    'THINK': 'think',
    'CALCULATE': 'calculate',
    'SYNTHESIZE': 'think',
    'DECIDE': 'decide',
  }
  return map[section] || 'think'
}

export function sectionToTitle(section: string): string {
  const map: Record<string, string> = {
    'OBSERVE': 'Analyzing vital signs',
    'THINK': 'Pattern recognition',
    'CALCULATE': 'Risk scoring',
    'SYNTHESIZE': 'Clinical assessment',
    'DECIDE': 'Action plan',
  }
  return map[section] || section
}
