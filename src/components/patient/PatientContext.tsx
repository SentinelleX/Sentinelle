import {
  User,
  AlertTriangle,
  Pill,
  FlaskConical,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
} from 'lucide-react'
import { PatientContextProps, TrendDirection } from '../../types'

const trendIcons: Record<TrendDirection, React.ElementType> = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
}

export function PatientContext({ patient, isLoading }: PatientContextProps) {
  if (isLoading) {
    return <PatientContextSkeleton />
  }

  return (
    <div className="bg-bg-tertiary rounded-lg border border-border-subtle p-4 overflow-y-auto">
      <h3 className="text-caption text-text-tertiary uppercase tracking-wider mb-4">
        Patient Context
      </h3>

      {/* Patient header */}
      <div className="flex items-start gap-3 mb-4 pb-4 border-b border-border-subtle">
        <div className="p-2 bg-bg-elevated rounded-lg">
          <User size={20} className="text-text-secondary" strokeWidth={1.5} />
        </div>
        <div>
          <h4 className="text-body text-text-primary font-normal">{patient.name}</h4>
          <p className="text-body-small text-text-secondary">
            {patient.demographics.age} y/o {patient.demographics.sex === 'F' ? 'Female' : 'Male'} | {patient.demographics.weight} kg
          </p>
          <p className="text-caption text-text-tertiary mt-1">
            {patient.location} | MRN: {patient.mrn}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded text-caption ${
              patient.codeStatus === 'Full Code'
                ? 'bg-status-normal/10 text-status-normal'
                : 'bg-status-warning/10 text-status-warning'
            }`}>
              {patient.codeStatus}
            </span>
            <span className="text-caption text-text-tertiary">
              Admitted: {patient.admissionDate}
            </span>
          </div>
        </div>
      </div>

      {/* Risk factors */}
      {patient.riskFactors.length > 0 && (
        <div className="mb-4 pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-status-warning" strokeWidth={1.5} />
            <h5 className="text-caption text-text-tertiary uppercase tracking-wider">
              Risk Factors
            </h5>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {patient.riskFactors.map((factor, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-status-warning/10 border border-status-warning/20 text-status-warning text-caption rounded"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Active diagnoses */}
      <div className="mb-4 pb-4 border-b border-border-subtle">
        <h5 className="text-caption text-text-tertiary uppercase tracking-wider mb-2">
          Active Diagnoses
        </h5>
        <ul className="space-y-1.5">
          {patient.diagnoses.slice(0, 4).map((dx, i) => (
            <li key={i} className="text-body-small text-text-secondary">
              <span className="text-text-tertiary font-mono text-caption mr-2">
                {dx.code}
              </span>
              {dx.description}
              {dx.onset && (
                <span className="text-text-tertiary ml-1">({dx.onset})</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Medications */}
      <div className="mb-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2 mb-2">
          <Pill size={14} className="text-text-tertiary" strokeWidth={1.5} />
          <h5 className="text-caption text-text-tertiary uppercase tracking-wider">
            Current Medications
          </h5>
        </div>
        <ul className="space-y-1">
          {patient.medications.slice(0, 5).map((med, i) => (
            <li key={i} className="text-body-small text-text-secondary">
              <span className="text-text-primary">{med.name}</span>
              <span className="text-text-tertiary ml-1">
                {med.dose} {med.frequency}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent labs */}
      <div className="mb-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical size={14} className="text-text-tertiary" strokeWidth={1.5} />
          <h5 className="text-caption text-text-tertiary uppercase tracking-wider">
            Recent Labs
          </h5>
        </div>
        <div className="space-y-1.5">
          {patient.recentLabs.slice(0, 6).map((lab, i) => {
            const TrendIcon = trendIcons[lab.trend]
            const isCritical = lab.critical
            return (
              <div
                key={i}
                className={`flex items-center justify-between py-1 px-2 rounded ${
                  isCritical ? 'bg-status-critical/10' : ''
                }`}
              >
                <span className={`text-body-small ${isCritical ? 'text-status-critical' : 'text-text-secondary'}`}>
                  {lab.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-body-small ${isCritical ? 'text-status-critical' : 'text-text-primary'}`}>
                    {lab.value} {lab.unit}
                  </span>
                  <TrendIcon
                    size={12}
                    className={
                      lab.trend === 'up'
                        ? 'text-status-warning'
                        : lab.trend === 'down'
                        ? 'text-status-info'
                        : 'text-text-tertiary'
                    }
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Prior visits */}
      {patient.priorVisits && patient.priorVisits.length > 0 && (
        <div className="mb-4 pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-text-tertiary" strokeWidth={1.5} />
            <h5 className="text-caption text-text-tertiary uppercase tracking-wider">
              Prior Visits
            </h5>
          </div>
          {patient.priorVisits.slice(0, 2).map((visit, i) => (
            <div key={i} className={`p-2 rounded mb-2 ${
              visit.relevantFindings ? 'bg-status-warning/10 border border-status-warning/20' : 'bg-bg-elevated'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-caption text-text-tertiary">{visit.date}</span>
                <span className="text-caption text-text-tertiary">{visit.department}</span>
              </div>
              <p className="text-body-small text-text-secondary">{visit.chiefComplaint}</p>
              {visit.relevantFindings && (
                <p className="text-body-small text-status-warning mt-1">
                  {visit.relevantFindings}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Nursing notes */}
      {patient.nursingNotes && patient.nursingNotes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-text-tertiary" strokeWidth={1.5} />
            <h5 className="text-caption text-text-tertiary uppercase tracking-wider">
              Recent Nursing Notes
            </h5>
          </div>
          <div className="space-y-2">
            {patient.nursingNotes.slice(0, 3).map((note, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  note.category === 'concern'
                    ? 'bg-status-warning/10 border border-status-warning/20'
                    : 'bg-bg-elevated'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-caption text-text-tertiary">{note.timestamp}</span>
                  <span className="text-caption text-text-tertiary">{note.author}</span>
                </div>
                <p className={`text-body-small ${
                  note.category === 'concern' ? 'text-status-warning' : 'text-text-secondary'
                }`}>
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Allergies */}
      {patient.allergies.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <h5 className="text-caption text-status-critical uppercase tracking-wider mb-2">
            Allergies
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {patient.allergies.map((allergy, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-status-critical/10 border border-status-critical/20 text-status-critical text-caption rounded"
              >
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PatientContextSkeleton() {
  return (
    <div className="bg-bg-tertiary rounded-lg border border-border-subtle p-4 animate-pulse">
      <div className="h-4 w-24 bg-bg-elevated rounded mb-4" />
      <div className="flex gap-3 mb-4">
        <div className="w-10 h-10 bg-bg-elevated rounded-lg" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-bg-elevated rounded" />
          <div className="h-3 w-48 bg-bg-elevated rounded" />
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-3 bg-bg-elevated rounded" style={{ width: `${80 - i * 10}%` }} />
        ))}
      </div>
    </div>
  )
}
