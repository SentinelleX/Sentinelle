import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, X, Bell, Activity } from 'lucide-react'
import { useSentinelStore } from '../../stores/sentinelStore'

export function AlertOverlay() {
  const activeAlerts = useSentinelStore((state) => state.activeAlerts)
  const acknowledgeAlert = useSentinelStore((state) => state.acknowledgeAlert)
  const dismissAlert = useSentinelStore((state) => state.dismissAlert)

  const criticalAlert = activeAlerts.find(a => a.severity === 'critical')
  const otherAlerts = activeAlerts.filter(a => a.severity !== 'critical')

  return (
    <>
      {/* Full-screen critical alert */}
      <AnimatePresence>
        {criticalAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Backdrop with pulse */}
            <motion.div
              className="absolute inset-0 bg-status-critical/10 backdrop-blur-sm"
              animate={{
                backgroundColor: ['rgba(184, 92, 92, 0.1)', 'rgba(184, 92, 92, 0.15)', 'rgba(184, 92, 92, 0.1)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Vignette effect */}
            <div className="absolute inset-0 vignette" />

            {/* Alert card */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative w-full max-w-lg mx-4 rounded-xl border border-status-critical/40 bg-bg-primary shadow-xl overflow-hidden"
            >
              {/* Top bar with animation */}
              <div className="h-1 bg-status-critical relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="p-3 rounded-xl bg-status-critical/20"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <AlertTriangle size={28} className="text-status-critical" strokeWidth={1.5} />
                  </motion.div>
                  <div>
                    <h2 className="text-section text-status-critical font-medium tracking-wide">
                      {criticalAlert.title}
                    </h2>
                    <p className="text-body-small text-text-tertiary mt-1">
                      Immediate attention required
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(criticalAlert.id)}
                  className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
                >
                  <X size={20} className="text-text-tertiary" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pb-4">
                <p className="text-body text-text-primary leading-relaxed">
                  {criticalAlert.message}
                </p>

                {/* Patient info */}
                <div className="mt-4 p-4 rounded-xl bg-bg-elevated border border-border-subtle">
                  <div className="flex items-center gap-3 mb-3">
                    <Activity size={18} className="text-status-critical" />
                    <span className="text-body text-text-primary font-medium">
                      {criticalAlert.patientName}
                    </span>
                    <span className="text-body-small text-text-tertiary">
                      {criticalAlert.location}
                    </span>
                  </div>

                  {/* Scores */}
                  {criticalAlert.scores && (
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <span className={`
                          px-3 py-1.5 rounded-lg font-mono text-body-small font-medium
                          ${criticalAlert.scores.qsofa >= 2
                            ? 'bg-status-critical/20 text-status-critical border border-status-critical/30'
                            : 'bg-bg-tertiary text-text-secondary'
                          }
                        `}>
                          qSOFA: {criticalAlert.scores.qsofa}/3
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`
                          px-3 py-1.5 rounded-lg font-mono text-body-small font-medium
                          ${criticalAlert.scores.news2 >= 7
                            ? 'bg-status-critical/20 text-status-critical border border-status-critical/30'
                            : criticalAlert.scores.news2 >= 5
                            ? 'bg-status-warning/20 text-status-warning border border-status-warning/30'
                            : 'bg-bg-tertiary text-text-secondary'
                          }
                        `}>
                          NEWS2: {criticalAlert.scores.news2}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 pt-4 border-t border-border-subtle bg-bg-secondary/50">
                <div className="flex items-center gap-2 text-caption text-text-tertiary">
                  <Bell size={14} />
                  <span className="font-mono">
                    {new Date(criticalAlert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <motion.button
                  onClick={() => acknowledgeAlert(criticalAlert.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 bg-status-normal hover:bg-status-normal/90 text-white rounded-xl font-medium transition-colors shadow-lg"
                >
                  <CheckCircle size={18} strokeWidth={1.5} />
                  <span className="text-body">Acknowledge Alert</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast alerts for non-critical */}
      <div className="fixed top-20 right-4 z-40 space-y-3">
        <AnimatePresence>
          {otherAlerts.slice(0, 3).map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="w-80 p-4 rounded-xl border border-border-subtle bg-bg-elevated shadow-lg"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={18}
                  className={alert.severity === 'high' ? 'text-status-critical' : 'text-status-warning'}
                />
                <div className="flex-grow">
                  <h4 className="text-body text-text-primary">{alert.title}</h4>
                  <p className="text-body-small text-text-secondary mt-1">{alert.message}</p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-1 hover:bg-bg-primary rounded"
                >
                  <X size={14} className="text-text-tertiary" />
                </button>
              </div>
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="text-body-small text-status-normal hover:text-status-normal/80"
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
