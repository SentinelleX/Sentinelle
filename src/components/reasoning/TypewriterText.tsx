import { useState, useEffect, useRef } from 'react'

interface TypewriterTextProps {
  text: string
  isStreaming: boolean
  speed?: number
}

export function TypewriterText({ text, isStreaming, speed = 5 }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const previousLengthRef = useRef(0)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const targetLength = text.length
    const startLength = previousLengthRef.current

    if (targetLength <= startLength) {
      // Text got shorter or same, just display it
      setDisplayedText(text)
      previousLengthRef.current = targetLength
      return
    }

    // Animate from startLength to targetLength
    let currentLength = startLength
    const charsToAdd = targetLength - startLength
    const charsPerFrame = Math.max(1, Math.ceil(charsToAdd / 20)) // Faster: add multiple chars per frame

    const animate = () => {
      currentLength = Math.min(currentLength + charsPerFrame, targetLength)
      setDisplayedText(text.slice(0, currentLength))

      if (currentLength < targetLength) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        previousLengthRef.current = targetLength
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [text, speed])

  // Reset when text is cleared
  useEffect(() => {
    if (text === '') {
      previousLengthRef.current = 0
      setDisplayedText('')
    }
  }, [text])

  return (
    <span>
      {displayedText}
      {isStreaming && <span className="streaming-cursor" />}
    </span>
  )
}
