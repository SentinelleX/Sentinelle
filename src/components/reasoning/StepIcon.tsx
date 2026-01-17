import {
  Activity,
  Brain,
  Search,
  Calculator,
  GitBranch,
  Zap,
  Bell,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpCircle,
} from 'lucide-react'
import { StepType, StepStatus } from '../../types'

interface StepIconProps {
  type: StepType
  status: StepStatus
  size?: number
}

const iconMap: Record<StepType, React.ElementType> = {
  observe: Activity,
  think: Brain,
  search: Search,
  calculate: Calculator,
  decide: GitBranch,
  action: Zap,
  alert: Bell,
  document: FileText,
  wait: Clock,
  success: CheckCircle,
  error: XCircle,
  escalate: ArrowUpCircle,
}

const statusColors: Record<StepStatus, string> = {
  pending: 'text-text-tertiary',
  in_progress: 'text-accent-agent',
  complete: 'text-status-normal',
  error: 'text-status-critical',
}

export function StepIcon({ type, status, size = 20 }: StepIconProps) {
  const IconComponent = iconMap[type] || Activity

  return (
    <div className={`relative ${statusColors[status]}`}>
      <IconComponent
        size={size}
        strokeWidth={1.5}
        className={status === 'in_progress' ? 'animate-pulse-subtle' : ''}
      />
      {status === 'complete' && type !== 'success' && (
        <CheckCircle
          size={10}
          strokeWidth={2}
          className="absolute -bottom-1 -right-1 text-status-normal bg-bg-tertiary rounded-full"
        />
      )}
    </div>
  )
}
