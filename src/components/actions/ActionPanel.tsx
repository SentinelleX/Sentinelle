import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  FlaskConical,
  Pill,
  Droplets,
  Bell,
  BedDouble,
  FileText,
  Activity,
  CheckCircle2,
  Loader2,
  Clock,
} from 'lucide-react'
import { ActionStep, OrchestrationSummary } from '../../services/actionOrchestrator'

interface ActionPanelProps {
  actions: ActionStep[]
  currentProgress: Record<string, string>
  summary: OrchestrationSummary | null
  isComplete: boolean
}

const toolIcons: Record<string, React.ElementType> = {
  'Epic CPOE': FlaskConical,
  'Pharmacy System': Pill,
  'IV Pump Integration': Droplets,
  'Pager System': Bell,
  'Nurse Call System': Bell,
  'Bed Management': BedDouble,
  'Epic EHR': FileText,
  'Monitoring System': Activity,
}

const toolColors: Record<string, string> = {
  'Epic CPOE': 'text-blue-400',
  'Pharmacy System': 'text-emerald-400',
  'IV Pump Integration': 'text-cyan-400',
  'Pager System': 'text-amber-400',
  'Nurse Call System': 'text-amber-400',
  'Bed Management': 'text-purple-400',
  'Epic EHR': 'text-rose-400',
  'Monitoring System': 'text-teal-400',
}

export function ActionPanel({ actions, currentProgress, summary, isComplete }: ActionPanelProps) {
  return (
    <div className="h-full flex flex-col bg-bg-secondary rounded-xl border border-border-subtle overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-bg-tertiary/50">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isComplete ? 'bg-status-normal/20' : 'bg-accent-agent/20'}`}>
            <Zap size={20} className={isComplete ? 'text-status-normal' : 'text-accent-agent'} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-card-title text-text-primary tracking-wide">
              AUTONOMOUS ACTIONS
            </h2>
            <p className="text-caption text-text-tertiary">
              Executing sepsis response protocol
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          {!isComplete ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-agent/20 border border-accent-agent/30 rounded-full">
              <Loader2 size={14} className="text-accent-agent animate-spin" />
              <span className="text-body-small text-accent-agent">
                {actions.filter(a => a.status === 'complete').length}/{actions.length} complete
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-status-normal/20 border border-status-normal/30 rounded-full">
              <CheckCircle2 size={14} className="text-status-normal" />
              <span className="text-body-small text-status-normal">All actions complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions list */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {actions.map((action, index) => {
            const Icon = toolIcons[action.tool] || Zap
            const color = toolColors[action.tool] || 'text-accent-agent'

            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  relative p-4 rounded-xl border transition-all duration-300
                  ${action.status === 'in_progress'
                    ? 'bg-accent-agent/10 border-accent-agent/30'
                    : action.status === 'complete'
                    ? 'bg-bg-elevated border-border-subtle'
                    : 'bg-bg-tertiary/50 border-border-subtle opacity-50'
                  }
                `}
              >
                {/* Active indicator */}
                {action.status === 'in_progress' && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-accent-agent rounded-l-xl"
                    layoutId="activeAction"
                  />
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg bg-bg-primary/50 ${color}`}>
                    {action.status === 'in_progress' ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : action.status === 'complete' ? (
                      <CheckCircle2 size={20} className="text-status-normal" />
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-body text-text-primary font-medium">
                        {action.title}
                      </h4>
                      <span className={`text-caption px-2 py-0.5 rounded ${color} bg-current/10`}>
                        {action.tool}
                      </span>
                    </div>

                    <p className="text-body-small text-text-secondary mb-2">
                      {action.description}
                    </p>

                    {/* Progress message */}
                    {action.status === 'in_progress' && currentProgress[action.id] && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-caption text-accent-agent"
                      >
                        <div className="w-1 h-1 bg-accent-agent rounded-full animate-pulse" />
                        {currentProgress[action.id]}
                      </motion.div>
                    )}

                    {/* Result */}
                    {action.status === 'complete' && action.result && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-caption text-status-normal mt-1"
                      >
                        <CheckCircle2 size={12} />
                        {action.result}
                      </motion.div>
                    )}

                    {/* Duration */}
                    {action.status === 'complete' && action.startTime && action.endTime && (
                      <div className="flex items-center gap-1 text-caption text-text-tertiary mt-2">
                        <Clock size={10} />
                        {((action.endTime - action.startTime) / 1000).toFixed(1)}s
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Summary footer */}
      {isComplete && summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-border-subtle bg-status-normal/5"
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={18} className="text-status-normal" />
            <span className="text-body text-status-normal font-medium">
              Sepsis Bundle Executed Successfully
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-caption">
            <div>
              <p className="text-text-tertiary mb-1">Labs Ordered</p>
              <p className="text-text-secondary">{summary.labsOrdered.length} tests</p>
            </div>
            <div>
              <p className="text-text-tertiary mb-1">Medications</p>
              <p className="text-text-secondary">{summary.medicationsOrdered.length} orders</p>
            </div>
            <div>
              <p className="text-text-tertiary mb-1">Alerts Sent</p>
              <p className="text-text-secondary">{summary.alertsSent.length} notifications</p>
            </div>
            <div>
              <p className="text-text-tertiary mb-1">Total Time</p>
              <p className="text-text-secondary">{(summary.totalDuration / 1000).toFixed(1)}s</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
