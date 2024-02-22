'use strict'
import PropTypes from 'prop-types'

// component used to calculate the path of the svg
function BrickPath ({
  height,
  width,
  bricksNumber,
  hover
}) {
  const radius = 4
  const topRadius = 3
  const startX = radius + 0.5
  const startY = 10.0

  const innerWidth = Math.floor((width - (radius * 2)) / bricksNumber)

  const singleLength = innerWidth - (4 * 2) - /* dash start and end */
    (3 * 2 * 2) // arch from low dash to vertical lines

  function drawBricksOnTop () {
    /* return `h${width - (radius * 2) - 1 } ` */
    let str = ''
    Array.from(new Array(bricksNumber).keys()).forEach(() => {
      str += `h4 ${addArch(topRadius, topRadius, 0, topRadius, -topRadius)} v-1 ${addArch(topRadius, topRadius, 1, topRadius, -topRadius)} h${singleLength - 0.3} ${addArch(topRadius, topRadius, 1, topRadius, topRadius)} v1 ${addArch(topRadius, topRadius, 0, topRadius, topRadius)} h4 `
    })
    return str
  }

  function addArch (radiusA, radiusB, clockWise, radiusC, radiusD) {
    return `a${radiusA},${radiusB} 0 0 ${clockWise} ${radiusC},${radiusD} `
  }

  return (
    <path
      d={`M${startX},${startY} ${drawBricksOnTop()} ${addArch(radius, radius, 1, radius, radius)} v${height - startY - (radius * 2) - 1} ${addArch(radius, radius, 1, -radius, radius)} h-${width - (radius * 2) - 1} ${addArch(radius, radius, 1, -radius, -radius)} v-${height - startY - (radius * 2) - 1} ${addArch(radius, radius, 1, radius, -radius)} Z`}
      fill='none'
      fillOpacity={hover ? 0.30 : 0.15}
      stroke='none'
      strokeOpacity={hover ? 1 : 0.7}
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
  bricksNumber: PropTypes.number,
  /**
   * hover
    */
  hover: PropTypes.bool
}

BrickPath.defaultProps = {
  bricksNumber: 4,
  hover: false
}

export default BrickPath
