import { useStreamingText } from '../../hooks/useStreamingText'
import { StreamingTextProps } from '../../types'

export function StreamingText({
  text,
  isStreaming,
  speed = 30,
  onComplete,
  className = '',
}: StreamingTextProps) {
  const { displayedText, isComplete } = useStreamingText({
    text,
    speed,
    enabled: isStreaming,
    onComplete,
  })

  return (
    <span className={className}>
      {displayedText}
      {isStreaming && !isComplete && (
        <span className="streaming-cursor" aria-hidden="true" />
      )}
    </span>
  )
}
