'use strict'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { WHITE } from '@platformatic/ui-components/src/components/constants'
import styles from './LineConnector.module.css'

const LineConnector = ({
  id,
  animationDelay,
  cancelAnimation,
  dashedStroke,
  height,
  style,
  width,
  topLeftToBottomRight
}) => {
  const [radius] = useState(4)
  const [diffHeight] = useState(height)
  let clefClassName = `${styles.clef} `
  clefClassName += dashedStroke ? styles['clef-white-dashed'] : styles['clef-white']
  const circleClassName = dashedStroke ? styles.circleFillOpaque : styles.circleFill
  const strokeWidth = 1
  const strokeWidthAnimation = 6
  let points = []
  let draws = []
  if (topLeftToBottomRight) {
    points = [
      { x: radius, y: radius },
      { x: radius, y: height / 2 - radius },
      { x: radius, y: height / 2 - (radius) },
      { x: 2 * radius, y: height / 2 },
      { x: width - (2 * radius), y: height / 2 - radius },
      { x: width - (2 * radius), y: height / 2 },
      { x: width - (radius), y: height / 2 + radius },
      { x: width - (radius), y: height - radius }
    ]
    draws = [
      `M${points[0].x} ${points[0].y}v${points[1].y - points[0].y}`,
      `M${points[2].x} ${points[2].y} a${radius},${radius} 0 0 0 ${radius},${radius}`,
      `M${points[3].x} ${points[3].y}h${points[4].x - points[3].x}`,
      `M${points[5].x} ${points[5].y} a${radius},${radius} 0 0 1 ${radius},${radius}`,
      `M${points[6].x} ${points[6].y}v${points[7].y - points[6].y}`
    ]
  } else {
    points = [
      { x: width - (radius), y: radius },
      { x: width - (radius), y: height / 2 - radius },
      { x: width - (2 * radius), y: height / 2 },
      { x: 2 * radius, y: height / 2 },
      { x: width - (2 * radius), y: height / 2 - radius },
      { x: radius, y: height / 2 + radius },
      { x: radius, y: height / 2 + radius },
      { x: radius, y: height - radius }
    ]

    draws = [
      `M${points[0].x} ${points[0].y}v${points[1].y - points[0].y}`,
      `M${points[2].x} ${points[2].y} a${radius},${radius} 0 0 0 ${radius},-${radius}`,
      `M${points[3].x} ${points[3].y}h${points[4].x - points[3].x}`,
      `M${points[5].x} ${points[5].y} a${radius},${radius} 0 0 1 ${radius},-${radius}`,
      `M${points[6].x} ${points[6].y}v${points[7].y - points[6].y}`
    ]
  }

  function renderSvg () {
    const styleSheet = document.styleSheets[0]
    styleSheet.insertRule(`@-webkit-keyframes draw1-${id} {
      from { stroke-dashoffset: 200; }
      to { stroke-dashoffset: 0; }
    }`, styleSheet.cssRules.length)
    styleSheet.insertRule(`@-webkit-keyframes draw2-${id} {
      from { stroke-dashoffset: 200; }
      to { stroke-dashoffset: 0; }
    }`, styleSheet.cssRules.length)
    styleSheet.insertRule(`@-webkit-keyframes draw3-${id} {
      from { stroke-dashoffset: 200; }
      to { stroke-dashoffset: 0; }
    }`, styleSheet.cssRules.length)
    styleSheet.insertRule(`@-webkit-keyframes draw4-${id} {
      from { stroke-dashoffset: 200; }
      to { stroke-dashoffset: 0; }
    }`, styleSheet.cssRules.length)
    styleSheet.insertRule(`@-webkit-keyframes draw5-${id} {
      from { stroke-dashoffset: 200; }
      to { stroke-dashoffset: 0; }
    }`, styleSheet.cssRules.length)

    let animationDelay2 = 0.0
    let animationDelay3 = 0.0
    let animationDelay4 = 0.0
    let animationDelay5 = 0.0
    let duration1 = 0.0
    let duration2 = 0.0
    let duration3 = 0.0
    let duration4 = 0.0
    let duration5 = 0.0

    if (!cancelAnimation) {
      animationDelay2 = animationDelay + 0.5
      animationDelay3 = animationDelay2 + 0.1
      animationDelay4 = animationDelay3 + 0.2
      animationDelay5 = animationDelay4 + 0.1
      duration1 = 0.5
      duration2 = 0.1
      duration3 = 0.2
      duration4 = 0.1
      duration5 = 0.2
    }

    const styleAnimation1 = {
      fill: 'none',
      stroke: 'white',
      strokeWidth: strokeWidthAnimation,
      strokeDasharray: diffHeight,
      strokeDashoffset: diffHeight,
      animation: `draw1-${id} ${duration1}s ${animationDelay}s linear forwards`
    }

    const styleAnimation2 = {
      fill: 'none',
      stroke: 'white',
      strokeWidth: strokeWidthAnimation,
      strokeDasharray: 200,
      strokeDashoffset: 200,
      animation: `draw2-${id} ${duration2}s ${animationDelay2}s linear forwards`
    }

    const styleAnimation3 = {
      fill: 'none',
      stroke: 'white',
      strokeWidth: strokeWidthAnimation,
      strokeDasharray: 200,
      strokeDashoffset: 200,
      animation: `draw3-${id} ${duration3}s ${animationDelay3}s linear forwards`
    }

    const styleAnimation4 = {
      fill: 'none',
      stroke: 'white',
      strokeWidth: strokeWidthAnimation,
      strokeDasharray: 200,
      strokeDashoffset: 200,
      animation: `draw4-${id} ${duration4}s ${animationDelay4}s linear forwards`
    }

    const styleAnimation5 = {
      fill: 'none',
      stroke: 'white',
      strokeWidth: strokeWidthAnimation,
      strokeDasharray: 200,
      strokeDashoffset: 200,
      animation: `draw5-${id} ${duration5}s ${animationDelay5}s linear forwards`
    }

    return draws.length > 0 && (
      <svg
        key={id}
        id={id}
        style={style}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <mask id={`mask1-${id}`} maskUnits='userSpaceOnUse'>
            <path style={styleAnimation1} d={draws[0]} />
          </mask>
          <mask id={`mask2-${id}`} maskUnits='userSpaceOnUse'>
            <path style={styleAnimation2} d={draws[1]} />
          </mask>
          <mask id={`mask3-${id}`} maskUnits='userSpaceOnUse'>
            <path style={styleAnimation3} d={draws[2]} />
          </mask>
          <mask id={`mask4-${id}`} maskUnits='userSpaceOnUse'>
            <path style={styleAnimation4} d={draws[3]} />
          </mask>
          <mask id={`mask5-${id}`} maskUnits='userSpaceOnUse'>
            <path style={styleAnimation5} d={draws[4]} />
          </mask>
        </defs>
        <circle cx={topLeftToBottomRight ? radius : width - radius} cy={radius} r={radius} fill='none' className={circleClassName} />
        <path
          className={clefClassName}
          mask={`url(#mask1-${id})`}
          d={draws[0]}
          stroke={WHITE}
          strokeWidth={strokeWidth}
        />
        <path
          className={clefClassName}
          mask={`url(#mask2-${id})`}
          d={draws[1]}
          stroke={WHITE}
          strokeWidth={strokeWidth}
        />
        <path
          className={clefClassName}
          mask={`url(#mask3-${id})`}
          d={draws[2]}
          stroke={WHITE}
          strokeWidth={strokeWidth}
        />
        <path
          className={clefClassName}
          mask={`url(#mask4-${id})`}
          d={draws[3]}
          stroke={WHITE}
          strokeWidth={strokeWidth}
        />
        <path
          className={clefClassName}
          mask={`url(#mask5-${id})`}
          d={draws[4]}
          stroke={WHITE}
          strokeWidth={strokeWidth}
        />
        <circle cx={topLeftToBottomRight ? width - radius : radius} cy={height - radius} r={radius} fill='none' className={circleClassName} />
      </svg>
    )
  }

  return height ? renderSvg() : <></>
}

LineConnector.propTypes = {
  /**
   * id
   */
  id: PropTypes.string.isRequired,
  /**
   * fromRef
   */
  fromRef: PropTypes.object,
  /**
   * toRef
   */
  toRef: PropTypes.object,
  /**
   * animationDelay
   */
  animationDelay: PropTypes.number,
  /**
   * cancelAnimation
   */
  cancelAnimation: PropTypes.bool,
  /**
   * dashedStroke
   */
  dashedStroke: PropTypes.bool,
  /**
   * style
   */
  style: PropTypes.object,
  /**
   * height
   */
  height: PropTypes.number,
  /**
   * width
   */
  width: PropTypes.number,
  /**
   * topLeftToBottomRight
   */
  topLeftToBottomRight: PropTypes.bool
}

LineConnector.defaultProps = {
  id: 'defaultId',
  fromRef: null,
  toRef: null,
  animationDelay: 0.0,
  cancelAnimation: false,
  dashedStroke: false,
  style: { position: 'absolute', top: 0, left: 0 },
  height: 40,
  width: 115,
  topLeftToBottomRight: true
}

export default LineConnector
