import { create } from 'zustand'
import {
  SentinelleState,
  PatientContext,
  VitalSign,
  ReasoningStep,
  StepStatus,
  Alert,
} from '../types'

export const useSentinelStore = create<SentinelleState>((set) => ({
  // Patient
  currentPatient: null,

  // Vitals
  vitals: [],
  latestVitals: null,

  // Reasoning
  reasoningSteps: [],
  isAgentActive: false,
  currentTraceId: null,

  // Alerts
  activeAlerts: [],
  alertHistory: [],

  // UI
  selectedStepId: null,
  isTraceModalOpen: false,
  isDemoMode: false,

  // Actions
  setPatient: (patient: PatientContext) => set({ currentPatient: patient }),

  addVital: (vital: VitalSign) =>
    set((state) => ({
      vitals: [...state.vitals.slice(-60), vital], // Keep last 60 readings
      latestVitals: vital,
    })),

  clearVitals: () => set({ vitals: [], latestVitals: null }),

  addReasoningStep: (step: ReasoningStep) =>
    set((state) => ({
      reasoningSteps: [...state.reasoningSteps, step],
    })),

  updateStepStatus: (id: string, status: StepStatus) =>
    set((state) => ({
      reasoningSteps: updateStepStatusRecursive(state.reasoningSteps, id, status),
    })),

  appendStepContent: (id: string, content: string) =>
    set((state) => ({
      reasoningSteps: appendContentRecursive(state.reasoningSteps, id, content),
    })),

  clearReasoningSteps: () => set({ reasoningSteps: [], isAgentActive: false }),

  setAgentActive: (active: boolean) => set({ isAgentActive: active }),

  addAlert: (alert: Alert) =>
    set((state) => ({
      activeAlerts: [...state.activeAlerts, alert],
    })),

  acknowledgeAlert: (alertId: string, acknowledgedBy?: string) =>
    set((state) => {
      const alert = state.activeAlerts.find((a) => a.id === alertId)
      if (!alert) return state

      const acknowledgedAlert: Alert = {
        ...alert,
        acknowledged: true,
        acknowledgedBy,
        acknowledgedAt: Date.now(),
      }

      return {
        activeAlerts: state.activeAlerts.filter((a) => a.id !== alertId),
        alertHistory: [...state.alertHistory, acknowledgedAlert],
      }
    }),

  dismissAlert: (alertId: string) =>
    set((state) => ({
      activeAlerts: state.activeAlerts.filter((a) => a.id !== alertId),
    })),

  setSelectedStep: (stepId: string | null) => set({ selectedStepId: stepId }),

  openTraceModal: () => set({ isTraceModalOpen: true }),

  closeTraceModal: () => set({ isTraceModalOpen: false }),

  setDemoMode: (enabled: boolean) => set({ isDemoMode: enabled }),

  reset: () =>
    set({
      vitals: [],
      latestVitals: null,
      reasoningSteps: [],
      isAgentActive: false,
      currentTraceId: null,
      activeAlerts: [],
      selectedStepId: null,
      isTraceModalOpen: false,
    }),
}))

// Helper function to recursively update step status
function updateStepStatusRecursive(
  steps: ReasoningStep[],
  id: string,
  status: StepStatus
): ReasoningStep[] {
  return steps.map((step) => {
    if (step.id === id) {
      return { ...step, status }
    }
    if (step.children) {
      return {
        ...step,
        children: updateStepStatusRecursive(step.children, id, status),
      }
    }
    return step
  })
}

// Helper function to recursively append content
function appendContentRecursive(
  steps: ReasoningStep[],
  id: string,
  content: string
): ReasoningStep[] {
  return steps.map((step) => {
    if (step.id === id) {
      return { ...step, content: (step.content || '') + content }
    }
    if (step.children) {
      return {
        ...step,
        children: appendContentRecursive(step.children, id, content),
      }
    }
    return step
  })
}
