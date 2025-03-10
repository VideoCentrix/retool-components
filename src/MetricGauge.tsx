import { FC, useMemo } from 'react'
import { Retool } from '@tryretool/custom-component-support'
import './MetricGauge.css'

export const MetricGauge: FC = () => {
  // Component state
  const [title] = Retool.useStateString({ name: 'title', initialValue: 'Security Score' })
  const [value] = Retool.useStateNumber({ name: 'value', initialValue: 95 })
  const [previousValue] = Retool.useStateNumber({ name: 'previousValue', initialValue: 90 })
  const [lowThreshold] = Retool.useStateNumber({ name: 'lowThreshold', initialValue: 40 })
  const [midThreshold] = Retool.useStateNumber({ name: 'midThreshold', initialValue: 70 })
  const [size] = Retool.useStateString({ name: 'size', initialValue: 'large' })
  const [showPercentChange] = Retool.useStateBoolean({ name: 'showPercentChange', initialValue: true })
  const [subtitle] = Retool.useStateString({ name: 'subtitle', initialValue: '' })

  // Configure component default size
  Retool.useComponentSettings({
    defaultHeight: size === 'large' ? 20 : 10,
    defaultWidth: size === 'large' ? 10 : 5,
  })

  // Calculate color based on thresholds
  const color = useMemo(() => {
    if (value < lowThreshold) return 'red'
    if (value < midThreshold) return 'yellow'
    return 'green'
  }, [value, lowThreshold, midThreshold])

  // Calculate percentage change
  const percentChange = useMemo(() => {
    if (previousValue === 0) return 0
    return ((value - previousValue) / Math.abs(previousValue)) * 100
  }, [value, previousValue])

  // Format percentage for display
  const formattedPercentChange = useMemo(() => {
    const rounded = Math.round(percentChange * 10) / 10
    return `${rounded >= 0 ? '+' : ''}${rounded}%`
  }, [percentChange])

  // Determine whether the change is positive, negative, or neutral
  const changeDirection = useMemo(() => {
    if (percentChange > 0) return 'positive'
    if (percentChange < 0) return 'negative'
    return 'neutral'
  }, [percentChange])

  return (
    <div className={`metric-gauge ${size} ${color}`}>
      <div className="gauge-ring">
        <div className="gauge-inner">
          <div className="value">{value}</div>
          {showPercentChange && (
            <div className={`percent-change ${changeDirection}`}>
              {formattedPercentChange}
            </div>
          )}
          <div className="title">{title}</div>
          {subtitle && <div className="subtitle">{subtitle}</div>}
        </div>
      </div>
    </div>
  )
}

export default MetricGauge
