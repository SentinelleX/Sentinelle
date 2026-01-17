import { VitalSign, DemoScenario } from '../types'
import { interpolateVitals } from '../data/scenarios/sepsisDeterioration'

interface VitalsSimulatorConfig {
  scenario: DemoScenario
  updateInterval?: number // ms
  onVitalUpdate: (vital: VitalSign) => void
  onThresholdCrossed?: (vital: VitalSign) => void
}

export interface VitalsSimulator {
  start: () => void
  stop: () => void
  pause: () => void
  resume: () => void
  reset: () => void
  getElapsedTime: () => number
  isRunning: () => boolean
}

export function createVitalsSimulator(config: VitalsSimulatorConfig): VitalsSimulator {
  const { scenario, updateInterval = 1000, onVitalUpdate, onThresholdCrossed } = config

  let intervalId: number | null = null
  let startTime: number | null = null
  let pausedAt: number | null = null
  let totalPausedTime = 0
  let running = false

  // Threshold crossing detection
  let lastStatus = {
    hr: 'normal',
    bp: 'normal',
    temp: 'normal',
    spo2: 'normal',
    rr: 'normal',
  }

  const getVitalStatus = (value: number, thresholds: { warningHigh?: number; criticalHigh?: number; warningLow?: number; criticalLow?: number }) => {
    if ((thresholds.criticalHigh && value >= thresholds.criticalHigh) ||
        (thresholds.criticalLow && value <= thresholds.criticalLow)) {
      return 'critical'
    }
    if ((thresholds.warningHigh && value >= thresholds.warningHigh) ||
        (thresholds.warningLow && value <= thresholds.warningLow)) {
      return 'warning'
    }
    return 'normal'
  }

  const thresholds = {
    hr: { warningHigh: 100, criticalHigh: 120 },
    bp: { warningLow: 95, criticalLow: 85 },
    temp: { warningHigh: 38.0, criticalHigh: 39.0 },
    spo2: { warningLow: 94, criticalLow: 90 },
    rr: { warningHigh: 20, criticalHigh: 25 },
  }

  const tick = () => {
    if (!startTime) return

    const now = Date.now()
    const elapsedMs = now - startTime - totalPausedTime
    const elapsedSeconds = elapsedMs / 1000

    // Interpolate vitals based on elapsed time
    const interpolated = interpolateVitals(scenario.deterioration, elapsedSeconds)

    const vital: VitalSign = {
      timestamp: now,
      heartRate: interpolated.hr,
      bloodPressure: {
        systolic: interpolated.sbp,
        diastolic: interpolated.dbp,
      },
      temperature: interpolated.temp,
      spO2: interpolated.spo2,
      respiratoryRate: interpolated.rr,
    }

    // Check for threshold crossings
    const currentStatus = {
      hr: getVitalStatus(vital.heartRate, thresholds.hr),
      bp: getVitalStatus(vital.bloodPressure.systolic, thresholds.bp),
      temp: getVitalStatus(vital.temperature, thresholds.temp),
      spo2: getVitalStatus(vital.spO2, thresholds.spo2),
      rr: getVitalStatus(vital.respiratoryRate, thresholds.rr),
    }

    // Detect if any vital crossed into critical
    const crossedCritical =
      (lastStatus.hr !== 'critical' && currentStatus.hr === 'critical') ||
      (lastStatus.bp !== 'critical' && currentStatus.bp === 'critical') ||
      (lastStatus.temp !== 'critical' && currentStatus.temp === 'critical') ||
      (lastStatus.spo2 !== 'critical' && currentStatus.spo2 === 'critical') ||
      (lastStatus.rr !== 'critical' && currentStatus.rr === 'critical')

    lastStatus = currentStatus

    // Emit update
    onVitalUpdate(vital)

    // Notify threshold crossing
    if (crossedCritical && onThresholdCrossed) {
      onThresholdCrossed(vital)
    }
  }

  return {
    start: () => {
      if (running) return
      startTime = Date.now()
      totalPausedTime = 0
      running = true
      intervalId = window.setInterval(tick, updateInterval)
      // Immediate first tick
      tick()
    },

    stop: () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
      running = false
      startTime = null
      pausedAt = null
      totalPausedTime = 0
    },

    pause: () => {
      if (!running || pausedAt) return
      pausedAt = Date.now()
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    },

    resume: () => {
      if (!pausedAt) return
      totalPausedTime += Date.now() - pausedAt
      pausedAt = null
      intervalId = window.setInterval(tick, updateInterval)
    },

    reset: () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
      running = false
      startTime = null
      pausedAt = null
      totalPausedTime = 0
      lastStatus = {
        hr: 'normal',
        bp: 'normal',
        temp: 'normal',
        spo2: 'normal',
        rr: 'normal',
      }
    },

    getElapsedTime: () => {
      if (!startTime) return 0
      const now = pausedAt || Date.now()
      return (now - startTime - totalPausedTime) / 1000
    },

    isRunning: () => running && !pausedAt,
  }
}
