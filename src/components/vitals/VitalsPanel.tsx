import { useMemo } from 'react'
import { useSentinelStore } from '../../stores/sentinelStore'
import { VitalCard } from './VitalCard'
import { VitalsChart } from './VitalsChart'
import { PatientContext } from '../patient/PatientContext'
import { vitalThresholds } from '../../data/scenarios/sepsisDeterioration'
import { TrendDirection } from '../../types'

export function VitalsPanel() {
  const { latestVitals, vitals, currentPatient } = useSentinelStore()

  // Calculate baseline (first reading or fallback)
  const baseline = vitals[0] || {
    heartRate: 78,
    bloodPressure: { systolic: 128, diastolic: 78 },
    temperature: 37.2,
    spO2: 97,
    respiratoryRate: 16,
  }

  // Calculate trends
  const getTrend = (current: number, base: number): TrendDirection => {
    const diff = current - base
    if (Math.abs(diff) < 2) return 'stable'
    return diff > 0 ? 'up' : 'down'
  }

  const vitalsData = useMemo(() => {
    if (!latestVitals) return null

    return {
      heartRate: {
        value: latestVitals.heartRate,
        trend: getTrend(latestVitals.heartRate, baseline.heartRate),
        trendValue: Math.round(latestVitals.heartRate - baseline.heartRate),
      },
      bloodPressure: {
        value: latestVitals.bloodPressure,
        trend: getTrend(
          latestVitals.bloodPressure.systolic,
          baseline.bloodPressure.systolic
        ),
        trendValue: Math.round(
          latestVitals.bloodPressure.systolic - baseline.bloodPressure.systolic
        ),
      },
      temperature: {
        value: latestVitals.temperature,
        trend: getTrend(latestVitals.temperature, baseline.temperature),
        trendValue:
          Math.round((latestVitals.temperature - baseline.temperature) * 10) / 10,
      },
      spO2: {
        value: latestVitals.spO2,
        trend: getTrend(latestVitals.spO2, baseline.spO2),
        trendValue: Math.round(latestVitals.spO2 - baseline.spO2),
      },
      respiratoryRate: {
        value: latestVitals.respiratoryRate,
        trend: getTrend(latestVitals.respiratoryRate, baseline.respiratoryRate),
        trendValue: Math.round(
          latestVitals.respiratoryRate - baseline.respiratoryRate
        ),
      },
    }
  }, [latestVitals, baseline])

  if (!vitalsData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-text-tertiary">Awaiting vital signs...</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto">
      {/* Vital cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <VitalCard
          type="heartRate"
          value={vitalsData.heartRate.value}
          unit="bpm"
          trend={vitalsData.heartRate.trend}
          trendValue={Math.abs(vitalsData.heartRate.trendValue)}
          thresholds={vitalThresholds.heartRate}
        />
        <VitalCard
          type="bloodPressure"
          value={vitalsData.bloodPressure.value}
          unit="mmHg"
          trend={vitalsData.bloodPressure.trend}
          trendValue={Math.abs(vitalsData.bloodPressure.trendValue)}
          thresholds={vitalThresholds.bloodPressure.systolic}
        />
        <VitalCard
          type="temperature"
          value={vitalsData.temperature.value}
          unit="°C"
          trend={vitalsData.temperature.trend}
          trendValue={Math.abs(vitalsData.temperature.trendValue)}
          thresholds={vitalThresholds.temperature}
        />
        <VitalCard
          type="spO2"
          value={vitalsData.spO2.value}
          unit="%"
          trend={vitalsData.spO2.trend}
          trendValue={Math.abs(vitalsData.spO2.trendValue)}
          thresholds={vitalThresholds.spO2}
        />
        <VitalCard
          type="respiratoryRate"
          value={vitalsData.respiratoryRate.value}
          unit="/min"
          trend={vitalsData.respiratoryRate.trend}
          trendValue={Math.abs(vitalsData.respiratoryRate.trendValue)}
          thresholds={vitalThresholds.respiratoryRate}
        />
      </div>

      {/* Vitals chart */}
      <div className="flex-shrink-0 h-64 bg-bg-tertiary rounded-lg border border-border-subtle p-4">
        <VitalsChart
          data={vitals}
          visibleVitals={['heartRate', 'bloodPressure', 'spO2']}
          timeWindow={30}
        />
      </div>

      {/* Patient context */}
      {currentPatient && (
        <div className="flex-grow min-h-0">
          <PatientContext patient={currentPatient} />
        </div>
      )}
    </div>
  )
}
