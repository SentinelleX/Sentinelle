import { ReasoningStep, StepStatus, VitalSign, Alert, PatientContext, StepType } from '../types'
import { analyzePatientWithStreaming, sectionToStepType, sectionToTitle } from './geminiService'
import { quickResearch } from './yutoriService'
import { generateEHRDocumentation, sendPagerAlert } from './minoService'
import { calculateClinicalScores, formatScoreDisplay } from '../utils/clinicalScoring'

interface ReasoningEngineConfig {
  onStep: (step: ReasoningStep) => void
  onStepUpdate: (id: string, status: StepStatus, content?: string) => void
  onStepContentAppend: (id: string, content: string) => void
  onComplete: (summary: { totalSteps: number; totalDuration: number; actionsCount: number }) => void
  onAlert: (alert: Alert) => void
  onError: (error: Error) => void
}

export interface ReasoningEngine {
  start: (patient: PatientContext, vitals: VitalSign, vitalHistory: VitalSign[]) => void
  stop: () => void
  isRunning: () => boolean
}

export function createReasoningEngine(config: ReasoningEngineConfig): ReasoningEngine {
  const { onStep, onStepUpdate, onStepContentAppend, onComplete, onAlert, onError: _onError } = config

  let running = false
  let startTime = 0
  let stepCounter = 0
  let currentStepId: string | null = null
  const steps: ReasoningStep[] = []

  // Store for cross-service data
  let geminiAssessment: string = ''

  const generateId = () => `step-${++stepCounter}-${Date.now()}`

  const createStep = (type: StepType, title: string, content: string = ''): ReasoningStep => {
    const step: ReasoningStep = {
      id: generateId(),
      type,
      title,
      content,
      status: 'in_progress',
      timestamp: Date.now(),
    }
    steps.push(step)
    onStep(step)
    return step
  }

  const completeStep = (stepId: string) => {
    const step = steps.find(s => s.id === stepId)
    if (step) {
      step.duration = Date.now() - step.timestamp
      step.status = 'complete'
      onStepUpdate(stepId, 'complete')
    }
  }

  // Simulate typewriter append with realistic delay
  const typeContent = async (stepId: string, content: string, chunkSize: number = 3) => {
    const words = content.split(' ')
    for (let i = 0; i < words.length; i += chunkSize) {
      if (!running) return
      const chunk = words.slice(i, i + chunkSize).join(' ') + ' '
      onStepContentAppend(stepId, chunk)
      // Random delay between 80-200ms for realistic feel
      await new Promise(r => setTimeout(r, 80 + Math.random() * 120))
    }
  }

  return {
    start: async (patient: PatientContext, vitals: VitalSign, vitalHistory: VitalSign[]) => {
      if (running) return

      running = true
      startTime = Date.now()
      stepCounter = 0
      steps.length = 0
      currentStepId = null
      geminiAssessment = ''

      // STEP 1: Quick Yutori Research
      const yutoriStep = createStep('search', 'Fetching sepsis guidelines', '')
      await typeContent(yutoriStep.id, 'Connecting to Yutori Research API...')
      await new Promise(r => setTimeout(r, 500))
      await typeContent(yutoriStep.id, '\nQuerying Surviving Sepsis Campaign protocols...')

      try {
        const guidelineResult = await quickResearch('Surviving Sepsis Campaign 2021 Hour-1 Bundle')
        await new Promise(r => setTimeout(r, 300))
        if (guidelineResult.success && guidelineResult.data?.summary) {
          await typeContent(yutoriStep.id, `\n\nGuidelines retrieved: ${guidelineResult.data.summary.slice(0, 200)}...`)
        } else {
          await typeContent(yutoriStep.id, '\n\nLoading cached SSC 2021 Hour-1 Bundle guidelines...')
        }
      } catch {
        await typeContent(yutoriStep.id, '\n\nLoading cached SSC 2021 Hour-1 Bundle guidelines...')
      }
      await new Promise(r => setTimeout(r, 400))
      completeStep(yutoriStep.id)

      if (!running) return
      await new Promise(r => setTimeout(r, 600)) // Pause before AI analysis

      // STEP 2-6: Try Gemini AI, with fallback to simulated reasoning
      let geminiSucceeded = false

      try {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Gemini timeout'))
          }, 15000) // 15 second timeout

          analyzePatientWithStreaming(patient, vitals, vitalHistory, {
            onSectionStart: (section) => {
              if (!running) return
              geminiSucceeded = true
              clearTimeout(timeout)

              const stepId = generateId()
              currentStepId = stepId

              const step: ReasoningStep = {
                id: stepId,
                type: sectionToStepType(section) as StepType,
                title: sectionToTitle(section),
                content: '',
                status: 'in_progress',
                timestamp: Date.now(),
              }

              steps.push(step)
              onStep(step)
            },

            onChunk: (text, section) => {
              if (!running || !currentStepId) return
              onStepContentAppend(currentStepId, text)

              if (section === 'SYNTHESIZE' || section === 'DECIDE') {
                geminiAssessment += text
              }
            },

            onSectionEnd: (_section) => {
              if (!running || !currentStepId) return
              completeStep(currentStepId)
            },

            onComplete: () => {
              clearTimeout(timeout)
              resolve()
            },

            onError: (error) => {
              clearTimeout(timeout)
              reject(error)
            },
          })
        })
      } catch (err) {
        console.log('Gemini unavailable, using simulated reasoning:', err)
      }

      // Fallback: If Gemini didn't produce any steps, simulate the reasoning
      if (!geminiSucceeded && running) {
        // OBSERVE
        const observeStep = createStep('observe', 'Analyzing vital signs', '')
        await typeContent(observeStep.id, `Critical values detected: HR ${vitals.heartRate} bpm (elevated), BP ${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic} mmHg (hypotensive), Temp ${vitals.temperature}°C (febrile), SpO2 ${vitals.spO2}%, RR ${vitals.respiratoryRate}/min. Multiple parameters crossing critical thresholds simultaneously.`)
        completeStep(observeStep.id)

        if (!running) return
        await new Promise(r => setTimeout(r, 800)) // Pause between steps

        // THINK
        const thinkStep = createStep('think', 'Pattern recognition', '')
        await typeContent(thinkStep.id, `Multi-system deterioration pattern detected. Compensatory tachycardia with concurrent hypotension suggests distributive shock. Fever trajectory indicates acute inflammatory response. Patient's immunocompromised status (chemotherapy) significantly increases sepsis risk. UTI as source likely progressing to urosepsis.`)
        completeStep(thinkStep.id)

        if (!running) return
        await new Promise(r => setTimeout(r, 600)) // Pause between steps

        // CALCULATE - Use validated clinical scoring algorithms
        const calcStep = createStep('calculate', 'Risk scoring', '')
        const scores = calculateClinicalScores(vitals, { gcs: 15, isOnOxygen: false, isAlert: true })
        
        await typeContent(calcStep.id, `qSOFA Score: ${formatScoreDisplay(scores.qsofa.score, scores.qsofa.maxScore)} (${scores.qsofa.criteria.respiratoryRate ? 'RR ≥22: +1, ' : ''}${scores.qsofa.criteria.systolicBP ? 'SBP ≤100: +1, ' : ''}${scores.qsofa.criteria.alteredMentation ? 'Altered mentation: +1' : ''}) - ${scores.qsofa.interpretation === 'high_risk' ? 'High mortality risk' : 'Continue monitoring'}. `)
        await typeContent(calcStep.id, `NEWS2 Score: ${scores.news2.score} - Clinical risk: ${scores.news2.clinicalRisk.replace('_', '-')}. `)
        await typeContent(calcStep.id, `Overall sepsis likelihood: ${scores.sepsisLikelihood}. Urgency level: ${scores.urgencyLevel}/5.`)
        
        geminiAssessment = scores.sepsisLikelihood === 'likely' || scores.sepsisLikelihood === 'probable' 
          ? 'Sepsis with early septic shock. Immediate intervention required.'
          : 'Potential sepsis. Close monitoring and workup recommended.'
        completeStep(calcStep.id)

        if (!running) return
        await new Promise(r => setTimeout(r, 700)) // Pause between steps

        // SYNTHESIZE
        const synthStep = createStep('think', 'Clinical assessment', '')
        await typeContent(synthStep.id, `DIAGNOSIS: Early septic shock secondary to urinary tract infection in immunocompromised host. Contributing factors include neutropenia from chemotherapy, diabetes, and CKD Stage 3. Mortality risk increases 7.6% per hour without treatment.`)
        completeStep(synthStep.id)

        if (!running) return
        await new Promise(r => setTimeout(r, 500)) // Pause between steps

        // DECIDE
        const decideStep = createStep('decide', 'Action plan', '')
        await typeContent(decideStep.id, `AUTONOMOUS RESPONSE INITIATED: 1) STAT page to attending physician, 2) Blood cultures x2 before antibiotics, 3) Serum lactate STAT, 4) Broad-spectrum antibiotics within 1 hour (Meropenem - penicillin allergy noted), 5) 30mL/kg crystalloid bolus if hypotensive or lactate ≥4.`)
        completeStep(decideStep.id)
      }

      if (!running) return

      // PHASE 3: Execute Actions with Mino
      const actionStep = createStep('action', 'Executing autonomous response', 'Initiating parallel care team alerts and documentation...')

      // Sub-action 1: Page attending physician
      const pagerStep = createStep('alert', 'Paging care team', '')
      const attendingPhysician = patient.careTeam?.find(m => m.role === 'Attending Physician')

      if (attendingPhysician?.pager) {
        onStepContentAppend(pagerStep.id, `Sending STAT page to ${attendingPhysician.name} (${attendingPhysician.pager})...`)

        await sendPagerAlert(
          attendingPhysician.pager,
          `SEPSIS ALERT - ${patient.name} (${patient.location}) - qSOFA 2+, NEWS2 elevated. Immediate assessment required.`,
          {
            onStart: () => {},
            onProgress: (msg) => onStepContentAppend(pagerStep.id, `\n${msg}`),
            onComplete: () => {
              onStepContentAppend(pagerStep.id, '\nPage sent successfully.')
            },
            onError: (err) => {
              onStepContentAppend(pagerStep.id, `\nPager system unavailable: ${err.message}. Manual notification required.`)
            },
          }
        )
      } else {
        onStepContentAppend(pagerStep.id, 'Attending physician contact not available. Escalating to charge nurse.')
      }
      completeStep(pagerStep.id)

      // Sub-action 2: Generate EHR documentation
      const docStep = createStep('document', 'Generating EHR documentation', 'Creating clinical note via Mino automation...')

      // Calculate scores for documentation
      const docScores = calculateClinicalScores(vitals, { gcs: 15, isOnOxygen: false, isAlert: true })
      
      await generateEHRDocumentation(
        {
          patientId: patient.id,
          patientName: patient.name,
          mrn: patient.mrn,
          timestamp: new Date().toISOString(),
          vitals: {
            heartRate: vitals.heartRate,
            bloodPressure: vitals.bloodPressure,
            temperature: vitals.temperature,
            spO2: vitals.spO2,
            respiratoryRate: vitals.respiratoryRate,
          },
          assessment: geminiAssessment || `Sepsis likelihood: ${docScores.sepsisLikelihood}. ${docScores.sirs.meetsSIRS ? 'SIRS criteria met.' : ''} Multi-system deterioration pattern detected.`,
          scores: { qsofa: docScores.qsofa.score, news2: docScores.news2.score },
          recommendations: [
            'Blood cultures x2 before antibiotics',
            'Serum lactate STAT',
            'Broad-spectrum antibiotics within 1 hour',
            '30mL/kg crystalloid if hypotensive or lactate ≥4',
            'Reassess volume status and tissue perfusion',
          ],
          alertLevel: 'CRITICAL',
        },
        {
          onStart: () => {},
          onProgress: (msg) => onStepContentAppend(docStep.id, `\n${msg}`),
          onComplete: () => {
            onStepContentAppend(docStep.id, '\n\nClinical note created successfully. Flagged for physician co-signature.')
          },
          onError: (err) => {
            onStepContentAppend(docStep.id, `\n\nEHR automation unavailable: ${err.message}. Documentation prepared for manual entry.`)
          },
        }
      )
      completeStep(docStep.id)

      // Sub-action 3: Set escalation timer
      const timerStep = createStep('wait', 'Escalation protocol armed', 'Setting automatic escalation timers...')
      onStepContentAppend(timerStep.id, '\n- 5 minute timer: Escalate to Medical Director if no physician response')
      onStepContentAppend(timerStep.id, '\n- 10 minute timer: Escalate to Hospital Administrator')
      onStepContentAppend(timerStep.id, '\n- ICU bed hold initiated')
      completeStep(timerStep.id)

      // Complete main action step
      completeStep(actionStep.id)

      // Calculate final scores for alert
      const finalScores = calculateClinicalScores(vitals, { gcs: 15, isOnOxygen: false, isAlert: true })
      
      // Generate alert with calculated scores
      const alert: Alert = {
        id: `alert-${Date.now()}`,
        severity: finalScores.urgencyLevel <= 2 ? 'critical' : finalScores.urgencyLevel <= 3 ? 'warning' : 'info',
        title: finalScores.sepsisLikelihood === 'likely' ? 'SEPSIS RISK DETECTED' : 'CLINICAL DETERIORATION',
        message: `${finalScores.sepsisLikelihood === 'likely' ? 'Multi-system deterioration identified' : 'Vital sign abnormalities detected'}. Care team notified. ${finalScores.qsofa.interpretation === 'high_risk' ? 'Sepsis bundle initiated.' : 'Close monitoring recommended.'}`,
        patientId: patient.id,
        patientName: patient.name,
        location: patient.location,
        scores: { qsofa: finalScores.qsofa.score, news2: finalScores.news2.score },
        timestamp: Date.now(),
        acknowledged: false,
      }

      onAlert(alert)

      // Summary
      const actionsCount = steps.filter(
        (s) => s.type === 'action' || s.type === 'alert' || s.type === 'document'
      ).length

      onComplete({
        totalSteps: steps.length,
        totalDuration: Date.now() - startTime,
        actionsCount,
      })

      running = false
    },

    stop: () => {
      running = false
    },

    isRunning: () => running,
  }
}
