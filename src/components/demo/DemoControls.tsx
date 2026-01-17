import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Zap } from 'lucide-react'

interface DemoControlsProps {
  onStart: () => void
  onPause: () => void
  onResume?: () => void
  onReset: () => void
  onTriggerAgent: () => void
}

export function DemoControls({
  onStart,
  onPause,
  onReset,
  onTriggerAgent,
}: DemoControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case ' ': // Space - toggle play/pause
          e.preventDefault()
          if (isPlaying) {
            onPause()
            setIsPlaying(false)
          } else {
            onStart()
            setIsPlaying(true)
          }
          break
        case 'r': // R - reset
        case 'R':
          onReset()
          setIsPlaying(false)
          break
        case 'a': // A - trigger agent
        case 'A':
          onTriggerAgent()
          break
        case 'h': // H - toggle controls visibility
        case 'H':
          setShowControls((prev) => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, onStart, onPause, onReset, onTriggerAgent])

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause()
      setIsPlaying(false)
    } else {
      onStart()
      setIsPlaying(true)
    }
  }

  const handleReset = () => {
    onReset()
    setIsPlaying(false)
  }

  if (!showControls) {
    return (
      <button
        onClick={() => setShowControls(true)}
        className="fixed bottom-4 left-4 px-3 py-1.5 bg-bg-elevated border border-border-subtle rounded text-caption text-text-tertiary hover:text-text-primary transition-colors"
      >
        Show Controls (H)
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2 p-2 bg-bg-elevated border border-border-subtle rounded-lg shadow-lg">
      <span className="px-2 text-caption text-accent-agent uppercase tracking-wider">
        Demo
      </span>

      <div className="w-px h-6 bg-border-subtle" />

      {/* Play/Pause button */}
      <button
        onClick={handlePlayPause}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-primary hover:bg-bg-tertiary border border-border-subtle rounded transition-colors"
        title={isPlaying ? 'Pause (Space)' : 'Start (Space)'}
      >
        {isPlaying ? (
          <>
            <Pause size={14} className="text-status-warning" />
            <span className="text-body-small text-text-primary">Pause</span>
          </>
        ) : (
          <>
            <Play size={14} className="text-status-normal" />
            <span className="text-body-small text-text-primary">Start</span>
          </>
        )}
      </button>

      {/* Reset button */}
      <button
        onClick={handleReset}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-primary hover:bg-bg-tertiary border border-border-subtle rounded transition-colors"
        title="Reset (R)"
      >
        <RotateCcw size={14} className="text-text-secondary" />
        <span className="text-body-small text-text-primary">Reset</span>
      </button>

      {/* Trigger agent button */}
      <button
        onClick={onTriggerAgent}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-agent/20 hover:bg-accent-agent/30 border border-accent-agent/30 rounded transition-colors"
        title="Trigger Agent (A)"
      >
        <Zap size={14} className="text-accent-agent" />
        <span className="text-body-small text-accent-agent">Trigger Agent</span>
      </button>

      <div className="w-px h-6 bg-border-subtle" />

      {/* Keyboard hints */}
      <div className="flex items-center gap-2 text-caption text-text-tertiary">
        <kbd className="px-1.5 py-0.5 bg-bg-primary rounded border border-border-subtle">Space</kbd>
        <kbd className="px-1.5 py-0.5 bg-bg-primary rounded border border-border-subtle">R</kbd>
        <kbd className="px-1.5 py-0.5 bg-bg-primary rounded border border-border-subtle">A</kbd>
        <kbd className="px-1.5 py-0.5 bg-bg-primary rounded border border-border-subtle">H</kbd>
      </div>
    </div>
  )
}
