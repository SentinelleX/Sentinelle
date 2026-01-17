import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { VitalsChartProps, VitalType } from '../../types'

const vitalColors: Record<VitalType, string> = {
  heartRate: '#b85c5c',
  bloodPressure: '#6b8cae',
  temperature: '#c9a227',
  spO2: '#4a9f7e',
  respiratoryRate: '#8b7fb8',
}

const vitalLabels: Record<VitalType, string> = {
  heartRate: 'HR',
  bloodPressure: 'BP',
  temperature: 'Temp',
  spO2: 'SpO2',
  respiratoryRate: 'RR',
}

export function VitalsChart({
  data,
  visibleVitals,
  timeWindow = 30,
}: VitalsChartProps) {
  // Transform data for recharts
  const chartData = data.map((vital) => ({
    time: vital.timestamp,
    heartRate: vital.heartRate,
    bloodPressure: vital.bloodPressure.systolic,
    temperature: vital.temperature,
    spO2: vital.spO2,
    respiratoryRate: vital.respiratoryRate,
    timeLabel: new Date(vital.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }))

  // Get time range
  const now = Date.now()
  const startTime = now - timeWindow * 60 * 1000

  // Filter to time window
  const filteredData = chartData.filter((d) => d.time >= startTime)

  if (filteredData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-tertiary">
        <p>Collecting vital sign data...</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={filteredData}
        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
      >
        {/* Grid */}
        <defs>
          <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#b85c5c" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#b85c5c" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* X Axis */}
        <XAxis
          dataKey="timeLabel"
          stroke="#3f3f46"
          tick={{ fill: '#71717a', fontSize: 11 }}
          axisLine={{ stroke: '#27272a' }}
          tickLine={{ stroke: '#27272a' }}
        />

        {/* Y Axis for HR */}
        {visibleVitals.includes('heartRate') && (
          <YAxis
            yAxisId="hr"
            domain={[40, 150]}
            stroke="#3f3f46"
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={{ stroke: '#27272a' }}
            tickLine={{ stroke: '#27272a' }}
            width={40}
          />
        )}

        {/* Y Axis for SpO2 */}
        {visibleVitals.includes('spO2') && !visibleVitals.includes('heartRate') && (
          <YAxis
            yAxisId="spo2"
            domain={[85, 100]}
            stroke="#3f3f46"
            tick={{ fill: '#71717a', fontSize: 11 }}
            axisLine={{ stroke: '#27272a' }}
            tickLine={{ stroke: '#27272a' }}
            width={40}
          />
        )}

        {/* Tooltip */}
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: '#3f3f46', strokeDasharray: '3 3' }}
        />

        {/* Lines */}
        {visibleVitals.includes('heartRate') && (
          <Line
            yAxisId="hr"
            type="monotone"
            dataKey="heartRate"
            stroke={vitalColors.heartRate}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: vitalColors.heartRate }}
            animationDuration={200}
          />
        )}

        {visibleVitals.includes('bloodPressure') && (
          <Line
            yAxisId="hr"
            type="monotone"
            dataKey="bloodPressure"
            stroke={vitalColors.bloodPressure}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: vitalColors.bloodPressure }}
            animationDuration={200}
          />
        )}

        {visibleVitals.includes('spO2') && (
          <Line
            yAxisId={visibleVitals.includes('heartRate') ? 'hr' : 'spo2'}
            type="monotone"
            dataKey="spO2"
            stroke={vitalColors.spO2}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: vitalColors.spO2 }}
            animationDuration={200}
          />
        )}

        {visibleVitals.includes('respiratoryRate') && (
          <Line
            yAxisId="hr"
            type="monotone"
            dataKey="respiratoryRate"
            stroke={vitalColors.respiratoryRate}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: vitalColors.respiratoryRate }}
            animationDuration={200}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey: string
    value: number
    color: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload) return null

  return (
    <div className="bg-bg-elevated border border-border-subtle rounded-md p-3 shadow-md">
      <p className="text-caption text-text-tertiary mb-2">{label}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-body-small text-text-secondary">
                {vitalLabels[entry.dataKey as VitalType] || entry.dataKey}
              </span>
            </div>
            <span className="text-body-small text-text-primary font-mono">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
