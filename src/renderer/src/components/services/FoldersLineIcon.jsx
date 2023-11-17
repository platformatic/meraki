'use strict'
import PropTypes from 'prop-types'
import styles from './FoldersLineIcon.module.css'
// component used to calculate the path of the svg
function FoldersLineIcon ({
  width,
  height,
  topPosition
}) {
  const radius = 3
  const startX = width / 2
  const startY = 0

  function addArch (radiusA, radiusB, clockWise, radiusC, radiusD) {
    return `a${radiusA},${radiusB} 0 0 ${clockWise} ${radiusC},${radiusD} `
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill='none' xmlns='http://www.w3.org/2000/svg' className={styles.svg} style={{ top: `${topPosition}px` }}>
      <path
        d={`M${startX},${startY} v${height - startY - (radius * 2) - 1} ${addArch(radius, radius, 0, radius, radius)} h${width}`}
        strokeOpacity={0.30} stroke='white'
      />
    </svg>
  )
}

FoldersLineIcon.propTypes = {
  /**
     * width
      */
  width: PropTypes.number,
  /**
   * height
    */
  height: PropTypes.number,
  /**
   * topPosition
    */
  topPosition: PropTypes.number
}

FoldersLineIcon.defaultProps = {
  width: 24,
  height: 0,
  topPosition: -10
}

export default FoldersLineIcon
