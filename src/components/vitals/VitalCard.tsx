import { motion } from 'framer-motion'
import {
  Heart,
  Activity,
  Thermometer,
  Droplet,
  Wind,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { VitalCardProps, VitalType, TrendDirection, VitalStatus } from '../../types'
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber'

const vitalIcons: Record<VitalType, React.ElementType> = {
  heartRate: Heart,
  bloodPressure: Activity,
  temperature: Thermometer,
  spO2: Droplet,
  respiratoryRate: Wind,
}

const vitalLabels: Record<VitalType, string> = {
  heartRate: 'Heart Rate',
  bloodPressure: 'Blood Pressure',
  temperature: 'Temperature',
  spO2: 'SpO2',
  respiratoryRate: 'Respiratory Rate',
}

const trendIcons: Record<TrendDirection, React.ElementType> = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
}

const statusColors: Record<VitalStatus, { text: string; border: string; bg: string }> = {
  normal: {
    text: 'text-status-normal',
    border: 'border-status-normal/30',
    bg: 'bg-status-normal/5',
  },
  warning: {
    text: 'text-status-warning',
    border: 'border-status-warning/40',
    bg: 'bg-status-warning/5',
  },
  critical: {
    text: 'text-status-critical',
    border: 'border-status-critical/40',
    bg: 'bg-status-critical/5',
  },
}

function getVitalStatus(
  value: number,
  thresholds: VitalCardProps['thresholds']
): VitalStatus {
  if (
    (thresholds.criticalHigh !== undefined && value >= thresholds.criticalHigh) ||
    (thresholds.criticalLow !== undefined && value <= thresholds.criticalLow)
  ) {
    return 'critical'
  }
  if (
    (thresholds.warningHigh !== undefined && value >= thresholds.warningHigh) ||
    (thresholds.warningLow !== undefined && value <= thresholds.warningLow)
  ) {
    return 'warning'
  }
  return 'normal'
}

export function VitalCard({
  type,
  value,
  unit,
  trend,
  trendValue,
  thresholds,
  onClick,
}: VitalCardProps) {
  const Icon = vitalIcons[type]
  const TrendIcon = trendIcons[trend]

  // Handle blood pressure (compound value)
  const isBP = type === 'bloodPressure' && typeof value === 'object'
  const displayValue = isBP
    ? (value as { systolic: number; diastolic: number }).systolic
    : (value as number)
  const diastolicValue = isBP
    ? (value as { systolic: number; diastolic: number }).diastolic
    : null

  const status = getVitalStatus(displayValue, thresholds)
  const colors = statusColors[status]

  const { displayValue: animatedValue } = useAnimatedNumber({
    value: displayValue,
    duration: 300,
    decimals: type === 'temperature' ? 1 : 0,
  })

  const { displayValue: animatedDiastolic } = useAnimatedNumber({
    value: diastolicValue || 0,
    duration: 300,
    decimals: 0,
  })

  // Determine trend color
  const getTrendColor = () => {
    if (trend === 'stable') return 'text-text-tertiary'
    // Rising HR or RR is bad, falling BP or SpO2 is bad
    const isBadTrend =
      (trend === 'up' && (type === 'heartRate' || type === 'respiratoryRate' || type === 'temperature')) ||
      (trend === 'down' && (type === 'bloodPressure' || type === 'spO2'))
    return isBadTrend ? 'text-status-warning' : 'text-status-normal'
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        relative p-5 rounded-xl border cursor-pointer overflow-hidden
        transition-all duration-300 ease-out
        ${colors.border} ${colors.bg}
      `}
    >
      {/* Background gradient for critical */}
      {status === 'critical' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-status-critical/10 to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Header row */}
      <div className="flex items-center justify-between mb-4 relative">
        <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <span className="text-caption text-text-tertiary uppercase tracking-wider font-medium">
          {vitalLabels[type].slice(0, 4)}
        </span>
      </div>

      {/* Value display */}
      <div className="relative mb-2">
        <motion.span
          className={`vital-value ${colors.text}`}
          key={displayValue}
          initial={{ opacity: 0.5, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isBP ? `${animatedValue}/${animatedDiastolic}` : animatedValue}
        </motion.span>
      </div>

      {/* Unit */}
      <div className="text-body-small text-text-secondary mb-4">{unit}</div>

      {/* Trend indicator */}
      {trend !== 'stable' && trendValue !== undefined && trendValue !== 0 && (
        <motion.div
          className={`flex items-center gap-1.5 ${getTrendColor()}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <TrendIcon size={14} strokeWidth={2} />
          <span className="text-caption font-mono font-medium">
            {trend === 'up' ? '+' : ''}{trendValue}
          </span>
          <span className="text-caption text-text-tertiary">from baseline</span>
        </motion.div>
      )}

      {/* Threshold bar */}
      <ThresholdBar value={displayValue} thresholds={thresholds} status={status} />

      {/* Status indicator dot */}
      {status !== 'normal' && (
        <motion.div
          className={`absolute top-3 right-3 w-2 h-2 rounded-full ${
            status === 'critical' ? 'bg-status-critical' : 'bg-status-warning'
          }`}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  )
}

interface ThresholdBarProps {
  value: number
  thresholds: VitalCardProps['thresholds']
  status: VitalStatus
}

function ThresholdBar({ value, thresholds, status }: ThresholdBarProps) {
  // Calculate position of current value on the bar
  const min = thresholds.criticalLow || 0
  const max = thresholds.criticalHigh || 200
  const range = max - min
  const position = Math.max(0, Math.min(100, ((value - min) / range) * 100))

  // Calculate warning and critical zone positions
  const warningLowPos = thresholds.warningLow
    ? ((thresholds.warningLow - min) / range) * 100
    : 0
  const warningHighPos = thresholds.warningHigh
    ? ((thresholds.warningHigh - min) / range) * 100
    : 100

  return (
    <div className="mt-4 relative h-1.5 bg-border-subtle rounded-full overflow-hidden">
      {/* Normal zone (center) */}
      <div
        className="absolute h-full bg-status-normal/30"
        style={{
          left: `${warningLowPos}%`,
          width: `${warningHighPos - warningLowPos}%`,
        }}
      />

      {/* Warning zones */}
      {thresholds.warningLow && (
        <div
          className="absolute h-full bg-status-warning/30"
          style={{
            left: `${((thresholds.criticalLow || 0) - min) / range * 100}%`,
            width: `${warningLowPos - ((thresholds.criticalLow || 0) - min) / range * 100}%`,
          }}
        />
      )}
      {thresholds.warningHigh && (
        <div
          className="absolute h-full bg-status-warning/30"
          style={{
            left: `${warningHighPos}%`,
            width: `${100 - warningHighPos}%`,
          }}
        />
      )}

      {/* Current value indicator */}
      <motion.div
        className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-md ${
          status === 'critical' ? 'bg-status-critical' :
          status === 'warning' ? 'bg-status-warning' : 'bg-text-primary'
        }`}
        initial={false}
        animate={{ left: `${position}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ marginLeft: '-6px' }}
      />
    </div>
  )
}
