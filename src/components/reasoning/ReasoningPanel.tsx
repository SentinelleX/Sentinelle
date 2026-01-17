import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, ChevronDown, Zap, Shield } from 'lucide-react'
import { useSentinelStore } from '../../stores/sentinelStore'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { ReasoningStep } from './ReasoningStep'
import { ActionSummary } from './ActionSummary'

export function ReasoningPanel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { reasoningSteps, isAgentActive, setSelectedStep } = useSentinelStore()

  const { isAtBottom, scrollToBottom } = useAutoScroll({
    containerRef,
    dependency: reasoningSteps.length,
    threshold: 50,
  })

  const handleStepExpand = (stepId: string) => {
    setSelectedStep(stepId)
  }

  // Calculate summary
  const actionsCount = reasoningSteps.filter(
    (s) => s.type === 'action' || s.type === 'alert' || s.type === 'document'
  ).length

  const totalDuration = reasoningSteps.reduce(
    (sum, step) => sum + (step.duration || 0),
    0
  )

  const hasCompleted =
    reasoningSteps.length > 0 &&
    !isAgentActive &&
    reasoningSteps.every((s) => s.status === 'complete' || s.status === 'error')

  return (
    <div className="h-full flex flex-col bg-bg-secondary rounded-xl border border-border-subtle overflow-hidden relative">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-bg-tertiary/50">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isAgentActive ? 'bg-accent-agent/20' : 'bg-bg-elevated'}`}>
            <Brain size={20} className={isAgentActive ? 'text-accent-agent' : 'text-text-secondary'} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-card-title text-text-primary tracking-wide">
              AUTONOMOUS REASONING
            </h2>
            <p className="text-caption text-text-tertiary">
              Clinical intelligence engine
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3">
          {isAgentActive ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent-agent/20 border border-accent-agent/30 rounded-full"
            >
              <Zap size={14} className="text-accent-agent" />
              <span className="text-body-small text-accent-agent font-medium">Processing</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-accent-agent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-accent-agent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-accent-agent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </motion.div>
          ) : reasoningSteps.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-status-normal/20 border border-status-normal/30 rounded-full"
            >
              <Shield size={14} className="text-status-normal" />
              <span className="text-body-small text-status-normal font-medium">Analysis Complete</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-elevated border border-border-subtle rounded-full">
              <span className="w-2 h-2 bg-status-info rounded-full status-pulse" />
              <span className="text-body-small text-text-secondary">Monitoring</span>
            </div>
          )}
        </div>
      </div>

      {/* Reasoning steps container */}
      <div
        ref={containerRef}
        className="flex-grow overflow-y-auto p-4 space-y-3"
      >
        {reasoningSteps.length === 0 && !isAgentActive ? (
          <EmptyState />
        ) : (
          <AnimatePresence mode="popLayout">
            {reasoningSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ReasoningStep
                  step={step}
                  depth={0}
                  isStreaming={step.status === 'in_progress'}
                  onExpand={handleStepExpand}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Jump to latest button */}
      <AnimatePresence>
        {!isAtBottom && reasoningSteps.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="absolute bottom-20 right-8 flex items-center gap-2 px-4 py-2 bg-accent-agent/90 hover:bg-accent-agent border border-accent-agent rounded-full text-body-small text-white shadow-lg backdrop-blur-sm transition-colors"
          >
            <ChevronDown size={16} />
            Jump to latest
          </motion.button>
        )}
      </AnimatePresence>

      {/* Action summary footer */}
      {hasCompleted && (
        <ActionSummary actionsCount={actionsCount} totalDuration={totalDuration} />
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-16 h-16 rounded-full bg-accent-agent/10 flex items-center justify-center mb-6"
      >
        <Brain size={32} className="text-accent-agent/60" strokeWidth={1} />
      </motion.div>
      <p className="text-body text-text-primary mb-2">
        Sentinelle is watching...
      </p>
      <p className="text-body-small text-text-tertiary max-w-xs">
        The AI will activate automatically when concerning vital sign patterns are detected
      </p>

      {/* Animated dots */}
      <div className="flex gap-1.5 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-accent-agent/40"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  )
}
