import { motion } from 'framer-motion'
import { AlertTriangle, X, CheckCircle } from 'lucide-react'
import { AlertToastProps, AlertSeverity } from '../../types'

const severityStyles: Record<AlertSeverity, {
  border: string
  bg: string
  icon: string
}> = {
  low: {
    border: 'border-l-status-info',
    bg: 'bg-status-info/5',
    icon: 'text-status-info',
  },
  medium: {
    border: 'border-l-status-warning',
    bg: 'bg-status-warning/5',
    icon: 'text-status-warning',
  },
  high: {
    border: 'border-l-status-critical',
    bg: 'bg-status-critical/5',
    icon: 'text-status-critical',
  },
  critical: {
    border: 'border-l-status-critical',
    bg: 'bg-status-critical/10',
    icon: 'text-status-critical',
  },
}

export function AlertToast({
  alert,
  onAcknowledge,
  onDismiss,
  onExpand,
}: AlertToastProps) {
  const styles = severityStyles[alert.severity]

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`
        w-96 max-w-full rounded-lg border border-border-subtle
        border-l-[3px] ${styles.border} ${styles.bg}
        bg-bg-elevated shadow-lg
        ${alert.severity === 'critical' ? 'animate-pulse-subtle' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex items-start gap-3">
          <AlertTriangle
            size={20}
            className={`${styles.icon} flex-shrink-0 mt-0.5`}
            strokeWidth={1.5}
          />
          <div>
            <h4 className="text-body text-text-primary font-normal">
              {alert.title}
            </h4>
          </div>
        </div>
        <button
          onClick={() => onDismiss(alert.id)}
          className="p-1 hover:bg-bg-primary/50 rounded transition-colors"
          aria-label="Dismiss alert"
        >
          <X size={16} className="text-text-tertiary" />
        </button>
      </div>

      {/* Body */}
      <div
        className="px-4 pb-3 cursor-pointer"
        onClick={() => onExpand?.(alert.id)}
      >
        <p className="text-body-small text-text-secondary mb-2">
          {alert.message}
        </p>
        <div className="flex items-center gap-2 text-caption text-text-tertiary">
          <span>
            Patient: <span className="text-text-primary">{alert.patientName}</span>
          </span>
          <span>|</span>
          <span>{alert.location}</span>
        </div>
        {alert.scores && (
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-2 py-0.5 rounded text-caption font-mono ${
              alert.scores.qsofa >= 2 ? 'bg-status-critical/20 text-status-critical' : 'bg-bg-primary text-text-secondary'
            }`}>
              qSOFA: {alert.scores.qsofa}/3
            </span>
            <span className={`px-2 py-0.5 rounded text-caption font-mono ${
              alert.scores.news2 >= 7 ? 'bg-status-critical/20 text-status-critical' : 'bg-bg-primary text-text-secondary'
            }`}>
              NEWS2: {alert.scores.news2}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle">
        <button
          onClick={() => onAcknowledge(alert.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-status-normal/20 hover:bg-status-normal/30 text-status-normal rounded transition-colors"
        >
          <CheckCircle size={14} strokeWidth={1.5} />
          <span className="text-body-small">Acknowledge</span>
        </button>
        <span className="text-caption text-text-tertiary font-mono">
          {formatTime(alert.timestamp)}
        </span>
      </div>
    </motion.div>
  )
}
