interface TypewriterTextProps {
  text: string
  isStreaming: boolean
  speed?: number
}

// Simple text display - streaming is handled by the reasoningEngine
export function TypewriterText({ text, isStreaming }: TypewriterTextProps) {
  return (
    <span>
      {text}
      {isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-accent-agent animate-pulse" />}
    </span>
  )
}
