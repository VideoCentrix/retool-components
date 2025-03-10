import React from 'react'
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
  const [inverseThresholds] = Retool.useStateBoolean({ name: 'inverseThresholds', initialValue: false })
  const [textSize] = Retool.useStateString({ name: 'textSize', initialValue: 'medium' })
  const [unit] = Retool.useStateString({ name: 'unit', initialValue: '' })

  // Configure component default size
  Retool.useComponentSettings({
    defaultHeight: 20,
    defaultWidth: 20,
  })

  // Calculate color based on thresholds
  const color = useMemo(() => {
    if (inverseThresholds) {
      // Lower is better (like response time)
      if (value < lowThreshold) return 'green'
      if (value < midThreshold) return 'yellow'
      return 'red'
    } else {
      // Higher is better (like success rate)
      if (value < lowThreshold) return 'red'
      if (value < midThreshold) return 'yellow'
      return 'green'
    }
  }, [value, lowThreshold, midThreshold, inverseThresholds])

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
    if ((percentChange > 0 && !inverseThresholds) || (percentChange < 0 && inverseThresholds)) {
      return 'positive'
    } else if ((percentChange < 0 && !inverseThresholds) || (percentChange > 0 && inverseThresholds)) {
      return 'negative'
    }
    return 'neutral'
  }, [percentChange, inverseThresholds])

  // Format display value (add units if provided)
  const displayValue = useMemo(() => {
    return `${value}${unit}`;
  }, [value, unit]);

  return (
    <div className="metric-gauge-container">
      <div className={`metric-gauge ${color} text-${textSize}`}>
        {/* Outer rotating ring */}
        <div className="gauge-outer-ring">
          <div className="light-effect"></div>
        </div>
        
        {/* Middle rotating ring */}
        <div className="gauge-middle-ring">
          <div className="light-effect"></div>
        </div>
        
        {/* Inner content circle - stays stationary */}
        <div className="gauge-inner">
          <div className="value">{displayValue}</div>
          <div className={`percent-change ${changeDirection}`}>
            {formattedPercentChange}
          </div>
          <div className="title">{title}</div>
        </div>
      </div>
    </div>
  )
}