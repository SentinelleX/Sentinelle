import { motion } from 'framer-motion'
import { Activity, Radio } from 'lucide-react'
import { useSentinelStore } from '../../stores/sentinelStore'

export function Header() {
  const { currentPatient, isAgentActive } = useSentinelStore()

  return (
    <header className="h-16 border-b border-border-subtle bg-bg-secondary/80 backdrop-blur-md px-6 flex items-center justify-between relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-agent/5 via-transparent to-accent-primary/5 pointer-events-none" />

      {/* Logo and title */}
      <div className="flex items-center gap-4 relative">
        <motion.div
          className={`p-2 rounded-xl ${isAgentActive ? 'bg-accent-agent/20' : 'bg-bg-elevated'}`}
          animate={isAgentActive ? {
            boxShadow: ['0 0 0 0 rgba(139, 127, 184, 0)', '0 0 20px 5px rgba(139, 127, 184, 0.3)', '0 0 0 0 rgba(139, 127, 184, 0)']
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Activity
            size={24}
            className={isAgentActive ? 'text-accent-agent' : 'text-accent-primary'}
            strokeWidth={1.5}
          />
        </motion.div>
        <div>
          <h1 className="text-section text-text-primary tracking-tight font-light">
            SENTINELLE
          </h1>
          <p className="text-caption text-text-tertiary tracking-widest uppercase">
            Autonomous Clinical Intelligence
          </p>
        </div>
      </div>

      {/* Patient info & Status */}
      {currentPatient && (
        <div className="flex items-center gap-6 relative">
          {/* Patient info card */}
          <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-bg-tertiary/50 border border-border-subtle">
            <div className="text-right">
              <p className="text-body-small text-text-primary font-medium">
                {currentPatient.name}
              </p>
              <p className="text-caption text-text-tertiary">
                {currentPatient.demographics.age}{currentPatient.demographics.sex === 'F' ? 'F' : 'M'} | {currentPatient.location}
              </p>
            </div>
            <div className="w-px h-8 bg-border-subtle" />
            <div className="text-right">
              <p className="text-caption text-text-tertiary">MRN</p>
              <p className="text-body-small text-text-secondary font-mono">{currentPatient.mrn}</p>
            </div>
          </div>

          {/* Status indicator */}
          <motion.div
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${
              isAgentActive
                ? 'border-accent-agent/50 bg-accent-agent/10'
                : 'border-status-normal/30 bg-status-normal/5'
            }`}
            animate={isAgentActive ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {isAgentActive ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Radio size={16} className="text-accent-agent" />
                </motion.div>
                <span className="text-body-small text-accent-agent font-medium">
                  AI ACTIVE
                </span>
                <div className="flex gap-1">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-accent-agent"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-accent-agent"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-accent-agent"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-status-normal status-pulse" />
                <span className="text-body-small text-status-normal font-medium">
                  MONITORING
                </span>
              </>
            )}
          </motion.div>
        </div>
      )}
    </header>
  )
}
