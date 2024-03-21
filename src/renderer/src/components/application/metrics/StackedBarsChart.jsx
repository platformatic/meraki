import { useRef, useState } from 'react'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './charts.module.css'
import * as d3 from 'd3'
import { xMargin, yMargin, windowInMinutes } from './chart_constants.js'

const StackedBarsChart = ({
  data,
  title,
  unit,
  paused = false,
  setPaused = () => {}
}) => {
  const miny = 0
  const lowermaxy = 10 // y max is dynamic, but we migth want to have a max lower bound. Set to 0 for completely dynamic y max
  const percentiles = {
    P99: '#FA6221',
    P95: '#C61BE2',
    P90: '#2192FA',
    P50: '#00B3A4'
  }

  // The setter is missing on purpose. We don't want to trigger a rerender when the mouse position changes
  const [mousePosition] = useState({ x: 0, y: 0 })

  const svgRef = useRef()
  const tooltipRef = useRef()

  const filterDataInWindow = (data) => {
    const window = windowInMinutes * 60 * 1000
    const now = new Date()
    const cutoff = now - window
    return data.filter(d => d.time > cutoff)
  }

  if (svgRef.current && tooltipRef.current && data.length > 2 && !paused) {
    const h = svgRef.current.clientHeight
    const w = svgRef.current.clientWidth

    const svg = d3
      .select(svgRef.current)

    const tooltip = d3
      .select(tooltipRef.current)

    svg.selectAll('*').remove() // clean up the svg
    const y = d3.scaleLinear([h - yMargin, 0])
    const x = d3.scaleTime([xMargin, w - 10])

    // We need to slice it here otherwise we cannot pause / resume the chart scrolling
    const latestData = filterDataInWindow(data)
    const window = windowInMinutes * 60 * 1000 // time window in millis
    const firstDatum = latestData[0]
    const firstTime = firstDatum.time // This is the time of the first data point in the window
    const lastTime = new Date(firstTime.getTime() + window)
    x.domain([firstTime, lastTime])

    latestData.shift() // We remove the first element because the bar cover the y axis

    // We need to get the max y for all values to correctly set the y domain
    const allCurrentValues = []
    for (let i = 0; i < latestData.length; i++) {
      allCurrentValues.push(latestData[i].P99)
    }
    const maxy = d3.max(allCurrentValues)
    const yMax = Math.max(d3.max(allCurrentValues), lowermaxy) + +(maxy * 0.05) // We add 5% to the max y to have some space on top
    y.domain([miny, yMax])

    // We always show 10 labels on the x axis
    const labelSecondsInterval = windowInMinutes * 60 / 10
    const xAxis = d3.axisBottom().scale(x).tickFormat(d3.timeFormat('%H:%M:%S')).ticks(d3.timeSecond.every(labelSecondsInterval))
    const yAxis = d3.axisLeft().scale(y).tickPadding(10)

    svg.attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', `translate(${xMargin}, ${xMargin})`)

    const $xAxis = svg
      .append('g')
      .attr('transform', `translate(0, ${h - yMargin})`)

    const $yAxis = svg
      .append('g')
      .attr('transform', `translate(${xMargin})`)

    svg.append('g')
      .attr('class', styles.grid)
      .call(d3.axisLeft(y).ticks(10).tickSize(-w).tickFormat(''))
      .attr('transform', `translate(${xMargin})`)

    $yAxis.call(yAxis)
    $xAxis.call(xAxis)

    const chart = svg.selectAll('.chart')
      .data(latestData)
      .enter()

    const barWidth = 2
    const barOffset = -(barWidth * 2)

    chart.append('rect')
      .attr('fill', percentiles.P50)
      .attr('x', d => x(d.time) + barOffset)
      .attr('y', d => y(d.P50))
      .attr('width', barWidth)
      .attr('height', d => h - yMargin - y(d.P50)) // We calculate the height upside-down

    chart.append('rect')
      .attr('fill', percentiles.P90)
      .attr('x', d => x(d.time) + barOffset)
      .attr('y', d => y(d.P90))
      .attr('width', barWidth)
      .attr('height', d => h - yMargin - y(d.P90 - d.P50))

    chart.append('rect')
      .attr('fill', percentiles.P95)
      .attr('x', d => x(d.time) + barOffset)
      .attr('y', d => y(d.P95))
      .attr('width', barWidth)
      .attr('height', d => h - yMargin - y(d.P95 - d.P90))

    chart.append('rect')
      .attr('fill', percentiles.P99)
      .attr('x', d => x(d.time) + barOffset)
      .attr('y', d => y(d.P99))
      .attr('width', barWidth)
      .attr('height', d => h - yMargin - y(d.P99 - d.P95))

    // Tooltip
    svg.on('mouseover pointermove', showTooltip)
      .on('pointerleave', hideTooltip)

    function showTooltip (event) {
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

      // Prepare the tooltip
      const timeString = d3.timeFormat('%H:%M:%S %p')(data.time)
      const valuesData = labels.map((label) => {
        return {
          label,
          value: Math.round(data[label] * 100) / 100
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
      const maxY = y(data.P99)
      tooltip.style('left', xPos + 'px').style('top', maxY - (valuesData.length * 15) - 60 + 'px')
      tooltip.style('opacity', 0.9)
    }

    function hideTooltip () {
      mousePosition.x = 0
      mousePosition.y = 0
      tooltip.style('opacity', 0)
    }
  }

  const generateLegend = (labels) => {
    return (
      <div className={styles.labels}>
        {
        labels.map((label, i) => {
          return (
            <div key={`label-${i}`} className={styles.labelContainer}>
              <div className={styles.label}> {label} </div>
              <div className={`${styles.legendLine} ${styles[`${label}`]}`} />
              <div>{i !== labels.length - 1 ? '|' : ''}</div>
            </div>
          )
        })
      }
      </div>
    )
  }
  const labels = Object.keys(percentiles)

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

export default StackedBarsChart
