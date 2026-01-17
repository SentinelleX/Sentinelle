import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { ReasoningStepProps, StepStatus } from '../../types'
import { StepIcon } from './StepIcon'
import { TypewriterText } from './TypewriterText'

const statusConfig: Record<StepStatus, { label: string; className: string; bg: string }> = {
  pending: { label: 'Queued', className: 'text-text-tertiary', bg: 'bg-text-tertiary/10' },
  in_progress: { label: 'Processing', className: 'text-accent-agent', bg: 'bg-accent-agent/20' },
  complete: { label: 'Complete', className: 'text-status-normal', bg: 'bg-status-normal/20' },
  error: { label: 'Failed', className: 'text-status-critical', bg: 'bg-status-critical/20' },
}

export function ReasoningStep({
  step,
  depth = 0,
  onExpand,
}: ReasoningStepProps) {
  const [localExpanded, setLocalExpanded] = useState(true)
  const hasChildren = step.children && step.children.length > 0
  const showChildren = hasChildren && localExpanded
  const isActive = step.status === 'in_progress'

  const handleClick = () => {
    if (hasChildren) {
      setLocalExpanded(!localExpanded)
    }
    onExpand?.(step.id)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative"
      style={{ paddingLeft: depth * 24 }}
    >
      {/* Connecting line for nested steps */}
      {depth > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 w-px bg-border-subtle"
          style={{ left: (depth - 1) * 24 + 10 }}
        />
      )}

      <div
        onClick={handleClick}
        className={`
          group relative flex items-start gap-4 p-4 rounded-lg cursor-pointer
          transition-all duration-200 ease-out
          border
          ${isActive
            ? 'bg-accent-agent/5 border-accent-agent/20'
            : step.status === 'complete'
            ? 'bg-bg-elevated border-border-subtle'
            : 'bg-bg-tertiary/30 border-border-subtle hover:bg-bg-elevated/50'
          }
        `}
      >
        {/* Active indicator line */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-agent rounded-l-lg" />
        )}

        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <StepIcon type={step.type} status={step.status} size={22} />
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2">
              {hasChildren && (
                <motion.div
                  animate={{ rotate: showChildren ? 90 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-text-tertiary"
                >
                  <ChevronRight size={14} />
                </motion.div>
              )}
              <h4 className={`text-body font-normal ${isActive ? 'text-text-primary' : 'text-text-primary'}`}>
                {step.title}
              </h4>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Status badge */}
              <span className={`
                px-2 py-0.5 rounded text-caption
                ${statusConfig[step.status].bg} ${statusConfig[step.status].className}
              `}>
                {isActive && (
                  <span className="inline-block w-1.5 h-1.5 bg-accent-agent rounded-full mr-1.5 animate-pulse" />
                )}
                {statusConfig[step.status].label}
              </span>
              <span className="text-caption text-text-tertiary font-mono">
                {formatTime(step.timestamp)}
              </span>
            </div>
          </div>

          {/* Content text with typewriter effect */}
          {step.content && (
            <div className="text-body-small text-text-secondary leading-relaxed whitespace-pre-wrap">
              <TypewriterText
                text={step.content}
                isStreaming={isActive}
                speed={10}
              />
            </div>
          )}

          {/* Duration badge for completed steps */}
          {step.status === 'complete' && step.duration && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-caption text-text-tertiary font-mono">
                {(step.duration / 1000).toFixed(1)}s
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Child steps */}
      {showChildren && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="mt-2 space-y-2"
        >
          {step.children!.map((child) => (
            <ReasoningStep
              key={child.id}
              step={child}
              depth={depth + 1}
              onExpand={onExpand}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
