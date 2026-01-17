import { useState, useEffect, useCallback, useRef } from 'react'

interface UseStreamingTextOptions {
  text: string
  speed?: number // ms per character
  enabled?: boolean
  onComplete?: () => void
}

interface UseStreamingTextReturn {
  displayedText: string
  isComplete: boolean
  reset: () => void
}

export function useStreamingText({
  text,
  speed = 30,
  enabled = true,
  onComplete,
}: UseStreamingTextOptions): UseStreamingTextReturn {
  const [charIndex, setCharIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(!enabled)
  const onCompleteRef = useRef(onComplete)

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Reset when text changes
  useEffect(() => {
    if (enabled) {
      setCharIndex(0)
      setIsComplete(false)
    } else {
      setCharIndex(text.length)
      setIsComplete(true)
    }
  }, [text, enabled])

  // Streaming effect
  useEffect(() => {
    if (!enabled || charIndex >= text.length) {
      if (enabled && charIndex >= text.length && !isComplete) {
        setIsComplete(true)
        onCompleteRef.current?.()
      }
      return
    }

    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [charIndex, text.length, speed, enabled, isComplete])

  const reset = useCallback(() => {
    setCharIndex(0)
    setIsComplete(false)
  }, [])

  const displayedText = enabled ? text.slice(0, charIndex) : text

  return {
    displayedText,
    isComplete,
    reset,
  }
}
