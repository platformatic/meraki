'use strict'
import styles from './ArrowConnector.module.css'
import Icons from '@platformatic/ui-components/src/components/icons'
import { LARGE, WHITE } from '@platformatic/ui-components/src/components/constants'

function ArrowConnector () {
  return (
    <div className={styles.container}>
      <svg width='792' height='24' viewBox='0 0 792 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={styles.svg}>
        <path d='M791.061 13.0607C791.646 12.4749 791.646 11.5252 791.061 10.9394L781.515 1.39347C780.929 0.80768 779.979 0.80768 779.393 1.39347C778.808 1.97925 778.808 2.929 779.393 3.51479L787.879 12.0001L779.393 20.4853C778.808 21.0711 778.808 22.0209 779.393 22.6067C779.979 23.1925 780.929 23.1925 781.515 22.6067L791.061 13.0607ZM-1.31134e-07 13.5L790 13.5001L790 10.5001L1.31134e-07 10.5L-1.31134e-07 13.5Z' fill='url(#paint0_linear_1_45571)' />
        <defs>
          <linearGradient id='paint0_linear_1_45571' x1='0' y1='12' x2='790' y2='12' gradientUnits='userSpaceOnUse'>
            <stop stopColor='white' stopOpacity='0' />
            <stop offset='1' stopColor='white' />
          </linearGradient>
        </defs>
      </svg>
      <div className={styles.iconContainer}>
        <Icons.RunningIcon color={WHITE} size={LARGE} />
      </div>
    </div>
  )
}

export default ArrowConnector
