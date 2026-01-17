import { Zap, Clock } from 'lucide-react'

interface ActionSummaryProps {
  actionsCount: number
  totalDuration: number
}

export function ActionSummary({ actionsCount, totalDuration }: ActionSummaryProps) {
  const durationSeconds = (totalDuration / 1000).toFixed(1)

  return (
    <div className="px-4 py-3 border-t border-border-subtle bg-bg-tertiary">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-status-normal">
            <Zap size={14} strokeWidth={1.5} />
            <span className="text-body-small">
              {actionsCount} action{actionsCount !== 1 ? 's' : ''} taken
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Clock size={14} strokeWidth={1.5} />
            <span className="text-body-small font-mono">
              {durationSeconds}s
            </span>
          </div>
        </div>
        <span className="text-caption text-text-tertiary">
          Full audit trail available
        </span>
      </div>
    </div>
  )
}
