'use strict'
import PropTypes from 'prop-types'

// component used to calculate the path of the svg
function BrickPath ({
  height,
  width,
  bricksNumber
}) {
  const xA = width - 0.5
  const yA = 12
  const xB = xA - 1
  const yB = height - 1
  const xC = xB - 1
  const yC = yB - 1
  const yD = height - 6
  const dxB = 4
  const xE = 0.5
  const yE = 12 - 1.5
  const xF = xE + 1.5
  const yF = yE - 1.5

  function drawBricksOnTop (xStart, yStart, xEnd, yEnd) {
    const innerWidth = Math.floor((xEnd - xStart) / bricksNumber)
    let str = ' '
    let currentX = xStart
    const currentY = yStart
    Array.from(new Array(bricksNumber).keys()).forEach(() => {
      console.log('currentX', currentX, yStart)
      const dA = currentX + 5
      const bX = yStart + 2.5
      const cX = bX + 2.5
      const dY = dA + 1
      const eY = 4.5
      const fY = eY - 0.5
      const gY = 0.5
      const gY2 = 0.5
      const hY = 1
      const iX = cX + 2.5
      const lX = iX + 2.5
      const residualWidth = innerWidth - (
        // 2 * A
        (5 * 2) +
        // 2 * cX
        (2 * 2.5) +
        // 2 * lX
        (2 * 1)
      )
      const mX = lX + residualWidth
      const nX = mX + 2.5
      const oX = nX + 2.5
      const pX = oX + 2.5
      const qX = pX + 5
      str += `H${dA} `
      str += `C${bX} ${dA} ${cX} ${dY} ${cX} ${eY} `
      str += `V${fY} `
      str += `C${cX} ${hY} ${iX} ${gY2} ${lX} ${gY} `
      str += `H${residualWidth} `
      str += `C${mX} ${hY} ${nX} ${gY} ${nX} ${fY} `
      str += `V${eY} `
      str += `C${nX} ${dY} ${oX} ${yEnd} ${pX} ${yEnd} `
      str += `H${qX} `
      currentX += innerWidth
    })
    return str
  }

  return (
    <path
      d={`M${xA} ${yA}
              V${yD}
              C${xA} ${yC} ${xB} ${yB} ${xC} ${yB}
              H${dxB}
              C${xF} ${yB} ${xE} ${yC} ${xE} ${yD}
              V${yA}
              C${xE} ${yE} ${xF} ${yF} ${dxB} ${yF}
              /* ${drawBricksOnTop(dxB, yF, xC, yA)} */
              C${xB} ${yF} ${xA} ${yF} ${xA} ${yA}Z`}
      fill='none' fillOpacity={0.15} stroke='none'
    />
  )
}

BrickPath.propTypes = {
  /**
     * height
      */
  height: PropTypes.number.isRequired,
  /**
     * width
      */
  width: PropTypes.number.isRequired,
  /**
     * bricksNumber
      */
  bricksNumber: PropTypes.number
}

BrickPath.defaultProps = {
  bricksNumber: 4
}

export default BrickPath
