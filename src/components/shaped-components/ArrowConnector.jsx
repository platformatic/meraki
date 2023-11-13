'use strict'
import styles from './ArrowConnector.module.css'
import Icons from '@platformatic/ui-components/src/components/icons'
import { LARGE, WHITE } from '@platformatic/ui-components/src/components/constants'

function ArrowConnector ({ onClick }) {
  return (
    <div className={styles.container} onClick={() => onClick()}>
      <svg
        width={246} height='24' viewBox='0 0 246 24'
        fill='none' xmlns='http://www.w3.org/2000/svg'
        className={styles.svg}
      >
        <path
          d='M245.061 13.0607C245.646 12.4749 245.646 11.5251 245.061 10.9393L235.515 1.3934C234.929 0.807611 233.979 0.807611 233.393 1.3934C232.808 1.97919 232.808 2.92893 233.393 3.51472L241.879 12L233.393 20.4853C232.808 21.0711 232.808 22.0208 233.393 22.6066C233.979 23.1924 234.929 23.1924 235.515 22.6066L245.061 13.0607ZM0.5 13.5H104.75V10.5H0.5V13.5ZM153.5 13.5H198.75V10.5H153.5V13.5ZM198.75 13.5H244V10.5H198.75V13.5Z'
          fill='url(#paint0_linear_1_45734)'
        />
        <defs>
          <linearGradient id='paint0_linear_1_45734' x1='244' y1='11.9998' x2='-2' y2='12' gradientUnits='userSpaceOnUse'>
            <stop stop-color='white' />
            <stop offset='1' stop-color='white' stop-opacity='0' />
          </linearGradient>
        </defs>
      </svg>

      {/* <svg
        width='763'
        height='24' viewBox='0 0 763 24' fill='none' xmlns='http://www.w3.org/2000/svg'
        className={styles.svg}
      >
        <path
          d={`M762.061 13.0607C762.646 12.4749 762.646 11.5251 762.061 10.9393L752.515 1.3934C751.929 0.807611 750.979 0.807611 750.393 1.3934C749.808 1.97919 749.808 2.92893 750.393 3.51472L758.879 12L750.393 20.4853C749.808 21.0711 749.808 22.0208 750.393 22.6066C750.979 23.1924 751.929 23.1924 752.515 22.6066L762.061 13.0607ZM372 13.5H761V10.5H372V13.5ZM0 13.5H323.25V10.5H0V13.5Z`}
          fill='url(#paint0_linear_1_44863)'
        />
        <defs>
          <linearGradient id='paint0_linear_1_44863' x1={0} y1={12} x2='100%' y2={12} gradientUnits='userSpaceOnUse'>
            <stop stopColor='white' stopOpacity={0} />
            <stop offset={1} stopColor='white' />
          </linearGradient>
        </defs>
      </svg> */}
      <Icons.RunningIcon color={WHITE} size={LARGE} />
    </div>
  )
}

export default ArrowConnector
