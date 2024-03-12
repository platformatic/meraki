import { useEffect, useRef, useState } from 'react'
import styles from './LineChart.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import colorSet0 from './ColorSet0.module.css'
import colorSet1 from './ColorSet1.module.css'

const LineChart = ({ title, unit, labels, numberOfLines, colorSet = 0 }) => {
  // This params are here to configure the chart, we could also change them to props (and have these values ad defaults)
  const windowInMinutes = 5
  const miny = 0
  const lowermaxy = 10 // y max is dynamic, but we migth want to have a max lower bound. Set to 0 for completely dynamic y max
  const colorStyles = colorSet === 0 ? colorSet0 : colorSet1

  // We assume the data is an array of objects with a time and a value
  const [data, setData] = useState([{ time: new Date(), values: Array(numberOfLines).fill(3) }])
  const [paused, setPaused] = useState(false) // This pauses the chart scrolling (not the data generation)
  // The setter is missing on purpose. We don't want to trigger a rerender when the mouse position changes
  const [mousePosition] = useState({ x: 0, y: 0 })

  // Increase the data every second
  useEffect(() => {
    const interval = setInterval(() => {
      const lastDatum = data[data.length - 1]

      const newValues = []
      for (let i = 0; i < numberOfLines; i++) {
        let newValue = lastDatum.values[i] + Math.random() - 0.5
        if (newValue < 0) newValue = -newValue
        newValues.push(newValue)
      }

      const newDatum = {
        time: new Date(),
        values: newValues
      }
      const newData = [...data, newDatum]
      setData(newData)
    }, 1000)
    return () => clearInterval(interval)
  }, [data])

  const svgRef = useRef()
  const tooltipRef = useRef()

  const filterDataInWindow = (data) => {
    const window = windowInMinutes * 60 * 1000
    const now = new Date()
    const cutoff = now - window
    return data.filter(d => d.time > cutoff)
  }

  useEffect(() => {
    if (!svgRef.current) return
    if (!tooltipRef.current) return
    if (paused) return

    const h = svgRef.current.clientHeight
    const w = svgRef.current.clientWidth

    const svg = d3
      .select(svgRef.current)

    const tooltip = d3
      .select(tooltipRef.current)

    svg.selectAll('*').remove() // clean up the svg
    const y = d3.scaleLinear([h - 25, 0])
    const x = d3.scaleTime([30, w - 10])

    // We need to slice it here otherwise we cannot pause / resume the chart scrolling
    const latestData = filterDataInWindow(data)
    const window = windowInMinutes * 60 * 1000 // time window in millis
    const firstDatum = latestData[0]
    const firstTime = firstDatum.time // This is the time of the first data point in the window
    const lastTime = new Date(firstTime.getTime() + window)
    x.domain([firstTime, lastTime])

    // We need to get the max y for all values to correctly set the y domain`
    const allCurrentValues = []
    for (let i = 0; i < latestData.length; i++) {
      allCurrentValues.push(...latestData[i].values)
    }
    const yMax = Math.max(d3.max(allCurrentValues), lowermaxy) + 0.2
    y.domain([miny, yMax])

    // We always show 10 labels on the x axis
    const labelSecondsInterval = windowInMinutes * 60 / 10
    const xAxis = d3.axisBottom().scale(x).tickFormat(d3.timeFormat('%H:%M:%S')).ticks(d3.timeSecond.every(labelSecondsInterval))
    const yAxis = d3.axisLeft().scale(y).tickPadding(10)

    svg.attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', 'translate(30, 30)')

    const $xAxis = svg
      .append('g')
      .attr('class', styles.axis)
      .attr('transform', `translate(0, ${h - 25})`)

    const $yAxis = svg
      .append('g')
      .attr('class', styles.axis)
      .attr('transform', `translate(${30})`)

    $yAxis.call(yAxis)
    $xAxis.call(xAxis)

    svg
      .selectAll('rect')
      .join('rect')

    for (let i = 0; i < numberOfLines; i++) {
      const $data = svg.append('path').attr('class', `${styles.line} ${colorStyles[`color-${i}`]}`)
      $data.datum(latestData)
        .attr('d', d3.line()
          .x(p => {
            return x(p.time)
          })
          .y((p) => y(p.values[i]))
        )
    }

    const tooltipDots = []

    for (let i = 0; i < numberOfLines; i++) {
      tooltipDots.push(svg
        .append('circle')
        .attr('r', 5)
        .attr('class', colorStyles[`color-${i}`])
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .style('opacity', 0)
        .style('pointer-events', 'none')
      )
    }

    svg.on('mouseover pointermove', showCircles)
      .on('pointerleave', hideCircles)

    // When we re-render the chart, we need to show the circles again
    // (otherwise they disappear when the chart is re-rendered)
    showCircles()

    function showCircles (event) {
      let xPos, yPos
      if (event) {
        [xPos, yPos] = d3.pointer(event)
        mousePosition.x = xPos
        mousePosition.y = yPos
      } else {
        if (mousePosition.x === 0 && mousePosition.y === 0) {
          return
        }
        xPos = mousePosition.x
        yPos = mousePosition.y
      }

      const time = (x.invert(xPos)).getTime()
      const data = latestData.find(d => d.time.getTime() >= time)
      if (!data) {
        return
      }

      for (let i = 0; i < numberOfLines; i++) {
        tooltipDots[i]
          .style('opacity', 1)
          .attr('cx', xPos)
          .attr('cy', y(data.values[i]))
          .raise()
      }

      const higestY = d3.max(data.values)
      const maxY = y(higestY)

      // Prepare the tooltip
      const timeString = d3.timeFormat('%H:%M:%S %p')(data.time)

      const valuesData = data.values.map((v, i) => {
        return {
          label: labels[i],
          value: Math.round(v * 100) / 100
        }
      })

      tooltip.html(`
      <div ${styles.tooltipContainer}>
        <div class="${styles.tooltipTime}"><div class="${styles.time}">${timeString}</div></div>
        <div class="${styles.tooltipTable}">
          ${valuesData.map(v => {
            return `
              <div class="${styles.tooltipLine}">
                <div class="${typographyStyles.desktopBodySmallest}">${v.label}</div>
                <div class="${typographyStyles.desktopBodySmallest} ${styles.tooltipValue}">${v.value}</div>
              </div>
          `
          }).join('')}
        </div>
      </div>`)
      tooltip.style('left', xPos + 'px').style('top', maxY - (valuesData.length * 15) - 60 + 'px')
      tooltip.style('opacity', 0.9)
    }

    function hideCircles () {
      tooltipDots.forEach(t => t.style('opacity', 0))
      mousePosition.x = 0
      mousePosition.y = 0
      tooltip.style('opacity', 0)
    }

    svg.exit().remove()
  }, [data, svgRef.current, tooltipRef.current, paused])

  const generateLegend = (labels) => {
    return (
      <div className={styles.labels}>
        {
        labels.map((label, i) => {
          return (
            <div key={`label-${i}`} className={styles.labelContainer}>
              <div className={styles.label}> {label} </div>
              <div className={`${styles.legendLine} ${colorStyles[`color-${i}`]}`} />
              <div>{i !== labels.length - 1 ? '|' : ''}</div>
            </div>
          )
        })
      }
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={typographyStyles.desktopHeadline3}>{title}</span> ({unit})
        </div>
        <div className={styles.labels}>
          {
            generateLegend(labels)
          }
        </div>
      </div>
      <svg
        ref={svgRef} style={{ width: '100%', height: '300px' }}
        onClick={
          () => {
            if (paused) {
              tooltipRef.current.style.opacity = 0
            }
            setPaused(!paused)
          }
        }
      />
      <div ref={tooltipRef} className={styles.tooltip} />
    </div>

  )
}

LineChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string)
}

export default LineChart
