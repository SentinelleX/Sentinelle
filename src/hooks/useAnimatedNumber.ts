import { useState, useEffect, useRef } from 'react'

interface UseAnimatedNumberOptions {
  value: number
  duration?: number // ms
  decimals?: number
}

interface UseAnimatedNumberReturn {
  displayValue: string
  isAnimating: boolean
}

export function useAnimatedNumber({
  value,
  duration = 300,
  decimals = 0,
}: UseAnimatedNumberOptions): UseAnimatedNumberReturn {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const startValueRef = useRef(value)

  useEffect(() => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    startValueRef.current = displayValue
    startTimeRef.current = performance.now()
    setIsAnimating(true)

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out function
      const eased = 1 - Math.pow(1 - progress, 3)

      const currentValue =
        startValueRef.current + (value - startValueRef.current) * eased
      setDisplayValue(currentValue)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
        setIsAnimating(false)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration])

  return {
    displayValue: displayValue.toFixed(decimals),
    isAnimating,
  }
}
