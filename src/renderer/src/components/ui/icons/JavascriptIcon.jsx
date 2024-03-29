import * as React from 'react'
import PropTypes from 'prop-types'
import { SIZES, SMALL } from '@platformatic/ui-components/src/components/constants'

const JavascriptIcon = ({ size }) => {
  let icon = <></>

  switch (size) {
    case SMALL:
      icon = (
        <svg
          width={16}
          height={16}
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <rect width='16' height='16' rx='1' fill='#FAE233' />
          <path d='M6.99961 12.9825L6.09961 13.5825C6.19961 13.9492 6.71961 14.6825 7.99961 14.6825C9.27961 14.6825 9.73294 13.8159 9.79961 13.3825V8.58252H8.59961V13.0825C8.53294 13.2825 8.29961 13.6825 7.89961 13.6825C7.49961 13.6825 7.13294 13.2159 6.99961 12.9825Z' fill='#00050B' />
          <path d='M11.3004 12.9L10.4004 13.5C10.7671 13.9 11.2004 14.7 12.8004 14.7C14.1004 14.7 14.7004 13.8 14.7004 13.1C14.7004 12.4 14.6004 11.4 13.3004 11.1C12.2604 10.86 12.0004 10.4 12.0004 10.2C12.0004 10 12.1204 9.6 12.6004 9.6C13.0804 9.6 13.3337 9.93333 13.4004 10.1L14.3004 9.4C13.8004 8.6 13.1004 8.5 12.6004 8.5C12.1004 8.5 10.8004 8.8 10.8004 10.1C10.8004 11.4 11.9004 11.9 12.7004 12.2C13.3404 12.44 13.5004 12.8333 13.5004 13C13.5004 13.2333 13.3204 13.7 12.6004 13.7C11.8804 13.7 11.4337 13.1667 11.3004 12.9Z' fill='#00050B' />
        </svg>
      )
      break

    default:
      break
  }
  return icon
}

JavascriptIcon.propTypes = {
  /**
   * Size
   */
  size: PropTypes.oneOf(SIZES)
}
JavascriptIcon.defaultProps = {
  size: SMALL
}

export default JavascriptIcon
