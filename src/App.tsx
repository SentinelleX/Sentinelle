import { useEffect, useRef, useCallback, useState } from 'react'
import { Header } from './components/layout/Header'
import { MainLayout } from './components/layout/MainLayout'
import { VitalsPanel } from './components/vitals/VitalsPanel'
import { ReasoningPanel } from './components/reasoning/ReasoningPanel'
import { ActionPanel } from './components/actions/ActionPanel'
import { AlertOverlay } from './components/alerts/AlertOverlay'
import { DemoControls } from './components/demo/DemoControls'
import { useSentinelStore } from './stores/sentinelStore'
import { sepsisScenario } from './data/scenarios/sepsisDeterioration'
import { createVitalsSimulator, VitalsSimulator } from './services/vitalsSimulator'
import { createReasoningEngine, ReasoningEngine } from './services/reasoningEngine'
import { executeResponseWorkflow, ActionStep, OrchestrationSummary } from './services/actionOrchestrator'

type Phase = 'monitoring' | 'reasoning' | 'alert' | 'executing' | 'complete'

function App() {
  const {
    currentPatient,
    setPatient,
    isDemoMode,
    setDemoMode,
    addVital,
    addReasoningStep,
    updateStepStatus,
    appendStepContent,
    setAgentActive,
    addAlert,
    activeAlerts,
    clearVitals,
    clearReasoningSteps,
  } = useSentinelStore()

  const [phase, setPhase] = useState<Phase>('monitoring')
  const [actions, setActions] = useState<ActionStep[]>([])
  const [actionProgress, setActionProgress] = useState<Record<string, string>>({})
  const [orchestrationSummary, setOrchestrationSummary] = useState<OrchestrationSummary | null>(null)

  const vitalsSimulatorRef = useRef<VitalsSimulator | null>(null)
  const reasoningEngineRef = useRef<ReasoningEngine | null>(null)
  const hasTriggeredRef = useRef(false)

  // Watch for alert acknowledgment to trigger Phase 2
  useEffect(() => {
    const store = useSentinelStore.getState()
    if (phase === 'alert' && activeAlerts.length === 0 && currentPatient) {
      // Alert was acknowledged - start executing actions
      setPhase('executing')

      const latestVitals = store.latestVitals || {
        heartRate: 116,
        bloodPressure: { systolic: 88, diastolic: 56 },
        temperature: 39.1,
        spO2: 93,
        respiratoryRate: 24,
      }

      executeResponseWorkflow(
        {
          id: currentPatient.id,
          name: currentPatient.name,
          mrn: currentPatient.mrn,
          location: currentPatient.location,
          weight: currentPatient.demographics.weight,
          vitals: latestVitals,
        },
        {
          onActionStart: (action) => {
            setActions(prev => [...prev, action])
          },
          onActionProgress: (actionId, message) => {
            setActionProgress(prev => ({ ...prev, [actionId]: message }))
          },
          onActionComplete: (actionId, result) => {
            setActions(prev =>
              prev.map(a =>
                a.id === actionId
                  ? { ...a, status: 'complete', result, endTime: Date.now() }
                  : a
              )
            )
            setActionProgress(prev => {
              const next = { ...prev }
              delete next[actionId]
              return next
            })
          },
          onActionError: (actionId, error) => {
            setActions(prev =>
              prev.map(a =>
                a.id === actionId
                  ? { ...a, status: 'error', result: error, endTime: Date.now() }
                  : a
              )
            )
          },
          onAllComplete: (summary) => {
            setOrchestrationSummary(summary)
            setPhase('complete')
          },
        }
      )
    }
  }, [phase, activeAlerts.length, currentPatient])

  // Initialize on mount
  useEffect(() => {
    setPatient(sepsisScenario.patient)
    setDemoMode(true)

    // Create reasoning engine with real Gemini AI
    reasoningEngineRef.current = createReasoningEngine({
      onStep: (step) => {
        addReasoningStep(step)
      },
      onStepUpdate: (id, status) => {
        updateStepStatus(id, status)
      },
      onStepContentAppend: (id, content) => {
        appendStepContent(id, content)
      },
      onComplete: () => {
        setAgentActive(false)
        setPhase('alert')
      },
      onAlert: (alert) => {
        addAlert(alert)
      },
      onError: (err) => {
        setAgentActive(false)
        console.error('Reasoning error:', err)
      },
    })

    // Create vitals simulator
    vitalsSimulatorRef.current = createVitalsSimulator({
      scenario: sepsisScenario,
      updateInterval: 1000,
      onVitalUpdate: (vital) => {
        addVital(vital)
      },
      onThresholdCrossed: (vital) => {
        // Trigger reasoning when threshold crossed (only once)
        // Always get fresh patient from store to avoid stale closure
        const store = useSentinelStore.getState()
        if (!hasTriggeredRef.current && reasoningEngineRef.current && store.currentPatient) {
          hasTriggeredRef.current = true
          setAgentActive(true)
          setPhase('reasoning')
          reasoningEngineRef.current.start(store.currentPatient, vital, store.vitals)
        }
      },
    })

    // Auto-start the simulator after a short delay to let the UI render
    setTimeout(() => {
      vitalsSimulatorRef.current?.start()
    }, 500)

    // Auto-trigger reasoning after 10 seconds regardless of thresholds
    const autoTriggerTimeout = setTimeout(() => {
      const store = useSentinelStore.getState()
      if (!hasTriggeredRef.current && reasoningEngineRef.current && store.currentPatient) {
        hasTriggeredRef.current = true
        setAgentActive(true)
        setPhase('reasoning')

        // Use current vitals or create realistic critical ones
        const currentVitals = store.latestVitals || {
          timestamp: Date.now(),
          heartRate: 112,
          bloodPressure: { systolic: 92, diastolic: 58 },
          temperature: 38.8,
          spO2: 94,
          respiratoryRate: 22,
        }

        reasoningEngineRef.current.start(store.currentPatient, currentVitals, store.vitals)
      }
    }, 10000) // 10 seconds

    return () => {
      vitalsSimulatorRef.current?.stop()
      reasoningEngineRef.current?.stop()
      clearTimeout(autoTriggerTimeout)
    }
  }, [])

  // Demo control functions
  const handleStartDemo = useCallback(() => {
    hasTriggeredRef.current = false
        setPhase('monitoring')
    setActions([])
    setActionProgress({})
    setOrchestrationSummary(null)
    vitalsSimulatorRef.current?.start()
  }, [])

  const handlePauseDemo = useCallback(() => {
    vitalsSimulatorRef.current?.pause()
  }, [])

  const handleResetDemo = useCallback(() => {
    vitalsSimulatorRef.current?.reset()
    reasoningEngineRef.current?.stop()
    hasTriggeredRef.current = false
        setPhase('monitoring')
    setActions([])
    setActionProgress({})
    setOrchestrationSummary(null)
    clearVitals()
    clearReasoningSteps()
    setAgentActive(false)
  }, [clearVitals, clearReasoningSteps, setAgentActive])

  const handleTriggerAgent = useCallback(() => {
    if (!hasTriggeredRef.current && reasoningEngineRef.current) {
      const store = useSentinelStore.getState()
      if (!store.currentPatient) return

      hasTriggeredRef.current = true
      setAgentActive(true)
      setPhase('reasoning')
      
      // Use current vitals or create critical ones
      const currentVitals = store.latestVitals || {
        timestamp: Date.now(),
        heartRate: 116,
        bloodPressure: { systolic: 88, diastolic: 56 },
        temperature: 39.1,
        spO2: 93,
        respiratoryRate: 24,
      }

      reasoningEngineRef.current.start(store.currentPatient, currentVitals, store.vitals)
    }
  }, [setAgentActive])

  // Determine which right panel to show based on phase
  const getRightPanel = () => {
    if (phase === 'executing' || phase === 'complete') {
      return (
        <ActionPanel
          actions={actions}
          currentProgress={actionProgress}
          summary={orchestrationSummary}
          isComplete={phase === 'complete'}
        />
      )
    }
    return <ReasoningPanel />
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />
      <MainLayout
        leftPanel={<VitalsPanel />}
        rightPanel={getRightPanel()}
      />
      <AlertOverlay />


      {/* Demo controls */}
      {isDemoMode && (
        <DemoControls
          onStart={handleStartDemo}
          onPause={handlePauseDemo}
          onReset={handleResetDemo}
          onTriggerAgent={handleTriggerAgent}
        />
      )}
    </div>
  )
}

export default App
