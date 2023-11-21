'use strict'
import { LARGE, MEDIUM, SMALL } from '@platformatic/ui-components/src/components/constants'
import PropTypes from 'prop-types'

function BackgroundArrowConnector ({ classNameSvg, size }) {
  let cmp
  switch (size) {
    case SMALL:
      cmp = (
        <svg width='222' height='24' viewBox='0 0 222 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={classNameSvg}>
          <path d='M221.061 13.0607C221.646 12.4749 221.646 11.5251 221.061 10.9393L211.515 1.3934C210.929 0.807612 209.979 0.807612 209.393 1.3934C208.808 1.97918 208.808 2.92893 209.393 3.51472L217.879 12L209.393 20.4853C208.808 21.0711 208.808 22.0208 209.393 22.6066C209.979 23.1924 210.929 23.1924 211.515 22.6066L221.061 13.0607ZM0 13.5H174.018V10.5H0V13.5ZM174.018 13.5H220V10.5H174.018V13.5Z' fill='url(#paint0_linear_1_45733)' />
          <defs>
            <linearGradient id='paint0_linear_1_45733' x1='220' y1='11.9999' x2='-29.977' y2='12' gradientUnits='userSpaceOnUse'>
              <stop stopColor='white' />
              <stop offset='1' stopColor='white' stopOpacity='0' />
            </linearGradient>
          </defs>
        </svg>
      )
      break
    case MEDIUM:
      cmp = (
        <svg width='516' height='24' viewBox='0 0 516 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={classNameSvg}>
          <path d='M515.061 13.0607C515.646 12.4749 515.646 11.5251 515.061 10.9393L505.515 1.3934C504.929 0.807612 503.979 0.807612 503.393 1.3934C502.808 1.97918 502.808 2.92893 503.393 3.51472L511.879 12L503.393 20.4853C502.808 21.0711 502.808 22.0208 503.393 22.6066C503.979 23.1924 504.929 23.1924 505.515 22.6066L515.061 13.0607ZM0 13.5H471.338V10.5H0V13.5ZM471.338 13.5H514V10.5H471.338V13.5Z' fill='url(#paint0_linear_289_9762)' />
          <defs>
            <linearGradient id='paint0_linear_289_9762' x1='514' y1='12' x2='0' y2='12' gradientUnits='userSpaceOnUse'>
              <stop stopColor='white' />
              <stop offset='1' stopColor='white' stopOpacity='0' />
            </linearGradient>
          </defs>
        </svg>
      )

      break
    default:
      cmp = (
        <svg width='792' height='24' viewBox='0 0 792 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={classNameSvg}>
          <path d='M791.061 13.0607C791.646 12.4749 791.646 11.5252 791.061 10.9394L781.515 1.39347C780.929 0.80768 779.979 0.80768 779.393 1.39347C778.808 1.97925 778.808 2.929 779.393 3.51479L787.879 12.0001L779.393 20.4853C778.808 21.0711 778.808 22.0209 779.393 22.6067C779.979 23.1925 780.929 23.1925 781.515 22.6067L791.061 13.0607ZM-1.31134e-07 13.5L790 13.5001L790 10.5001L1.31134e-07 10.5L-1.31134e-07 13.5Z' fill='url(#paint0_linear_1_45571)' />
          <defs>
            <linearGradient id='paint0_linear_1_45571' x1='0' y1='12' x2='790' y2='12' gradientUnits='userSpaceOnUse'>
              <stop stopColor='white' stopOpacity='0' />
              <stop offset='1' stopColor='white' />
            </linearGradient>
          </defs>
        </svg>
      )
      break
  }

  return cmp
}

BackgroundArrowConnector.propTypes = {
  /**
   * classNameSvg
    */
  classNameSvg: PropTypes.string,
  /**
   * classNameSvg
    */
  size: PropTypes.oneOf([SMALL, MEDIUM, LARGE])
}

BackgroundArrowConnector.defaultProps = {
  classNameSvg: '',
  size: LARGE
}

export default BackgroundArrowConnector
