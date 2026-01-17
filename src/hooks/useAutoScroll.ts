import { useState, useEffect, useCallback, RefObject } from 'react'

interface UseAutoScrollOptions {
  containerRef: RefObject<HTMLElement>
  dependency: unknown
  threshold?: number
}

interface UseAutoScrollReturn {
  isAtBottom: boolean
  scrollToBottom: () => void
  enableAutoScroll: () => void
  disableAutoScroll: () => void
}

export function useAutoScroll({
  containerRef,
  dependency,
  threshold = 50,
}: UseAutoScrollOptions): UseAutoScrollReturn {
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)

  // Check if user is at bottom of container
  const checkIfAtBottom = useCallback(() => {
    const container = containerRef.current
    if (!container) return true

    const { scrollTop, scrollHeight, clientHeight } = container
    return scrollHeight - scrollTop - clientHeight < threshold
  }, [containerRef, threshold])

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const atBottom = checkIfAtBottom()
      setIsAtBottom(atBottom)

      // If user scrolls up, disable auto-scroll
      if (!atBottom && autoScrollEnabled) {
        setAutoScrollEnabled(false)
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [containerRef, checkIfAtBottom, autoScrollEnabled])

  // Auto-scroll when dependency changes
  useEffect(() => {
    if (autoScrollEnabled && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [dependency, autoScrollEnabled, containerRef])

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
      setAutoScrollEnabled(true)
    }
  }, [containerRef])

  const enableAutoScroll = useCallback(() => {
    setAutoScrollEnabled(true)
    scrollToBottom()
  }, [scrollToBottom])

  const disableAutoScroll = useCallback(() => {
    setAutoScrollEnabled(false)
  }, [])

  return {
    isAtBottom,
    scrollToBottom,
    enableAutoScroll,
    disableAutoScroll,
  }
}
